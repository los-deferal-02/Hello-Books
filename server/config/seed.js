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
import pool from './index';

(async () => {
  let result;
  const params = [
    'martinsUsername',
    'martins@gmail.com',
    'martins',
    'obayomi',
    'martinsPw'];
  try {
    result = await pool.query(`INSERT INTO users 
    (username, email, firstname, lastname, password)
      VALUES ($1, $2, $3, $4, $5)`, params);

    return result;
  } catch (error) {
    return error;
  }
})();

(async () => {
  let result;
  const params = [
    'Harry Potter',
    'Harry potter and the goblet of fire',
    'This is the best series in the harry potter book',
    'Sci-fiction',
    350];
  try {
    result = await pool.query(`INSERT INTO books 
      (title, body, description, genre, pages)
        VALUES ($1, $2, $3, $4, $5)`, params);

    return result;
  } catch (error) {
    return error;
  }
})();
