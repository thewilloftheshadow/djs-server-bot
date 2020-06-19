const verify = require("../models/verify.js");
const data = require("../data.js");

module.exports = {
  name: "verify",
  description: "Verify yourself as human to access the server",
  aliases: [],
  run: async (message, args) => {
    const memberrole = data.roles().member;
    message.delete().catch(() => {});
    if (message.member.roles.cache.has(memberrole)) return;
    verify.findOne({ user: message.author.id }, async (err, doc) => {
      if (args[0] != doc.code)
        return message.reply(
          "Invalid code! Use the command `==code` if you need a new code."
        );
      await message.member.roles.add(memberrole);
      verify.findOneAndDelete({ user: message.author.id });
      message.channel.send(`${message.author} has been verified!`);
      message.guild.channels.cache
        .get(data.channels().general)
        .send(`${message.author}, welcome to the server!`);

      const messages = await message.channel.messages.fetch(); // fetch all messages in unverified general and add to cache
      messages.forEach(msg => {
        if (
          msg.mentions.has(message.author, {
            ignoreRoles: true,
            ignoreEveryone: true,
            ignoreDirect: true
          })
        ) {
          msg.delete();
        } else if (msg.author == message.author) {
          msg.delete();
        }
      });
    });
  }
};
