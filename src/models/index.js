import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelizeConfig from '../config/config';
import env from '../config/env';

const basename = path.basename(__filename);
const environ = env.NODE_ENV || 'development';
const config = sequelizeConfig[environ];

const db = {};
let sequelize;

if (environ === 'test') config.logging = false;
if (environ === 'production') {
  sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    ssl: true,
    dialectOptions: {
        ssl: {
          require: true
        }
      }
  });
} 
else {
  sequelize = new Sequelize(
    config.url,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(
    (file) => file.indexOf('.') !== 0
        && file !== basename
        && file.slice(-3) === '.js'
  )
  .forEach((file) => {
    // const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    const model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
