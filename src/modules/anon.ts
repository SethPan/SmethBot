import { bot } from "./../bot";
import { Collection, Guild, Message, TextChannel } from "discord.js";
import fs from "fs";
import path from "path";

const dataFilePath = path.join(__dirname, "..", "..", "..", "src", "data.json");

function anon(msg: Message) {
  // we only care about the message if it's a DM
  if (msg.guild !== null) return;

  if (msg.content.startsWith("!anon")) {
    handleAnonMessage(msg);
  } else {
    handleResponse(msg);
  }
}

function createAnonymousMessageText(messageText) {
  return `${messageText}\n\t-**anonymous message**`;
}

function handleCustomChannelMessage(messageArray: string[], msg: Message) {
  const channelIDString = messageArray[1].slice(1);
  const anonMessage = messageArray.slice(2).join("");

  if (!bot.channels.cache.get(channelIDString)) {
    msg.reply(
      `The channel ID you gave me didn't work out.\n
      Here is an example using the ID from the main channel: \n
      !189542527496486919`
    );
    return;
  }
  if (!(bot.channels.cache.get(channelIDString).type !== "text")) {
    msg.reply("The channel has to be a main text channel or a guild ID");
    return;
  }
  (bot.channels.cache.get(channelIDString) as TextChannel).send(
    createAnonymousMessageText(anonMessage)
  );
}

function saveGuildInfoForResponse(
  msg: Message,
  anonMessage: string,
  IDs,
  guildIDs: boolean // if false, it's channels
) {
  const rawData = fs.readFileSync(dataFilePath);
  //@ts-ignore;
  const anonMessageChannelChoice: object = JSON.parse(rawData);
  const senderID = msg.author.id;
  const IDKey = guildIDs ? "commonGuildIDs" : "guildChannelIDs";
  anonMessageChannelChoice[senderID] = {
    anonChannelSelect: {
      [IDKey]: IDs,
      message: createAnonymousMessageText(anonMessage),
    },
  };
  fs.writeFile(
    dataFilePath,
    JSON.stringify(anonMessageChannelChoice),
    (err) => {
      if (err) throw err;
    }
  );
}

function getGuildChannelNamesAndIDs(commonGuild: Guild) {
  const guildChannelNames = [];
  const guildChannelIDs = [];

  commonGuild.channels.cache.forEach((channel) => {
    if (channel.type === "text") {
      guildChannelNames.push(channel.name);
      guildChannelIDs.push(channel.id);
    }
  });

  const guildChannelNamesString = guildChannelNames
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");

  return {
    guildChannelIDs: guildChannelIDs,
    guildChannelNamesString: guildChannelNamesString,
  };
}

function handleSingleServerMessage(
  msg: Message,
  commonGuilds: Collection<string, Guild>,
  anonMessage: string
) {
  const commonGuild: Guild = commonGuilds.values().next().value; // first item from values() which is annoyingly an iterator

  const guildInfo = getGuildChannelNamesAndIDs(commonGuild);
  const guildChannelIDs = guildInfo.guildChannelIDs;
  const guildChannelNamesString = guildInfo.guildChannelNamesString;

  saveGuildInfoForResponse(msg, anonMessage, guildChannelIDs, false);

  msg.reply(
    `The discord server "${commonGuild.name}" has ${guildChannelIDs.length} text channels.\n
    Please type the number of the channel you would like to send your anonymous message to:\n
    ${guildChannelNamesString}`
  );
}

function handleMultipleServerMessage(
  msg: Message,
  commonGuilds: Collection<string, Guild>,
  anonMessage: string
) {
  const commonGuildNames = [];
  commonGuilds.forEach((guild) => commonGuildNames.push(guild.name));
  const commonGuildIDs = [];
  commonGuilds.forEach((guild) => commonGuildIDs.push(guild.id));
  const commonGuildNameString = commonGuildNames
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");
  saveGuildInfoForResponse(msg, anonMessage, commonGuildIDs, true);
  msg.reply(
    `We are in **${commonGuilds.size}** discord servers togeather.\n
    Please type the number of the server you would like the anonymous message sent to:\n
    ${commonGuildNameString}`
  );
}

function handleAnonMessageWithoutChannel(msg: Message, messageArray: string[]) {
  const anonMessage = messageArray.slice(1).join(" ");

  const commonGuilds = bot.guilds.cache.filter((guild) => {
    if (guild.members.cache.keyArray().includes(msg.author.id)) {
      return true; // return true to add to new array
    }
    return false;
  });

  if (commonGuilds.size === 1) {
    handleSingleServerMessage(msg, commonGuilds, anonMessage);
  } else if (commonGuilds.size > 1) {
    handleMultipleServerMessage(msg, commonGuilds, anonMessage);
  }
}

function handleAnonMessage(msg: Message) {
  const messageArray = msg.content.split(" ");
  if (messageArray[1].startsWith("!")) {
    handleCustomChannelMessage(messageArray, msg);
  } else {
    handleAnonMessageWithoutChannel(msg, messageArray);
  }
}

function handleAnonChannelSelectResponse(
  messageNumber,
  senderData,
  serverOptionData
) {
  if (messageNumber > senderData.anonChannelSelect.guildChannelIDs.length + 1)
    return;
  const chosenChannel =
    senderData.anonChannelSelect.guildChannelIDs[messageNumber - 1];
  const message = senderData.anonChannelSelect.message;
  (bot.channels.cache.get(chosenChannel) as TextChannel).send(message);
  delete senderData.anonChannelSelect;
  fs.writeFile(dataFilePath, JSON.stringify(serverOptionData), (err) => {
    if (err) throw err;
  });
}

function handleAnonServerSelectResponse(
  messageNumber: number,
  senderData,
  serverOptionData,
  msg: Message, 
  senderID
) {
  if (messageNumber > senderData.anonServerSelect.commonGuildIDs.length + 1)
    return;
  const chosenGuild =
    senderData.anonServerSelect.commonGuildIDs[messageNumber - 1];
  const message = senderData.anonServerSelect.message;

  const guild = bot.guilds.cache.find((guild) => guild.id === chosenGuild);

  const guildInfo = getGuildChannelNamesAndIDs(guild);
  const guildChannelIDs = guildInfo.guildChannelIDs;
  const guildChannelNamesString = guildInfo.guildChannelNamesString;

  const newSenderData = {
    anonChannelSelect: {
      guildChannelIDs: guildChannelIDs,
      message: `${message}`,
    },
  };

  serverOptionData[senderID] = newSenderData

  msg.reply(
    `The discord server "${chosenGuild.name}" has ${guildChannelIDs.length} text channels.\n
  Please type the number of the channel you would like to send your anonymous message to:\n
  ${guildChannelNamesString}`
  );
  fs.writeFile(dataFilePath, JSON.stringify(serverOptionData), (err) => {
    if (err) throw err;
  });
}

function handleResponse(msg: Message) {
  const senderID = msg.author.id;
  const rawData = fs.readFileSync(dataFilePath);
  //@ts-ignore;
  const serverOptionData: object = JSON.parse(rawData);
  const senderData = serverOptionData[senderID];

  const messageNumber = Number(msg.content);

  if (senderData === undefined) return;
  if (!Number.isInteger(messageNumber)) return; // instead of returning, tell them that isn't a valid number
  if (messageNumber < 1) return;

  if (senderData.anonChannelSelect) {
    handleAnonChannelSelectResponse(
      messageNumber,
      senderData,
      serverOptionData
    );
  } else if (senderData.anonServerSelect) {
    handleAnonServerSelectResponse(
      messageNumber,
      senderData,
      serverOptionData,
      msg,
      senderID
    );
  }
}

export { anon };
