const { checkMember } = require("../utils/utilities");
module.exports = {
  name: "interactionCreate",
  async execute(client, interaction) {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    const isInTheDatabase = await checkMember(interaction.member);

    if (!isInTheDatabase) {
      if (interaction.commandName !== "setup") {
        return interaction.reply(
          "Vous n'êtes pas dans la base de données, veuillez utiliser la commande `setup`"
        );
      }
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
