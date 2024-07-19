// models/note.js
const db = require('../db/database')

const createNote = (userId, title, content, tags, color, callback) => {
  db.run(
    'INSERT INTO notes (user_id, title, content, tags, color) VALUES (?, ?, ?, ?, ?)',
    [userId, title, content, tags, color],
    function (err) {
      if (err) return callback(err)
      callback(null, {id: this.lastID, userId, title, content, tags, color})
    },
  )
}

const getNotesByUserId = (userId, callback) => {
  db.all(
    'SELECT * FROM notes WHERE user_id = ? AND is_deleted = 0',
    [userId],
    (err, rows) => {
      if (err) return callback(err)
      callback(null, rows)
    },
  )
}

const searchNotesByUserId = (userId, query, callback) => {
  const searchQuery = `%${query}%`
  db.all(
    'SELECT * FROM notes WHERE user_id = ? AND (title LIKE ? OR content LIKE ?) AND is_deleted = 0',
    [userId, searchQuery, searchQuery],
    (err, rows) => {
      if (err) return callback(err)
      callback(null, rows)
    },
  )
}

const getNotesByLabel = (userId, label, callback) => {
  db.all(
    'SELECT * FROM notes WHERE user_id = ? AND tags LIKE ? AND is_deleted = 0',
    [userId, `%${label}%`],
    (err, rows) => {
      if (err) return callback(err)
      callback(null, rows)
    },
  )
}

module.exports = {
  createNote,
  getNotesByUserId,
  searchNotesByUserId,
  getNotesByLabel,
}
