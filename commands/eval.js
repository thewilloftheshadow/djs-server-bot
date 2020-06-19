const cmd = require("node-cmd");

module.exports = {
  name: "eval",
  description: "Run JavaScript code",
  aliases: ["e"],
  run: async(message, args) => {
    const client = message.client;
    
    if (client.owners.includes(message.author.id)) {
      try {
        const code = args.join(" ");
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        
      } catch (err) {
        console.error("Eval error: ", err);
        message.channel.send("Error: " + err.message);
      }
    }
  }
}

function send(message, toSend){
  message.channel.send(toSend, {split: true});
}

function dm(user, toSend){
  user.send(toSend, {split: true});
}