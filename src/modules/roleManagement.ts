import { bot } from "./../bot";

const Database = require("better-sqlite3");
const db = new Database("smethbot.db");

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
      //if (roleName === "new role") role.delete();
      //^purpose is to remove incorrect roles created from testing
      if (!permissionRoleNames.includes(roleName) && role.editable) {
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
}

function guildIsAlreadyInTable(guildID) {
  const query = "SELECT guild_ID FROM roles_in_guilds WHERE guild_ID = ?";
  const statement = db.prepare(query);
  const results = statement.all(guildID);
  if (results.length >= 1) {
    return true;
  } else {
    return false;
  }
}

function organizeRoleData(permissionRoleNames) {
  interface templateObj {
    [key: string]: any;
  }
  const templateObj = rolePermissionsPerServer(permissionRoleNames);
  const guildEntries = Object.entries(templateObj);
  createTables();
  const allRolesOrganized = [];

  for (let i = 0; i < guildEntries.length; i++) {
    const guildID = guildEntries[i][0];
    //189542527496486919

    if (guildIsAlreadyInTable(guildID)) {
      continue;
    }

    const guildRoleIDs = Object.keys(guildEntries[i][1]);
    //[ '813914928222175303', '189542527496486919' ]

    const guildRoleNames = [];
    Object.entries(guildEntries[i][1]).forEach((thing) => {
      guildRoleNames.push(Object.values(thing[1])[0]);
    });
    //[ 'bots', '@everyone' ]

    const permissionNamesPerRole = [];
    Object.entries(guildEntries[i][1]).forEach((thing) => {
      permissionNamesPerRole.push(Object.keys(Object.values(thing[1])[1]));
    });
    // [
    //   [
    // 'CREATE_INSTANT_INVITE', 'KICK_MEMBERS',
    // 'BAN_MEMBERS',           'ADMINISTRATOR',
    // 'MANAGE_CHANNELS',       'MANAGE_GUILD',
    // 'ADD_REACTIONS',         'VIEW_AUDIT_LOG',
    // 'PRIORITY_SPEAKER',      'STREAM',
    // 'VIEW_CHANNEL',          'SEND_MESSAGES',
    // 'SEND_TTS_MESSAGES',     'MANAGE_MESSAGES',
    // 'EMBED_LINKS',           'ATTACH_FILES',
    // 'READ_MESSAGE_HISTORY',  'MENTION_EVERYONE',
    // 'USE_EXTERNAL_EMOJIS',   'VIEW_GUILD_INSIGHTS',
    // 'CONNECT',               'SPEAK',
    // 'MUTE_MEMBERS',          'DEAFEN_MEMBERS',
    // 'MOVE_MEMBERS',          'USE_VAD',
    // 'CHANGE_NICKNAME',       'MANAGE_NICKNAMES',
    // 'MANAGE_ROLES',          'MANAGE_WEBHOOKS',
    // 'MANAGE_EMOJIS'
    //   ],
    //   [
    //     'CREATE_INSTANT_INVITE', 'KICK_MEMBERS',
    //     'BAN_MEMBERS',           'ADMINISTRATOR',
    //     'MANAGE_CHANNELS',       'MANAGE_GUILD',
    //     'ADD_REACTIONS',         'VIEW_AUDIT_LOG',
    //     'PRIORITY_SPEAKER',      'STREAM',
    //     'VIEW_CHANNEL',          'SEND_MESSAGES',
    //     'SEND_TTS_MESSAGES',     'MANAGE_MESSAGES',
    //     'EMBED_LINKS',           'ATTACH_FILES',
    //     'READ_MESSAGE_HISTORY',  'MENTION_EVERYONE',
    //     'USE_EXTERNAL_EMOJIS',   'VIEW_GUILD_INSIGHTS',
    //     'CONNECT',               'SPEAK',
    //     'MUTE_MEMBERS',          'DEAFEN_MEMBERS',
    //     'MOVE_MEMBERS',          'USE_VAD',
    //     'CHANGE_NICKNAME',       'MANAGE_NICKNAMES',
    //     'MANAGE_ROLES',          'MANAGE_WEBHOOKS',
    //     'MANAGE_EMOJIS'
    //   ]
    // ]

    const permissionBooleansPerRole = [];
    Object.entries(guildEntries[i][1]).forEach((thing) => {
      permissionBooleansPerRole.push(Object.values(Object.values(thing[1])[1]));
    });
    // [
    //   [
    //     true, true, true, true, true,
    //     true, true, true, true, true,
    //     true, true, true, true, true,
    //     true, true, true, true, true,
    //     true, true, true, true, true,
    //     true, true, true, true, true,
    //     true
    //   ],
    //   [
    //     false, false, false, false, false,
    //     false, true,  false, false, true,
    //     true,  true,  false, false, true,
    //     true,  true,  true,  true,  false,
    //     true,  true,  false, false, false,
    //     true,  true,  false, false, false,
    //     false
    //   ]
    // ]

    const permissionValuesPerRole = [];
    for (let l = 0; l < permissionBooleansPerRole.length; l++) {
      const singleRolePermissionValues = [];
      for (let j = 0; j < permissionBooleansPerRole[l].length; j++) {
        if (permissionBooleansPerRole[l][j] === true) {
          singleRolePermissionValues.push(1);
        } else {
          singleRolePermissionValues.push(0);
        }
      }
      permissionValuesPerRole.push(singleRolePermissionValues);
    }

    for (let t = 0; t < guildRoleIDs.length; t++) {
      const preparedRoleObject = {
        role_ID: guildRoleIDs[t],
        guild_ID: guildID,
        role_name: guildRoleNames[t],
        CREATE_INSTANT_INVITE: permissionValuesPerRole[t][0],
        KICK_MEMBERS: permissionValuesPerRole[t][1],
        BAN_MEMBERS: permissionValuesPerRole[t][2],
        ADMINISTRATOR: permissionValuesPerRole[t][3],
        MANAGE_CHANNELS: permissionValuesPerRole[t][4],
        MANAGE_GUILD: permissionValuesPerRole[t][5],
        ADD_REACTIONS: permissionValuesPerRole[t][6],
        VIEW_AUDIT_LOG: permissionValuesPerRole[t][7],
        PRIORITY_SPEAKER: permissionValuesPerRole[t][8],
        STREAM: permissionValuesPerRole[t][9],
        VIEW_CHANNEL: permissionValuesPerRole[t][10],
        SEND_MESSAGES: permissionValuesPerRole[t][11],
        SEND_TTS_MESSAGES: permissionValuesPerRole[t][12],
        MANAGE_MESSAGES: permissionValuesPerRole[t][13],
        EMBED_LINKS: permissionValuesPerRole[t][14],
        ATTACH_FILES: permissionValuesPerRole[t][15],
        READ_MESSAGE_HISTORY: permissionValuesPerRole[t][16],
        MENTION_EVERYONE: permissionValuesPerRole[t][17],
        USE_EXTERNAL_EMOJIS: permissionValuesPerRole[t][18],
        VIEW_GUILD_INSIGHTS: permissionValuesPerRole[t][19],
        CONNECT: permissionValuesPerRole[t][20],
        SPEAK: permissionValuesPerRole[t][21],
        MUTE_MEMBERS: permissionValuesPerRole[t][22],
        DEAFEN_MEMBERS: permissionValuesPerRole[t][23],
        MOVE_MEMBERS: permissionValuesPerRole[t][24],
        USE_VAD: permissionValuesPerRole[t][25],
        CHANGE_NICKNAME: permissionValuesPerRole[t][26],
        MANAGE_NICKNAMES: permissionValuesPerRole[t][27],
        MANAGE_ROLES: permissionValuesPerRole[t][28],
        MANAGE_WEBHOOKS: permissionValuesPerRole[t][29],
        MANAGE_EMOJIS: permissionValuesPerRole[t][30],
      };
      insertRolesIntoTables(preparedRoleObject);
    }
  }
}

function insertRolesIntoTables(preparedRoleObject) {
  db.prepare(
    `INSERT INTO roles_in_guilds 
VALUES(@role_ID, 
  @guild_ID, 
  @role_name, 
  @CREATE_INSTANT_INVITE,
  @KICK_MEMBERS,
  @BAN_MEMBERS,
  @ADMINISTRATOR,
  @MANAGE_CHANNELS,
  @MANAGE_GUILD,
  @ADD_REACTIONS,
  @VIEW_AUDIT_LOG,
  @PRIORITY_SPEAKER,
  @STREAM,
  @VIEW_CHANNEL,
  @SEND_MESSAGES,
  @SEND_TTS_MESSAGES,
  @MANAGE_MESSAGES,
  @EMBED_LINKS,
  @ATTACH_FILES,
  @READ_MESSAGE_HISTORY,
  @MENTION_EVERYONE,
  @USE_EXTERNAL_EMOJIS,
  @VIEW_GUILD_INSIGHTS,
  @CONNECT,
  @SPEAK,
  @MUTE_MEMBERS,
  @DEAFEN_MEMBERS,
  @MOVE_MEMBERS,
  @USE_VAD,
  @CHANGE_NICKNAME,
  @MANAGE_NICKNAMES,
  @MANAGE_ROLES,
  @MANAGE_WEBHOOKS,
  @MANAGE_EMOJIS
  );`
  ).run(preparedRoleObject);
}

function createTables() {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS roles_in_guilds (
    role_ID INTEGER PRIMARY KEY,
    guild_ID INTEGER NOT NULL,
    role_name TEXT NOT NULL,
    CREATE_INSTANT_INVITE INTEGER DEFAULT 0,
    KICK_MEMBERS INTEGER DEFAULT 0,
    BAN_MEMBERS INTEGER DEFAULT 0,
    ADMINISTRATOR INTEGER DEFAULT 0,
    MANAGE_CHANNELS INTEGER DEFAULT 0,
    MANAGE_GUILD INTEGER DEFAULT 0,
    ADD_REACTIONS INTEGER DEFAULT 0,
    VIEW_AUDIT_LOG INTEGER DEFAULT 0,
    PRIORITY_SPEAKER INTEGER DEFAULT 0,
    STREAM INTEGER DEFAULT 0,
    VIEW_CHANNEL INTEGER DEFAULT 0,
    SEND_MESSAGES INTEGER DEFAULT 0,
    SEND_TTS_MESSAGES INTEGER DEFAULT 0,
    MANAGE_MESSAGES INTEGER DEFAULT 0,
    EMBED_LINKS INTEGER DEFAULT 0,
    ATTACH_FILES INTEGER DEFAULT 0,
    READ_MESSAGE_HISTORY INTEGER DEFAULT 0,
    MENTION_EVERYONE INTEGER DEFAULT 0,
    USE_EXTERNAL_EMOJIS INTEGER DEFAULT 0,
    VIEW_GUILD_INSIGHTS INTEGER DEFAULT 0,
    CONNECT INTEGER DEFAULT 0,
    SPEAK INTEGER DEFAULT 0,
    MUTE_MEMBERS INTEGER DEFAULT 0,
    DEAFEN_MEMBERS INTEGER DEFAULT 0,
    MOVE_MEMBERS INTEGER DEFAULT 0,
    USE_VAD INTEGER DEFAULT 0,
    CHANGE_NICKNAME INTEGER DEFAULT 0,
    MANAGE_NICKNAMES INTEGER DEFAULT 0,
    MANAGE_ROLES INTEGER DEFAULT 0,
    MANAGE_WEBHOOKS INTEGER DEFAULT 0,
    MANAGE_EMOJIS INTEGER DEFAULT 0
    );`
  ).run();
}

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

function removePermissionsFromOldRoles(permissionRoleNames) {
  bot.guilds.cache.forEach((guild) => {
    guild.roles.cache.forEach((role) => {
      if (!permissionRoleNames.includes(role.name)) {
        for (let i = 0; i < permissionRoleNames.length; i++) {
          if (role.permissions.has(permissionRoleNames[i]) && role.editable) {
            role.setPermissions([]);
          } else {
            continue;
          }
        }
      }
    });
  });
}

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
  organizeRoleData(permissionRoleNames);
  removePermissionsFromOldRoles(permissionRoleNames);
}

export { roleManagement };
