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
    "userName", "firstName", "lastName", email, password, role
  )
  VALUES (
    'xwebyna', 'Tolu', 'Martins', 'nero.abdul@gmail.com', '${hashedPassword}', 1
    )
  ON CONFLICT (email)
  DO NOTHING;
`;

  try {
    await pool.query(seed);
    await pool.query(`INSERT INTO roles (name)
    VALUES
       ('user'), ('author'), ('cashier'), ('admin'), ('superAdmin');`);
    debug('insert succeeded');
  } catch (error) {
    debug(error);
  }
};

insertSeed();
