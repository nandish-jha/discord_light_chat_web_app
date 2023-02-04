const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Channel = require('./Channels.model');
const User = require('./Users.model.js');
const Reaction = sequelize.define('Reaction', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true,},
  usrId: {type: DataTypes.INTEGER,allowNull: false,},
  msgId: {type: DataTypes.INTEGER,allowNull: false,},
  reactionType: {type: DataTypes.ENUM('like', 'dislike'),allowNull: false,},}, {
  tableName: 'reactions',timestamps: true,});

const Message = sequelize.define('Message', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true,},
  message: {type: DataTypes.STRING,allowNull: false,},
  from: {type: DataTypes.INTEGER,allowNull: false,},
  to: {type: DataTypes.INTEGER,allowNull: false,},
  replyTo:{type:DataTypes.INTEGER,allowNull:true}}, {
  tableName: 'messages',timestamps: true,});

User.belongsToMany(Message, { through: Reaction, as: 'likedMessages' });
Message.belongsToMany(User, { through: Reaction, as: 'likingUsers' });
Message.belongsTo(Message, { foreignKey: 'replyTo', as: 'respondingMessage' });
Message.belongsTo(User, { as: 'sender', foreignKey: 'from' });
Message.belongsTo(Channel, { as: 'group', foreignKey: 'to' });

// Define the association on the Message model
Message.hasMany(Reaction, { foreignKey: 'msgId' });

// Define the association on the Reaction model
Reaction.belongsTo(Message, { foreignKey: 'msgId' });

sequelize.sync()
  .then(() => {console.log('Messages table Created successfully.');})
  .catch((error) => {console.error('Error Creating Messages Table:', error);});

module.exports = {Message,Reaction};
