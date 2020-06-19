const bots = require("../models/bots.js");
const data = require("../data.js");
const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "list",
  description: "List your custom bot to our server",
  aliases: [],
  run: async (message, args) => {
    const client = message.client;

    message.delete({ timeout: 5000 });
    bots.findOne({ owner: message.author.id }, async (err, doc) => {
      if (doc)
        message.channel
          .send("You already have a bot pending review")
          .then(m => m.delete({ timeout: 5000 }));
      const channel = client.channels.cache.get(data.channels().listBot);
      if (channel) {
        let invite = args[0];
        if (!invite)
          return message.channel
            .send("No bot invite link was specified")
            .then(m => m.delete({ timeout: 5000 }));
        let INV = false;
        let domains = [
          "https://discord.com/api/oauth2/authorize",
          "https://discordapp.com/api/oauth2/authorize",
          "https://discord.com/oauth2/authorize",
          "https://discordapp.com/oauth2/authorize"
        ];
        for (let i = 0; i < domains.length; i++) {
          if (
            invite.toLowerCase().startsWith(domains[i]) &&
            invite.includes("scope=bot")
          ) {
            INV = true;
            break;
          }
        }
        if (!INV)
          return message.channel
            .send("Please provide a valid bot invite from the discord oauth2")
            .then(m => m.delete({ timeout: 5000 }));

        let invParams = invite
          .split("?")
          .slice(1)
          .join(" ")
          .split("&");
        let bits = null;
        let bot = null;
        let botid = invParams
          .find(e => e.startsWith("client_id"))
          .replace("client_id=", "");

        bot = await client.users.fetch(botid).catch(() => {});
        if (bot) {
          if (!bot.bot)
            return message.channel
              .send("The user id does not belong to a bot account")
              .then(m => m.delete({ timeout: 5000 }));

          for (var i = 0; i < invParams.length; i++) {
            if (invParams[i].startsWith("permissions=")) {
              bits = invParams[i].replace("permissions=", "");
            }
            if (bits != null && invParams[i] == `permissions=${bits}`) {
              invite = invite.replace(
                `permissions=${bits}`,
                "permissions=104189633"
              );
            }
          }
          if (bits == null) bits = 0;
          let help = args[1];
          if (help) {
            help = help.toLowerCase();
            const Prefix = args.slice(2).join(" ");
            if (args[2]) {
              if (!doc) {
                const embed = new MessageEmbed()
                  .setTitle("Bot Listing")
                  .setColor("#0099ff")
                  .addField(
                    "Owner",
                    client.users.cache.get(message.author.id).tag
                  )
                  .addField("Bot", bot.tag)
                  .addField("Invite Link", invite)
                  .addField("Prefix", Prefix)
                  .addField("Help Command", help);
                let m1 = await message.channel.send(
                  'Are your bot details correct? `Reply with "yes" if they are. This message will timeout in 30 seconds`',
                  { embed: embed }
                );
                let coll = await message.channel.awaitMessages(
                  m => m.content.trim().length > 0,
                  {
                    time: 30000,
                    max: 1
                  }
                );

                if (!coll) {
                  message.channel.send("Command cancelled").then(m => {
                    m.delete({ timeout: 5000 });
                  });
                }

                if (
                  coll
                    .first()
                    .content.toLowerCase()
                    .trim()
                    .includes("yes")
                ) {
                  bits = parseInt(bits);
                  let Perm = new Permissions(bits);
                  doc = await new bots({
                    owner: message.author.id,
                    bot: bot.id,
                    invite: invite,
                    permissions: Perm.toArray(),
                    prefix: Prefix,
                    helpCommand: help
                  }).save();
                  m1.delete();
                  message
                    .reply("Your bot has been successfully listed")
                    .then(m => m.delete({ timeout: 5000 }));

                  for (var i = 0; i < coll.array().length; i++) {
                    coll.array()[i].delete(); // delete awaited messages
                  }
                  client.channels.cache.get(data.channels().botListings).send(
                    `**${
                      client.users.cache.get(doc.owner).tag
                    }** has just listed their bot **${bot.tag}**
Help Command: **${doc.prefix}${doc.helpCommand}**
Invite: **${doc.invite}**`
                  );
                } else {
                  return message.channel
                    .send("Command Cancelled")
                    .then(m => m.delete({ timeout: 5000 }));
                }
              }
            } else {
              return message.channel
                .send("Specify the main prefix of your bot")
                .then(m => m.delete({ timeout: 5000 }));
            }
          } else {
            return message.channel
              .send("Specify the help command name of your bot")
              .then(m => m.delete({ timeout: 5000 }));
          }
        } else {
          return message.channel
            .send("No account with that ID was found!")
            .then(m => m.delete({ timeout: 5000 }));
        }
      } else {
        return message.channel
          .send(`This command can only be used in ${channel}`)
          .then(m => m.delete({ timeout: 5000 }));
      }
    });
  }
};
