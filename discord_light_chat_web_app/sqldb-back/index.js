const express = require("express");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const chatRouter = require("./routes/Chat");
const authRouter = require("./routes/Auth");
const ChannelRouter = require("./routes/Channels");
const socket = require("./utils/socket");
const User = require("./models/Users.model");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRouter);
app.use("/api/auth", authRouter);
app.use("/api/channel", ChannelRouter);

const createAdminAccount = async () => {
  const hashedPassword = await bcrypt.hash('password', 10);

  // Check if user already exists
  const existingUser = await User.findOne({
    where: {
      username:'admin',
      email:'admin@gmail.com',
    },
  });
  if (!existingUser) {
    // Create a new user
     await User.create({
      username:'admin',
      password: hashedPassword,
      email:'admin@gmail.com',
      type:'admin'
    });
  }
};
createAdminAccount()

const PORT = process.env.PORT || 3333;

const server = app.listen(PORT, () => {
  console.log("application is running on " + PORT);
});

socket.initSocket(server);
