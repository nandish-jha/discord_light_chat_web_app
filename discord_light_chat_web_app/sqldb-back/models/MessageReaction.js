const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./Users.model.js");
const Message = require("./Message.model.js");

const MessageReaction = sequelize.define('MessageReaction', {
  id: {type: DataTypes.INTEGER,primaryKey: true,autoIncrement: true,},
  type: {type: DataTypes.ENUM('like', 'dislike'),allowNull: false,},}, {
  tableName: 'message_reactions',timestamps: true,});

// Define the relationships
User.belongsToMany(Message, { through: MessageReaction, as: 'likedMessages' });
Message.belongsToMany(User, { through: MessageReaction, as: 'likingUsers' });


sequelize
  .sync()
  .then(() => console.log("MessageReaction Table created Successfully..."))
  .catch((err) => console.log("Error Creating MessageReaction Table: " + err));

module.exports = MessageReaction;
