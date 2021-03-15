import { bot } from "./../bot";
function kick(msg) {
  const taggedUser = msg.mentions.users.first();
  if (msg.content.startsWith("!kick")) {
    if (taggedUser === bot.user) {
      msg.channel.send("||Nah||");
      return;
    }
    if (msg.mentions.users.size) {
      msg.channel.send(
        `You wanted to kick ${taggedUser.username} ...but this is a place of love and acceptance. Let's work on our problems togeather, and strive to be well adjusted members of society. DUDES ROCK`
      );
    } else {
      msg.reply("Please tag a valid user!");
    }
  }
}
export { kick };
