import pool from '.';

const { log } = console;

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    "userName" VARCHAR(100) UNIQUE NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "role" int DEFAULT 0,
    "createdOn" TIMESTAMPTZ DEFAULT now() NOT NULL
  );
`;

/**
 * @name createTable
 * @async
 * @returns {String} string with state of table creation
 */
const createTable = async () => {
  try {
    await pool.query(`${userTableQuery}`);
    log('Tables created successfully');
  } catch (error) {
    log(error);
  }
};

createTable();
