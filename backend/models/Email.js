const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  from: String,
  to: String,
  date: Date,
  subject: String,
  snippet: String,
});

module.exports = mongoose.model('Email', emailSchema);
