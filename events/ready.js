const mongoose = require("mongoose");
const config = require("../config.js");
const fs = require("fs");
const client = global.client;

module.exports = {
  name: "ready",
  emitter: "discord",
  run: async () => {
    mongoose.connect(config.db.cs, config.db.options);

    console.log("Ready");
    client.user.setActivity("over the server", { type: "WATCHING" });
    
    fs.readdir("./commands", async(err, files) => {
      files.filter(file=>file.endsWith("js")).forEach(file=>{
        const command = require(`../commands/${file}`);
        
        client.commands.set(command.name, command);
        command.aliases.forEach(alias=>{
          client.aliases.set(alias, command);
        })
      })
    })
  }
};
