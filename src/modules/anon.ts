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
        } 
        if (!(bot.channels.cache.get(channelIDString) as TextChannel)) {
          msg.reply('The channel has to be a text channel');
          return
        }
        (bot.channels.cache.get(channelIDString) as TextChannel)
        .send(`${anonMessage}\n\t-**anonymous message**`);  
      } 
      else {
        messageArray.splice(0, 1);
        const anonMessage = messageArray.join(' ');

        const commonGuilds = []
        bot.guilds.cache.forEach(guild => {
          if (guild.members.cache.keyArray().includes(msg.author.id)) {
            commonGuilds.push(guild)
          }
        });
        if (commonGuilds.length === 1) {
          const guildChannelNames = [];
        bot.guilds.cache.find(guild => guild.id === commonGuilds[0].id)
        .channels.cache.forEach(channel => {
          if (channel.type === 'text') {
            guildChannelNames.push(channel.name)
          }
        })   
        const guildChannelIDs = [];
        bot.guilds.cache.find(guild => guild.id === commonGuilds[0].id)
        .channels.cache.forEach(channel => {
          if (channel.type === 'text') {
            guildChannelIDs.push(channel.id)
          }
        })   
          const guildChannelNamesString = guildChannelNames.map((name, index) => `${index + 1}. ${name}`).join('\n');  
          const rawData= fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'data.json'));
          //@ts-ignore;
          const anonMessageChannelChoice: object  = JSON.parse(rawData);
          const senderID = msg.author.id;
          anonMessageChannelChoice[senderID] = {anonChannelSelect: {guildChannelIDs: guildChannelIDs, message: `${anonMessage}\n\t-**anonymous message**`}};
          fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageChannelChoice), (err) => {
            if (err) throw err;
          });
          msg.reply(`The discord server "${commonGuilds[0].name}" has ${guildChannelIDs.length} text channels.\nPlease type the number of the channel you would like to send your anonymous message to:\n${guildChannelNamesString}`)
        } 
        if (commonGuilds.length > 1) {
          const commonGuildNames = []
          commonGuilds.forEach(guild => commonGuildNames.push(guild.name))
          const commonGuildIDs = []
          commonGuilds.forEach(guild => commonGuildIDs.push(guild.id))   
          const commonGuildNameString = commonGuildNames.map((name, index) => `${index + 1}. ${name}`).join('\n');  
          const rawData = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'data.json'));
          //@ts-ignore;
          const anonMessageServerChoice: object  = JSON.parse(rawData);
          const senderID = msg.author.id;
          anonMessageServerChoice[senderID] = {anonServerSelect: {commonGuildIDs: commonGuildIDs, message: `${anonMessage}\n\t-**anonymous message**`}};
          fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageServerChoice), (err) => {
            if (err) throw err;
          });
          msg.reply(`We are in **${commonGuilds.length}** discord servers togeather.\nPlease type the number of the server you would like the anonymous message sent to:\n${commonGuildNameString}`);
          return;
          }
        }
    } 
    else {
      const senderID = msg.author.id;
      const rawData = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'data.json'));
      //@ts-ignore;
      const anonMessageServerChoice: object = JSON.parse(rawData);
      if (anonMessageServerChoice[senderID] === undefined){
        return;
      }
      if (anonMessageServerChoice[senderID].anonChannelSelect && !isNaN(msg.content) && Number(msg.content) <= (anonMessageServerChoice[msg.author.id].anonChannelSelect.guildChannelIDs.length + 1) && Number.isInteger(Number(msg.content))) {
        const chosenChannel = anonMessageServerChoice[senderID].anonChannelSelect.guildChannelIDs[Number(msg.content) - 1];
        const message = anonMessageServerChoice[senderID].anonChannelSelect.message;
        (bot.channels.cache.get(chosenChannel) as TextChannel)
          .send(message);
        delete anonMessageServerChoice[senderID].anonChannelSelect;
        fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageServerChoice), (err) => {
          if (err) throw err;
        });
        return;
      }
      if (anonMessageServerChoice[senderID].anonServerSelect && !isNaN(msg.content) && Number(msg.content) <= (anonMessageServerChoice[msg.author.id].anonServerSelect.commonGuildIDs.length + 1) && Number.isInteger(Number(msg.content))) {
        const chosenGuild = anonMessageServerChoice[senderID].anonServerSelect.commonGuildIDs[Number(msg.content) - 1];
        const message = anonMessageServerChoice[senderID].anonServerSelect.message;
        const guildChannelNames = [];
        bot.guilds.cache.find(guild => guild.id === chosenGuild)
        .channels.cache.forEach(channel => {
          if (channel.type === 'text') {
            guildChannelNames.push(channel.name)
          }
        })   
        const guildChannelIDs = [];
        bot.guilds.cache.find(guild => guild.id === chosenGuild)
        .channels.cache.forEach(channel => {
          if (channel.type === 'text') {
            guildChannelIDs.push(channel.id)
          }
        })   
        const guildChannelNamesString = guildChannelNames.map((name, index) => `${index + 1}. ${name}`).join('\n');  
        anonMessageServerChoice[senderID] = {anonChannelSelect: {guildChannelIDs: guildChannelIDs, message: `${message}`}};
        delete anonMessageServerChoice[senderID].anonServerSelect;
        msg.reply(`The discord server "${chosenGuild.name}" has ${guildChannelIDs.length} text channels.\nPlease type the number of the channel you would like to send your anonymous message to:\n${guildChannelNamesString}`)
        fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'data.json'), JSON.stringify(anonMessageServerChoice), (err) => {
          if (err) throw err;
        });
        return;
      }
    }
  } 
}

export {anon};