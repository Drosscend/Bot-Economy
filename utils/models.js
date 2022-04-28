const mongoose = require("mongoose");

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const memberSchema = new mongoose.Schema({
  id: String,
  guildId: String,
  coins: { type: Number, default: 0 },
  inventory: { type: Array, default: [] },
  daily: { type: Date, default: yesterday },
});

const Member = mongoose.model("Member", memberSchema);

module.exports = Member;
