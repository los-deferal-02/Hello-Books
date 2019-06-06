import pool from '.';

const { log } = console;

/**
 * @name dropTable
 * @async
 * @return {String} message showing whether tables were or were not dropped
 */
const dropTable = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS users');
    log('Tables dropped successfully');
  } catch (error) {
    log(error);
  }
};

dropTable();
