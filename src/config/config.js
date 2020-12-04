import env from './env';

module.exports = {
  development: {
    url: env.DATABASE_URL_DEV || env.LOCAL_URL,
    dialect: 'mysql',
  },

  test: {
    url: env.DATABASE_URL_TEST || env.LOCAL_URL,
    dialect: 'mysql',
  },
};
