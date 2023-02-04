const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/Users.model');
const router = express.Router();
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({
      where: {username,},});
    if (existingUser) {return res.status(400).json({message: 'Username already exists',});}
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({username,password: hashedPassword,email,});
    return res.status(201).json({message: 'User created successfully',success:true});}
  catch (error) {console.error(error);return res.status(500).json({message: 'Internal server error',});}});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {email,},});
    if (!user) {return res.status(400).json({message: 'Invalid credentials',});}
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {return res.status(400).json({message: 'Invalid credentials',});}
    return res.status(200).json({message: 'Logged in successfully',user,});}
  catch (error) {console.error(error);return res.status(500).json({message: 'Internal server error',});}});
router.get('/users', async (req, res) => {
  try {const users = await User.findAll({attributes: ['id', 'username', 'email'],});return res.status(200).json(users);}
  catch (error) {console.error(error);return res.status(500).json({message: 'Internal server error',});}});

module.exports = router;
