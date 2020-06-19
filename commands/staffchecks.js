const funcs = require("../functions.js");
const data = require("../data.js");

module.exports = {
  name: "staffchecks",
  description: "Perform the staffchecks",
  aliases: [],
  run: async (message, args) => {
    await message.delete().catch(() => {});
    if (!message.member.roles.cache.has(data.roles().HR)) return;
    if (message.channel.id !== data.channels().staffchecks) return;
    let m = await message.channel.send("Generating checks");

    let mod = message.guild.members.cache.filter(
      m =>
        m.roles.cache.has(data.roles().mods) ||
        m.roles.cache.has(data.roles().hMods)
    );
    let support = message.guild.members.cache.filter(m =>
      m.roles.cache.has(data.roles().support)
    );
    let partner = message.guild.members.cache.filter(
      m =>
        m.roles.cache.has(data.roles().partnership) ||
        m.roles.cache.has(data.roles().advertisers)
    );
    let checks = { Moderation: mod, Support: support, Partnership: partner };

    const checkEmoji = message.guild.emojis.cache.get(data.emojis().check);
    const crossEmoji = message.guild.emojis.cache.get(data.emojis().cross);
    const lineEmoji = message.guild.emojis.cache.get(data.emojis().line);
    let checkmsg = "";
    for (let [key, value] of Object.entries(checks)) {
      checkmsg += `**__${funcs.capFirstLetter(key)}__**\n`;
      for (let [id, member] of value) {
        m.edit(
          `Has **<@${member.id}>** passed (${
            checkEmoji
          }), failed (${crossEmoji}) or bypassed (${
            lineEmoji
          }) the StaffCheck for the **${funcs.capFirstLetter(key)}** role?`
        );
        const pass = await funcs.scmr(m, message);
        await m.reactions.removeAll();

        checkmsg += `> ${
          pass === "Bypassed"
            ? message.client.emojis.cache.get(data.emojis().line)
            : pass
            ? message.client.emojis.cache.get(data.emojis().check)
            : message.client.emojis.cache.get(data.emojis().cross)
        }<@${id}>${pass === "Bypassed" ? " - Bypassed" : ""}\n`;
      }
    }

    await m.delete();
    await message.channel.send(checkmsg, { split: "\n" });
  }
};
