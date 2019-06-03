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
