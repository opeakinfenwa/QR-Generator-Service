import { pool } from "../config/db";

export const getUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
};

export const googleUserCheck = async (email: string) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 AND google_id IS NOT NULL",
    [email]
  );
  return result.rows[0];
};

export const createUser = async (
  email: string,
  name: string,
  password: string,
  securityQuestion: string,
  securityAnswer: string
) => {
  const result = await pool.query(
    "INSERT INTO users (email, name, password, security_question, security_answer) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [email, name, password, securityQuestion, securityAnswer]
  );
  return result.rows[0];
};

export const updateUserDetails = async (id: string, updates: any) => {
  const setFields: string[] = [];
  const values: any[] = [];

  if (updates.name) {
    setFields.push("name = $" + (values.length + 1));
    values.push(updates.name);
  }

  if (updates.email) {
    setFields.push("email = $" + (values.length + 1));
    values.push(updates.email);
  }

  if (setFields.length === 0) {
    throw new Error(
      "At least one field (name or email) must be provided for update"
    );
  }

  const query = `UPDATE users SET ${setFields.join(
    ", "
  )}, updated_at = CURRENT_TIMESTAMP WHERE id = $${
    values.length + 1
  } RETURNING *`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const updateUserPassword = async (
  id: string,
  hashedPassword: string
) => {
  const result = await pool.query(
    "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [hashedPassword, id]
  );
  return result.rows[0];
};

export const getUserById = async (id: string) => {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      throw new Error("User not found");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Database query failed");
  }
};

export const getUserByGoogleId = async (googleId: string) => {
  const result = await pool.query("SELECT * FROM users WHERE google_id = $1", [
    googleId,
  ]);
  return result.rows[0];
};

export const deleteUserById = async (id: string) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      throw new Error("User not found or already deleted");
    }
    return result.rows[0];
  } catch (error) {
    throw new Error("Database deletion failed");
  }
};