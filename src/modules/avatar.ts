function displayAvatar(msg) {
  const taggedUser = msg.mentions.users.first();
  if (msg.content.startsWith("!avatar") && taggedUser !== msg.author) {
    const user = msg.mentions.users.first() || msg.author;
    msg.channel.send(
      "https://cdn.discordapp.com/avatars/" +
        user.id +
        "/" +
        user.avatar +
        ".png?size=1024"
    );
  }
}

export { displayAvatar };
