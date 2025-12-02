import { pool } from "../../config/db";

const createUser = async (payload: Record<string, unknown>) => {
  const { name, email, age, phone, address } = payload;
  const result = await pool.query(
    `INSERT INTO users(name, email, age, phone, address) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, age, phone, address]
  );
  return result;
};

const getUser = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return result;
};

const updateUser = async (
  name: string,
  email: string,
  phone: string,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING *`,
    [name, email, phone, id]
  );

  return result;
};

const deleteUser = async (id: string) => {
  const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
  return result;
};

export const userServices = {
  createUser,
  getUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
