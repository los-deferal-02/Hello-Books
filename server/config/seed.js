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
  INSERT INTO checkouts("userId", "bookId","rentalFee", due) VALUES 
(1, 'Supinghdd cbs', 20, 'false'),
(1, 'Harry', 23, 'false'),
(1, 'Chima', 20, 'false'),
(1, 'Tusks', 40, 'true'),
(1, 'Supinghdd cbs', 20, 'true')
`;

  try {
    await pool.query(seed);
    debug('insert succeeded');
  } catch (error) {
    debug(error);
  }
};

insertSeed();
