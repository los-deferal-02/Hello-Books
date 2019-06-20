import Debug from 'debug';
import pool from '.';
import encrypt from '../helpers/encrypt';

const debug = Debug('db');
const { encryptPassword } = encrypt;

/**
 * Insert super admin after tables are created
 * @name insertSeed
 * @returns {String} details of insert
 */
const insertSeed = async () => {
  const hashedPassword = encryptPassword('nonsoDrums');
  const userSeed = `
  INSERT INTO users(
    "userName", "firstName", "lastName", email, password, role
  )
  VALUES (
    'xwebyna', 'Tolu', 'Martins', 'nero.abdul@gmail.com', '${hashedPassword}', 1
    )
  ON CONFLICT (email)
  DO NOTHING;
`;

  const bookSeed = `INSERT INTO books 
(title, body, description, genre, pages, "authorId")
  VALUES ('Harry Potter',
  'Harry potter and the goblet of fire',
  'This is the best series in the harry potter book',
  'Sci-fiction',
  350, 1);`;

  const authorSeed = `INSERT INTO authors (name)
    VALUES ('Harry Potter');`;

  const roleSeed = `INSERT INTO roles (name)
    VALUES
       ('patron'), ('author'), ('cashier'), ('admin'), ('superAdmin');`;

  try {
    await pool.query(roleSeed);
    await pool.query(authorSeed);
    await pool.query(userSeed);
    await pool.query(bookSeed);
    debug('insert succeeded');
  } catch (error) {
    debug(error);
  }
};

insertSeed();
