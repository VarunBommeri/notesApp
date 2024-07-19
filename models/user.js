// models/user.js
const db = require('../db/database')
const bcrypt = require('bcryptjs')

const createUser = (username, email, password, callback) => {
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return callback(err)
    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hash],
      function (err) {
        if (err) return callback(err)
        callback(null, {id: this.lastID, username, email})
      },
    )
  })
}

const findUserByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) return callback(err)
    callback(null, row)
  })
}

module.exports = {createUser, findUserByEmail}
