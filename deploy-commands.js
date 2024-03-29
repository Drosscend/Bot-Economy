const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const dotenv = require("dotenv");
dotenv.config();
const clientId = process.env.clientId;
const guildId = process.env.guildId;
const token = process.env.token;

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  console.log(`Commande ${command.data.name} bien enregistrée`);
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
