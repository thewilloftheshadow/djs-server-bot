const verify = require("../models/verify.js");
const data = require("../data.js");
const funcs = require("../functions.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "code",
  description: "ReGenerate your verification code",
  aliases: [],
  run: async(message, args) => {
    const client = message.client;
    if (message.member.roles.cache.has(data.roles().member)) return;
    const code = funcs.getRandomInt(1000000, 9999999);
    
    verify.deleteMany({ user: message.author.id }, async (err, doc2) => {});
    let doc = await new verify({
      user: message.author.id,
      code: code.toString(),
      date: Date.now()
    }).save();
    const embed = new MessageEmbed()
      .setDescription(
        `▶ Please verify your account to receive access to the rest of the server\nUse the command \`==verify ${code}\` to complete the verification.`
      )
      .setTimestamp();
    client.channels.cache
      .get("617289687505043469")
      .send(`<@${message.author.id}> ->`, embed);
  }
}