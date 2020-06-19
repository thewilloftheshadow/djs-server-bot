module.exports = {
  bot: {
    prefix: "==",
    owners: ["571283749652660225", "439223656200273932"],
    token: process.env.token
  },
  
  db: {
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    cs: process.env.mongo
  }
}