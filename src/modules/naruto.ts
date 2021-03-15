import fs from "fs";
import path from "path";

const filePath = path.join(__dirname, "..", "..", "..", "src", "names.json");

function handlePassword(msg) {
  if (msg.content.startsWith("!_")) {
    const userID = msg.author.id;
    const discordServer = msg.guild.id;
    const typedPassword = msg.content.split("_")[1];
    let savedNamesPasswordsTimes: object = JSON.parse(
      //@ts-ignore
      fs.readFileSync(filePath)
    );
    if (!savedNamesPasswordsTimes[userID][discordServer]) return;

    if (
      savedNamesPasswordsTimes[userID][discordServer].savedPassword !==
      typedPassword
    ) {
      msg.reply(
        "Invalid password. Please check that it is correct, and does not contain spaces at the end."
      );
      return;
    } else if (
      new Date(savedNamesPasswordsTimes[userID][discordServer].endTime) >
      new Date()
    ) {
      msg.reply(
        `Please try again at ${new Date(
          savedNamesPasswordsTimes[userID][discordServer].endTime
        ).toLocaleTimeString()}`
      );
      return;
    } else {
      if (msg.guild === null) {
        msg.author.send(
          "Please send the password in the appropriate discord server : )"
        );
        return;
      } else {
        msg.member.setNickname(
          savedNamesPasswordsTimes[userID][discordServer].previousName
        );
        const role = msg.guild.roles.cache.find((r) => r.name === "nickname");
        msg.member.roles.add(role); //.catch(console.error)
        msg.reply("So soon? Back to normal.");
        delete savedNamesPasswordsTimes[userID][discordServer];
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(savedNamesPasswordsTimes));
  }
}

function naruto(msg) {
  const userID = msg.author.id;
  if (msg.content.startsWith("!naruto")) {
    if (msg.member.hasPermission("CHANGE_NICKNAME") === false) {
      msg.reply(`You're stuck with ${msg.member.displayName} for now.`);
      return;
    } else {
      const narutoNames = [
        "Naruto Uzumaki",
        "Sasuke Uchiha",
        "Kakashi Hatake",
        "Boruto Uzumaki",
        "Sarada Uchiha",
        "Mitsuki",
        "Konohamaru Sarutobi",
        "Hinata Hyuga",
        "Kiba Inuzuka",
        "Akamaru",
        "Shino Aburame",
        "Kurenai Yuhi",
        "Shikamaru Nara",
        "Choji Akimichi",
        "Ino Yamanaka",
        "Asuma Sarutobi",
        "Rock Lee",
        "Neji Hyuga",
        "Tenten",
        "Might Guy",
        "Gaara",
        "Kankuro",
        "Temari",
        "Shikadai Nara",
        "Chocho Akimichi",
        "Inojin Yamanaka",
        "Moegi Kazamatsuri",
        "Sumire Kakei",
        "Namida Suzumeno",
        "Wasabi Izuno",
        "Tsubaki Kurogane",
        "Hanabi Hyuga",
        "Metal Lee",
        "Iwabi Yuino",
        "Denki Kaminarimon",
        "Udon Ise",
        "Zabuza Momochi",
        "Haku",
        "Orochimaru",
        "Kabuto Yakushi",
        "Zetsu",
        "Kisame Hoshigaki",
        "Konan",
        "Nagato",
        "Itachi Uchiha",
        "Deidara",
        "Kakuzu",
        "Sasori",
        "Iruka Umino",
        "Hokage",
        "Tsunade",
        "Jiraiya",
        "Sai",
        "Yamato",
        "Killer Bee",
        "Hagoromo Otsutsuki",
        "A",
        "Darui",
        "Karui",
        "Chiyo",
        "Mei Terumi",
        "Chojuro",
        "Ao",
        "Gengetsu Hozuki",
        "Onoki",
        "Kurotsuchi",
        "Akatsuchi",
        "Kurama",
        "Taka",
        "Suigetsu Hozuki",
        "Karin",
        "Jugo",
        "Kushina Uzumaki",
        "Kawaki",
      ];
      const originalName = msg.member.displayName;
      msg.member.setNickname(narutoNames[Math.floor(Math.random() * 74)]);
      const data = fs.readFileSync(filePath);
      //@ts-ignore
      const savedNamesPasswordsTimes: object = JSON.parse(data);
      const role = msg.guild.roles.cache.find((r) => r.name === "nickname");
      msg.member.roles.remove(role); //.catch(console.error)
      const password = "!_" + Math.random().toString(36).substring(7);
      const savedPassword = password.split("_")[1];
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + 2);
      const discordServer = msg.guild.id;
      savedNamesPasswordsTimes[userID] = {
        [discordServer]: {
          previousName: originalName,
          savedPassword,
          endTime,
        },
      };
      fs.writeFile(
        filePath,
        JSON.stringify(savedNamesPasswordsTimes),
        (err) => {
          if (err) throw err;
        }
      );
      msg.member.send(
        `This is your password: ${password} \nSend this any time after ${endTime.toLocaleTimeString()} in ${
          msg.guild.name
        } to get your old name, and nickname permissions back.\nHave fun with your new identity!`
      );
    }
  } else {
    handlePassword(msg);
  }
}

export { naruto };
