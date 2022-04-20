const Member = require("../utils/models");

// Database

/**
 * Get the member object from the database
 * @param {member} member
 * @returns {object} memberData
 */
async function getMember(member) {
  const memberData = await Member.findOne({ id: member.id });
  return memberData;
}

/**
 * Check if the member is in the database
 * @param {member} member
 * @returns {boolean} isMember
 */
async function checkMember(member) {
  const memberData = await Member.findOne({ id: member.id });
  if (memberData) {
    return true;
  } else {
    return false;
  }
}

/**
 * Create a member in the database
 * @param {*} member
 */
function createMember(member) {
  const newMember = new Member({
    id: member.id,
  });
  newMember.save().then(u => console.log(`New member created: ${u.id}`));
}

/**
 * Update a member in the database
 * @param {*} member
 * @param {*} settings
 * @returns {object} memberData
 */
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

// Economy

/**
 * Get the money of a member
 * @param {*} member
 * @returns {number} money
 */
async function getMemberMoney(member) {
  member = await getMember(member);
  return member.coins;
}

/**
 * Get the member's inventory
 * @param {*} member
 * @returns {array} inventory
 */
async function getMemberInventory(member) {
  member = await getMember(member);
  return member.inventory;
}

/**
 * Add the money of a member
 * @param {*} member
 * @param {integer} amount
 */
async function addMoney(member, amount) {
  member = await getMember(member);
  member.coins += amount;
  updateMember(member, { coins: member.coins });
}

/**
 * Remove the money of a member
 * @param {*} member
 * @param {integer} amount
 */
async function removeMoney(member, amount) {
  member = await getMember(member);
  member.coins -= amount;
  updateMember(member, { coins: member.coins });
}

// shop

/**
 * Buy an item
 * @param {*} member
 * @param {*} item
 */
async function buyItem(member, item) {
  member = await getMember(member);
  if (member.coins >= item.price) {
    member.coins -= item.price;
    member.inventory.push(item.name);
    updateMember(member, { coins: member.coins, inventory: member.inventory });
  }
}

/**
 * Sell an item
 * @param {*} member
 * @param {*} item
 */
async function sellItem(member, item) {
  member = await getMember(member);
  member.coins += item.price;
  member.inventory.splice(member.inventory.indexOf(item), 1);
  updateMember(member, { coins: member.coins, inventory: member.inventory });
}

// General

/**
 * Capitalize the first letter of a string
 * @param {*} string
 * @returns  {string} capitalizedString
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

module.exports = {
  getMember,
  checkMember,
  createMember,
  updateMember,
  getMemberMoney,
  getMemberInventory,
  addMoney,
  removeMoney,
  buyItem,
  sellItem,
  capitalizeFirstLetter,
};
