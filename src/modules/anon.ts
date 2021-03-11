import {bot} from './../bot';
import {TextChannel} from 'discord.js';
import fs from 'fs';
import path from 'path';


function anon(msg) {
  if (msg.guild === null) {
    if (msg.content.startsWith('!anon ')) {
      let messageArray = msg.content.split(' ') 
      if (messageArray[1].startsWith('!')) {
        let channelIDCommand = messageArray[1].split('')
        channelIDCommand.splice(0, 1);
        const channelIDString = channelIDCommand.join('')
        messageArray.splice(0, 2);
        const anonMessage = messageArray.join(' ')
        if (!bot.channels.cache.get(channelIDString)) {
          msg.reply('The channel ID you gave me didn\'t work out.\nHere is an example using the ID from the main channel: \n!189542527496486919')
          return
        } if (!(bot.channels.cache.get(channelIDString) as TextChannel)) {
          msg.reply('The channel has to be a text channel, lol');
          return
        }
        (bot.channels.cache.get(channelIDString) as TextChannel)
        .send(`${anonMessage}\n\t-**anonymous message**`);  
      } else {
      messageArray.splice(0, 1);
      const anonMessage = messageArray.join(' ');

      const commonGuilds = []
      bot.guilds.cache.forEach(guild => {
        if (guild.members.cache.keyArray().includes(msg.author.id)) {
          commonGuilds.push(guild)
        }
        });
      if (commonGuilds.length === 1) {
        (bot.channels.cache.get(commonGuilds[0].id) as TextChannel)
          .send(`${anonMessage}\n\t-**anonymous message**`);
          return;
      } if (commonGuilds.length > 1) {
        const commonGuildNames = []
        commonGuilds.forEach(guild => commonGuildNames.push(guild.name))            
        const commonGuildNameString = commonGuildNames.map((name, index) => `${index + 1}. ${name}`).join('\n');  
        const rawData = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'data.json'));
        //@ts-ignore;
        const anonMessageServerChoice = JSON.parse(rawData);
        anonMessageServerChoice[msg.author.id] = {anonServerSelect: {commonGuilds: commonGuilds, message: `${anonMessage}\n\t-**anonymous message**`}}
        fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageServerChoice), (err) => {
          if (err) throw err;
        });
        msg.reply(`We are in **${commonGuilds.length}** discord servers togeather.\nPlease type the number of the server you would like the anonymous message sent to:\n${commonGuildNameString}`);
        }
      }
    } else {
      const rawData = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'data.json'));
      //@ts-ignore;
      const anonMessageServerChoice = JSON.parse(rawData);
      if (anonMessageServerChoice[msg.author.id].anonServerSelect && !isNaN(msg.content)) {
        const chosenGuild = anonMessageServerChoice[msg.author.id].anonServerSelect.commonGuilds[Number(msg.content) - 1];
        const message = anonMessageServerChoice[msg.author.id].anonServerSelect.message;
        (bot.channels.cache.get(chosenGuild[0].id) as TextChannel)
          .send(`${message}\n\t-**anonymous message**`);
        delete anonMessageServerChoice[msg.author.id].anonServerSelect;
        fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageServerChoice), (err) => {
          if (err) throw err;
        });
        return;
      }
    }
  } 
}


export {anon};