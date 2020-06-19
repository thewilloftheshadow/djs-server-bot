const funcs = require("../functions.js");
const data = require("../data.js");


module.exports = {
  name: "suggest",
  description: "Suggest something for the server",
  aliases: [],
  run: async (message, args) => {
    await message.delete().catch(() => {});
    let c = message.client.channels.cache.get(data.channels().suggestions)
    let ah = await c.fetchWebhooks()
    let h = ah.find(item => item)
    if(!h) h = await c.createWebhook("Galaxy Suggestions")
    await h.edit({
      name: message.author.username,
      avatar: message.author.avatarURL()
    }, "New Suggestion");
    let m = await h.send(new Discord.MessageEmbed().setTitle("New Suggestion").setDescription(s).setAuthor(message.author.tag, message.author.avatarURL()).setFooter("Suggested at").setTimestamp())
    await m.react("678023486618468363")
    await m.react("684155550728192019")
    message.delete()
  }
};
