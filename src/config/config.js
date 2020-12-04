import fs from 'fs';
import env from './env';

module.exports = {
  production: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    ssl: {
      key: fs.readFileSync('./certs/client-key.pem'),
      cert: fs.readFileSync('./certs/client-cert.pem')
    }
  },

  development: {
    url: env.DATABASE_URL_DEV || env.LOCAL_URL,
    dialect: 'mysql',
  },

  test: {
    url: env.DATABASE_URL_TEST || env.LOCAL_URL,
    dialect: 'mysql',
  },
};
