import pool from "../database/pool.js";
import camelCaseRows from "./utils/camelCaseRows.js";

class UserRepository {
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
}

export default UserRepository;
