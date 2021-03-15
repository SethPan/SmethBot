import Discord from "discord.js";
import { bot } from "./../bot";

function f(msg) {
  if (msg.content === "f" && msg.author !== bot.user) {
    //msg.channel.send('_**F**_')
    const fEmbed = new Discord.MessageEmbed()
      .setColor("#f55742")
      .setTitle("FFFFFFFFFFFFFFF")
      .setURL("https://en.wikipedia.org/wiki/F")
      .setAuthor(
        "Effel Tower",
        "https://h45vs1s00ar1vknck1y9srp1-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/f-grade.png",
        "https://www.urbandictionary.com/define.php?term=F"
      )
      .setDescription(
        '"**f**" is a prominent letter of the alphabet, known for it\'s iconic dash, which makes it impossible to write with a single continuous line, similar to the dash on a "**t**". A common alternative form of "**f**" looks like this: "**F**". This is "**f**"\'s uppercase variant, and is used in cases where "**f**" begins the first word of a sentence, or is the first letter of a proper noun. Documentation for all of the aforementioned english syntax is readily available, making it a field with many practitioners. If you try hard enough, you may find yet more variants of the letter "**f**".'
      )
      .setThumbnail(
        "https://h45vs1s00ar1vknck1y9srp1-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/f-grade.png"
      )
      .addFields(
        { name: "f", value: "f" },
        { name: "\u200B", value: "\u200B" },
        { name: "f", value: "f", inline: true },
        { name: "f", value: "f", inline: true }
      )
      .addField("f", "f", true)
      .setImage(
        "https://dzpzmbuhhss7e.cloudfront.net/p/1/9/8/4/6/19846-large_default.jpg"
      )
      .setTimestamp()
      .setFooter("f", "https://i.ytimg.com/vi/PzK0-VSZPd4/maxresdefault.jpg");
    msg.channel.send(fEmbed);
  }
}

export { f };
