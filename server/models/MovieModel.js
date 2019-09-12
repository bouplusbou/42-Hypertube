const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
  title: String,
  year: Number,
  magnet: String,
  quality: String,
  language: String,
  seed: Number,
  peer: Number,
  bytes: Number,
  fileSize: String,
});

module.exports = Movie = mongoose.model("Movie", MovieSchema);
