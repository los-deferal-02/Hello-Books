import pool from '.';

/**
 * @name dropTable
 * @async
 * @return {String} message showing whether tables were or were not dropped
 */
const dropTable = async () => {
  try {
    await pool.query('DROP TABLE IF EXISTS USERS');
    return 'Tables dropped successfully';
  } catch (error) {
    return error;
  }
};

dropTable();
