const Member = require("../utils/models");

// Database

/**
 * Get the member object from the database
 * @param {member} member
 * @returns {object} memberData
 */
async function getMember(member) {
  return Member.findOne({ id: member.id });
}

/**
 * Check if the member is in the database
 * @param {member} member
 * @returns {boolean} isMember
 */
async function checkMember(member) {
  const memberData = await Member.findOne({ id: member.id });
  return !!memberData;
}

/**
 * Create a member in the database
 * @param {*} member
 */
function createMember(member) {
  const newMember = new Member({
    id: member.id,
    guildId: member.guild.id,
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
    if (memberData[key] !== settings[key]) {
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
  await updateMember(member, { coins: member.coins });
}

/**
 * Remove the money of a member
 * @param {*} member
 * @param {integer} amount
 */
async function removeMoney(member, amount) {
  member = await getMember(member);
  member.coins -= amount;
  await updateMember(member, { coins: member.coins });
}

/**
 * Return the leaderboard
 * @param guildId {string} guild id
 * @returns {Promise<Query<Array<HydratedDocument<any, {}, {}>>, any, {}, any>>} top 10 members from a guild
 */
async function leaderboard(guildId) {
  return Member.find({ guildId: guildId }).sort({
    coins: -1,
  }).limit(10);
}

/**
 * Give 1000 coins to the member every day
 * @param member member who gets the daily reward
 * @returns {Promise<string>} message to send to the member
 */
async function daily(member) {
  member = await getMember(member);
  const now = new Date();
  if (member.daily.getDate() !== now.getDate()) {
    member.daily = now;
    member.coins += 1000;
    await updateMember(member, { coins: member.coins, daily: member.daily });
    return "Vous avez reçu 1000 coins, revenez demain pour de nouveaux coins !";
  } else {
    return "Vous avez déjà reçu votre récompense aujourd'hui !";
  }
}

/**
 * Give coins to a member
 * @param member the member who will send the coins
 * @param oMember the member who will receive the coins
 * @param amount the amount of coins
 * @returns {Promise<string>} the message to send to the member
 */
async function give(member, oMember, amount) {
  try {
    member = await getMember(member);
    oMember = await getMember(oMember);
    if (member.id === oMember.id) return "Vous ne pouvez pas vous faire donner de l'argent à vous-même !";
    if (member.coins >= amount) {
      member.coins -= amount;
      oMember.coins += amount;
      await updateMember(member, { coins: member.coins });
      await updateMember(oMember, { coins: oMember.coins });
      return `Vous avez donné ${amount} coins avec <@${oMember.id}>`;
    } else {
      return "Vous n'avez pas assez de coins !";
    }
  } catch (err) {
    return "Une erreur est survenue, il est probable que l'utilisateur n'existe pas !";
  }
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
    await updateMember(member, { coins: member.coins, inventory: member.inventory });
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
  await updateMember(member, { coins: member.coins, inventory: member.inventory });
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
  getMemberMoney,
  getMemberInventory,
  addMoney,
  removeMoney,
  leaderboard,
  daily,
  give,
  buyItem,
  sellItem,
  capitalizeFirstLetter,
};
