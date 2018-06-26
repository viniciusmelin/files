const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/files')
mongoose.Promise = global.Promise
const db = mongoose.connection
module.exports = db