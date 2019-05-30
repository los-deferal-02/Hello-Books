import pool from '.';

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`;

/**
 * @name createTable
 * @async
 * @returns {String} string with state of table creation
 */
const createTable = async () => {
  try {
    await pool.query(`${userTableQuery}`);
    return 'table created successfully';
  } catch (error) {
    return error;
  }
};

createTable();
