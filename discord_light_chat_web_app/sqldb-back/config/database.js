const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  host: process.env.DATABASE_HOST ||'localhost',
  username: 'nandish',
  password: "nandish_project",
  database: 'nandish_discord_db',
  dialect: "mysql",
  socketPath: '/var/run/mysqld/mysqld.sock',
});
module.exports = sequelize;