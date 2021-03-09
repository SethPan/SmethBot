import {bot} from './../bot'
import { TextChannel } from "discord.js";

function anon(msg) {
    if (msg.content.startsWith('!anon ')) {
        if (msg.guild === null) {
          let messageArray = msg.content.split(' ') 
          if (messageArray[1].startsWith('!')) {
            let channelIDCommand = messageArray[1].split('')
            channelIDCommand.splice(0, 1)
            const channelID = channelIDCommand.join('')
            messageArray.splice(0, 2)
            const anonMessage = messageArray.join(' ')
            if (!bot.channels.cache.get(channelID)) {
              msg.reply('The channel ID you gave me didn\'t work out.\nHere is an example using the ID from the main channel: \n!189542527496486919')
              return
            }
            (bot.channels.cache.get(channelID) as TextChannel).send(`${anonMessage}\n\t-**anonymous message**`)  
          } else {
          messageArray.splice(0, 1)
          const anonMessage = messageArray.join(' ');
          (bot.channels.cache.get('189542527496486919') as TextChannel).send(`${anonMessage}\n\t-**anonymous message**`)
          }
        } else {
          return
        }
      }
}

export {anon};