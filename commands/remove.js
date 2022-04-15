const { SlashCommandBuilder } = require("@discordjs/builders");
const { removeMoney } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Enlever de l'argent à un membre")
    .addNumberOption(option =>
      option
        .setName("amount")
        .setDescription("La somme à enlever")
        .setRequired(true)
        .setMinValue(1),
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Le membre à qui enlever de l'argent")
        .setRequired(true),
    ),
  async execute(interaction) {
    const number = interaction.options.getNumber("amount");
    const user = interaction.options.getMember("user", true);
    removeMoney(user, number);
    return interaction.reply(
      `${user} a perdu **${number}** ${number > 1 ? "pièces" : "piece"} d'or.`,
    );
  },
};
