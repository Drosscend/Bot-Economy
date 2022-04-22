const { MessageEmbed } = require("discord.js");
module.exports = {
  name: "guildCreate",
  once: true,
  execute(client, guild) {
    const message = `New guild joined: **${guild.name}** (id: **${guild.id}**). This guild has **${guild.memberCount}** members!`;
    const logsChannel = client.channels.cache.get("967059042805624852");
    const embed = new MessageEmbed()
      .setTitle("New Guild Joined")
      .setColor("#2f3136")
      .setThumbnail(guild.iconURL() || client.user.displayAvatarURL())
      .addField("Guild Name", guild.name, true)
      .addField("Guild ID", guild.id, true)
      .addField("At", new Date().toLocaleString(), true)
      .setTimestamp();
    logsChannel.send({ content: message, embeds: [embed] });
  },
};
