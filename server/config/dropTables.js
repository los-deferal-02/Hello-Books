import Debug from 'debug';
import pool from '.';

const debug = Debug('db');

const rolesTableQuery = 'DROP TABLE IF EXISTS roles CASCADE;';
const userTableQuery = 'DROP TABLE IF EXISTS users CASCADE;';
const otherTables = 'DROP TABLE IF EXISTS user_profiles, books, book_request;';

/**
 * @name dropTable
 * @async
 * @return {String} message showing whether tables were or were not dropped
 */
const dropTable = async () => {
  try {
    await pool.query(`
      ${otherTables}
      ${rolesTableQuery}
      ${userTableQuery}
    `);
    debug('Tables dropped successfully');
  } catch (error) {
    debug(error);
  }
};

dropTable();
