function botcolor(msg) {
  if (msg.content.startsWith("!botcolor")) {
    const randomColor = () => {
      let color = "#";
      for (let i = 0; i < 6; i++) {
        const random = Math.random();
        const bit = (random * 16) | 0;
        color += bit.toString(16);
      }
      return color;
    };

    msg.guild.roles.cache
      .find((role) => role.name === "SmethBot")
      .edit({
        color: `${randomColor()}`,
      });
  }
}

export { botcolor };
