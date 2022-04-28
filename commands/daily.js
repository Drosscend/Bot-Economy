const { SlashCommandBuilder } = require("@discordjs/builders");
const { daily } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Ajouter des points à votre compte quotidien"),
  async execute(interaction) {
    return interaction.reply(await daily(interaction.member));
  }
};
