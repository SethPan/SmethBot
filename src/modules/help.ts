import { bot } from "./../bot";

const commands = {
  "!help": {
    name: "\n\t!help",
    description: `\n\tIt does this.`,
    example: `\n\t!help`,
    //handler: help,
  },
  "!anon": {
    name: "\n\t!anon",
    description: `\n\tDM'ing this to SmethBot (followed by a message),\n\tallows you to send this message anonymously to any channel in any guild you have in common with SmethBot. \n\tUnless you specify a guild ID (optional), SmethBot will give you a selection of available options to send the message to.`,
    example: `\n\t!anon *This is a message i intend to send anonymously*\n\t!anon !237830263986585601 *This is a message i intend to send to a specific guild's main channel* (by following !anon with !(GUILD-ID)).`,
    //handler: anon,
  },
  "!naruto": {
    name: "\n\t!naruto",
    description: `\n\tThis will change your nickname to a random Naruto character in the current discord server.\n\tYou won't be able to change your name back for 2 hours, so you have to live with the character you get.\n\tSmethBot will message you a unique password and the time you will be allowed to use it, which will return everything to normal.\n\tSome people find that they never want to go back. **Believe it!** Life as a ninja is exciting.`,
    example: `\n\t!naruto\n\t!_123456 (password example)`,
    //handler: naruto,
  },
  "!f": {
    name: "\n\tf",
    description: `\n\tf`,
    example: `\n\tf`,
    //handler: f,
  },
  "!botcolor": {
    name: "\n\t!botcolor",
    description: `\n\tThis will change SmethBot's name to a random color in the server.`,
    example: `\n\t!botcolor`,
    //handler: botcolor,
  },
  "!avatar": {
    name: "\n\t!avatar",
    description: `\n\tSmethBot will post a larger version of the mentioned user's profile picture.\n\tif you don't mention anyone, it will post your avatar instead. Get a better look.`,
    example: `\n\t!avatar @SomeIdiot\n\t!avatar`,
    //handler: displayAvatar,
  },
  "!kick": {
    name: "\n\t!kick",
    description: `\n\tThis will kick the mentioned user out of the discord channel, but that's a mean thing to do, you cunt.`,
    example: `\n\t!kick @SomeIdiot`,
    //handler: kick,
  },
};

function help(msg) {
  const [mention, command, ...args] = msg.content.split(" ");
  const invoked = mention.includes(bot.user.id);
  if (invoked && command.toLowerCase() === "!help") {
    let message = [];
    let i = 0;
    for (i = 0, message, commands; i < Object.keys(commands).length; i++) {
      let index = Object.keys(commands)[i];
      message.push(
        "__*Name:*__" +
          ` **${commands[index].name}**` +
          "\n" +
          "__*Description:*__" +
          ` ${commands[index].description}` +
          "\n" +
          "__*Example:*__" +
          ` ${commands[index].example}` +
          "\n"
      );
    }
    message.join("\n");
    msg.channel.send(message);
  }
}

export { help };
