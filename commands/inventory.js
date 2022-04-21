const { SlashCommandBuilder, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { getMemberInventory } = require("../utils/utilities");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("inventaire")
    .setDescription("Affiche votre inventaire"),
  async execute(interaction) {
    const memberInventory = await getMemberInventory(interaction.member);
    if (memberInventory == "") {
      return interaction.reply(
        "Vous n'avez pas d'objets dans votre inventaire, vous pouvez en acheter en utilisant la commande `shop buy`"
      );
    }

    // create a string that fallox this example
    // 1x x
    // 1x y
    // 3x z

    const inventory = memberInventory.reduce((acc, item) => {
      if (acc[item]) {
        acc[item]++;
      } else {
        acc[item] = 1;
      }
      return acc;
    }, {});

    // create a clean string to display
    let inventoryString = "";
    for (const item in inventory) {
      inventoryString += `${inventory[item]}x ${item}\n`;
    }

    const embed = new MessageEmbed()
      .setTitle("Votre inventaire")
      .setAuthor({
        name: interaction.member.displayName,
        iconURL: interaction.member.user.displayAvatarURL(),
      })
      .setThumbnail(interaction.member.user.displayAvatarURL())
      .setDescription(codeBlock(inventoryString))
      .setColor("#2f3136")
      .setTimestamp();
    return interaction.reply({ embeds: [embed] });
  },
};
