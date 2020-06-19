const funcs = require("../functions.js");
const bots = require("../models/bots.js");
const verify = require("../models/verify.js");
const data = require("../data.js");

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  emitter: "discord",
  run: async member => {
    const client = member.client;

    if (member.user.bot) {
      bots.findOne({ bot: member.user.id }, async (err, bot) => {
        if (bot) {
          member.guild.fetchAuditLogs({ type: 28 }).then(audits => {
            if (audits.entries.find(ae => ae.target.id == bot)) {
              const testingRole = member.guild.roles.cache.get(
                data.roles().botTesting
              );
              member.roles.add(testingRole, "Added to be tested");
              const supportRole = member.guild.roles.cache.get(
                data.roles().support
              );
              if (supportRole.hasPermission("MANAGE_GUILD")) {
                const permissions = supportRole.permissions.toArray();
                const index = permissions.findIndex(e => e == "MANAGE_GUILD");
                
                permissions.splice(index, 1);
                
                supportRole.setPermissions(
                  permissions,
                  "Testing bot has been added to the server"
                );
              }
            }
          });
        }
      });
    } else {
      const code = funcs.getRandomInt(1000000, 9999999);
      let doc = await new verify({
        user: member.user.id,
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
        .send(`<@${member.user.id}> ->`, embed);
    }
  }
};
