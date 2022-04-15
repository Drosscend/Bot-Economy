const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: String,
  coins: { type: Number, default: 0 },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
