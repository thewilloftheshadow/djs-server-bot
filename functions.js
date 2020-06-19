const cmd = require("node-cmd");
const data = require("./data.js");

class funcs {
  constructor() {
    return console.error("This class cannot be instantiated");
  }

  static capFirstLetter(string) {
    if (typeof string == undefined) return;
    var firstLetter = string[0] || string.charAt(0);
    return firstLetter ? string.replace(/^./, firstLetter.toUpperCase()) : "";
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  static async scmr(msg, message) {
    await msg.react(data.emojis().check);
    await msg.react(data.emojis().line);
    await msg.react(data.emojis().cross);
    let reactions = await msg
      .awaitReactions(
        (r, u) =>
          (r.emoji.id == data.emojis().check ||
            r.emoji.id == data.emojis().line ||
            r.emoji.id == data.emojis().cross) &&
          u.id == message.author.id,
        { time: 20000, max: 1, errors: ["time"] }
      )
      .catch(() => {
        return false;
      });
    if (!reactions) {
      msg.edit("Staff Checks timed out");
      cmd.run("refresh");
    }
    let reaction = reactions.first().emoji.id;
    if (reaction === data.emojis().check) return true;
    if (reaction === data.emojis().line) return "Bypassed";
    if (reaction === data.emojis().cross) return false;
  }
}

module.exports = funcs;
