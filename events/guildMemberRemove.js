const bots = require("../models/bots.js");
const data = require("../data.js");
const verify = require("../models/verify.js");

module.exports = {
  name: "guildMemberRemove",
  emitter: "discord",
  run: async member => {
    bots.findOne({ owner: member.user.id }, async (err, bot) => {
      if (bot) {
        await bots.findOneAndDelete({ owner: member.user.id });
        const supportRole = member.guild.roles.cache.get(data.roles().support);
        if (supportRole.permissions.has("MANAGE_GUILD")) {
          const permissions = supportRole.permissions.toArray();
          const mngGuildIndex = permissions.findIndex(
            element => element == "MANAGE_GUILD"
          );
          
          permissions.splice(mngGuildIndex, 1);
          supportRole.setPermissions(
            permissions,
            "An owner awaiting bot review has left the server"
          );
        }
      }
    });
    
    await verify.findOneAndDelete({user: member.user.id});
  }
};
