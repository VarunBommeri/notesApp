// routes/notes.js
const express = require('express')
const {
  createNote,
  getNotesByUserId,
  searchNotesByUserId,
  getNotesByLabel,
} = require('../models/note')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()

// Middleware to check authentication
router.use(authMiddleware)

router.post('/', (req, res) => {
  const {title, content, tags, color} = req.body
  const userId = req.userId

  // Validate the request body
  if (!title || !content) {
    return res.status(400).json({message: 'Title and content are required'})
  }

  const tagsArray = tags
    ? tags
        .split(',')
        .map(tag => tag.trim())
        .slice(0, 9)
    : []
  const tagsString = tagsArray.join(',')

  createNote(userId, title, content, tagsString, color, (err, note) => {
    if (err) return res.status(500).json({message: err.message})
    res.status(201).json({message: 'Note created successfully', note})
  })
})

router.get('/', (req, res) => {
  const userId = req.userId
  getNotesByUserId(userId, (err, notes) => {
    if (err) return res.status(500).json({message: err.message})
    res.status(200).json({notes})
  })
})

router.get('/search', (req, res) => {
  const userId = req.userId
  const query = req.query.q
  if (!query) {
    return res.status(400).json({message: 'Query parameter is required'})
  }
  searchNotesByUserId(userId, query, (err, notes) => {
    if (err) return res.status(500).json({message: err.message})
    res.status(200).json({notes})
  })
})

router.get('/label/:label', (req, res) => {
  const userId = req.userId
  const label = req.params.label
  getNotesByLabel(userId, label, (err, notes) => {
    if (err) return res.status(500).json({message: err.message})
    res.status(200).json({notes})
  })
})

module.exports = router
