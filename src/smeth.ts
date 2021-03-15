require("dotenv").config();
import Discord, { TextChannel } from "discord.js";
import fs from "fs";
import { naruto } from "./modules/naruto";
import { anon } from "./modules/anon";
import { botcolor } from "./modules/botcolor";
import { bot } from "./bot";
import { displayAvatar } from "./modules/avatar";
import { f } from "./modules/f";
import { kick } from "./modules/kick";

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  bot.guilds.cache.forEach((guild) => {
    guild.members
      .fetch("812100292375609356")
      .then((me) => me.setNickname("SmethBot"));
  });
});

bot.on("message", (msg) => {
  //if (msg.channel.id !== 714504371286835261) return;
  //for testing channel

  // msg.guild.members.fetch('475786160862396427')
  //   .then(kickedID => kickedID.kick())
  //(code to kick)

  naruto(msg);
  anon(msg);
  botcolor(msg);
  displayAvatar(msg);
  f(msg);
  kick(msg);

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
