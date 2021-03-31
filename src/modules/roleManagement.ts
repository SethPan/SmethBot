//import Discord, { Guild } from "discord.js";
import { bot } from "./../bot";

const Database = require("better-sqlite3");
const db = new Database("smethbot.db", { verbose: console.log });

function getRoleToCopy(roleName) {
  const archetypeGuild = bot.guilds.cache.find(
    (guild) => guild.id === "408000941078347796"
  );
  const role = archetypeGuild.roles.cache.find(
    (role) => role.name === roleName
  );
  return role;
}

function findGuildsLackingRole(roleSearchedFor) {
  const matchingGuilds = [];
  bot.guilds.cache.forEach((guild) => {
    if (!guild.roles.cache.find((role) => role.name === roleSearchedFor.name)) {
      matchingGuilds.push(guild);
    }
  });
  return matchingGuilds;
}

function createRoleInServer(role, guild) {
  guild.roles.create({ data: role });
}

function matchThenAddRolesToServers(role) {
  const guilds = findGuildsLackingRole(role);
  for (let i = 0; i < guilds.length; i++) {
    createRoleInServer(role, guilds[i]);
  }
}

function createPermissionObject(guilds, permissionRoleNames) {
  const permissionsPerRolePerGuild = {};
  guilds.forEach((guild) => {
    const guildID = guild.id;
    permissionsPerRolePerGuild[guildID] = {};
    guild.roles.cache.forEach((role) => {
      const roleName = role.name;
      const roleID = role.id;
      if (!permissionRoleNames.includes(roleName) && !role.managed) {
        const permissions = role.permissions.serialize();
        permissionsPerRolePerGuild[guildID][roleID] = {
          roleName,
          permissions,
        };
      }
    });
  });
  return permissionsPerRolePerGuild;
}

function rolePermissionsPerServer(permissionRoleNames) {
  const guilds = bot.guilds.cache;
  const permissionsPerRolePerServer = createPermissionObject(
    guilds,
    permissionRoleNames
  );
  return permissionsPerRolePerServer;
} //to be saved for later use

function addUsersToRoles(role) {
  const roleName = role.name;
  bot.guilds.cache.forEach((guild) =>
    guild.members.cache.forEach((member) => {
      if (member.hasPermission(roleName)) {
        const roleInServer = guild.roles.cache.find(
          (role) => role.name === roleName
        );
        addRoleToUser(roleInServer, member);
      }
    })
  );
}

function addRoleToUser(role, member) {
  member.roles.add(role);
}

function copyAndAddRolesToServersAndAddUsersToRoles(name) {
  const roleToClone = getRoleToCopy(name);
  matchThenAddRolesToServers(roleToClone);
  addUsersToRoles(roleToClone);
}

function removePermissionsFromOldRoles() {}

function roleManagement() {
  const permissionRoleNames = [
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "ADMINISTRATOR",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    // "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS",
  ];
  permissionRoleNames.forEach((name) =>
    copyAndAddRolesToServersAndAddUsersToRoles(name)
  );
  console.log(rolePermissionsPerServer(permissionRoleNames));
}

export { roleManagement };
