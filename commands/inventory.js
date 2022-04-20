const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getMemberInventory } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("Get your inventory"),
  async execute(interaction) {
    const memberInventory = await getMemberInventory(interaction.member);
    if (memberInventory == "") {
      interaction.reply(
        "You don't have any items in your inventory. Use `/shop buy` to buy some."
      );
      return;
    }
    const embed = new MessageEmbed()
      .setTitle("Your inventory")
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.member.user.displayAvatarURL())
      .setDescription(codeBlock(memberInventory.join("\n")))
      .setColor("#2f3136")
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
