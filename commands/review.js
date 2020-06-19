const { MessageEmbed } = require("discord.js");
const data = require("../data.js");
const bots = require("../models/bots.js");

module.exports = {
  name: "review",
  description: "Review a listed bot",
  aliases: [],
  run: async (message, args) => {
    const client = message.client;

    const supportRole = message.guild.roles.cache.get(data.roles().support);
    if (message.member.roles.has(supportRole)) {
      if (message.channel.id == data.channels().botTesting) {
        if (args[0]) {
          client.users
            .fetch(args[0])
            .then(user => {
              if (!user.bot) return message.reply("That ID is not a bot");
              bots.countDocuments({}, async (err, count) => {
                if (count == 0)
                  return message.reply("There are no bots pending review");
              });
              bots.findOne({ bot: user.id }, async (err, bot) => {
                if (bot) {
                  const embed = new MessageEmbed()
                    .setTitle(client.users.cache.get(bot.bot).tag)
                    .setColor("#0099ff")
                    .addField("Owner", client.users.cache.get(bot.owner).tag)
                    .addField("Help Command", `${bot.helpCommand}`)
                    .addField("Invite Link", bot.invite)
                    .setTimestamp();
                  message.reply(
                    "Do you want to review this bot? Send `yes` to accept",
                    { embed: embed }
                  );
                  await message.channel
                    .awaitMessages(
                      m =>
                        m.content.toLowerCase().includes("yes") ||
                        !m.content.toLowerCase().includes("yes"),
                      {
                        max: 1,
                        time: 30000
                      }
                    )
                    .then(async collected => {
                      if (collected.first().content.includes("yes")) {
                        if (!message.member.permissions.has("MANAGE_GUILD"))
                          supportRole.setPermissions(
                            supportRole.permissions
                              .toArray()
                              .push("MANAGE_GUILD"),
                            `${message.author.tag} is reviewing a bot`
                          );
                        message.reply(
                          "Please add the bot using the above invite link to proceed with testing"
                        );
                        setInterval(async()=>{
                          let perms = supportRole.permissions.toArray();
                          let index = perms.findIndex(e=>e == "MANAGE_GUILD");
                          perms = perms.splice(index, 1);
                          await supportRole.setPermissions(perms, "Bot Review Timeout")
                        }, 60000);
                      } else {
                        return message.reply(
                          "Bot has had its review rejected. It has not been rejected overall and is still available for review at another time"
                        );
                      }
                    });
                } else {
                  return message.reply(
                    "There is no bot with that id that needs reviewed"
                  );
                }
              });
            })
            .catch(err => {
              return message.reply(
                "The ID provided is not for a user or bot account"
              );
            });
        } else {
          message.reply(`Please specify a bot ID to review`);
        }
      } else {
        return message.reply(
          `This command can only be used in ${client.channels.cache.get(
            data.channels().botTesting
          )}`
        );
      }
    } else {
      return message.reply(
        "You must be a member of the support team to use this command"
      );
    }
  }
};
