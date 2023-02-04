const socketIo = require("socket.io");
const {Message,Reaction} = require("../models/Message.model");
const Channel = require("../models/Channels.model");
const User = require("../models/Users.model");
const { toCamelCase } = require("../utils/miscFunctions");

function initSocket(server) {
  const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  let onlineUsers = new Map();
  onlineUsers.clear();

  io.on("connection", (socket) => {
    const returnUpdatedUsers = () => {
      const usersArray = Array.from(onlineUsers.entries()).map(
        ([socketId, username]) => {
          return { socketId, ...username };
        }
      );
      io.emit("updatedUsers", usersArray);
    };


    const saveMessageToDb = async (message) => {
      try {
        const savedMessage = await Message.create(message);
        const newMessage = await Message.findOne({
          where: { id: savedMessage.id },
          include: [{ model: Message, as: "respondingMessage" }],
        });
        return newMessage;
      } catch (error) {
        console.error(`Error saving message to database: ${error.message}`);
        return null;
      }
    };

    socket.on("join", ({ channelName }) => {
      socket.join(toCamelCase(channelName));
      io.to(socket.id).emit('channelJoinedInit',toCamelCase(channelName))
    });

    socket.on("joinchannel", async ({ channelName, channelId, userId }) => {
      try {
        const channel = await Channel.findByPk(channelId);
        const user = await User.findByPk(userId);

        if (!channel || !user) {
          console.log("channel or user not found");
        }

        await channel.addParticipant(user);
        socket.join(toCamelCase(channelName));
        const channels = await Channel.findAll({
          include: [
            {
              model: User,
              as: 'createdByUser',
              attributes: ['id', 'username', 'email'],
            },
            {
              model: User,
              as: 'participants',
              attributes: ['id', 'username', 'email'],
              through: { attributes: [] },
            },
          ],
        });
        io.to(socket.id).emit("welcome",channels);
        socket.to(toCamelCase(channelName)).emit("newUser", {
          message: "A new User Joined us",
        });
      } catch (err) {
        console.error(err);
      }
    });

    socket.on("messageSend", async ({ message, channelName }) => {
      const messageSaved = await saveMessageToDb(message);
      const newMessage = await Message.findByPk(messageSaved.id,{
        include: [
          { model: Message, as: "respondingMessage" },
          {
            model: User,
            as: "sender",
          },
          {
            model: Reaction,
          },
        ],
      })
      socket.to(channelName).emit("messagesUpdated", newMessage);
      io.to(socket.id).emit("messagesUpdated",newMessage);
    });

    socket.on('addReaction',async({channelName,channelId,reactionType, usrId, msgId})=>{
      const existingReaction = await Reaction.findOne({
        where: { usrId, msgId }
      });
      
      if (existingReaction) {
        await existingReaction.update({ reactionType });
      } else {
        await Reaction.create({ reactionType, usrId, msgId });
      }
      const messages = await Message.findAll({
        where: {
          to: channelId,
        },
        include: [
          { model: Message, as: "respondingMessage" },
          {
            model: User,
            as: "sender",
          },
          {
            model: Reaction,
          },
        ],
      });
      socket.to(channelName).emit('getAllMessages',messages)
      io.to(socket.id).emit("getAllMessages",messages);
    })

    socket.on('deleteMessage',async ({messageId,channelName,channelId})=>{
      try {
        const message = await Message.findByPk(messageId);
        await message.destroy(); 
        const messages = await Message.findAll({
          where: {
            to: channelId,
          },
          include: [
            { model: Message, as: "respondingMessage" },
            {
              model: User,
              as: "sender",
            },
            {
              model: Reaction,
            },
          ],
        });
        socket.to(channelName).emit('getAllMessages',messages)
        io.to(socket.id).emit('getAllMessages',messages)
      } catch (error) {
        io.to(socket.id).emit('error','you need to delete all the channels created by this user')  
      }
    })

    socket.on('deleteChannel',async ({channelId})=>{
     try {
      const channel = await Channel.findByPk(channelId);
      await channel.destroy();
      const channels = await Channel.findAll({
        include: [
          {
            model: User,
            as: 'createdByUser',
            attributes: ['id', 'username', 'email'],
          },
          {
            model: User,
            as: 'participants',
            attributes: ['id', 'username', 'email'],
            through: { attributes: [] },
          },
        ],
      });
     io.emit('welcome',channels)
     } catch (error) {
      console.log(error)
      io.to(socket.id).emit('error','you need to delete all the Messages in this Channel first due to foriegn key constraint')
     }
    })

    socket.on('deleteUser',async ({userId})=>{
     try {
      console.log(userId)
      const user =await User.findByPk(userId)
      await user.destroy()
      const users = await User.findAll({
        attributes: ['id', 'username', 'email'],
      });

      io.emit('updateAllUsers',users)
     } catch (error) {
      console.log(error.message)
      io.to(socket.id).emit('error','you need to delete all the channels created by this user')
     }
    })

    socket.on("disconnect", () => {
      const user = onlineUsers.get(socket.id);
      onlineUsers.delete(socket.id);
      io.emit("user left", user);
      returnUpdatedUsers();
    });
  });
}

module.exports = {
  initSocket,
};
