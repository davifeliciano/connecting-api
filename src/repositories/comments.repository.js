import pool from "../database/pool.js";
import camelCaseRows from "./utils/camelCaseRows.js";

class CommentsRepository {
  static async list(userId, options) {
    const whereConditions = [];
    const values = [userId];
    let placeholder = 2;

    if (options?.postId) {
      whereConditions.push(`c.post_id = $${placeholder}`);
      values.push(options.postId);
      placeholder++;
    }

    if (options?.startTimestamp && options?.startId) {
      whereConditions.push(
        `(c.created_at, c.id) < ($${placeholder}, $${placeholder + 1})`
      );

      values.push(options.startTimestamp, options.startId);
      placeholder += 2;
    }

    if (options?.author) {
      whereConditions.push(`u.username = $${placeholder}`);
      values.push(options.author);
    }

    const text = `
      SELECT
        c.id,
        c.content,
        c.created_at,
        c.post_id,
        json_build_object(
          'id', u.id,
          'username', u.username,
          'filename', ui.filename,
          'following', exists(
            SELECT 1
            FROM followers f
            WHERE f.leader_id = c.author AND f.follower_id = $1
          )
        ) AS author
      FROM comments c
      JOIN users u ON u.id = c.author
      LEFT JOIN user_images ui ON ui.user_id = c.author
      WHERE ${
        whereConditions.length !== 0 ? whereConditions.join(" AND ") : "TRUE"
      }
      ORDER BY c.created_at DESC, c.id DESC
      LIMIT 5
    `;

    const { rows } = await pool.query(text, values);
    return camelCaseRows(rows);
  }

  static async insert(userId, postId, content) {
    const insertPostText = `
        INSERT INTO comments
          (author, post_id, content)
        VALUES
          ($1, $2, $3)
      `;

    const insertPostValues = [userId, postId, content];
    await pool.query(insertPostText, insertPostValues);
  }
}

export default CommentsRepository;
