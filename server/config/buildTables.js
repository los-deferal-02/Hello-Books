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
    "resetpasswordtoken" VARCHAR(100),
    "resettokenexpires" BIGINT,
    role INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
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

const rolesTableQuery = `
  CREATE TABLE IF NOT EXISTS roles(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
  );
`;

const bookTableQuery = `
CREATE TABLE IF NOT EXISTS books(
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  body VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  genre VARCHAR(100) NOT NULL,
  "authorId" INTEGER NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
  pages NUMERIC(250) NOT NULL
);
`;

const authorsTableQuery = `
CREATE TABLE IF NOT EXISTS authors(
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL
);
`;

const favouriteAuthorsTableQuery = `
CREATE TABLE IF NOT EXISTS favourite_authors(
  "userId" INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  "authorId" INTEGER NOT NULL REFERENCES authors (id) ON DELETE CASCADE,
  PRIMARY KEY ("userId", "authorId")
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
    ${authorsTableQuery}
    ${bookTableQuery}
    ${favouriteAuthorsTableQuery}
 `);
    debug('Tables created successfully');
  } catch (error) {
    debug(error);
    await pool.query(`${userTableQuery}`);
  }
};

createTable();
