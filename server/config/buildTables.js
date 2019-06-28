import Debug from 'debug';
import pool from '.';

const debug = Debug('db');

const tablesQuery = `
  CREATE TYPE "verification_status" AS ENUM (
  'verified',
  'rejected',
  'pending'
  );
  CREATE TYPE "lend_status" AS ENUM (
  'borrowed',
  'available'
  );
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
  CREATE TABLE "books" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(100) NOT NULL,
  "body" VARCHAR(100) NOT NULL,
  "description" TEXT NOT NULL,
  "genreId" INT NOT NULL,
  "pages" NUMERIC(250) NOT NULL,
  "authorId" INT NOT NULL,
  "uploadedBy" INT NOT NULL,
  "verification" "verification_status" DEFAULT 'pending',
  "createdOn" TIMESTAMPTZ DEFAULT now() NOT NULL,
  "hardcopy" boolean,
  "status" "lend_status" DEFAULT 'available',
  "uploadId" INT
);
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

  CREATE TABLE IF NOT EXISTS checkouts(
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL,
    "bookId" VARCHAR(100) NOT NULL,
    "rentalFee" INTEGER,
    "checkoutDate" TIMESTAMPTZ DEFAULT now() NOT NULL,
    "returnDate" TIMESTAMPTZ DEFAULT now() NOT NULL,
    due boolean
    );

  CREATE TABLE IF NOT EXISTS roles(
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) UNIQUE NOT NULL
  );
  CREATE TABLE "authors" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR
  );
  CREATE TABLE IF NOT EXISTS favourite_authors(
  "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "authorId" INTEGER NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
  PRIMARY KEY("userId", "authorId")
  );
  CREATE TABLE IF NOT EXISTS favourite_books(
    "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    "bookId" INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    PRIMARY KEY("userId", "bookId")
    );
  CREATE TABLE "ebooks" (
  id SERIAL PRIMARY KEY,
  "filename" varchar,
  "filePath" varchar UNIQUE
  );
  CREATE TABLE "genre" (
  id SERIAL PRIMARY KEY,
  "name" VARCHAR
);
ALTER TABLE "users" ADD FOREIGN KEY ("role") REFERENCES "roles" ("id");
ALTER TABLE "user_profiles" 
ADD FOREIGN KEY ("userId") REFERENCES "users" ("id");
ALTER TABLE "books" ADD FOREIGN KEY ("genreId") REFERENCES "genre" ("id");
ALTER TABLE "books" ADD FOREIGN KEY ("authorId") REFERENCES "authors" ("id");
ALTER TABLE "books" ADD FOREIGN KEY ("uploadedBy") REFERENCES "users" ("id");
ALTER TABLE "books" ADD FOREIGN KEY ("uploadId") REFERENCES "ebooks" ("id");
INSERT INTO roles (name) 
VALUES ('user'), ('author'), ('cashier'), ('admin'), ('superAdmin');
`;

/**
 * @name createTable
 * @async
 * @returns {String} string with state of table creation
 */
const createTable = async () => {
  try {
    await pool.query(`${tablesQuery}
`);
    debug('Tables created successfully');
  } catch (error) {
    debug(error);
    return error;
  }
};

createTable();
