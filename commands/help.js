const funcs = require("../functions.js");

module.exports = {
  name: "help",
  description: "Shows this message",
  aliases: ["commands"],
  run: async (message, args) => {
    const client = message.client;
    let cmd = client.commands.get(args[0]) || client.aliases.get(args[0]);

    let descrip = "";
    if (cmd) {
      descrip += `**__${funcs.capFirstLetter(cmd.name)}:__**
Description: *${cmd.description}*
Aliases: *${
        cmd.aliases && cmd.aliases.length > 0
          ? cmd.aliases.map(a => funcs.capFirstLetter(a)).join(", ")
          : "No command aliases"
      }*`;
    } else {
      descrip += "__Command Help:__\n";
      client.commands.forEach(command => {
        descrip += `**__${funcs.capFirstLetter(command.name)}:__**
Description:  *${command.description}*\n`;
      });
    }
    message.channel.send(descrip, { split: "\n" });
  }
};
