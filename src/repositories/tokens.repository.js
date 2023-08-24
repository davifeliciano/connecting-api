import pool from "../database/pool.js";

class TokensRepository {
  static async clearIfReused(userId, token) {
    const text = `
      DELETE FROM tokens
      WHERE user_id = $1 AND NOT EXISTS(
        SELECT 1
        FROM tokens
        WHERE token = $2
      )
    `;

    const values = [userId, token];
    const { rowCount } = await pool.query(text, values);
    return rowCount;
  }

  static async insert(userId, token) {
    const text = `
      INSERT INTO tokens
        (user_id, token)
      VALUES
        ($1, $2)
    `;

    await pool.query(text, [userId, token]);
  }

  static async update(token, newToken) {
    const text = `
      UPDATE tokens
      SET
        token = $2,
        created_at = NOW()
      WHERE token = $1
    `;

    await pool.query(text, [token, newToken]);
  }

  static async delete(token) {
    const text = `
      DELETE FROM tokens
      WHERE token = $1
    `;

    await pool.query(text, [token]);
  }
}

export default TokensRepository;
