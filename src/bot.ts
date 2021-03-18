import Discord from "discord.js";

const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
bot.login(TOKEN);

export { bot };
