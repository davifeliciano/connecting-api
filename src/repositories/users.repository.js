import pool from "../database/pool.js";
import camelCaseRows from "./utils/camelCaseRows.js";

class UserRepository {
  static async findById(userId) {
    const text = `
      SELECT
        id,
        username,
        email,
        created_at
      FROM users
      WHERE id = $1
    `;

    const { rows } = await pool.query(text, [userId]);
    return rows.length !== 0 ? camelCaseRows(rows)[0] : null;
  }

  static async findByUsernameOrEmail(usernameOrEmail) {
    const text = `
      SELECT *
      FROM users
      WHERE username = $1 OR email = $1
    `;

    const { rows } = await pool.query(text, [usernameOrEmail]);
    return rows.length !== 0 ? camelCaseRows(rows)[0] : null;
  }

  static async insert(name, username, email, password) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertUserText = `
        INSERT INTO users
          (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING id
      `;

      const insertUserValues = [username, email, password];
      const insertUserResult = await client.query(
        insertUserText,
        insertUserValues
      );

      const userId = insertUserResult.rows[0].id;

      const insertProfileText = `
        INSERT INTO profiles
          (name, user_id)
        VALUES
          ($1, $2)
      `;

      const insertProfileValues = [name, userId];
      await client.query(insertProfileText, insertProfileValues);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async update(userId, name, bio, filename) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateProfileText = `
        UPDATE profiles
        SET
          name = $2,
          bio = $3
        WHERE
          user_id = $1
      `;

      const updateProfileValues = [userId, name, bio];
      await client.query(updateProfileText, updateProfileValues);

      if (filename) {
        const updateUserImageText = `
          INSERT INTO user_images
            (user_id, filename)
          VALUES
            ($1, $2)
          ON CONFLICT(user_id) DO UPDATE
          SET
            user_id = $1,
            filename = $2,
            updated_at = now()
        `;

        await client.query(updateUserImageText, [userId, filename]);
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async follow(followerId, leaderId) {
    const text = `
      INSERT INTO followers
        (follower_id, leader_id)
      VALUES
        ($1, $2)
    `;

    await pool.query(text, [followerId, leaderId]);
  }

  static async unfollow(follower_id, leader_id) {
    const text = `
      REMOVE FROM followers
      WHERE follower_id = $1 AND leader_id = $2
    `;

    await pool.query(text, [follower_id, leader_id]);
  }

  static async getFollowers(userId) {
    const text = `
      SELECT
        u.id,
        u.username,
        p.name,
        ui.filename,
        u.created_at
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      JOIN profiles p ON p.user_id = u.id
      LEFT JOIN user_images ui ON ui.user_id = u.id
      WHERE f.leader_id = $1
    `;

    const { rows } = await pool.query(text, [userId]);
    return camelCaseRows(rows);
  }

  static async getLeaders(userId) {
    const text = `
      SELECT
        u.id,
        u.username,
        p.name,
        u.created_at
      FROM followers f
      JOIN users u ON f.leader_id = u.id
      JOIN profiles p ON p.user_id = u.id
      WHERE f.follower_id = $1
    `;

    const { rows } = await pool.query(text, [userId]);
    return camelCaseRows(rows);
  }
}

export default UserRepository;
