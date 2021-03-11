import fs from 'fs';
import path from 'path';

function naruto(msg) {
    if (msg.content.startsWith('!naruto')) {
        if (msg.member.hasPermission("CHANGE_NICKNAME") === false) {
        msg.reply(`You're stuck with ${msg.member.displayName} for now.`)
        return
        } else {
        const narutoNames = ['Naruto Uzumaki', 'Sasuke Uchiha', 'Kakashi Hatake', 'Boruto Uzumaki', 'Sarada Uchiha', 'Mitsuki', 'Konohamaru Sarutobi', 'Hinata Hyuga', 'Kiba Inuzuka', 'Akamaru', 'Shino Aburame', 'Kurenai Yuhi', 'Shikamaru Nara', 'Choji Akimichi', 'Ino Yamanaka', 'Asuma Sarutobi', 'Rock Lee', 'Neji Hyuga', 'Tenten', 'Might Guy', 'Gaara', 'Kankuro', 'Temari', 'Shikadai Nara', 'Chocho Akimichi', 'Inojin Yamanaka', 'Moegi Kazamatsuri', 'Sumire Kakei', 'Namida Suzumeno', 'Wasabi Izuno', 'Tsubaki Kurogane', 'Hanabi Hyuga', 'Metal Lee', 'Iwabi Yuino', 'Denki Kaminarimon', 'Udon Ise', 'Zabuza Momochi', 'Haku', 'Orochimaru', 'Kabuto Yakushi', 'Zetsu', 'Kisame Hoshigaki', 'Konan', 'Nagato', 'Itachi Uchiha', 'Deidara', 'Kakuzu', 'Sasori', 'Iruka Umino', 'Hokage', 'Tsunade', 'Jiraiya', 'Sai', 'Yamato', 'Killer Bee', 'Hagoromo Otsutsuki', 'A', 'Darui', 'Karui', 'Chiyo', 'Mei Terumi', 'Chojuro', 'Ao', 'Gengetsu Hozuki', 'Onoki', 'Kurotsuchi', 'Akatsuchi', 'Kurama', 'Taka', 'Suigetsu Hozuki', 'Karin', 'Jugo', 'Kushina Uzumaki', 'Kawaki'];
        const originalName = msg.member.displayName
        msg.member.setNickname(narutoNames[Math.floor(Math.random() * 74)]);
        const data = fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'names.json'))
        //@ts-ignore
        const savedNamesPasswordsTimes = JSON.parse(data)
        const role = msg.guild.roles.cache.find(r => r.name === "dudes")
        msg.member.roles.remove(role)//.catch(console.error)
        const password = '!_' + Math.random().toString(36).substring(7);
        const savedPassword = password.split('_')[1]
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + 2);
        savedNamesPasswordsTimes[msg.author.id] = {previousName: originalName, savedPassword, endTime}
        fs.writeFile(path.join(__dirname, '..', '..', '..', 'src', 'names.json'), JSON.stringify(savedNamesPasswordsTimes), (err) => {
            if (err) throw err;
        });
        msg.member.send(`This is your password: ${password} \n Send this in chat any time after ${endTime.toLocaleTimeString()} to get your old name back. Have fun with your new identity!`)} 
    }

    if (msg.content.startsWith('!_')) {
        const typedPassword = msg.content.split('_')[1]     
        //@ts-ignore
        let savedNamesPasswordsTimes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', '..', 'src', 'names.json')));
        if (!savedNamesPasswordsTimes[msg.author.id]) 
            return
        
        if (savedNamesPasswordsTimes[msg.author.id].savedPassword !== typedPassword) {
        msg.reply('Invalid password. Please check that it is correct, and does not contain spaces at the end.')
        return
        } else if (new Date(savedNamesPasswordsTimes[msg.author.id].endTime)> new Date()) {
            msg.reply(`Please try again at ${new Date(savedNamesPasswordsTimes[msg.author.id].endTime).toLocaleTimeString()}`)
            return
        } else {
            if (msg.guild === null) {
                msg.author.send('Please send the password in the appropriate discord server : )')
                return
            } else {
            msg.member.setNickname(savedNamesPasswordsTimes[msg.author.id].previousName)
            const role = msg.guild.roles.cache.find(r => r.name === "dudes")
            msg.member.roles.add(role)//.catch(console.error)
            msg.reply('So soon? Back to normal.')
            delete savedNamesPasswordsTimes[msg.author.id]
            }  
        }
            fs.writeFileSync(path.join(__dirname, '..', '..', '..', 'src', 'names.json'), JSON.stringify(savedNamesPasswordsTimes))                         
        } 
}

export {naruto};