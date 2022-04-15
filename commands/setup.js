const { SlashCommandBuilder } = require("@discordjs/builders");
const { createMember } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Débuter votre aventure"),
  async execute(interaction) {
    createMember(interaction.member);
    return interaction.reply("Bienvenue sur notre jeu!");
  },
};
