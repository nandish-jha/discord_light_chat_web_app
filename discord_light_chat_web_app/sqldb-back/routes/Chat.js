const express = require("express");
const router = express.Router();
const User = require("../models/Users.model");
const {Message,Reaction} = require('../models/Message.model')

router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: Message, as: "respondingMessage" },{model: User,as: "sender",},
        {model: Message,as: "respondingMessage",},{model: Reaction,attributes: ["id", "usrId",'reactionType'],},],});
    res.status(200).json(messages);}
  catch (err) {console.error(err);res.status(500).json({ message: "Internal server error" });}});
router.get("/:to", async (req, res) => {const { to } = req.params;
  try {const messages = await Message.findAll({where: {to: to,},include: [{ model: Message, as: "respondingMessage" },{model: User,as: "sender",},{model: Reaction,},],});res.json(messages);}
  catch (error) {console.error(`Error fetching messages: ${error}`);res.status(500).send("Internal server error");}});
router.post("/messages/:id/reactions", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    const user = await User.findByPk(req.body.userId);
    if (!message || !user) {
      return res.status(404).json({ message: "Message or user not found" });
    }
    const reaction = await Reaction.create({
      reactionType: req.body.reactionType,
      msgId: message.id,
      usrId: user.id,
    });
    res.status(201).json(reaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.delete("/messages/:id/reactions/:userId", async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    const user = await User.findByPk(req.params.userId);
    if (!message || !user) {return res.status(404).json({ message: "Message or user not found" });}
    if (!reaction) {return res.status(404).json({ message: "Like not found" });}
    await reaction.destroy();res.status(204).end();}
  catch (error) {console.error(error);res.status(500).json({ message: "Internal server error" });}});

module.exports = router;
