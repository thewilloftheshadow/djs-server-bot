const data = require("../data.js");

module.exports = {
  name: "ban",
  description: "Ban a member from the server",
  usage: "<member> [reason]",
  aliases: ["bean"],
  run: async (message, args) => {
    if (
      !message.member.permissions.has("BAN_MEMBERS") ||
      !message.member.roles.cache.has(
        data.roles().admins || data.roles().hAdmins
      )
    )
      return message.channel.send(
        "You do not have permission to use this command"
      );

    const member =
      message.mentions.members.first() || message.guild.member(args[0]);
    if (member) {
      if (
        message.member != message.guild.owner &&
        message.member.roles.highest.position <= member.roles.highest.position
      )
        return message.channel.send(
          "That members highest role is greater than or equal to your highest"
        );
      const reason = args.slice(1).join(" ") || "None Provided";
      if (member.bannable) {
        // ban the member
        await message.guild.members
          .ban(member, { days: 7, reason: reason })
          .catch(err => {
            return message.channel.send(
              `*${member.user.tag}* could not be banned because; ${err}`
            );
          });
        // inform them they were banned...
        await member
          .send(
            `You have been banned from *${message.guild.name}*${
              reason != "None Provided" ? ` for *${reason}*` : ""
            }!`
          )
          .catch(() => {}); // ...and catch an error if the message couldn't be sent
        // let the banner know
        await message.channel.send(
          `*${member.user.tag}* was banned successfully ${
            reason != "None Provided" ? `for *${reason}*` : ""
          }`
        );
      } else {
        return message.channel.send(
          `*${member.user.tag}* is not able to be banned`
        );
      }
    } else {
      return message.channel.send("No member was found");
    }
  }
};
