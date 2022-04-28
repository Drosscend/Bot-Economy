const { SlashCommandBuilder } = require("@discordjs/builders");
const { give } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("give")
    .setDescription("Donner de l'argent à un membre")
    .addNumberOption(option =>
      option
        .setName("amount")
        .setDescription("La somme à donner")
        .setRequired(true)
        .setMinValue(1),
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Le membre à qui donner de l'argent")
        .setRequired(true),
    ),
  async execute(interaction) {
    const number = interaction.options.getNumber("amount");
    const user = interaction.options.getMember("user", true);
    return interaction.reply(
      await give(interaction.member, user, number),
    );
  },
};
