// models/Channel.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./Users.model')

const Channel = sequelize.define('Channel', {
  id: {type: DataTypes.INTEGER,allowNull: false,autoIncrement: true,primaryKey: true,},
  name: {type: DataTypes.STRING,allowNull: false,},
  createdBy: {type: DataTypes.INTEGER,allowNull: false,references: {model: User,key: 'id',},},});

Channel.belongsToMany(User, { as: 'participants', through: 'UserChannel' });
User.belongsToMany(Channel, { through: 'UserChannel' });

// Define associations
Channel.belongsTo(User, { as: 'createdByUser', foreignKey: 'createdBy' });
User.hasMany(Channel, { as: 'createdChannels', foreignKey: 'createdBy' });


sequelize.sync()
  .then(() => console.log('Channels Table created Successfully...'))
  .catch(err => console.log('Error Creating Channels Table: ' + err));

module.exports = Channel;
