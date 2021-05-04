import { bot } from "./../bot";
const Database = require("better-sqlite3");
const db = new Database("smethbot.db");

function queryDB(msg) {
  const guildID = msg.guild.id;
  const query = `SELECT 
    role_ID, 
    CREATE_INSTANT_INVITE, 
    KICK_MEMBERS, 
    BAN_MEMBERS, 
    ADMINISTRATOR, 
    MANAGE_CHANNELS, 
    MANAGE_GUILD,
    ADD_REACTIONS, 
    VIEW_AUDIT_LOG, 
    PRIORITY_SPEAKER, 
    STREAM, 
    VIEW_CHANNEL, 
    SEND_MESSAGES, 
    SEND_TTS_MESSAGES, 
    MANAGE_MESSAGES, 
    EMBED_LINKS, 
    ATTACH_FILES, 
    READ_MESSAGE_HISTORY, 
    MENTION_EVERYONE, 
    USE_EXTERNAL_EMOJIS, 
    VIEW_GUILD_INSIGHTS, 
    CONNECT, 
    SPEAK, 
    MUTE_MEMBERS, 
    DEAFEN_MEMBERS, 
    MOVE_MEMBERS, 
    USE_VAD, 
    CHANGE_NICKNAME, 
    MANAGE_NICKNAMES, 
    MANAGE_ROLES, 
    MANAGE_WEBHOOKS, 
    MANAGE_EMOJIS 
    FROM roles_in_guilds WHERE guild_ID = ?`;
  const statement = db.prepare(query);
  const results = statement.all(guildID);
  return results;
}

function checkCommandFromAdmin(msg) {
  if (
    msg.content.startsWith("!restore") &&
    msg.member.hasPermission("ADMINISTRATOR")
  ) {
    return true;
  } else {
    return false;
  }
}

function roleMatchingID(idString, msg) {
  msg.guild.roles.cache.forEach((role) => {
    console.log(role);
    console.log("\n\n\n", idString, "\n\n\n");
    if (role.id === idString) {
      return role;
    }
  });
}

function addBackPermissions(
  permissionNames,
  roleTemplates,
  roleIDs,
  msg,
  guildID
) {
  roleIDs.forEach((roleID) => {
    const idString = roleID.toString();
    const role = roleMatchingID(idString, msg);
    const permissionsToAdd = [];
    for (let t = 0; t < roleTemplates.length; t++) {
      if (roleTemplates[t].role_ID === roleID) {
        const template = roleTemplates[t];
        for (let i = 0; i < permissionNames.length; i++) {
          const permission = permissionNames[i];
          if (template[permission] === 1) {
            permissionsToAdd.push(permission);
          } else {
            continue;
          }
        }
      }
    }
    // console.log(role);

    //role.setPermissions(permissionsToAdd);
  });
}

function restoreRoles(msg) {
  if (!checkCommandFromAdmin(msg)) {
    return;
  }
  const guildID = msg.guild.id;
  const permissionNames = [
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
  const roleTemplates = queryDB(msg);
  console.log("doing the restore command hehe");
  const roleIDs = [];
  for (let j = 0; j < roleTemplates.length; j++) {
    roleIDs.push(roleTemplates[j].role_ID);
  }
  addBackPermissions(permissionNames, roleTemplates, roleIDs, msg, guildID);
}

export { restoreRoles };
