import pool from "../database/pool.js";
import camelCaseRows from "./utils/camelCaseRows.js";

class PostsRepository {
  static async list(userId, options) {
    const whereConditions = [];
    const values = [userId];

    if (options?.startTimestamp && options?.startId) {
      whereConditions.push("(p.created_at, p.id) < ($2, $3)");
      values.push(options.startTimestamp, options.startId);
    }

    if (options?.following === true) {
      whereConditions.push(`
        exists(
          SELECT 1
          FROM followers f
          WHERE f.leader_id = p.author AND f.follower_id = 1
        )
      `);
    }

    const text = `
    SELECT
      p.id,
      p.caption,
      p.created_at,
      pi.filename,
      json_build_object(
        'id', u.id,
        'username', u.username,
        'filename', ui.filename,
        'following', exists(
          SELECT 1
			    FROM followers f
			    WHERE f.leader_id = p.author AND f.follower_id = $1
        )
      ) AS author,
      (
        SELECT count(*)::integer
        FROM post_likes pl
        WHERE pl.post_id = p.id
      ) AS likes_count,
      exists(
        SELECT 1
        FROM post_likes pl
        WHERE pl.author = $1 AND pl.post_id = p.id
      ) AS liked
    FROM posts p
    JOIN users u ON u.id = p.author
    JOIN post_images pi ON pi.post_id = p.id
    LEFT JOIN user_images ui ON ui.user_id = p.author
    WHERE ${
      whereConditions.length !== 0 ? whereConditions.join(" AND ") : "TRUE"
    }
    ORDER BY p.created_at DESC, p.id DESC
    LIMIT 5
    `;

    const { rows } = await pool.query(text, values);
    return camelCaseRows(rows);
  }

  static async insert(userId, caption, filename) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const insertPostText = `
        INSERT INTO posts
          (author, caption)
        VALUES
          ($1, $2)
        RETURNING id
      `;

      const insertPostValues = [userId, caption];
      const insertPostResult = await client.query(
        insertPostText,
        insertPostValues
      );

      const postId = insertPostResult.rows[0].id;

      const insertPostImageText = `
        INSERT INTO post_images
          (post_id, filename)
        VALUES
          ($1, $2)
      `;

      const insertPostImageValues = [postId, filename];
      await client.query(insertPostImageText, insertPostImageValues);

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  static async like(userId, postId) {
    const text = `
      INSERT INTO post_likes
        (author, post_id)
      VALUES
        ($1, $2)
    `;

    await pool.query(text, [userId, postId]);
  }

  static async unlike(userId, postId) {
    const text = `
      DELETE FROM post_likes
      WHERE author = $1 AND post_id = $2
    `;

    await pool.query(text, [userId, postId]);
  }
}

export default PostsRepository;
