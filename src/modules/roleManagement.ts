//import Discord, { Guild } from "discord.js";
import { TeamMember } from "discord.js";
import { bot } from "./../bot";
import { f } from "./f";

function getRoleToCopy(roleName) {
  const archetypeGuild = bot.guilds.cache.get("408000941078347796");
  console.log(
    archetypeGuild.roles.cache.find((role) => role.name === roleName)
  );
  const roleToCopy = archetypeGuild.roles.cache.find(
    (role) => role.name === roleName
  );
  return roleToCopy;
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
function matchThenAddRolesToServers(roleToClone) {
  const guilds = findGuildsLackingRole(roleToClone);
  for (let i = 0; i < guilds.length; i++) {
    createRoleInServer(roleToClone, guilds[i]);
  }
  return roleToClone;
}

function createPermissionObject(guilds) {
  const permissionsPerRolePerGuild = {};
  guilds.forEach((guild) => {
    const guildID = guild.id;
    permissionsPerRolePerGuild[guildID] = {};
    guild.roles.cache.forEach((role) => {
      const roleName = role.name;
      const roleID = role.id;
      const permissions = role.permissions.serialize();
      permissionsPerRolePerGuild[guildID][roleID] = {
        roleName,
        permissions,
      };
    });
  });
  return permissionsPerRolePerGuild;
}

function rolePermissionsPerServer() {
  const guilds = bot.guilds.cache;
  const permissionsPerRolePerServer = createPermissionObject(guilds);
  return permissionsPerRolePerServer;
} //to be saved for later use

function addUsersToRoles(role) {
  const roleName = role.name;
  bot.guilds.cache.forEach((guild) =>
    guild.members.cache.forEach((member) => {
      if (member.hasPermission(roleName)) {
        asyncAddingRoleToUser(role, member);
      }
    })
  );
}

function asyncAddingRoleToUser(role, member) {
  member.roles.add(role);
}

function copyAndAddRolesToServersAndAddUsersToRoles(roleName) {
  const roleToClone = getRoleToCopy(roleName);
  console.log("\n\n\n\n" + roleToClone + "\n\n\n\n");
  matchThenAddRolesToServers(roleToClone);
  addUsersToRoles(roleToClone);
  //console.log(rolePermissionsPerServer());
}

function roleManagement() {
  const permissionRoleNames = [
    // "CREATE_INSTANT_INVITE",
    // "KICK_MEMBERS",
    // "BAN_MEMBERS",
    // "ADMINISTRATOR",
    // "MANAGE_CHANNELS",
    // "MANAGE_GUILD",
    // "ADD_REACTIONS",
    // "VIEW_AUDIT_LOG",
    // "PRIORITY_SPEAKER",
    // "STREAM",
    // "VIEW_CHANNEL",
    // "SEND_MESSAGES",
    // "SEND_TTS_MESSAGES",
    // "MANAGE_MESSAGES",
    // "EMBED_LINKS",
    // "ATTACH_FILES",
    // "READ_MESSAGE_HISTORY",
    // "MENTION_EVERYONE",
    // "USE_EXTERNAL_EMOJIS",
    // "VIEW_GUILD_INSIGHTS",
    // "CONNECT",
    // "SPEAK",
    // "MUTE_MEMBERS",
    // "DEAFEN_MEMBERS",
    // "MOVE_MEMBERS",
    // "USE_VAD",
    "CHANGE_NICKNAME",
    // "MANAGE_NICKNAMES",
    // "MANAGE_ROLES",
    // "MANAGE_WEBHOOKS",
    // "MANAGE_EMOJIS",
  ];
  permissionRoleNames.forEach((name) =>
    copyAndAddRolesToServersAndAddUsersToRoles(name)
  );
}

export { roleManagement };
