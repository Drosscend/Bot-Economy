const { SlashCommandBuilder } = require("@discordjs/builders");
const { addMoney } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Ajouter de l'argent à un membre")
    .addNumberOption(option =>
      option
        .setName("amount")
        .setDescription("La somme à ajouter")
        .setRequired(true)
        .setMinValue(1),
    )
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Le membre à qui ajouter de l'argent")
        .setRequired(true),
    ),
  async execute(interaction) {
    const number = interaction.options.getNumber("amount");
    const user = interaction.options.getMember("user", true);
    addMoney(user, number);
    return interaction.reply(
      `${user} a reçu **${number}** ${number > 1 ? "pièces" : "piece"} d'or.`,
    );
  },
};
