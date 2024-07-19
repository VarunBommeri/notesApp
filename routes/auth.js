// routes/auth.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {User} = require('../models/user.js')
const router = express.Router()

// Registration endpoint
router.post('/register', async (req, res) => {
  const {email, password} = req.body

  try {
    const existingUser = await User.findOne({where: {email}})
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'})
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({email, password: hashedPassword})

    res.status(201).json({message: 'User registered successfully'})
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.findOne({where: {email}})
    if (!user) {
      return res.status(400).json({message: 'Invalid email or password'})
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({message: 'Invalid email or password'})
    }

    const token = jwt.sign({userId: user.id}, 'secret_key', {expiresIn: '1h'})

    res.json({token})
  } catch (error) {
    console.error('Error logging in user:', error)
    res.status(500).json({message: 'Internal server error'})
  }
})

module.exports = router
