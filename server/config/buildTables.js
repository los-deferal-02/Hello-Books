import Debug from 'debug';
import pool from '.';

const debug = Debug('dev');

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    "userName" VARCHAR(100) UNIQUE NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role INTEGER DEFAULT 0,
    "emailConfirmCode" VARCHAR(64),
    created_on TIMESTAMPTZ DEFAULT now() NOT NULL
  );
`;

const bookTableQuery = `
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) UNIQUE NOT NULL,
  body VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
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
    debug('Tables created successfully');
  } catch (error) {
    debug(error);
  }
};

createTable();
