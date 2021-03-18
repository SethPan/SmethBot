//import Discord, { Guild } from "discord.js";
import { bot } from "./../bot";

function getRoleToCopy(roleName) {
  return bot.guilds
    .fetch("408000941078347796")
    .then((guild) => guild.roles.cache.find((role) => role.name === roleName));
}
function findGuildsLackingRole(roleName) {
  let matchingGuilds = [];
  bot.guilds.cache.forEach((guild) => {
    if (guild.roles.cache.find((role) => role.name === roleName) === null) {
      matchingGuilds.push(guild);
    }
  });
  return matchingGuilds;
}
function addRoleToServer(role, guild) {
  guild.roles.create({ data: role });
}
async function matchRolesToServers(roleList) {
  roleList.forEach((role) => {
    const guilds = findGuildsLackingRole(role);
    let i = 0;
    for (i = 0; i < guilds.length; i++) {
      addRoleToServer(role, guilds[i]);
    }
  });
}

async function roleManagement() {
  const nicknameRole = await getRoleToCopy("nickname");
  const roleList = [nicknameRole];
  matchRolesToServers(roleList);
}

export { roleManagement };
