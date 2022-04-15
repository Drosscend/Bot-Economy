const fs = require("node:fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Client, Collection, Intents } = require("discord.js");
dotenv.config();
const token = process.env.token;
const database_uri = process.env.database_uri;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));
const eventFiles = fs
  .readdirSync("./events")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, ...args));
  }
}

process.on("exit", code => {
  console.log(`Process is exiting with code ${code}`);
});

process.on("uncaughtException", (err, origin) => {
  console.error(`Uncaught exception: ${err}`);
  console.error(`Uncaught exception origin: ${origin}`);
});

process.on("unhandledRejection", (err, origin) => {
  console.error(`Unhandled rejection: ${err}`);
  console.error(`Unhandled rejection origin: ${origin}`);
});

process.on("warning", (...args) => {
  console.warn(...args);
});

mongoose
  .connect(database_uri, {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(err => {
    console.error("Could not connect to database", err);
  });

client.login(token);
