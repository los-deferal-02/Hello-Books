import pool from '../config/index';

export default class Users {
  static async create(user) {
    const {
      username, email, firstname, lastname, password
    } = user;
    const { rows } = await pool.query(`INSERT INTO 
    users( username, email, firstname, lastname, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [username, email, firstname, lastname, password]);
    return rows[0];
  }


  static async findUserInput(userData) {
    const column = (userData.split('@').length === 2 ? 'email' : 'username');
    const data = await pool.query(`SELECT * FROM users WHERE ${column} = $1`, [userData]);
    if (data.rowCount < 1) {
      return false;
    }
    return data.rows[0];
  }
}
