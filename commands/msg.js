const data = require("../data.js");

module.exports = {
  name: "msg",
  description: "Direct message a server member",
  aliases: ["contact"],
  run: async (message, args) => {
    const client = message.client;
    
    if (
      message.member.roles.cache.has(data.roles().moderation) || 
      message.member.permissions.has("ADMINISTRATOR") ||
      message.guild.ownerID == message.author.id
    ) {
      const user =
        message.mentions.users.first() || client.users.cache.get(args[0]);

      if (user) {
        if (args[1]) {
          user.send(
            args.slice(1).join(" ") + `\n- ${message.guild.name} Staff Team`
          );
          message.channel.send(
            `Sent the below message to ${user.tag}\n\n${args
              .slice(1)
              .join(" ")}`
          );

          message.channel.send(`Sent the message to ${user.tag}`).then(m => {
            setTimeout(() => {
              message.delete();
              m.delete();
            }, 4000);
          });
        } else {
          return message.channel.send("Enter a message to send");
        }
      } else {
        return message.channel.send(
          "No user was found. Use a mention or an ID"
        );
      }
    } else {
      return message.channel.send("Only mods can use this command");
    }
  }
};
