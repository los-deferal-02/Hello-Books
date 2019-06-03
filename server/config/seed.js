import pool from '.';

const { log } = console;

/**
 * Insert super admin after tables are created
 * @name insertSuperAdmin
 * @returns {String} details of insert
 */
const insertSuperAdmin = async () => {
  const adminInsert = `
  INSERT INTO users(
    username, firstname, lastname, email, password
  )
  VALUES (
    'xwebyna', 'Tolu', 'Martins', 'nero.abdul@gmail.com', 'nonsoDRUMS'
    )
  ON CONFLICT (email)
  DO NOTHING;
`;
  try {
    await pool.query(adminInsert);
    log('insert succeeded');
  } catch (error) {
    log(error);
  }
};

insertSuperAdmin();
