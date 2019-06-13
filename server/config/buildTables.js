import Debug from 'debug';
import pool from '.';

const debug = Debug('db');

const userTableQuery = `
  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    "userName" VARCHAR(100) UNIQUE NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    role INTEGER NOT NULL,
    "isAdmin" boolean NOT NULL DEFAULT false,
    "emailConfirmCode" VARCHAR(64),
    "createdOn" TIMESTAMPTZ DEFAULT now() NOT NULL
  );
  CREATE TABLE IF NOT EXISTS books(
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    body VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    pages NUMERIC(250) NOT NULL
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

const rolesTableQuery = `
    CREATE TABLE IF NOT EXISTS roles(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
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
    await pool.query(`${userTableQuery}
    ${userProfileTableQuery}
    ${bookTableQuery}
    ${rolesTableQuery}
 `);
    debug('Tables created successfully');
  } catch (error) {
    debug(error);
  }
};

createTable();
