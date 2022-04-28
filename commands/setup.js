const { SlashCommandBuilder } = require("@discordjs/builders");
const { createMember, checkMember } = require("../utils/utilities");
const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Débuter votre aventure"),
  async execute(interaction) {
    if (!checkMember(interaction.member)) {
      return interaction.reply("Vous êtes déjà dans la base de données");
    }
    createMember(interaction.member);
    const canvas = Canvas.createCanvas(700, 250);
    const context = canvas.getContext("2d");

    const background = await Canvas.loadImage(
      "https://live.staticflickr.com/7503/16083572245_57a4d450a7_b.jpg"
    );
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    context.strokeStyle = "#0099ff";
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = "28px sans-serif";
    context.fillStyle = "#ffffff";
    context.fillText("Bienvenue à", canvas.width / 2.5, canvas.height / 3.5);

    context.font = applyText(canvas, `${interaction.member.displayName}`);
    context.fillText(
      `${interaction.member.displayName}!`,
      canvas.width / 2.5,
      canvas.height / 1.8
    );

    context.font = "14px sans-serif";
    context.fillText(
      "dans le monde où les problèmes d'argent n'existent pas",
      canvas.width / 2.5,
      canvas.height / 1.4
    );

    context.beginPath();
    context.arc(125, 125, 100, 0, Math.PI * 2, true);
    context.closePath();
    context.clip();

    const avatar = await Canvas.loadImage(
      interaction.user.displayAvatarURL({ format: "jpg" })
    );
    context.drawImage(avatar, 25, 25, 200, 200);

    const attachment = new MessageAttachment(
      canvas.toBuffer(),
      "profile-image.png"
    );

    return interaction.reply({
      files: [attachment],
    });
  },
};

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px sans-serif`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};
