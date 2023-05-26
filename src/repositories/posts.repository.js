import pool from "../database/pool.js";

class PostsRepository {
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
