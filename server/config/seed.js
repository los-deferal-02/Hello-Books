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
  const seed = `
  INSERT INTO genre("name") VALUES ('Fiction');
  INSERT INTO authors("name") VALUES ('JK Rowling');
  INSERT INTO users(
    "userName", "firstName", "lastName", email, password, role
  )
  VALUES (
    'xwebyna', 'Tolu', 'Martins', 'nero.abdul@gmail.com', '${hashedPassword}', 1
    )
  ON CONFLICT (email)
  DO NOTHING;
  INSERT INTO books("title", "body", "description", "genreId", "pages", 
  "authorId", "uploadedBy", "hardcopy")
  VALUES (
    'Harry Potter', 'Harry Potter and The Prisoner of Azkaban', 
    'Harry makes a new friend', 1, 455, 1, 1, true
  );
`;

  try {
    await pool.query(seed);
    debug('insert succeeded');
  } catch (error) {
    debug(error);
  }
};

insertSeed();
