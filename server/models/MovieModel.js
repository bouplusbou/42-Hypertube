const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const MovieSchema = new Schema({
  magnet: {
    type: String,
    required: false
  },
  quality: {
    type: String,
    required: false
  },
  language: {
    type: String,
    required: false
  },
  seed: {
    type: Number,
    required: false
  },
  peer: {
    type: Number,
    required: false
  },
  bytes: {
    type: Number,
    required: false
  },
  fileSize: {
    type: String,
    required: false
  },
});

module.exports = Movie = mongoose.model("Movie", MovieSchema);
