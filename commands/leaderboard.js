const { SlashCommandBuilder } = require("@discordjs/builders");
const { leaderboard } = require("../utils/utilities");
const { MessageEmbed } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Renvoyer le top 10 des meilleurs joueurs de votre serveur"),
  async execute(interaction) {
    const guildLeaderboard = await leaderboard(interaction.guild.id);

    if (!guildLeaderboard || guildLeaderboard.length < 1) {
      return interaction.reply(
        "Aucun joueur n'a encore joué dans ce serveur"
      );
    }
    const embed = new MessageEmbed()
      .setTitle("Top 10 des meilleurs joueurs")
      .setColor("#2f3136")
      .setTimestamp();
    for (let i = 0; i < guildLeaderboard.length; i++) {
      const member = await interaction.guild.members.fetch(guildLeaderboard[i].id);
      embed.addField(
        `${i + 1}. ${member.displayName}`,
        `${guildLeaderboard[i].coins} coins`
      );
    }
    return interaction.reply({ embeds: [embed] });
  }
};
