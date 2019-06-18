import Debug from 'debug';
import pool from '.';

const debug = Debug('db');

const rolesTableQuery = `
  CREATE TABLE IF NOT EXISTS roles(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
  );
`;

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    "userName" VARCHAR(100) UNIQUE NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "resetpasswordtoken" VARCHAR(100),
    "resettokenexpires" BIGINT,
    "role" INTEGER DEFAULT 0,
    "isAdmin" boolean NOT NULL DEFAULT false,
    "emailConfirmCode" VARCHAR(64),
    "createdOn" TIMESTAMPTZ DEFAULT now() NOT NULL
  );
`;

const userProfileTableQuery = `
  CREATE TABLE IF NOT EXISTS user_profiles(
    "userId" INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    "bio" VARCHAR,
    "avatarUrl" VARCHAR,
    "favoriteBook" VARCHAR(100),
    "favoriteGenre" VARCHAR(100),
    "favoriteAuthor" VARCHAR(100),
    "createdOn" TIMESTAMPTZ DEFAULT now() NOT NULL,
    PRIMARY KEY ("userId")
  );
`;

const bookTableQuery = `
  CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    body VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    pages NUMERIC(250) NOT NULL
  );
`;

const bookRequestTableQuery = `
  CREATE TABLE IF NOT EXISTS book_request(
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) UNIQUE NOT NULL,
    author VARCHAR(150) NOT NULL
  );
`;

/**
 * @name createTable
 * @async
 * @returns {String} string with state of table creation
 */
const createTable = async () => {
  try {
    await pool.query(`
      ${rolesTableQuery}
      ${userTableQuery}
      ${userProfileTableQuery}
      ${bookTableQuery}
      ${bookRequestTableQuery}
    `);
    debug('Tables created successfully');
  } catch (error) {
    debug(error);
  }
};

createTable();
