import Debug from 'debug';
import pool from '.';

const debug = Debug('dev');

/**
 * @name dropTable
 * @async
 * @return {String} message showing whether tables were or were not dropped
 */
const dropTable = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS user_profiles, users, books');
    debug('Tables dropped successfully');
  } catch (error) {
    debug(error);
    await pool.query('DROP TABLE IF EXISTS users, books');
  }
};

dropTable();
