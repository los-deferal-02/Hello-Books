import Debug from 'debug';
import pool from '.';

const debug = Debug('db');

/**
 * @name dropTable
 * @async
 * @return {String} message showing whether tables were or were not dropped
 */
const dropTable = async () => {
  try {
    await pool.query(
      `DROP TABLE IF EXISTS user_profiles, users, books, book_requests, roles, 
      authors, ebooks, genre, favourite_authors CASCADE`
    );
    debug('Tables dropped successfully');
    await pool.query('DROP TYPE IF EXISTS verification_status, lend_status');
  } catch (error) {
    debug(error);
    return error;
  }
};

dropTable();
