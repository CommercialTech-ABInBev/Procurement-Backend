import env from './env';

module.exports = {
  production: {
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'mysql',
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    }
  },
  development: {
    // url: env.DATABASE_URL_DEV || env.LOCAL_URL,
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true
      }
    }
  },

  test: {
    url: env.DATABASE_URL_TEST || env.LOCAL_URL,
    dialect: 'mysql',
  },
};
