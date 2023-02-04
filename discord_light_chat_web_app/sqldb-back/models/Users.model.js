const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // replace with your Sequelize instance

const User = sequelize.define('User', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true,},
  username: {type: DataTypes.STRING,allowNull: false,unique: true,},
  password: {type: DataTypes.STRING,allowNull: false,},
  email: {type: DataTypes.STRING,allowNull: false,unique: true,},
  type: {type: DataTypes.STRING,allowNull: false,validate: {isIn: [['admin', 'user']]},defaultValue: 'user'}}, {
  tableName: 'users',});

// Synchronize the models with the database
sequelize.sync()
  .then(() => {console.log('users Table Created successfully.');})
  .catch((error) => {console.error('Error creating users table:', error);});
  
module.exports = User;
