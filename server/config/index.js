import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  NODE_ENV, DB_URL_DEV, DB_URL_TEST, DB_URL_PROD
} = process.env;

const dbUrl = {
  development: {
    url: DB_URL_DEV
  },
  test: {
    url: DB_URL_TEST
  },
  production: {
    url: DB_URL_PROD
  }
};

const connectionString = dbUrl[NODE_ENV].url;

const pool = new Pool({ connectionString });

export default pool;
