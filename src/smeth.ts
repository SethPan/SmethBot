require('dotenv').config();
import Discord, { TextChannel } from 'discord.js';
import fs from 'fs';
import {naruto} from './modules/naruto';
import {anon} from './modules/anon';
import {botcolor} from './modules/botcolor';
import {bot} from "./bot";

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);

  //console.log(bot.guilds.cache.find(guild => guild.id === '189542527496486919').channels)

  bot.guilds.cache.forEach(guild => {
    guild.members.fetch('812100292375609356')
    .then(me => me.setNickname('SmethBot'))
  });

  // console.log(goons.presences.cache.every(guild => !guild.deleted))
  
  //myGuilds = Array.from(bot.guilds.cache.keys())
  //bot.guilds.forEach(setNickname('SmethBot'))

  //for (let key of bot.guilds.cache.keys()

});

bot.on('message', msg => {
  const taggedUser = msg.mentions.users.first();

  //if (msg.channel.id !== 714504371286835261) return; 
      //for testing channel
 
  // msg.guild.members.fetch('475786160862396427')
  //   .then(kickedID => kickedID.kick())
             //(code to kick)

  naruto(msg);
  anon(msg);
  botcolor(msg);
  

  if (msg.content === 'f' && msg.author !== bot.user) {
    //msg.channel.send('_**F**_')
    const fEmbed = new Discord.MessageEmbed()
	.setColor('#f55742')
	.setTitle('FFFFFFFFFFFFFFF')
	.setURL('https://en.wikipedia.org/wiki/F')
	.setAuthor('Effel Tower', 'https://h45vs1s00ar1vknck1y9srp1-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/f-grade.png', 'https://www.urbandictionary.com/define.php?term=F')
	.setDescription('\"**f**\" is a prominent letter of the alphabet, known for it\'s iconic dash, which makes it impossible to write with a single continuous line, similar to the dash on a \"**t**\". A common alternative form of \"**f**\" looks like this: \"**F**\". This is \"**f**\"\'s uppercase variant, and is used in cases where \"**f**\" begins the first word of a sentence, or is the first letter of a proper noun. Documentation for all of the aforementioned english syntax is readily available, making it a field with many practitioners. If you try hard enough, you may find yet more variants of the letter \"**f**\".')
	.setThumbnail('https://h45vs1s00ar1vknck1y9srp1-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/f-grade.png')
	.addFields(
		{ name: 'f', value: 'f' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'f', value: 'f', inline: true },
		{ name: 'f', value: 'f', inline: true },
	)
	.addField('f', 'f', true)
	.setImage('https://dzpzmbuhhss7e.cloudfront.net/p/1/9/8/4/6/19846-large_default.jpg')
	.setTimestamp()
	.setFooter('f', 'https://i.ytimg.com/vi/PzK0-VSZPd4/maxresdefault.jpg');
  msg.channel.send(fEmbed);
  }
  
  if (msg.content.startsWith('!kick')) {
    if (taggedUser === bot.user) {
      msg.channel.send('||Nah||') 
      return
    } if (msg.mentions.users.size) {
    msg.channel.send(`You wanted to kick ${taggedUser.username} ...but this is a place of love and acceptance. Let's work on our problems togeather, and strive to be well adjusted members of society. DUDES ROCK`);
    } else {
      msg.reply('Please tag a valid user!');
    }
  }

  
  
  if (msg.content.startsWith('!avatar') && taggedUser !== msg.author) {
   const user = msg.mentions.users.first() || msg.author;
    msg.channel.send("https://cdn.discordapp.com/avatars/"+user.id+"/"+user.avatar+".png?size=1024");
    }

  //if (msg.)

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


