import Debug from 'debug';
import pool from '.';
import encrypt from '../helpers/encrypt';

const debug = Debug('dev');
const { encryptPassword } = encrypt;

/**
 * Insert super admin after tables are created
 * @name insertSeed
 * @returns {String} details of insert
 */
const insertSeed = async () => {
  const hashedPassword = encryptPassword('nonsoDrums');
  const seed = `
  INSERT INTO users(
    "userName", "firstName", "lastName", email, password
  )
  VALUES (
    'xwebyna', 'Tolu', 'Martins', 'nero.abdul@gmail.com', '${hashedPassword}'
    )
  ON CONFLICT (email)
  DO NOTHING;
`;
  try {
    await pool.query(seed);
    debug('insert succeeded');
  } catch (error) {
    debug(error);
  }
};

insertSeed();
