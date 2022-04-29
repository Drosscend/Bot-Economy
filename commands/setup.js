const { SlashCommandBuilder } = require("@discordjs/builders");
const { createMember, checkMember } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Débuter votre aventure"),
  async execute(interaction) {
    if (!checkMember(interaction.member)) {
      return interaction.reply("Vous êtes déjà dans la base de données");
    }
    createMember(interaction.member);
    return interaction.reply("Vous avez bien été ajouté à la base de données");
  },
};