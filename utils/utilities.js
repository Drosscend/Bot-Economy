const Member = require("../utils/models");

async function getMember(member) {
  const memberData = await Member.findOne({ id: member.id });
  return memberData;
}

function createMember(member) {
  const newMember = new Member({
    id: member.id,
  });
  newMember.save().then(u => console.log(`New member created: ${u.id}`));
}

async function updateMember(member, settings) {
  let memberData = await getMember(member);
  if (typeof memberData != "object") memberData = {};
  for (const key in settings) {
    if (memberData[key] != settings[key]) {
      memberData[key] = settings[key];
    }
  }
  return memberData.updateOne(settings);
}

async function addMoney(member, amount) {
  member = await getMember(member);
  member.coins += amount;
  updateMember(member, { coins: member.coins });
}

async function removeMoney(member, amount) {
  member = await getMember(member);
  member.coins -= amount;
  updateMember(member, { coins: member.coins });
}

module.exports = {
  getMember,
  createMember,
  updateMember,
  addMoney,
  removeMoney,
};
