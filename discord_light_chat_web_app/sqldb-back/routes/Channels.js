const express = require("express");
const router = express.Router();
const Channel = require("../models/Channels.model.js");
const User = require("../models/Users.model");

router.get("/", async (req, res) => {
  try {
    const channels = await Channel.findAll({include: [{
            model: User,as: 'createdByUser',attributes: ['id', 'username', 'email'],},
          { model: User,as: 'participants',attributes: ['id', 'username', 'email'],through: { attributes: [] },},],});
    res.status(200).json(channels);}
  catch (error) {console.error("Error retrieving channels:", error);res.status(500).json({ message: "Error retrieving channels" });}});
router.post("/", async (req, res) => {
const { name, createdBy, participants } = req.body;
  try {
    const channel = await Channel.create({name,createdBy,});
    if (participants && participants.length > 0) {const users = await User.findAll({where: {id: participants,},});
      await channel.addParticipants(users);}res.status(201).json(channel);}
  catch (err) {console.error(err);res.status(500).json({ message: 'Server error' });}});
router.post('/:channelId/participants/:userId', async (req, res) => {
    const { channelId, userId } = req.params;
    try {
      const channel = await Channel.findByPk(channelId);
      const user = await User.findByPk(userId);
      if (!channel || !user) {return res.status(404).json({ message: 'Channel or user not found' });}await channel.addParticipant(user);res.status(200).json({ message: 'User added to channel participants' });}
    catch (err) {console.error(err);res.status(500).json({ message: 'Server error' });}});

module.exports = router;
