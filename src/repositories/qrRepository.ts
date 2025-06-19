import { pool } from "../config/db";

export const createQRCode = async (
  data: string,
  imageUrl: string,
  userId: string | null
) => {
  const result = await pool.query(
    `INSERT INTO qr_codes (data, image_url, user_id) VALUES ($1, $2, $3) RETURNING *`,
    [data, imageUrl, userId]
  );
  return result.rows[0];
};

export const incrementScanCount = async (id: string) => {
  const result = await pool.query(
    `UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = $1 RETURNING *`,
    [id]
  );

  if (result.rowCount === 0) {
    return null;
  }

  return result.rows[0];
};

export const findUserQRCodes = async (userId: string) => {
  const result = await pool.query(`SELECT * FROM qr_codes WHERE user_id = $1`, [
    userId,
  ]);
  return result.rows;
};

export const deleteQRCodeById = async (id: string, userId: string) => {
  const result = await pool.query(
    `DELETE FROM qr_codes WHERE id = $1 AND user_id = $2 RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};