require("dotenv").config();

//require('source-map-support').install()
//thing for better errors

//import Discord, { TextChannel } from "discord.js";
import fs from "fs";
import { naruto } from "./modules/naruto";
import { anon } from "./modules/anon";
import { botcolor } from "./modules/botcolor";
import { bot } from "./bot";
import { displayAvatar } from "./modules/avatar";
import { f } from "./modules/f";
import { kick } from "./modules/kick";
import { help } from "./modules/help";
import { roleManagement } from "./modules/roleManagement";
import { restoreRoles } from "./modules/restoreRoles";

//process.on('unhandledRejection', console.log)
//thing for better errors

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  roleManagement();

  function resetSmethBotNickname() {
    bot.guilds.cache.forEach((guild) => {
      guild.members
        .fetch("812100292375609356")
        .then((me) => me.setNickname("SmethBot"));
    });
  }
  resetSmethBotNickname();
});
bot.on("message", (msg) => {
  console.log(msg.content);
  //if (msg.channel.id !== 714504371286835261) return;
  //for testing channel

  //console.log(msg.guild.roles.cache.first().permissions.serialize());

  // msg.guild.members.fetch('475786160862396427')
  //   .then(kickedID => kickedID.kick())
  //(code to kick)

  const taggedUser = msg.mentions.users.first();

  naruto(msg);
  anon(msg);
  botcolor(msg);
  displayAvatar(msg, taggedUser);
  f(msg);
  kick(msg);
  help(msg, taggedUser);
  restoreRoles(msg);

  // if (msg.content.startsWith('!hack')) {
  //   if (GET(taggedUser.mfa_enabled) === false) {
  //     msg.channel.send('This user is not two factor enabled!')
  //   } if (get(taggedUser.mfa_enabled) === true) {
  //     msg.channel.send('Unhackable')
  //   } if (taggedUser.bot) {
  //     msg.channel.send('This is a bot.')
  //   }
  //     else msg.channel.send('Please tag a valid user!')
  // }
});
