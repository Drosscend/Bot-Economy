const { SlashCommandBuilder, codeBlock, bold } = require("@discordjs/builders");
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
    .setDescription("Shows the shop")
    .addSubcommand(subcommand =>
      subcommand.setName("show").setDescription("Shows the shop")
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("buy")
        .setDescription("Buys an item")
        .addStringOption(option =>
          option
            .setName("item")
            .setRequired(true)
            .setDescription("The item to buy")
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("sell")
        .setDescription("Sells an item")
        .addStringOption(option =>
          option
            .setName("item")
            .setRequired(true)
            .setDescription("The item to sell")
        )
    ),
  async execute(interaction) {
    const memberMoney = await getMemberMoney(interaction.member);
    const memberInventory = await getMemberInventory(interaction.member);

    switch (interaction.options.getSubcommand()) {
      case "show": {
        const shopItems = Object.entries(shop);
        interaction.reply(
          `${codeBlock(
            shopItems.map(item => `${item[0]} - ${item[1].price}`).join("\n")
          )}`
        );
        break;
      }
      case "buy": {
        const itemName = capitalizeFirstLetter(
          interaction.options.getString("item")
        );
        const item = shop[itemName];
        if (!item) {
          return interaction.reply(`${bold(itemName)} is not a valid item`);
        }
        if (memberMoney < item.price) {
          return interaction.reply(
            `You don't have enough money to buy ${bold(itemName)}`
          );
        }
        buyItem(interaction.member, item);
        interaction.reply(
          `You bought ${bold(itemName)} for ${bold(item.price)}`
        );
        break;
      }
      case "sell": {
        const itemName = capitalizeFirstLetter(
          interaction.options.getString("item")
        );
        const item = shop[itemName];
        if (!memberInventory.includes(itemName)) {
          return interaction.reply(`You don't have ${bold(itemName)}`);
        }
        sellItem(interaction.member, item);
        interaction.reply(`You sold ${bold(itemName)} for ${bold(item.price)}`);
        break;
      }
    }
  },
};
