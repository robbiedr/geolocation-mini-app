require('dotenv').config();
const Sequelize = require('sequelize');

const {
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
} = process.env;

// DEFINITIONS
const treasures = require('../definitions/Treasures');
const moneyValues = require('../definitions/MoneyValues');
const users = require('../definitions/Users');

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  timezone: 'utc',
});

const db = {
  Sequelize,
  sequelize,
};

// MODELS
db.treasures = treasures(sequelize, Sequelize);
db.moneyValues = moneyValues(sequelize, Sequelize);
db.users = users(sequelize, Sequelize);

// ASSOCIATIONS
db.treasures.hasMany(db.moneyValues, { foreignKey: 'treasure_id' });
db.moneyValues.belongsTo(db.treasures, { foreignKey: 'treasure_id' });

module.exports = db;
