const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/user');
const { doHash, doHashValidation } = require('../utils/util');
require('dotenv').config();

// Joi 
const signUpSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .required(),
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

const signInSchema = Joi.object({
  usernameOrEmail: Joi.string()
    .required(),
  password: Joi.string()
    .required(),
});

//Sign Up
const signUp = async (req, res) => {
  const { error } = signUpSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { username, email, password } = req.body;
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) return res.status(409).json({ message: 'User already exists' });

  const saltRounds = 10;
  const hashedPassword = await doHash(password, saltRounds);
  const user = new User({ username, email, password: hashedPassword });
  await user.save();

  res.status(201).json({ message: 'User created successfully' });
};


//Sign In
const signIn = async (req, res) => {
  const { error } = signInSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { usernameOrEmail, password } = req.body;
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const valid = await doHashValidation(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '30mins' });
  res.json({ token });
};

module.exports = {
  signUp,
  signIn,
};
