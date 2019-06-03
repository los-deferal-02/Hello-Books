import pool from '.';

const { log } = console;

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role INTEGER DEFAULT 0,
    created_on TIMESTAMPTZ DEFAULT now() NOT NULL
  );
`;

const bookTableQuery = `
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) UNIQUE NOT NULL,
  body VARCHAR(100) NOT NULL,
  description VARCHAR(100) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  pages NUMERIC(250) NOT NULL
);
`;

/**
 * @name createTable
 * @async
 * @returns {String} string with state of table creation
 */
const createTable = async () => {
  try {
    await pool.query(`${userTableQuery}${bookTableQuery}`);
    log('Tables created successfully');
  } catch (error) {
    log(error);
  }
};

createTable();
