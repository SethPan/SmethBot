import { bot } from "./../bot";
const Database = require("better-sqlite3");
const db = new Database(
  "smethbot.db"
  // , {
  //   verbose: console.log,
  // }
);
const fs = require("fs");

function queryDB(msg) {
  const guildID = msg.guild.id;
  const query = `SELECT 
    role_ID,
    role_name, 
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
    FROM roles_in_guilds 
    WHERE guild_ID = ?`;
  const statement = db.prepare(query);
  const results = statement.all(guildID);
  console.log("-", guildID, "-");
  console.log(results);
  return results;
}

function checkCommandFromAdmin(msg) {
  if (
    msg.content.includes("!restore") &&
    msg.member.hasPermission("ADMINISTRATOR")
    // && msg.member.id !== "812100292375609356"
  ) {
    return true;
  } else {
    return false;
  }
}

function roleMatchingID(idString, msg) {
  //console.log("-----", idString, "----");
  return msg.guild.roles.cache.find((role) => {
    //console.log(role.name, role.id);
    if (role.id === idString) {
      return true;
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
    const idString = roleID;
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

    if (role) {
      role.setPermissions(permissionsToAdd);
    }
  });
}

function deletePermissionRoles(permissionNames, msg, guildID) {
  if (guildID === 408000941078347796) {
    return;
  } else {
    permissionNames.forEach((permissionName) => {
      msg.guild.roles.cache
        .find((role) => role.name === permissionName)
        .delete(`Server returned to it's previous state`);
    });
  }
}

function deleteRolesFromDB(guildID) {
  const sqlInput = `DELETE FROM roles_in_guilds 
  WHERE guild_ID = ?`;
  const deleteStatement = db.prepare(sqlInput);
  deleteStatement.run(guildID);
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
  const roleIDs = [];
  for (let j = 0; j < roleTemplates.length; j++) {
    //console.log(roleTemplates[j]);
    roleIDs.push(roleTemplates[j].role_ID);
  }
  addBackPermissions(permissionNames, roleTemplates, roleIDs, msg, guildID);
  deletePermissionRoles(permissionNames, msg, guildID);
  deleteRolesFromDB(guildID);
}

export { restoreRoles };
