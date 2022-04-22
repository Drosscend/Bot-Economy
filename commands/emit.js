const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("emit")
    .setDescription("Emit un event")
    .addStringOption(option =>
      option
        .setName("event")
        .setRequired(true)
        .setDescription("L'event à émettre")
        .addChoice("guildCreate", "guildCreate")
    ),
  async execute(interaction, client) {
    const eventChoice = interaction.options.getString("event");

    switch (eventChoice) {
      case "guildCreate":
        client.emit("guildCreate", interaction.guild);
        interaction.reply({
          content: "Event guildCreate has been run",
          ephemeral: true,
        });
        break;
      default:
        interaction.reply("L'event n'existe pas");
        break;
    }
  },
};
