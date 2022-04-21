const { SlashCommandBuilder, bold, codeBlock } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const shop = require("../utils/shop");
const {
  capitalizeFirstLetter,
  getMemberMoney,
  getMemberInventory,
  buyItem,
  sellItem,
} = require("../utils/utilities");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Commande pour accéder au magasin")
    .addSubcommand(subcommand =>
      subcommand.setName("show").setDescription("Affiche le magasin")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("details")
        .setDescription("Detail d'un item")
        .addStringOption(option =>
          option
            .setName("item")
            .setRequired(true)
            .setDescription("Nom de l'item")
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("buy")
        .setDescription("Acheter un item")
        .addStringOption(option =>
          option
            .setName("item")
            .setRequired(true)
            .setDescription("Nom de l'item")
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("sell")
        .setDescription("Vendre un item")
        .addStringOption(option =>
          option
            .setName("item")
            .setRequired(true)
            .setDescription("Nom de l'item")
        )
    ),
  async execute(interaction) {
    const memberMoney = await getMemberMoney(interaction.member);
    const memberInventory = await getMemberInventory(interaction.member);

    switch (interaction.options.getSubcommand()) {
      case "show": {
        const shopItems = Object.entries(shop);
        const embed = new MessageEmbed()
          .setTitle("Shop")
          .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.user.displayAvatarURL(),
          })
          .setDescription(
            codeBlock(
              shopItems.map(item => `${item[0]} - ${item[1].price}`).join("\n")
            )
          )
          .setColor("#2f3136")
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
        break;
      }
      case "details": {
        const itemName = capitalizeFirstLetter(
          interaction.options.getString("item")
        );
        const item = shop[itemName];
        if (!item) {
          return interaction.reply(
            `${bold(itemName)} n'est pas un item valide`
          );
        }
        const embed = new MessageEmbed()
          .setTitle(`${bold(itemName)} - ${item.price}`)
          .setAuthor({
            name: interaction.member.displayName,
            iconURL: interaction.member.user.displayAvatarURL(),
          })
          .setDescription(item.description)
          .setColor("#2f3136")
          .setTimestamp();
        interaction.reply({ embeds: [embed] });
        break;
      }
      case "buy": {
        const itemName = capitalizeFirstLetter(
          interaction.options.getString("item")
        );
        const item = shop[itemName];
        if (!item) {
          return interaction.reply(
            `${bold(itemName)} n'est pas un item valide`
          );
        }
        if (memberMoney < item.price) {
          return interaction.reply(
            `Vous n'avez pas assez d'argent pour acheter ${bold(itemName)}`
          );
        }
        buyItem(interaction.member, item);
        interaction.reply(
          `Vous avez acheté ${bold(itemName)} pour ${bold(item.price)}`
        );
        break;
      }
      case "sell": {
        const itemName = capitalizeFirstLetter(
          interaction.options.getString("item")
        );
        const item = shop[itemName];
        if (!memberInventory.includes(itemName)) {
          return interaction.reply(`Vous n'avez pas ${bold(itemName)}`);
        }
        sellItem(interaction.member, item);
        interaction.reply(
          `Vous avez vendu ${bold(itemName)} pour ${bold(item.price)}`
        );
        break;
      }
    }
  },
};
