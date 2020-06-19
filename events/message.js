const data = require("../data.js");

module.exports = {
  name: "message",
  emitter: "discord",
  run: async message => {
    const client = message.client;

    if (message.author == client.user) return;
    if (message.channel.type == "dm") return;

    if (message.channel.id == data.channels().oneWordStory) {
      message.channel.messages.fetch({ limit: 5 }); // cache the current messages
      if (
        message.channel.lastMessage &&
        message.channel.lastMessage.author == message.author
      ) {
        console.log("last message");
        message.delete({ timeout: 1500 }).catch(() => {});
      }
      const msgArray = message.content.toLowerCase().split(" ");
      if (msgArray[1]) {
        console.log("word 2");
        message.delete({ timeout: 1500 }).catch(() => {});
      }
    }

    if (!message.content.startsWith(client.prefix)) return;
    const args = message.content.slice(client.prefix.length).split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.aliases.get(command);
    if (cmd) cmd.run(message, args);
  }
};
