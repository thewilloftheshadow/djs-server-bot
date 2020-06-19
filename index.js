// REQUIRE EXTERNAL MODULES
const discord = require("discord.js");
const express = require("express");
const cmd = require("node-cmd");
const fs = require("fs");
const mongoose = require("mongoose");

// REQUIRE LOCAL FILES
const config = require("./config.js");

// CREATE LOCAL VARIABLES
const client = new discord.Client();
const app = express();

client.commands = new discord.Collection();
client.aliases = new discord.Collection();
client.prefix = config.bot.prefix;
client.owners = config.bot.owners;
global.client = client;

client.login(config.bot.token);

fs.readdir("./events", async (err, files) => {
  if (err) return console.error(err);
  files
    .filter(file => file.endsWith(".js"))
    .forEach(file => {
      const event = require(`./events/${file}`);
      const name = event.name;

      event.emitter == "discord"
        ? client.on(name, (...args) => event.run(...args))
        : process.on(name, (...args) => event.run(...args));
    });
});

app.get("/", (req, res) => {
  res.sendStatus(200);
});
app.listen(process.env.PORT);
