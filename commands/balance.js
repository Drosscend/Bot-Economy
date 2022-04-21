const { SlashCommandBuilder, bold } = require("@discordjs/builders");
const { getMemberMoney } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Affiche votre solde"),
  async execute(interaction) {
    const memberMoney = await getMemberMoney(interaction.member);
    return interaction.reply(
      `You have ${bold(memberMoney)} ${memberMoney === 1 ? "coin" : "coins"}`
    );
  },
};
