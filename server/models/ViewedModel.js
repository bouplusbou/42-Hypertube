const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ViewedSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imdbId: {
    type: String,
    required: true
  },
  viewDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = Viewed = mongoose.model("Viewed", ViewedSchema);