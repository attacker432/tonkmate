/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
/*jshint esversion: 6 */
"use strict";
// Discord.js general requirements
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

//Note: JSHint is used for detecting bugs.

// General equires
require("google-closure-library");
goog.require("goog.structs.PriorityQueue");
goog.require("goog.structs.QuadTree");

// Import game settings.
const c = require("./lib/split/gamemodes.js").output;
const axios = require("axios");
// Import utilities.
var ips = new Array();
const util = require("./lib/util");
const ran = require("./lib/random");
const hshg = require("./lib/hshg");
var sysok = true; // sysok must know when is not ok /client/app.js
let closed = false;
let bots5 = 5;
let bot_count = 5;
let doms = true;
let banned_arrays = "";
let bannedIPs = [];
let arena_open = true;
let danger = true;
let skill = true;
let chat_system = true;
let mapsize_y = 4000;
let mapsize_x = 4000;
let recoil = true;
let regen = true;
let maze = 16;
if (closed == true) {
  process.exit(1);
}
const notificationMessageColor = 15;
const pmMessageColor = 13;
const errorMessageColor = 12;
var keys = [
  process.env.dev_server_token,
  process.env.token_level_2,
  process.env.token_level_1,
];
const btConfig = require("./lib/split/btconfig.js").data;
function lerp(a, b, x) {
  return a + x * (b - a);
}

// IP geolocation.
let ipGeolocationLookup = require("./ipgeolocation.json");
const { config } = require("process");

const getIPInfo = (ipAddress) => {
  // https://ip-api.com/docs/api:json
  return axios.get(`http://ip-api.com/json/${ipAddress}?fields=182274`);
};

let vpn_blocker_enabled = false;

function socketIpAsnLookup(client) {
  const clients = sockets.getClients();
  const ipAddress = clients.filter((c) => c.ip === c.ip);
  const ASN = getIPInfo(ipAddress)
    .then((response) => {
      const ipInfo = response.data;

      if (ipInfo && ipInfo.status === "success") {
        ipGeolocationLookup[ipAddress] = {
          isocode: ipInfo.countryCode,
          asn: ipInfo.as.split(" ")[0],
        };
      } else {
        console.warn(ipInfo.message || "Unknown error.");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}
// ============================================================================
// Chat System.
// ============================================================================
const nameGenerator = require("./lib/NameGenerator");

const maxChatLettersPerSecond = 7;
const maxChatMessageLength = 100;

let regExList = [];
// Muted players for chat system.
let mutedPlayers = [];
let muteCommandUsageCountLookup = {};

// Authentication.
let blacklisted_users = [
  "not sus",
  "Not sus",
  "Not Sus",
  "not Sus",
  "n0t sus",
  "N0t Sus",
  "Angry Too The CompaperOS",
];
let userAccounts = require("./chat_user.json");
let userAccountsChatColors = require("./chat_user_role_color.json");
let userAccountRoleValues = require("./chat_user_role.json");
// =====================================================================

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(find, "g"), replace);
};

const removeRedundantSpaces = (str) => {
  const searchTerm = "  "; // Double spaces.
  const replaceTerm = " "; // Single space.
  let tmpStr = str;
  let index = tmpStr.indexOf(searchTerm);

  while (index >= 0) {
    tmpStr = tmpStr.replace(searchTerm, replaceTerm);
    index = tmpStr.indexOf(searchTerm);
  }

  return tmpStr;
};

// https://geraintluff.github.io/sha256/
const sha256 = function sha256(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  let mathPow = Math.pow;
  let maxWord = mathPow(2, 32);
  let lengthProperty = "length";
  let i, j; // Used as a counter across the whole file
  let result = "";

  let words = [];
  let asciiBitLength = ascii[lengthProperty] * 8;

  let hash = (sha256.h = sha256.h || []);
  // Round constants: first 32 bits of the fractional parts of the cube roots of the first 64 primes
  let k = (sha256.k = sha256.k || []);
  let primeCounter = k[lengthProperty];

  let isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return; // ASCII check: only accept characters in range 0-255
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  // process each chunk
  for (j = 0; j < words[lengthProperty]; ) {
    let w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
    let oldHash = hash;
    // This is now the undefined working hash", often labelled as variables a...g
    // (we have to truncate as well, otherwise extra entries at the end accumulate
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      let i2 = i + j;
      // Expand the message into 64 words
      // Used below if
      let w15 = w[i - 15],
        w2 = w[i - 2];

      // Iterate
      let a = hash[0],
        e = hash[4];
      let temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + // S1
        ((e & hash[5]) ^ (~e & hash[6])) + // ch
        k[i] +
        // Expand the message schedule if needed
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + // s0
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | // s1
              0);
      // This is only used once, so *could* be moved below, but it only saves 4 bytes and makes things unreadble
      let temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + // S0
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

      hash = [(temp1 + temp2) | 0].concat(hash); // We don't bother trimming off the extra ones, they're harmless as long as we're truncating when we do the slice()
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      let b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? 0 : "") + b.toString(16);
    }
  }
  return result;
};
// Banning players.
const bannedIps = [];
const bannedASNs = [];
const blockedIPs = [];

const tempBanASN = (socket) => {
  const index = bannedASNs.findIndex((asn) => {
    return asn === socket.asn;
  });

  if (index === -1) {
    if (socket.asn) {
      bannedASNs.push(socket.asn);
      util.warn("[tempBanASN] " + socket.asn + " banned!");
    }
  }
  // Disconnect regardless.
  socket.terminate();
};
// permabanned ips.
let permabanned_ips = [];

const tempBan = (socket) => {
  const ipIndex = bannedIPs.findIndex((ip) => {
    return ip === socket.ip;
  });

  if (ipIndex === -1) {
    if (socket.ip) {
      bannedIPs.push(socket.ip);
      util.warn("[tempBan] " + socket.ip + " banned!");
    }
  }

  socket.terminate();
};
// ===============================================================
// User Accounts.
// ===============================================================
const blacklistRole = "blacklist";
const guestRole = "guest";
const memberRole = "member";
const trustedmemberRole = "trusted member";
const memberpinkRole = "member_pink";
const ambassadorRole = "ambassador";
const bugfinderRole = "bugfinder";
const moderatorRole = "moderator";
const adminRole = "admin";
const undercoveradminRole = "undercover admin";
const ownerRole = "owner";
const codevRole = "co-dev";
const developerRole = "developer";

const isUserMember = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 0;
  }
  return false;
};
const isUserTrustedMember = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 11;
  }
  return false;
};
const isUserambassador = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 12;
  }
  return false;
};
const isUsermoderator = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 19;
  }
  return false;
};
const isUseradmin = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 49;
  }
  return false;
};
const isUserundercoveradmin = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 55;
  }
  return false;
};
const isUserowner = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue >= 90;
  }
  return false;
};
const isUsercodev = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 99;
  }
  return false;
};

const isUserdeveloper = (role) => {
  let roleValue = userAccountRoleValues[role];
  if (roleValue) {
    // Role value 0 is guest, more than 0 are member, admin, etc.
    return roleValue > 109;
  }
  return false;
};

// ===============================================================

// ===============================================================
// Chat commands.
// ===============================================================

// ===============================================
// killme, km
// ===============================================
const cli = (clients) => {};
const commitSuicide = (socket, clients, args) => {
  if (socket.player != null && socket.player.body != null) {
    socket.player.body.invuln = false;
    socket.player.body.health.amount = -1;
    socket.player.body.destroy(); //destroy it!!!!!!!!!!!!!!!!!
    sockets.broadcast(socket.player.name + " has killed his/her own tank.");
  }
};
// ===============================================
// chatsystem   [on/off]
// ===============================================
const togglechatsystem = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      if (args[1] === "on" || args[1] === "1") {
        chat_system = false;
        sockets.broadcast("chat system disabled");
      } else if (args[1] === "off" || args[1] === "0") {
        chat_system = true;
        sockets.broadcast("chat system enabled.");
      }
    }
  } catch (error) {
    util.error(error);
  }
};
// ===============================================
// chatsystem on
// ===============================================
const enableChatsystem = (socket, clients, args) => {
  try {
    let isMember = isUseradmin(socket.role);
    if (isMember) {
      if (socket.player != null) {
        chat_system = true;
        socket.player.body.sendMessage(
          "*** Chat system enabled. ***",
          notificationMessageColor
        );
      }
    } else {
      socket.player.body.sendMessage("you do not have Enablechat permission");
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// chatsystem off
// ===============================================
const disableChatsystem = (socket, clients, args) => {
  try {
    let isMember = isUseradmin(socket.role);
    if (isMember) {
      if (socket.player != null) {
        chat_system = false;
        socket.player.body.sendMessage(
          "*** Chat system disabled. ***",
          notificationMessageColor
        );
      }
    } else {
      socket.player.body.sendMessage("you do not have Disablechat permission");
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// chat   [on/off]
// ===============================================
const toggleChat = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      if (args[1] === "on" || args[1] === "1") {
        socket.enableChat = true;
        socket.player.body.sendMessage(
          "*** Chat enabled. ***",
          notificationMessageColor
        );
      } else if (args[1] === "off" || args[1] === "0") {
        socket.enableChat = false;
        socket.player.body.sendMessage(
          "*** Chat disabled. ***",
          notificationMessageColor
        );
      }
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// chaton
// ===============================================
const enableChat = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enableChat = true;
      socket.player.body.sendMessage(
        "*** Chat enabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// chatoff
// ===============================================
const disableChat = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enableChat = false;
      socket.player.body.sendMessage(
        "*** Chat disabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// pm   [on/off] - Private message on/off
// ===============================================
const togglePrivateMessage = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      if (args[1] === "on" || args[1] === "1") {
        socket.enablePM = true;
        socket.player.body.sendMessage(
          "*** PM enabled. ***",
          notificationMessageColor
        );
      } else if (args[1] === "off" || args[1] === "0") {
        socket.enablePM = false;
        socket.player.body.sendMessage(
          "*** PM disabled. ***",
          notificationMessageColor
        );
      }
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// pmon - Private message on
// ===============================================
const enablePrivateMessage = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enablePM = true;
      socket.player.body.sendMessage(
        "*** PM enabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// pmoff - Private message off
// ===============================================
const disablePrivateMessage = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enablePM = false;
      socket.player.body.sendMessage(
        "*** PM disabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// sf   [on/off] - Swear filter on/off
// ===============================================
const toggleSwearFilter = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      if (args[1] === "on" || args[1] === "1") {
        socket.enableSwearFilter = true;
        socket.player.body.sendMessage(
          "*** Swear Filter enabled. ***",
          notificationMessageColor
        );
      } else if (args[1] === "off" || args[1] === "0") {
        socket.enableSwearFilter = false;
        socket.player.body.sendMessage(
          "*** Swear Filter disabled. ***",
          notificationMessageColor
        );
      }
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// sfon - Swear filter on
// ===============================================
const enableSwearFilter = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enableSwearFilter = true;
      socket.player.body.sendMessage(
        "*** Swear Filter enabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};

// ===============================================
// sfoff - Swear filter off
// ===============================================
const disableSwearFilter = (socket, clients, args) => {
  try {
    if (socket.player != null) {
      socket.enableSwearFilter = false;
      socket.player.body.sendMessage(
        "*** Swear Filter disabled. ***",
        notificationMessageColor
      );
    }
  } catch (error) {
    util.error(error);
  }
};
// (LAST UPDATED BY FELIX)
// ===============================================
// broadcast  [message]
// ===============================================
const broadcastToPlayers = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length >= 2) {
      let isMember = isUserMember(socket.role);

      if (isMember) {
        let a, rest;
        // a is the command "/broadcast" (args[0]).
        // ...rest is the rest of arguments (args[1] to args[n-1]).
        [a, ...rest] = args;

        // Construct message from the rest of the args which is an array.
        let msg = rest.reduce((accumulator, currentValue) => {
          return accumulator + " " + currentValue;
        }, "");

        let msgAnnounce = socket.player.name + ": " + msg;
        sockets.broadcast(msgAnnounce, 12);

        console.log(`[LOG] ${socket.player.name} broadcasted ${msg}`);
      }
    }
  } catch (error) {
    util.error(error);
  }
};

//===========================
// usage: /warn [reason]
//===========================
//===========================
const handleWarnChatCommand = (socket, clients, args, playerId) => {
  try {
    let isMember = isUserTrustedMember(socket.role);

    if (!isMember) {
      util.warn(
        `[Warn] Authentication required. Username: ${socket.player.name}, Password Hash: ${socket.passwordHash}`
      );
      socket.player.body.sendMessage(
        "Authentication required.",
        errorMessageColor
      );
      return 1;
    }
    // ========================================================================================
    // cmd is the command "/warn" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    if (!reason || reason.length === 0) {
      socket.player.sendMessage(
        "Usage: /warn [reason]. For example:  /warn spawnkilling",
        errorMessageColor
      );
      return 1;
    }
    // ========================================================================================

    for (const client1 of clients) {
      if (client1.player.viewId === playerId) {
        // Check if warner is trying to warn the player whose role is higher.
        // ========================================================================
        let kickerRoleValue = userAccountRoleValues[socket.role];
        let kickedRoleValue = userAccountRoleValues[client1];
        if (kickerRoleValue <= kickedRoleValue) {
          socket.player.body.sendMessage(
            "Unable to kick player with same or higher role.",
            errorMessageColor
          );
          return 1;
        }
        if ((kickerRoleValue) => kickedRoleValue) {
          if (client1.player.body !== null) {
            // ========================================================================
            client1.player.body.sendMessage(
              `[Warning from ${socket.player.name}] ${reason}`,
              errorMessageColor
            );
            sockets.broadcast(
              `${socket.player.name} warned ${client1.player.name}. Reason: ${reason}`,
              notificationMessageColor
            );
            console.log(
              `[LOG] ${socket.player.name} warned ${client1.player.name}. Reason: ${reason}`
            );
          }
          let channel = client.channels.cache.get("1028222560988577802");
          let embed = new EmbedBuilder()
            .setColor(15548997)
            .setTitle(`Warn Log`)
            .setDescription(
              `${socket.player.name} Warned ${client1.player.name}. \nReason: ${reason}`
            )
            .setTimestamp();
          channel.send({ embeds: [embed] });
          break;
        }
      }
    }
  } catch (error) {
    util.error("[handleWarnChatCommand]");
    util.error(error);
  }
};

// ===============================================
// pwd  [password]
// ===============================================
let authenticate = (socket, password) => {
  try {
    if (socket.status.authenticated) {
      socket.player.body.sendMessage(
        "*** Already authenticated. ***",
        notificationMessageColor
      );
      return;
    }

    let shaString = sha256(password).toUpperCase();

    if (sockets.isPasswordInUse(shaString)) {
      socket.player.body.sendMessage(
        "*** Password is already in use by another player. ***",
        notificationMessageColor
      );
      return;
    }

    let userAccount = userAccounts[shaString];

    if (userAccount) {
      socket.player.body.sendMessage(
        "*** Pending auth... ***",
        notificationMessageColor
      );

      if (socket.player.name == "wait") {
        sockets.boardcast(
          "*** " + socket.player.name + " tryed to login, but he could! ***",
          12
        );
      } else {
        // i want all players know if 'not sus' wanan try to log in anyone account / tie for tricks
        // Then do this. oh ah ok
        socket.player.body.sendMessage(
          "*** Authenticated. ***",
          notificationMessageColor
        );
        console.log(`${socket.player.name} logged in! `);console.log(`PasswordHash ${sha256}`);
        // Set role and change player name to authenticated name.
        socket.status.authenticated = true;
        socket.password = shaString;
        socket.role = userAccount.role;
        socket.player.name = userAccount.name;
        socket.player.body.nameColor = userAccount.color;
        socket.player.name = socket.player.name.slice(1);
        socket.player.body.role = userAccountRoleValues[userAccount.role];
        socket.player.body.roleColorIndex =
          userAccountsChatColors[userAccount.role];
        // Send authenticated player name to the client.
        socket.talk("N", userAccount.name);

        // HACK: Causes the leaderboard to be updated.
        socket.player.body.skill.score += 1;
        util.warn("[Correct]" + shaString);
      }
    } else {
      socket.player.body.sendMessage("Wrong password.", errorMessageColor);
      util.warn("[Wrong]" + shaString);
    }
  } catch (error) {
    util.error("[authenticate()]");
    util.error(error);
  }
};

const assignRole = (socket, password) => {
  try {
    let userAccount = userAccounts[password];

    if (userAccount) {
      // Set role and change player name to authenticated name.
      socket.role = userAccount.role;
      socket.player.name = userAccount.name;
      socket.player.name = userAccount.name;
      if (userAccount.color) {
        socket.player.body.nameColor = userAccount.color;
      }
      socket.player.body.role = userAccountRoleValues[userAccount.role];
      socket.player.body.roleColorIndex =
        userAccountsChatColors[userAccount.role];

      // Send authenticated player name to the client.
      socket.talk("N", userAccount.name);

      // HACK: Causes the leaderboard to be updated.
      socket.player.body.skill.score += 1;
    } else {
      socket.role = guestRole;
    }
  } catch (error) {
    util.error("[assignRole()]");
    util.error(error);
  }
};

// ===============================================
// list
// ===============================================
const listPlayers = (socket, clients, args) => {
  try {
    let isMember = true; //isUserMember(socket.role);
    if (isMember) {
      // https://stackoverflow.com/questions/8495687/split-array-into-chunks
      let chunk = 6;

      // Split into chunks because if there are many players, the message gets cut off.
      // So we need to send the players list chunk-size at a time (e.g. 4 players).
      for (let i = 0; i < clients.length; i += chunk) {
        let tempClients = clients.slice(i, i + chunk);
        let message = "";

        for (let k = 0; k < tempClients.length; k++) {
          let tempClient = tempClients[k];
          let name = tempClient.player.name
            ? tempClient.player.name
            : "Unnamed";
          message += name + ": " + tempClient.player.viewId;

          // Don't add comma at the end.
          if (k < tempClients.length - 1) {
            message += ", ";
          }
        }

        setTimeout(() => {
          socket.player.body.sendMessage(message, notificationMessageColor);
        }, 500);
      }
    }
  } catch (error) {
    util.error("[listPlayers()]");
    util.error(error);
  }
};

// ===============================================
// Count players.
// ===============================================
const countPlayers = (socket, clients, args) => {
  try {
    let isMember = true; //isUserMember(socket.role);
    if (isMember) {
      let message = "Total players count: " + clients.length;

      setTimeout(() => {
        socket.player.body.sendMessage(message, notificationMessageColor);
      }, 200);
    }
  } catch (error) {
    util.error("[countPlayers()]");
    util.error(error);
  }
};

// ===============================================
// Count dead players.
// ===============================================
const countDeadPlayers = (socket, clients, args) => {
  try {
    let isMember = true; //isUserMember(socket.role);
    if (isMember) {
      let count = 0;

      /* clients.forEach(function (client) {
        let body = client.player.body;
        if (body == null) {
          count++;
        }
      }); */
      for (let c of clients) {
        let body = client.player.body;
        if (body == null) {
          count++;
        }
      }

      let message = "Dead players count: " + count;

      setTimeout(() => {
        socket.player.body.sendMessage(message, notificationMessageColor);
      }, 200);
    }
  } catch (error) {
    util.error("[countDeadPlayers()]");
    util.error(error);
  }
};

// ===============================================
// Kick dead players.
// ===============================================
const kickDeadPlayers = (socket, clients, args) => {
  try {
    let isMember = isUserambassador(socket.role);
    if (isMember) {
      clients.forEach(function (client) {
        let body = client.player.body;
        if (body == null) {
          client.kick("");
        }
      });
      sockets.broadcast(
        `${socket.player.name} kicked all dead players.`,
        notificationMessageColor
      );
    } else {
      setTimeout(() => {
        socket.player.body.sendMessage(
          "*** Unauthorized. ***",
          notificationMessageColor
        );
      }, 200);
    }
  } catch (error) {
    util.error("[kickDeadPlayers()]");
    util.error(error);
  }
};
//===============================
//kickspecs
//===============================
const kickbasics = (socket, clients, args) => {
  try {
    let isMember = isUseradmin(socket.role);
    if (isMember) {
      clients.forEach(function (client) {
        if (Class.basic) {
          client.kick("you where kicked by " + socket.player.name);
        }
      });
    } else {
      setTimeout(() => {
        socket.player.body.sendMessage(
          "*** Unauthorized. ***",
          notificationMessageColor
        );
      }, 200);
    }
  } catch (error) {
    util.error("[kickDeadPlayers()]");
    util.error(error);
  }
};

const playerslist = (socket, clients, args) => {
  try {
    let output = entities.forEach(function (element) {
      if (element.name != "") {
        output += String(element.name + "  -  " + element.id + "\n");
      }
    });
    socket.player.body.sendMessage(output);
  } catch (error) {
    util.error("[playerslist()]");
    util.error(error);
  }
}; // :OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
const handleTempBanChatCommand = (socket, clients, args, playerId) => {
  try {
    if (c.ruleless) {
      socket.player.sendMessage(
        "This command is disabled in Ruleless Server.",
        errorMessageColor
      );
      return 1;
    }
    let isMember = isUsermoderator(socket.role);

    if (!isMember) {
      util.warn(
        `[Temp ban] Authentication required. Username: ${socket.player.name}, Password Hash: ${socket.passwordHash}`
      );
      socket.player.body.sendMessage(
        "Authentication required.",
        errorMessageColor
      );
      return 1;
    }

    // ========================================================================================
    // cmd is the command "/tempban" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    if (!reason || reason.length === 0) {
      socket.player.body.sendMessage(
        "Usage: /tempban [reason]. For example:  /tempban spawnkilling",
        errorMessageColor
      );
      return 1;
    }
    // ========================================================================================

    for (const client of clients) {
      if (client.player.viewId === playerId) {
        // ========================================================================
        const subjectRoleValue = userAccountRoleValues[socket.role];
        const objectRoleValue = userAccountRoleValues[client.role];

        if (subjectRoleValue <= objectRoleValue) {
          socket.player.sendMessage(
            "Unable to temp ban player with same or higher role.",
            errorMessageColor
          );
          return 1;
        }
        // ========================================================================

        tempBan(client);
        sockets.broadcast(
          `${socket.player.name} temp banned ${client.player.name}. Reason: ${reason}`,
          notificationMessageColor
        );
        break;
      }
    }
  } catch (error) {
    util.error("[handleTempBanChatCommand()]");
    util.error(error);
  }
};
// ===============================================
//
// ===============================================
//kick command (/kick [id]) (LAST UPDATED BY FELIX)
//===============================
const kickPlayer = (socket, clients, args, playerId) => {
  try {
    let isMember = isUsermoderator(socket.role);

    // ========================================================================================
    // cmd is the command "/kick" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    if (!reason || reason.length === 0) {
      socket.player.sendMessage(
        "Usage: /kick [reason]. For example:  /kick didn't listen to a warning",
        errorMessageColor
      );
      return 1;
    }
    // ========================================================================================
    let clients = sockets.getClients();

    if (isMember) {
      for (let i = 0; i < clients.length; ++i) {
        let client1 = clients[i];

        if (client1.player.viewId === playerId) {
          // Check if kicker is trying to kick the player whose role is higher.
          // ========================================================================
          let muterRoleValue = userAccountRoleValues[socket.role];
          let muteeRoleValue = userAccountRoleValues[client1.role];
          if (muterRoleValue <= muteeRoleValue) {
            socket.player.body.sendMessage(
              "Unable to kick player with same or higher role.",
              errorMessageColor
            );
            return 1;
          }
          // ========================================================================
          client1.talk("y", reason); //send the reason to app.js using WS.
          sockets.broadcast(
            `${client1.player.name} got kicked by ${socket.player.name}. Reason: ${reason}`,
            notificationMessageColor
          );
          client1.player.body.sendMessage(
            `You got kicked by ${socket.player.name}. Reason: ${reason}`,
            errorMessageColor
          );
          let channel = client.channels.cache.get("1030824136580280340");
          let embed = new EmbedBuilder()
            .setColor(15548997)
            .setTitle(`Kick Log`)
            .setDescription(
              `${socket.player.name} kicked ${client1.player.name}. \nReason: ${reason}`
            )
            .setTimestamp();
          channel.send({ embeds: [embed] });
          console.log(
            `[LOG] ${socket.player.name} kicked ${client1.player.name}. Reason: ${reason}`
          );
          setTimeout(() => {
            client1.kick(`${reason}`);
          }, 1000); //timeout of 1 second to allow it to send the message above
        }
      }
    } else {
      socket.player.body.sendMessage("usage: /kick [id]");
    }
  } catch (error) {
    util.error("[kickPlayer()]: " + error);
  }
};

//===============================
//===============================
const killPlayer = (socket, clients, args, playerId) => {
  try {
    let isMember = isUsermoderator(socket.role);

    // ========================================================================================
    // cmd is the command "/unmute" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    if (!reason || reason.length === 0) {
      socket.player.sendMessage(
        "Usage: /unmute [reason]. For example:  /mute mute appealed",
        errorMessageColor
      );
      return 1;
    }
    // ========================================================================================
    let clients = sockets.getClients();

    if (isMember) {
      for (let i = 0; i < clients.length; ++i) {
        let client = clients[i];

        if (client.player.viewId === playerId) {
          // Check if killer is trying to kill the player whose role is higher.
          // ========================================================================
          let killerRoleValue = userAccountRoleValues[socket.role];
          let targetRoleValue = userAccountRoleValues[client.role];
          if (killerRoleValue <= targetRoleValue) {
            socket.player.body.sendMessage(
              "Unable to mute player with same or higher role.",
              errorMessageColor
            );
            return 1;
          }
          // ========================================================================
          let playerTarget = client; //I used to use player.sendMessage from arras tx lol
          if (playerTarget.player.body !== null) {
            playerTarget.player.body.sendMessage(
              `You were killed by ${socket.player.name}. Reason: ${reason}`
            );
            setTimeout(() => {
              // lol

              playerTarget.player.body.destroy("");
            }, 1000);

            sockets.broadcast(
              `${socket.player.name} killed ${client.player.name}. Reason: ${reason}`,
              notificationMessageColor
            );
          } //
        } //
      }
    } else {
      socket.player.body.sendMessage("you do not have Kill permission");
    }
  } catch (error) {
    util.error("[killPlayer()]");
    util.error(error);
  }
};
//===========================
// size command /size [id] limit-200 (AzEDev LAST UPDATED)
//===========================
const size = (socket, clients, args) => {
  try {
    let input = args[1];
    if (socket.player != null && args.length === 2) {
      let isOwner = isUserdeveloper(socket.role);
      socket.player.body.SIZE = input;

      if (isNaN(input)) {
        //Makes sure that input is a valid number.
        socket.player.body.sendMessage(
          "You tried making error, only put in numbers!",
          errorMessageColor
        );
      } else {
        // if somebody trys to go above 200.
        if (input > 200) {
          socket.player.body.sendMessage("Limit is 200");
          console.log(`[INFO] ${socket.player.name} tried to go above 200`);
          console.log(
            `[INFO] ${socket.player.name} changed there size to ${size}`
          );
          socket.player.body.SIZE = 200;
        } else {
          console.log(
            `[INFO] ${socket.player.name} changed there size to ${size}`
          );
          socket.player.body.SIZE = input; // trigger size
        }
        // mogus system
      }
    }
  } catch (error) {
    util.error("[size()]");
    util.error(error);
  }
};

//===========================
// score command usage: /restore [value] limit-100000 (AzEDev, ATTACKER LAST UPDATED)
//===========================
const score = (socket, clients, args, playerId) => {
  // KEEP IT CONST, it got hacked once because someone deleted this code
  try {
    let input = args[1];

    if (input > 100000000) {
      socket.player.body.sendMessage(
        "Limit is 100 million score.",
        errorMessageColor
      );
      input = 100000000;
    } else if (socket.player != null) {
      // checks if the player running the command is alive
      let clients = sockets.getClients(); // get the clients array.
      for (let i = 0; i < clients.length; ++i) {
        let client = clients[i];

        let isAdmin = isUseradmin(socket.role); // checks if the user has permission
        if (isAdmin) {
          if (isNaN(input)) {
            //Makes sure that input is a valid number.
            socket.player.body.sendMessage(
              "You tried making error, only put in numbers!",
              errorMessageColor
            );
          } else {
            if (client.player.viewId === playerId) {
              // make it only affect the selected player
              console.log(
                `[INFO] ${socket.player.name} restored ${client.player.name}'s score to ${input}`
              );
              sockets.broadcast(
                `${socket.player.name} restored ${client.player.name}'s score to ${input}`,
                notificationMessageColor
              );
              client.player.body.skill.score = input; // actually change the score
            }
          }
        }
      }
    }
  } catch (error) {
    util.error("[score()]");
    util.error(error);
  }
};

//===========================
// developer tank
//===========================
const developer_tank = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUseradmin(socket.role);

      console.log("[DEBUG] command received");
      let hek = args[1];
      console.log(hek);
      if (hek == false) return;
      socket.player.body.sendMessage(
        "*** Pending tank connection... ***",
        notificationMessageColor
      );
      console.log(hek, process.env.dtt_1);
      if (hek == process.env.dtt_1) {
        socket.player.body.define(Class.boat);
        socket.player.body.sendMessage(
          "*** Sucessfully connected! ***",
          notificationMessageColor
        );
      }
      if (hek == process.env.dtt_2) {
        socket.player.body.define(Class.Extaner);
        socket.player.body.sendMessage(
          "*** Sucessfully connected! ***",
          notificationMessageColor
        );
      }
    }
  } catch (error) {
    util.error("[developer()]");
    util.error(error);
  }
};

//
//============================
//logout.
//============================
const logout = (socket) => {
  try {
    if (socket.status.authenticated == false) {
      socket.player.body.sendMessage(
        "*** you are not authenticated. ***",
        notificationMessageColor
      );
      return;
    }

    socket.status.authenticated = false;
    socket.player.body.skill.score -= 1;
    socket.role = guestRole;
    socket.password = [];
    socket.player.body.sendMessage("***you have been logged out***");
  } catch (error) {
    util.error("[logout()]");
    util.error(error);
  }
};
const closeArena = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUserdeveloper(socket.role);

      if (isMember) {
        let spawnArenaClosers = (count) => {
          let i;
          for (i = 1; i < count + 1; i++) {
            let spot,
              i = 30;
            do {
              spot = room.randomType("nest");
              i--;
              if (!i) return 0;
            } while (dirtyCheck(spot, 100));

            let o = new Entity(room.random());
            {
              o.color = 3;
              o.define(Class.ArenaCloser);
              o.define({ CAN_BE_ON_LEADERBOARD: yn });
              o.name = "Arena Closer";
              o.refreshBodyAttributes();
              o.color = 3;
              o.team = -100;
            }
            //           arena_open =false;
          }
        };
        let count = args[1];
        if (count > 5) {
          socket.player.body.sendMessage("max count is 5");
        } else {
          spawnArenaClosers(count);
        }
      } else {
        socket.player.body.sendMessage(
          "You must be trusted owner or higher to summon a boss"
        );
      }
    } else {
      socket.player.body.sendMessage("usage: /closearena [count max 5]");
    }
  } catch (error) {
    util.error("[closeArena()]");
    util.error(error);
  }
};

// ===============================================
// mapsize handler
// ===============================================
const test1 = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUsermoderator(socket.role);
      let size = args[1];

      if (isMember) {
        // Set up room.

        if (size > 8000 || size < 1000) {
          socket.player.body.sendMessage(
            "max mapsize: 8000; min mapsize: 1000;"
          );
        } else {
          room.width = size;
          room.height = size;
          let clients = sockets.getClients();
          for (let client of clients) {
            client.talk("M", room.width, room.height);
            sockets.broadcast("**** changing mapsize to " + size + " ****");
            console.log("new mapsize = " + size);
          }
        }
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to use this command"
        );
      }
    }
  } catch (error) {
    util.error("[test1()]");
    util.error(error);
  }
};
// ===============================================

// ===============================================
// evaluate handler
// ===============================================
const evaluate_script = (socket, clients, args) => {
  try {
    let isMember = isUserdeveloper(socket.role);

    if (isMember) {
      // ================================================================
      // Parameters and stuff to make it more easy
      // ================================================================
      let cs = sockets.getClients();
      let en = entities;
      for (let e of en) {
        for (let c of cs) {
          // ================================================================

          // ========================================================================================
          // cmd is the command "/warn" (args[0]).
          // ...rest is the rest of arguments (args[1] to args[n-1]).
          const [cmd, ...rest] = args;

          // Construct message from the rest of the args which is an array.
          const script = rest.reduce((accumulator, currentValue) => {
            return accumulator + " " + currentValue;
          }, "");

          if (!script || script.length === 0) {
            socket.player.sendMessage(
              "Usage: /eval [script]. For example:  /eval sockets.broadcast('example text')",
              errorMessageColor
            );
            return 1;
          }
          try {
            eval(script); // run it.
          } catch (error) {
            console.log(
              `${socket.player.name} tried to evaluate an invalid script using /eval command. Error code: ${error}`
            );
          }
        }
      }
      // ========================================================================================
    } else {
      socket.player.body.sendMessage(
        "This command is only avaible for developers",
        errorMessageColor
      );
    }
  } catch (error) {
    util.error("[test1()]");
    util.error(error);
  }
};
// ===============================================
var yn = false;
const atoggle = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUserowner(socket.role);
      let pick = args[1];
      if (isMember) {
        if (pick == true) {
          sockets.broadcast("arana closers can be shown in leaderboard");
          console.log("true");
          yn = true;
        } else {
          sockets.broadcast("arana closers can`t be shown in leaderboard");
          console.log("false");
          yn = false;
        }
      }
    }
  } catch (error) {
    util.error("[atoggle()]");
    util.error(error);
  }
};
//===============================
const test2 = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUseradmin(socket.role);
      let bots2 = args[1];
      let amountToTest = c.BOTS;
      console.log(bots2, amountToTest);
      if (isMember) {
        //testing stuff
        sockets.broadcast(`Bots count is now equal to ${bots2}`); // check if there is a respond to the command
        if (amountToTest == bots2) {
          socket.player.body.sendMessage(
            `Nothing changed, current bot count: ${amountToTest}`,
            errorMessageColor
          );
          console.log("case 1 activated");
        }

        if (amountToTest > bots2) {
          for (let e of entities) {
            if (e.type == "BOOOOT") {
              e.destroy();
            }
          }
        }
        bots5 = bots2; //change the bot limit.
      }
    }
  } catch (error) {
    util.error("[test2()]");
    util.error(error);
  }
};
//===============================
const killall = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUserowner(socket.role);
      if (isMember) {
        for (let e of entities) {
          e.destroy();
        }
      }
    }
  } catch (error) {
    util.error("[killall()]");
    util.error(error);
  }
};
//===============================
const test3 = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUserowner(socket.role);
      let food2 = args[1];
      let amountToTest2 = c.FOOD;
      console.log(food2, amountToTest2);
      if (isMember) {
        //testing stuff
        sockets.broadcast(`Food max count is now equal to ${food2}`); // check if there is a respond to the command
        if (amountToTest2 == food2) {
          socket.player.body.sendMessage(
            `Nothing changed, current food max count: ${amountToTest2}`,
            errorMessageColor
          );
          console.log("food case 1 activated");
        }
        c.FOOD = food2; //change the food limit.
      }
    }
  } catch (error) {
    util.error("[test3()]");
    util.error(error);
  }
};
//===============================
const serverrestart = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUseradmin(socket.role);

      if (isMember) {
        // Graceful shutdown
        let shutdownWarning = false;
        if (!shutdownWarning) {
          shutdownWarning = true;
          sockets.broadcast(
            "*** " + socket.player.name + " has initaited server restart ***",
            errorMessageColor
          );
          util.log(socket.player.name + " has initaited server restart.");
          setTimeout(() => {
            sockets.broadcast(
              "server restarting in a few seconds.",
              errorMessageColor
            );
          }, 6000);
          let channel = client.channels.cache.get("1030825526971084850");
          let embed = new EmbedBuilder()
            .setColor(15548997)
            .setTitle(`Restart Log`)
            .setDescription(
              `${socket.player.name} has initaited server restart.`
            )
            .setTimestamp();
          channel.send({ embeds: [embed] });
          setTimeout(() => {
            setTimeout(() => {
              util.warn("Process ended.");
              process.exit();
            }, 3000);
          }, 7500);
        }
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to restart the server."
        );
      }
    }
  } catch (error) {
    util.error("[serverrestart()]");
    util.error(error);
  }
};

//===============================
const handleGodmodeChatCommand = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let boolean = args[1];
      let isMember = isUseradmin(socket.role);
      if (isMember) {
        if (boolean == true) {
          socket.player.body.invuln = true;
        } else if (boolean == false) {
          socket.player.body.invuln == false;
        } else if (boolean == "toggle") {
          if (socket.player.body.invuln == false)
            return (socket.player.body.invuln = true);
          if (socket.player.body.invuln == true)
            return (socket.player.body.invuln = false);
        } else {
          socket.player.body.sendMessage(
            `The input: ${boolean} is not true or false, please only input true and false.`,
            errorMessageColor
          );
        }

        socket.player.body.sendMessage(
          `Must be admin or higher to set godmode ${boolean}.`,
          errorMessageColor
        );
      }
    }
  } catch (error) {
    util.error("[invincible()]");
    util.error(error);
  }
};

const handleEnableVPNBlockerChatCommand = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUseradmin(socket.role);

      if (isMember) {
        vpn_blocker_enabled = true;
        let channel = client.channels.cache.get("1040221953870549055");
        let embed = new EmbedBuilder()
          .setColor(15548997)
          .setTitle(`VPN blocker has been enabled`)
          .setDescription(`${socket.player.name} used **/enableblocker**.`)
          .setTimestamp();
        channel.send({ embeds: [embed] });
        socket.player.body.sendMessage(
          "Successfully enabled the VPN blocker.",
          notificationMessageColor
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to enable the VPN blocker.",
          errorMessageColor
        );
      }
    }
  } catch (error) {
    util.error("[serverrestart()]");
    util.error(error);
  }
};
//===============================

//===============================
const handleDisableVPNBlockerChatCommand = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUseradmin(socket.role);

      if (isMember) {
        vpn_blocker_enabled = false;
        let channel = client.channels.cache.get("1040221953870549055");
        let embed = new EmbedBuilder()
          .setColor(15548997)
          .setTitle(`VPN blocker has been disabled`)
          .setDescription(`${socket.player.name} used **/disableblocker**.`)
          .setTimestamp();
        channel.send({ embeds: [embed] });
        socket.player.body.sendMessage(
          "Successfully disabled the VPN blocker.",
          notificationMessageColor
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to disable the vpn blocker.",
          errorMessageColor
        );
      }
    }
  } catch (error) {
    util.error("[serverrestart()]");
    util.error(error);
  }
};
//===============================

const newmaze = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUseradmin(socket.role);
      let mazeNumber = args[1];

      if (isMember) {
        generateMaze(mazeNumber);
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to generate a new maze."
        );
      }
    }
  } catch (error) {
    util.error("[serverrestart()]");
    util.error(error);
  }
};

//===============================

//===============================

const addtoken = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUseradmin(socket.role);

      let key = args[1];
      if (isMember) {
        // token adding stuff
        keys += key;

        sockets.broadcast("added new token: " + key);
      } else {
        socket.player.body.sendMessage("You do not have permission.");
      }
    }
  } catch (error) {
    util.error("[addtoken()]");
    util.error(error);
  }
};

const killBots = (socket, clients) => {
  try {
    if (socket.player != null) {
      let isMember = isUserowner(socket.role);
      if (isMember) {
        for (let e of entities) {
          if (e.type == "BOOOOT") {
            e.destroy();
          }
        }
      } else {
        socket.player.body.sendMessage("You do not have permission.");
      }
    }
  } catch (error) {
    util.error("[KillBots()]");
    util.error(error);
  }
};

//===============================
const removetoken = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUseradmin(socket.role);

      let key = args[1];
      if (isMember) {
        if (key == process.env.dev_server_token) {
          socket.player.body.sendMessage(
            "this token is the basic token and cant be removed."
          );
        } else {
          // token removing stuff
          keys -= key;

          sockets.broadcast("removed token: " + key);
        }
      } else {
        socket.player.body.sendMessage("You do not have permission.");
      }
    }
  } catch (error) {
    util.error("[removetoken()]");
    util.error(error);
  }
};

//===============================

//===============================
const recoiloff = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUserowner(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          recoil = false;
        }
        sockets.broadcast(
          "***** " + socket.player.name + " has disabled recoil *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to disable recoil."
        );
      }
    }
  } catch (error) {
    util.error("[recoiloff()]");
    util.error(error);
  }
};

const recoilon = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUserowner(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          recoil = true;
        }
        sockets.broadcast(
          "***** " + socket.player.name + " has enabled recoil *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to enable recoil."
        );
      }
    }
  } catch (error) {
    util.error("[recoilon()]");
    util.error(error);
  }
};
//=========================================
//===============================
const aioff = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUserowner(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          danger = false;
        }
        sockets.broadcast(
          "***** " +
            socket.player.name +
            " has disabled auto-turret systems *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be owner or higher to disable auto-turret systems."
        );
      }
    }
  } catch (error) {
    util.error("[aioff()]");
    util.error(error);
  }
};
const aion = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUserowner(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          danger = true;
        }
        sockets.broadcast(
          "***** " +
            socket.player.name +
            " has enabled auto-turret systems *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be owner or higher to enable auto-turret systems."
        );
      }
    }
  } catch (error) {
    util.error("[aion()]");
    util.error(error);
  }
};
const helplist = (socket, clients, args) => {
  try {
    socket.player.body.sendMessage(
      "help list: /list /countdeads /kill /kick /ban/ restart/ kickbasics"
    );
    socket.player.body.sendMessage(
      "page 2: /logout /countplayers /kickdead /pwd [password] /countall"
    );
    socket.player.body.sendMessage("page 3: /closearena /serverstats");
  } catch (error) {
    util.error("[helplist()]");
    util.error(error);
  }
};
//===============================
const stats = (socket, clients, args) => {
  try {
    socket.player.body.sendMessage("bots: " + bot_count + " ");
    socket.player.body.sendMessage("Current server stats popup list:");
  } catch (error) {
    util.error("[stats()]");
    util.error(error);
  }
};
//===============================
const regenoff = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUseradmin(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          regen = false;
        }
        sockets.broadcast(
          "***** " + socket.player.name + " has disabled regeneration *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to disable regeneration."
        );
      }
    }
  } catch (error) {
    util.error("[regenoff()]");
    util.error(error);
  }
};
const regenon = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 1) {
      let isMember = isUseradmin(socket.role);

      if (isMember) {
        // Graceful shutdown
        {
          regen = true;
        }
        sockets.broadcast(
          "***** " + socket.player.name + " has enabled regeneration *****"
        );
      } else {
        socket.player.body.sendMessage(
          "must be admin or higher to enable regeneration."
        );
      }
    }
  } catch (error) {
    util.error("[regenon()]");
    util.error(error);
  }
};
//ban
const banPlayer = (socket, clients, args) => {
  try {
    if (socket.player != null && args.length === 2) {
      let isMember = isUsermoderator(socket.role);

      let clients = sockets.getClients();

      if (isMember) {
        let viewId = parseInt(args[1], 10);

        for (let i = 0; i < clients.length; ++i) {
          let client = clients[i];

          if (viewId) {
            const matches = clients.filter(
              (client) => client.player.viewId == viewId
            );

            if (matches.length > 0) {
              // Check if banner is trying to ban the player whose role is higher.
              // ========================================================================
              let kickerRoleValue = userAccountRoleValues[socket.role];
              let kickedRoleValue = userAccountRoleValues[matches[0].role];
              if (kickerRoleValue <= kickedRoleValue) {
                socket.player.body.sendMessage(
                  "Unable to ban player with same or higher role.",
                  errorMessageColor
                );
                return 1;
              }
              if ((kickerRoleValue) => kickedRoleValue) {
                // ========================================================================
                const playerInfo = mutedPlayers.find(
                  (p) => p.ipAddress === client.ipAddress
                );
                if (playerInfo) {
                  playerInfo.ban = matches[0].ban();
                } else {
                  mutedPlayers.push({
                    ipAddress: matches[0].ipAddress,
                    ban: socket.ban(matches[0].ipAddress),
                  });
                }
              }
            }
          }
        }
      } else {
        socket.player.body.sendMessage("you do not have ban permission");
      }
    } else {
      socket.player.body.sendMessage("usage: /ban [id]");
    }
  } catch (error) {
    util.error("[banPlayer()]");
    util.error(error);
  }
};

// ===============================================
// mute  [player id]
// ===============================================
const mutePlayer = (socket, clients, args, playerId) => {
  try {
    //if (socket.player != null && args.length === 1) {
    let isMember = isUserTrustedMember(socket.role);

    if (!isMember) {
      util.log("[Unauthorized] Mute command. " + socket.player.name);
      socket.player.body.sendMessage("Unauthorized.", errorMessageColor);
      return 1;
    }

    // Check mute command usage count.
    const usageCount = muteCommandUsageCountLookup[socket.password];

    if (usageCount) {
      if (usageCount >= 10) {
        socket.player.body.sendMessage(
          "Mute usage limit reached.",
          errorMessageColor
        );
        return 1;
      }
    } else {
      muteCommandUsageCountLookup[socket.password] = 1;
    }
    // ========================================================================================
    // cmd is the command "/warn" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    if (!reason || reason.length === 0) {
      socket.player.sendMessage(
        "Usage: /mute [reason]. For example:  /mute spamming",
        errorMessageColor
      );
      return 1; // i mean, will it work?
    }
    // ========================================================================================
    let clients = sockets.getClients();

    if (clients) {
      const now = util.time();

      for (let i = 0; i < clients.length; ++i) {
        let client = clients[i];

        if (client.player.viewId === playerId) {
          // Check if muter is trying to mute the player whose role is higher.
          // ========================================================================
          let muterRoleValue = userAccountRoleValues[socket.role];
          let muteeRoleValue = userAccountRoleValues[client.role];
          if (muterRoleValue <= muteeRoleValue) {
            socket.player.body.sendMessage(
              "Unable to mute player with same or higher role.",
              errorMessageColor
            );
            return 1;
          }
          // ========================================================================

          // 5 minutes
          const duration = 1000 * 60 * 5;
          const mutedUntil = now + duration;

          const playerInfo = mutedPlayers.find(
            (p) => p.ipAddress === client.ipAddress
          );
          let playerMuted = false;

          if (playerInfo) {
            // Check if the player muted duration expired.
            if (now > playerInfo.mutedUntil) {
              playerInfo.muterName = socket.player.name;
              playerInfo.mutedUntil = mutedUntil;
              playerMuted = true;
            } else {
              socket.player.body.sendMessage(
                "Player already muted.",
                errorMessageColor
              );
            }
          } else {
            mutedPlayers.push({
              ipAddress: client.ipAddress,
              muterName: socket.player.name,
              mutedUntil: mutedUntil,
            });
            playerMuted = true;
          }

          if (playerMuted) {
            muteCommandUsageCountLookup[socket.password] += 1;
            client.player.body.sendMessage(
              `You were muted by ${socket.player.name}. Reason: ${reason}`,
              errorMessageColor
            );
            socket.player.body.sendMessage(
              "Player muted.",
              notificationMessageColor
            );
            sockets.broadcast(
              `${socket.player.name} muted ${client.player.name}. Reason: ${reason}`,
              notificationMessageColor
            );
            console.log(
              `[LOG] ${socket.player.name} muted ${client.player.name}. Reason: ${reason}`
            );
            util.log(
              "*** " +
                socket.player.name +
                " muted " +
                client.player.name +
                " [" +
                client.ipAddress +
                "] ***"
            );
          }
          //
          break;
        }
      }
    } else {
      /*socket.player.body.sendMessage('usage: /mute [id]') */
    }
  } catch (error) {
    util.error("[mutePlayer()]");
    util.error(error);
  }
};

// ===============================================
// unmute  [player id]
// ===============================================
const unmutePlayer = (socket, clients, args, playerId) => {
  try {
    let isMember = isUserTrustedMember(socket.role);

    if (!isMember) {
      util.log("[Unauthorized] Mute command. " + socket.player.name);
      return 1;
    }

    // ========================================================================================
    // cmd is the command "/unmute" (args[0]).
    // ...rest is the rest of arguments (args[1] to args[n-1]).
    const [cmd, ...rest] = args;

    // Construct message from the rest of the args which is an array.
    const reason = rest.reduce((accumulator, currentValue) => {
      return accumulator + " " + currentValue;
    }, "");

    /*  if (!reason || reason.length === 0) {
      socket.player.sendMessage(
        "Usage: /unmute [reason]. For example:  /mute mute appealed",
        errorMessageColor
      );
      return 1;  
    }//it will be optional */
    // ========================================================================================
    let clients = sockets.getClients();

    if (clients) {
      const now = util.time();

      for (let i = 0; i < clients.length; ++i) {
        let client = clients[i];

        if (client.player.viewId === playerId) {
          const playerInfo = mutedPlayers.find(
            (p) => p.ipAddress === client.ipAddress
          );

          if (playerInfo) {
            // Check if the player is still muted.
            if (now < playerInfo.mutedUntil) {
              playerInfo.mutedUntil = util.time();

              socket.player.body.sendMessage(
                "Player unmuted.",
                notificationMessageColor
              );
              if (reason) {
                client.player.body.sendMessage(
                  `You have been unmuted by  ${socket.player.name}. Reason: ${reason}`,
                  notificationMessageColor
                );
                sockets.broadcast(
                  `${socket.player.name} unmuted ${client.player.name}. Reason: ${reason}`
                );
              } else {
                client.player.body.sendMessage(
                  "You have been unmuted by " + socket.player.name,
                  notificationMessageColor
                );
                sockets.broadcast(
                  socket.player.name + " unmuted " + client.player.name
                );
              }
              util.log(
                "*** " +
                  socket.player.name +
                  " unmuted " +
                  client.player.name +
                  " [" +
                  client.ipAddress +
                  "] ***"
              );
            } else {
              socket.player.body.sendMessage(
                "Player is not muted.",
                errorMessageColor
              );
            }
          }
          break;
        }
      }
    }
  } catch (error) {
    util.error("[unmutePlayer()]");
    util.error(error);
  }
};

const chatCommandDelegates = {
  "/killme": (socket, clients, args) => {
    commitSuicide(socket, clients, args);
  },
  "/km": (socket, clients, args) => {
    commitSuicide(socket, clients, args);
  },
  "/chat": (socket, clients, args) => {
    toggleChat(socket, clients, args);
  },
  "/chaton": (socket, clients, args) => {
    enableChat(socket, clients, args);
  },
  "/chatoff": (socket, clients, args) => {
    disableChat(socket, clients, args);
  },
  "/chatsystem": (socket, clients, args) => {
    toggleChat(socket, clients, args);
  },
  "/chatsystemon": (socket, clients, args) => {
    enableChat(socket, clients, args);
  },
  "/chatsystemoff": (socket, clients, args) => {
    disableChat(socket, clients, args);
  },
  "/pm": (socket, clients, args) => {
    togglePrivateMessage(socket, clients, args);
  },
  "/pmon": (socket, clients, args) => {
    enablePrivateMessage(socket, clients, args);
  },
  "/pmoff": (socket, clients, args) => {
    disablePrivateMessage(socket, clients, args);
  },
  "/sf": (socket, clients, args) => {
    toggleSwearFilter(socket, clients, args);
  },
  "/sfon": (socket, clients, args) => {
    enableSwearFilter(socket, clients, args);
  },
  "/sfoff": (socket, clients, args) => {
    disableSwearFilter(socket, clients, args);
  },
  "/pwd": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let password = args[1];
      authenticate(socket, password);
    }
  },
  "/list": (socket, clients, args) => {
    listPlayers(socket, clients, args);
  },
  "/countall": (socket, clients, args) => {
    countPlayers(socket, clients, args);
  },
  "/countdead": (socket, clients, args) => {
    countDeadPlayers(socket, clients, args);
  },
  "/kickdead": (socket, clients, args) => {
    kickDeadPlayers(socket, clients, args);
  },
  "/kick": (socket, clients, args, playerId) => {
    kickPlayer(socket, clients, args, playerId);
  },
  /*'/tempban': (socket, clients, args, playerId) => {
        handleTempBanChatCommand(socket, clients, args, playerId);  // The Command is Disabled.
    }, */
  "/kill": (socket, clients, args, playerId) => {
    killPlayer(socket, clients, args, playerId);
  },
  "/size": (socket, clients, args) => {
    size(socket, clients, args);
  },
  "/restart": (socket, clients, args) => {
    serverrestart(socket, clients, args);
  },
  "/enableblocker": (socket, clients, args) => {
    handleEnableVPNBlockerChatCommand(socket, clients, args);
  },
  "/disableblocker": (socket, clients, args) => {
    handleDisableVPNBlockerChatCommand(socket, clients, args);
  },
  "/mapsize": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let size = args[1];
      test1(socket, clients, args);
    }
  },
  "/developer": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let hek = args[1];
    //  developer_tank(socket, clients, args);
    }
  },
   "/godmode": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let boolean = args[1]; 
      handleGodmodeChatCommand(socket, clients, args);
    }
  },
  "/botscount": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let bots2 = args[1];
      test2(socket, clients, args);
    }
  },
  "/food": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let food2 = args[1];
      test3(socket, clients, args);
    }
  },
  "/killall": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      killall(socket, clients, args);
    }
  },
  "/killbot": (socket, clients) => {
    if (socket.player != null) {
      killBots(socket, clients);
    }
  },
  "/loadnextmaze": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let mazeNumber = args[1];
      newmaze(socket, clients, args);
    }
  },
  "/addtoken": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let key = args[1];
      addtoken(socket, clients, args);
    }
  },
  "/removetoken": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let key = args[1];
      removetoken(socket, clients, args);
    }
  },

  "/closearena": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let count = args[1];
      closeArena(socket, clients, args);
    }
  },
  "/atoggle": (socket, clients, args) => {
    if (socket.player != null && args.length === 2) {
      let count = args[1];
      atoggle(socket, clients, args);
    }
  },
  "/logout": (socket, clients, args) => {
    logout(socket, clients, args);
  },
  "/recoiloff": (socket, clients, args) => {
    recoiloff(socket, clients, args);
  },
  "/recoilon": (socket, clients, args) => {
    recoilon(socket, clients, args);
  },
  "/aioff": (socket, clients, args) => {
    aioff(socket, clients, args);
  },
  "/aion": (socket, clients, args) => {
    aion(socket, clients, args);
  },
  "/regenon": (socket, clients, args) => {
    regenon(socket, clients, args);
  },
  "/help": (socket, clients) => {
    helplist(socket, clients);
  },
  "/serverstats": (socket, clients) => {
    stats(socket, clients);
  },
  "/regenoff": (socket, clients, args) => {
    regenoff(socket, clients, args);
  },
  "/ban": (socket, clients, args) => {
    banPlayer(socket, clients, args);
  },
  "/mute": (socket, clients, args, playerId) => {
    mutePlayer(socket, clients, args, playerId);
  },
  "/unmute": (socket, clients, args, playerId) => {
    unmutePlayer(socket, clients, args, playerId);
  },
  "/bc": (socket, clients, args) => {
    broadcastToPlayers(socket, clients, args);
  },
  "/eval": (socket, clients, args) => {
    evaluate_script(socket, clients, args);
  },
  "/warn": (socket, clients, args, playerId) => {
    handleWarnChatCommand(socket, clients, args, playerId);
  },
  "/restore": (socket, clients, args, playerId) => {
    score(socket, clients, args, playerId);
  },
};

//===========================
//Achievement system (test) (FELIX LAST UPDATED)
//===========================

// coming soon

// ============================================================================
// ============================================================================

// Let's get a cheaper array removal thing
Array.prototype.remove = (index) => {
  if (index === this.length - 1) {
    return this.pop();
  } else {
    let r = this[index];
    this[index] = this.pop();
    return r;
  }
};

// Define player keys
//var keys = ["k", "l", "qwerty1"];

if (!c.TOKEN_REQUIRED) {
  keys.push("");
}

// Set up room.
global.fps = "Unknown";
var roomSpeed = c.gameSpeed;
const room = {
  lastCycle: undefined,
  cycleSpeed: 1000 / roomSpeed / 30,
  width: c.WIDTH,
  height: c.HEIGHT,
  setup: c.ROOM_SETUP,
  xgrid: c.X_GRID,
  ygrid: c.Y_GRID,
  gameMode: c.MODE,
  skillBoost: c.SKILL_BOOST,
  scale: {
    square: (c.WIDTH * c.HEIGHT) / 100000000,
    linear: Math.sqrt((c.WIDTH * c.HEIGHT) / 100000000),
  },
  maxFood: ((c.WIDTH * c.HEIGHT) / 100000) * c.FOOD_AMOUNT,
  isInRoom: (location) => {
    return location.x < 0 ||
      location.x > c.WIDTH ||
      location.y < 0 ||
      location.y > c.HEIGHT
      ? false
      : true;
  },
  topPlayerID: -1,
};
room.findType = (type) => {
  let output = [];
  let j = 0;
  room.setup.forEach((row) => {
    let i = 0;
    row.forEach((cell) => {
      if (cell === type) {
        output.push({
          x: ((i + 0.5) * room.width) / room.xgrid,
          y: ((j + 0.5) * room.height) / room.ygrid,
        });
      }
      i++;
    });
    j++;
  });
  room[type] = output;
};
room.setType = (type, location) => {
  if (!room.isInRoom(location)) return false;
  let a = Math.floor((location.y * room.ygrid) / room.height);
  let b = Math.floor((location.x * room.xgrid) / room.width);
  room.setup[a][b] = type;
  sockets.broadcastRoom();
};
room.findType("nest");
room.findType("norm");
room.findType("bas1");
room.findType("bas2");
room.findType("bas3");
room.findType("bas4");
room.findType("roid");
room.findType("rock");
room.nestFoodAmount =
  (1.5 * Math.sqrt(room.nest.length)) / room.xgrid / room.ygrid;
room.random = () => {
  return {
    x: ran.irandom(room.width),
    y: ran.irandom(room.height),
  };
};
room.randomType = (type) => {
  let selection = room[type][ran.irandom(room[type].length - 1)];
  return {
    x:
      ran.irandom((0.5 * room.width) / room.xgrid) * ran.choose([-1, 1]) +
      selection.x,
    y:
      ran.irandom((0.5 * room.height) / room.ygrid) * ran.choose([-1, 1]) +
      selection.y,
  };
};
room.gauss = (clustering) => {
  let output;
  do {
    output = {
      x: ran.gauss(room.width / 2, room.height / clustering),
      y: ran.gauss(room.width / 2, room.height / clustering),
    };
  } while (!room.isInRoom(output));
};
room.gaussInverse = (clustering) => {
  let output;
  do {
    output = {
      x: ran.gaussInverse(0, room.width, clustering),
      y: ran.gaussInverse(0, room.height, clustering),
    };
  } while (!room.isInRoom(output));
  return output;
};
room.gaussRing = (radius, clustering) => {
  let output;
  do {
    output = ran.gaussRing(room.width * radius, clustering);
    output = {
      x: output.x + room.width / 2,
      y: output.y + room.height / 2,
    };
  } while (!room.isInRoom(output));
  return output;
};
room.isIn = (type, location) => {
  if (
    location.x == null ||
    location.y == null ||
    isNaN(location.x) ||
    isNaN(location.y)
  ) {
    //throw "InvalidPositionError"
    return false;
  }
  if (room.isInRoom(location)) {
    let a = Math.floor((location.y * room.ygrid) / room.height);
    let b = Math.floor((location.x * room.xgrid) / room.width);
    return type === room.setup[a][b];
  } else {
    return false;
  }
};
room.isInNorm = (location) => {
  if (room.isInRoom(location)) {
    let a = Math.floor((location.y * room.ygrid) / room.height);
    let b = Math.floor((location.x * room.xgrid) / room.width);
    let v = room.setup[a][b];
    return v !== "nest";
  } else {
    return false;
  }
};
room.gaussType = (type, clustering) => {
  let selection = room[type][ran.irandom(room[type].length - 1)];
  let location = {};
  do {
    location = {
      x: ran.gauss(selection.x, room.width / room.xgrid / clustering),
      y: ran.gauss(selection.y, room.height / room.ygrid / clustering),
    };
  } while (!room.isIn(type, location));
  return location;
};
util.log(
  room.width +
    " x " +
    room.height +
    " room initalized.  Max food: " +
    room.maxFood +
    ", max nest food: " +
    room.maxFood * room.nestFoodAmount +
    "."
);

// Define a vector
class Vector {
  constructor(x, y) {
    //Vector constructor.
    this.x = x;
    this.y = y;
  }

  update() {
    this.len = this.length;
    this.dir = this.direction;
  }

  get length() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  isShorterThan(d) {
    return this.x * this.x + this.y * this.y <= d * d;
  }

  get direction() {
    return Math.atan2(this.y, this.x);
  }
}

function nullVector(v) {
  v.x = 0;
  v.y = 0; //this guy's useful
}

// Get class definitions and index them
var Class = (() => {
  let def = require("./lib/definitions"),
    i = 0;
  for (let k in def) {
    if (!def.hasOwnProperty(k)) continue;
    def[k].index = i++;
  }
  return def;
})();

// Define IOs (AI)
function nearest(
  array,
  location,
  test = () => {
    return true;
  }
) {
  let list = new goog.structs.PriorityQueue();
  let d;
  if (!array.length) {
    return undefined;
  }
  for (let instance of array) {
    d =
      Math.pow(instance.x - location.x, 2) +
      Math.pow(instance.y - location.y, 2);
    if (test(instance, d)) {
      list.enqueue(d, instance);
    }
  }
  return list.dequeue();
}
console.log(c.BOTS); // this works
function timeOfImpact(p, v, s) {
  // Requires relative position and velocity to aiming point
  let a = s * s - (v.x * v.x + v.y * v.y);
  let b = p.x * v.x + p.y * v.y;
  let c = p.x * p.x + p.y * p.y;

  let d = b * b + a * c;

  let t = 0;
  if (d >= 0) {
    t = Math.max(0, (b + Math.sqrt(d)) / a);
  }

  return t * 0.9;
}
class IO {
  constructor(body) {
    this.body = body;
    this.acceptsFromTop = true;
  }

  think() {
    return {
      target: null,
      goal: null,
      fire: null,
      main: null,
      alt: null,
      power: null,
    };
  }
}
class io_doNothing extends IO {
  constructor(body) {
    super(body);
    this.acceptsFromTop = false;
  }

  think() {
    return {
      goal: {
        x: this.body.x,
        y: this.body.y,
      },
      main: false,
      alt: false,
      fire: false,
    };
  }
}
class io_moveInCircles extends IO {
  constructor(body) {
    super(body);
    this.acceptsFromTop = false;
    this.timer = ran.irandom(10) + 3;
    this.goal = {
      x: this.body.x + 10 * Math.cos(-this.body.facing),
      y: this.body.y + 10 * Math.sin(-this.body.facing),
    };
  }

  think() {
    if (!this.timer--) {
      this.timer = 10;
      this.goal = {
        x: this.body.x + 10 * Math.cos(-this.body.facing),
        y: this.body.y + 10 * Math.sin(-this.body.facing),
      };
    }
    return {
      goal: this.goal,
    };
  }
}
class io_listenToPlayer extends IO {
  constructor(b, p) {
    super(b);
    this.player = p;
    this.acceptsFromTop = false;
  }

  // THE PLAYER MUST HAVE A VALID COMMAND AND TARGET OBJECT

  think() {
    let targ = {
      x: this.player.target.x,
      y: this.player.target.y,
    };
    if (this.player.command.autospin) {
      let kk =
        Math.atan2(this.body.control.target.y, this.body.control.target.x) +
        0.015;
      targ = {
        x: 150 * Math.cos(kk),
        y: 150 * Math.sin(kk),
      };
    }
    if (this.body.invuln) {
      if (
        this.player.command.right ||
        this.player.command.left ||
        this.player.command.up ||
        this.player.command.down ||
        this.player.command.lmb
      ) {
        this.body.invuln = false;
        if (this.body.invisible[0] === 0) {
          this.body.alpha = this.body.maxAlpha;
        }
      }
    }
    this.body.autoOverride = this.player.command.override;
    return {
      target: targ,
      goal: {
        x: this.body.x + this.player.command.right - this.player.command.left,
        y: this.body.y + this.player.command.down - this.player.command.up,
      },
      fire: this.player.command.lmb || this.player.command.autofire,
      main:
        this.player.command.lmb ||
        this.player.command.autospin ||
        this.player.command.autofire,
      alt: this.player.command.rmb,
    };
  }
}
class io_mapTargetToGoal extends IO {
  constructor(b) {
    super(b);
  }

  think(input) {
    if (input.main || input.alt) {
      return {
        goal: {
          x: input.target.x + this.body.x,
          y: input.target.y + this.body.y,
        },
        power: 1,
      };
    }
  }
}
class io_boomerang extends IO {
  constructor(b) {
    super(b);
    this.r = 0;
    this.b = b;
    this.m = b.master;
    this.turnover = false;
    let len =
      10 *
      util.getDistance(
        {
          x: 0,
          y: 0,
        },
        b.master.control.target
      );
    this.myGoal = {
      x: 3 * b.master.control.target.x + b.master.x,
      y: 3 * b.master.control.target.y + b.master.y,
    };
  }
  think(input) {
    if (this.b.range > this.r) this.r = this.b.range;
    let t = 1; //1 - Math.sin(2 * Math.PI * this.b.range / this.r) || 1;
    if (!this.turnover) {
      if (this.r && this.b.range < this.r * 0.5) {
        this.turnover = true;
      }
      return {
        goal: this.myGoal,
        power: t,
      };
    } else {
      return {
        goal: {
          x: this.m.x,
          y: this.m.y,
        },
        power: t,
      };
    }
  }
}
class io_goToMasterTarget extends IO {
  constructor(body) {
    super(body);
    this.myGoal = {
      x: body.master.control.target.x + body.master.x,
      y: body.master.control.target.y + body.master.y,
    };
    this.countdown = 5;
  }

  think() {
    if (this.countdown) {
      if (util.getDistance(this.body, this.myGoal) < 1) {
        this.countdown--;
      }
      return {
        goal: {
          x: this.myGoal.x,
          y: this.myGoal.y,
        },
      };
    }
  }
}
class io_canRepel extends IO {
  constructor(b) {
    super(b);
  }

  think(input) {
    if (input.alt && input.target) {
      return {
        target: {
          x: -input.target.x,
          y: -input.target.y,
        },
        main: true,
      };
    }
  }
}
class io_alwaysFire extends IO {
  constructor(body) {
    super(body);
  }

  think() {
    return {
      fire: true,
    };
  }
}
class io_targetSelf extends IO {
  constructor(body) {
    super(body);
  }

  think() {
    return {
      main: true,
      target: {
        x: 0,
        y: 0,
      },
    };
  }
}
class io_mapAltToFire extends IO {
  constructor(body) {
    super(body);
  }

  think(input) {
    if (input.alt) {
      return {
        fire: true,
      };
    }
  }
}
class io_onlyAcceptInArc extends IO {
  constructor(body) {
    super(body);
  }

  think(input) {
    if (input.target && this.body.firingArc != null) {
      if (
        Math.abs(
          util.angleDifference(
            Math.atan2(input.target.y, input.target.x),
            this.body.firingArc[0]
          )
        ) >= this.body.firingArc[1]
      ) {
        return {
          fire: false,
          alt: false,
          main: false,
        };
      }
    }
  }
}
class io_nearestDifferentMaster extends IO {
  constructor(body) {
    super(body);
    this.targetLock = undefined;
    this.tick = ran.irandom(30);
    this.lead = 0;
    this.validTargets = this.buildList(body.fov);
    this.oldHealth = body.health.display();
  }

  buildList(range) {
    // Establish whom we judge in reference to
    let m = {
        x: this.body.x,
        y: this.body.y,
      },
      mm = {
        x: this.body.master.master.x,
        y: this.body.master.master.y,
      },
      mostDangerous = 0,
      sqrRange = range * range,
      keepTarget = false;
    // Filter through everybody...
    let out = entities
      .map((e) => {
        // Only look at those within our view, and our parent's view, not dead, not our kind, not a bullet/trap/block etc
        if (e.health.amount > 0) {
          if (!e.invuln) {
            if (
              e.master.master.team !== this.body.master.master.team &&
              e.alpha > 0.5
            ) {
              if (e.master.master.team !== -101) {
                if (
                  e.type === "tank" ||
                  e.type === "crasher" ||
                  e.type === "miniboss" ||
                  (!this.body.aiSettings.shapefriend && e.type === "food")
                ) {
                  if (
                    Math.abs(e.x - m.x) < range &&
                    Math.abs(e.y - m.y) < range
                  ) {
                    if (
                      !this.body.aiSettings.blind ||
                      (Math.abs(e.x - mm.x) < range &&
                        Math.abs(e.y - mm.y) < range)
                    )
                      return e;
                  }
                }
              }
            }
          }
        }
      })
      .filter((e) => {
        return e;
      });

    if (!out.length) return [];

    out = out
      .map((e) => {
        // Only look at those within range and arc (more expensive, so we only do it on the few)
        let yaboi = false;
        if (
          Math.pow(this.body.x - e.x, 2) + Math.pow(this.body.y - e.y, 2) <
          sqrRange
        ) {
          if (this.body.firingArc == null || this.body.aiSettings.view360) {
            yaboi = true;
          } else if (
            Math.abs(
              util.angleDifference(
                util.getDirection(this.body, e),
                this.body.firingArc[0]
              )
            ) < this.body.firingArc[1]
          )
            yaboi = true;
        }
        if (yaboi) {
          mostDangerous = Math.max(e.dangerValue, mostDangerous);
          return e;
        }
      })
      .filter((e) => {
        // Only return the highest tier of danger
        if (e != null) {
          if (this.body.aiSettings.farm || e.dangerValue === mostDangerous) {
            if (this.targetLock) {
              if (e.id === this.targetLock.id) keepTarget = true;
            }
            return e;
          }
        }
      });
    // Reset target if it's not in there
    if (!keepTarget) this.targetLock = undefined;
    return out;
  }

  think(input) {
    // Override target lock upon other commands
    if (input.main || input.alt || this.body.master.autoOverride) {
      this.targetLock = undefined;
      return {};
    }
    // Otherwise, consider how fast we can either move to ram it or shoot at a potiential target.
    let tracking = this.body.topSpeed,
      range = this.body.fov;
    // Use whether we have functional guns to decide
    for (let i = 0; i < this.body.guns.length; i++) {
      if (this.body.guns[i].canShoot && !this.body.aiSettings.skynet) {
        let v = this.body.guns[i].getTracking();
        tracking = v.speed;
        if (true) range = 640 * this.body.FOV;
        else range = Math.min(range, (v.speed || 1) * (v.range || 90));
        break;
      }
    }
    // Check if my target's alive
    if (this.targetLock) {
      if (this.targetLock.health.amount <= 0) {
        this.targetLock = undefined;
        this.tick = 100;
      }
    }
    // Think damn hard
    if (this.tick++ > 15 * roomSpeed) {
      this.tick = 0;
      this.validTargets = this.buildList(range);
      // Ditch our old target if it's invalid
      if (
        this.targetLock &&
        this.validTargets.indexOf(this.targetLock) === -1
      ) {
        this.targetLock = undefined;
      }
      // Lock new target if we still don't have one.
      if (this.targetLock == null && this.validTargets.length) {
        this.targetLock =
          this.validTargets.length === 1
            ? this.validTargets[0]
            : nearest(this.validTargets, {
                x: this.body.x,
                y: this.body.y,
              });
        this.tick = -90;
      }
    }
    // Lock onto whoever's shooting me.
    // let damageRef = (this.body.bond == null) ? this.body : this.body.bond;
    // if (damageRef.collisionArray.length && damageRef.health.display() < this.oldHealth) {
    //     this.oldHealth = damageRef.health.display();
    //     if (this.validTargets.indexOf(damageRef.collisionArray[0]) === -1) {
    //         this.targetLock = (damageRef.collisionArray[0].master.id === -1) ? damageRef.collisionArray[0].source : damageRef.collisionArray[0].master;
    //     }
    // }
    // Consider how fast it's moving and shoot at it
    if (this.targetLock != null) {
      let radial = this.targetLock.velocity;
      let diff = {
        x: this.targetLock.x - this.body.x,
        y: this.targetLock.y - this.body.y,
      };
      /// Refresh lead time
      if (this.tick % 4 === 0) {
        this.lead = 0;
        // Find lead time (or don't)
        if (!this.body.aiSettings.chase) {
          let toi = timeOfImpact(diff, radial, tracking);
          this.lead = toi;
        }
      }
      // And return our aim
      return {
        target: {
          x: diff.x + this.lead * radial.x,
          y: diff.y + this.lead * radial.y,
        },
        fire: true,
        main: true,
      };
    }
    return {};
  }
}
class io_avoid extends IO {
  constructor(body) {
    super(body);
  }

  think(input) {
    let masterId = this.body.master.id;
    let range = this.body.size * this.body.size * 100;
    this.avoid = nearest(
      entities,
      {
        x: this.body.x,
        y: this.body.y,
      },
      function (test, sqrdst) {
        return (
          test.master.id !== masterId &&
          (test.type === "bullet" ||
            test.type === "drone" ||
            test.type === "swarm" ||
            test.type === "trap" ||
            test.type === "block") &&
          sqrdst < range
        );
      }
    );
    // Aim at that target
    if (this.avoid != null) {
      // Consider how fast it's moving.
      let delt = new Vector(
        this.body.velocity.x - this.avoid.velocity.x,
        this.body.velocity.y - this.avoid.velocity.y
      );
      let diff = new Vector(
        this.avoid.x - this.body.x,
        this.avoid.y - this.body.y
      );
      let comp =
        (delt.x * diff.x + delt.y * diff.y) / delt.length / diff.length;
      let goal = {};
      if (comp > 0) {
        if (input.goal) {
          let goalDist = Math.sqrt(
            range / (input.goal.x * input.goal.x + input.goal.y * input.goal.y)
          );
          goal = {
            x: input.goal.x * goalDist - diff.x * comp,
            y: input.goal.y * goalDist - diff.y * comp,
          };
        } else {
          goal = {
            x: -diff.x * comp,
            y: -diff.y * comp,
          };
        }
        return goal;
      }
    }
  }
}
class io_bot extends IO {
    constructor(body) {
        super(body);
        this.goal = room.randomType("nest");
        this.timer = Math.random() * 500 | 0;
        this.defendTick = -1;
        this.state = 1;
    }
    think(input) {
            this.defendTick --;
            this.timer --;
            if (input.target) {
                if (this.timer <= 0 || util.getDistance(this.body, this.goal) < this.body.SIZE || this.state === 1) {
                    const target = {
                        x: input.target.x + this.body.x,
                        y: input.target.y + this.body.y
                    };
                    const angle = Math.atan2(target.y - this.body.y, target.x - this.body.x) + (Math.PI / 2 * (Math.random() - .5));
                    const dist = Math.random() * this.body.fov;
                    this.timer = Math.random() * 100 | 0;
                    this.goal = {
                        x: target.x + Math.cos(angle) * dist,
                        y: target.y + Math.sin(angle) * dist
                    };
                    this.state = 0;
                }
            } else {
                if (this.timer <= 0 || util.getDistance(this.body, this.goal) < this.body.SIZE || this.state === 0) {
                    this.timer = Math.random() * 500 | 0;
                    this.state = 1;
                    this.goal = room.randomType(Math.random() > .9 ? "nest" : "nest");
                }
            }
        return {
            goal: this.goal
        }
    }
}
class io_minion extends IO {
  constructor(body) {
    super(body);
    this.turnwise = 1;
  }

  think(input) {
    if (this.body.aiSettings.reverseDirection && ran.chance(0.005)) {
      this.turnwise = -1 * this.turnwise;
    }
    if (input.target != null && (input.alt || input.main)) {
      let sizeFactor = Math.sqrt(this.body.master.size / this.body.master.SIZE);
      let leash = 60 * sizeFactor;
      let orbit = 120 * sizeFactor;
      let repel = 135 * sizeFactor;
      let goal;
      let power = 1;
      let target = new Vector(input.target.x, input.target.y);
      if (input.alt) {
        // Leash
        if (target.length < leash) {
          goal = {
            x: this.body.x + target.x,
            y: this.body.y + target.y,
          };
          // Spiral repel
        } else if (target.length < repel) {
          let dir = -this.turnwise * target.direction + Math.PI / 5;
          goal = {
            x: this.body.x + Math.cos(dir),
            y: this.body.y + Math.sin(dir),
          };
          // Free repel
        } else {
          goal = {
            x: this.body.x - target.x,
            y: this.body.y - target.y,
          };
        }
      } else if (input.main) {
        // Orbit point
        let dir = this.turnwise * target.direction + 0.01;
        goal = {
          x: this.body.x + target.x - orbit * Math.cos(dir),
          y: this.body.y + target.y - orbit * Math.sin(dir),
        };
        if (Math.abs(target.length - orbit) < this.body.size * 2) {
          power = 0.7;
        }
      }
      return {
        goal: goal,
        power: power,
      };
    }
  }
}
class io_hangOutNearMaster extends IO {
  constructor(body) {
    super(body);
    this.acceptsFromTop = false;
    this.orbit = 30;
    this.currentGoal = {
      x: this.body.source.x,
      y: this.body.source.y,
    };
    this.timer = 0;
  }
  think(input) {
    if (this.body.invisible[1]) return {};
    if (this.body.source != this.body) {
      let bound1 = this.orbit * 0.8 + this.body.source.size + this.body.size;
      let bound2 = this.orbit * 1.5 + this.body.source.size + this.body.size;
      let dist = util.getDistance(this.body, this.body.source) + Math.PI / 8;
      let output = {
        target: {
          x: this.body.velocity.x,
          y: this.body.velocity.y,
        },
        goal: this.currentGoal,
        power: undefined,
      };
      // Set a goal
      if (dist > bound2 || this.timer > 30) {
        this.timer = 0;

        let dir =
          util.getDirection(this.body, this.body.source) +
          Math.PI * ran.random(0.5);
        let len = ran.randomRange(bound1, bound2);
        let x = this.body.source.x - len * Math.cos(dir);
        let y = this.body.source.y - len * Math.sin(dir);
        this.currentGoal = {
          x: x,
          y: y,
        };
      }
      if (dist < bound2) {
        output.power = 0.15;
        if (ran.chance(0.3)) {
          this.timer++;
        }
      }
      return output;
    }
  }
}
class io_spin extends IO {
  constructor(b) {
    super(b);
    this.a = 0;
  }

  think(input) {
    this.a += 0.05;
    let offset = 0;
    if (this.body.bond != null) {
      offset = this.body.bound.angle;
    }
    return {
      target: {
        x: Math.cos(this.a + offset),
        y: Math.sin(this.a + offset),
      },
      main: true,
    };
  }
}
class io_slowSpin extends IO {
  constructor(body) {
    super(body);
    this.a = 0;
  }

  think(input) {
    this.a += 0.02;
    let offset = 0;
    if (this.body.bond != null) {
      offset = this.body.bound.angle;
    }
    return {
      target: {
        x: Math.cos(this.a + offset),
        y: Math.sin(this.a + offset),
      },
      main: true,
    };
  }
}
class io_counterslowspin extends IO {
  constructor(body) {
    super(body);
    this.a = 0;
  }

  think(input) {
    this.a -= 0.02;
    let offset = 0;
    if (this.body.bond != null) {
      offset = this.body.bound.angle;
    }
    return {
      target: {
        x: Math.cos(this.a + offset),
        y: Math.sin(this.a + offset),
      },
      main: true,
    };
  }
}
class io_fastspin extends IO {
  constructor(b) {
    super(b);
    this.a = 0;
  }

  think(input) {
    this.a += 0.072;
    let offset = 0;
    if (this.body.bond != null) {
      offset = this.body.bound.angle;
    }
    return {
      target: {
        x: Math.cos(this.a + offset),
        y: Math.sin(this.a + offset),
      },
      main: true,
    };
  }
}
class io_reversespin extends IO {
  constructor(b) {
    super(b);
    this.a = 0;
  }

  think(input) {
    this.a -= 0.05;
    let offset = 0;
    if (this.body.bond != null) {
      offset = this.body.bound.angle;
    }
    return {
      target: {
        x: Math.cos(this.a + offset),
        y: Math.sin(this.a + offset),
      },
      main: true,
    };
  }
}
class io_dontTurn extends IO {
  constructor(b) {
    super(b);
  }

  think(input) {
    return {
      target: {
        x: 1,
        y: 0,
      },
      main: true,
    };
  }
}
class io_fleeAtLowHealth extends IO {
  constructor(b) {
    super(b);
    this.fear = util.clamp(ran.gauss(0.7, 0.15), 0.1, 0.9);
  }

  think(input) {
    if (
      input.fire &&
      input.target != null &&
      this.body.health.amount < this.body.health.max * this.fear
    ) {
      return {
        goal: {
          x: this.body.x - input.target.x,
          y: this.body.y - input.target.y,
        },
      };
    }
  }
}

/***** ENTITIES *****/
// Define skills
const skcnv = {
  rld: 0,
  pen: 1,
  str: 2,
  dam: 3,
  spd: 4,

  shi: 5,
  atk: 6,
  hlt: 7,
  rgn: 8,
  mob: 9,
};
const levelers = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
  42, 43, 44, 45,
];
class Skill {
  constructor(inital = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]) {
    // Just skill stuff.
    this.raw = inital;
    this.caps = [];
    this.setCaps([
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
      c.MAX_SKILL,
    ]);
    this.name = [
      "Reload",
      "Bullet Penetration",
      "Bullet Health",
      "Bullet Damage",
      "Bullet Speed",
      "Shield Capacity",
      "Body Damage",
      "Max Health",
      "Shield Regeneration",
      "Movement Speed",
    ];
    this.atk = 0;
    this.hlt = 0;
    this.spd = 0;
    this.str = 0;
    this.pen = 0;
    this.dam = 0;
    this.rld = 0;
    this.mob = 0;
    this.rgn = 0;
    this.shi = 0;
    this.rst = 0;
    this.brst = 0;
    this.ghost = 0;
    this.acl = 0;

    this.reset();
  }

  reset() {
    this.points = 0;
    this.score = 0;
    this.deduction = 0;
    this.level = 0;
    this.canUpgrade = false;
    this.update();
    this.maintain();
  }

  update() {
    let curve = (() => {
      function make(x) {
        return Math.log(4 * x + 1) / Math.log(5);
      }
      let a = [];
      for (let i = 0; i < c.MAX_SKILL * 2; i++) {
        a.push(make(i / c.MAX_SKILL));
      }
      // The actual lookup function
      return (x) => {
        return a[x * c.MAX_SKILL];
      };
    })();

    function apply(f, x) {
      return x < 0 ? 1 / (1 - x * f) : f * x + 1;
    }
    for (let i = 0; i < 10; i++) {
      if (this.raw[i] > this.caps[i]) {
        this.points += this.raw[i] - this.caps[i];
        this.raw[i] = this.caps[i];
      }
    }
    let attrib = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 2; j += 1) {
        attrib[i + 5 * j] = curve(
          (this.raw[i + 5 * j] + this.bleed(i, j)) / c.MAX_SKILL
        );
      }
    }
    this.rld = Math.pow(0.5, attrib[skcnv.rld]);
    this.pen = apply(2.5, attrib[skcnv.pen]);
    this.str = apply(2, attrib[skcnv.str]);
    this.dam = apply(3, attrib[skcnv.dam]);
    this.spd = 0.5 + apply(1.5, attrib[skcnv.spd]);

    this.acl = apply(0.5, attrib[skcnv.rld]);

    this.rst = 0.5 * attrib[skcnv.str] + 2.5 * attrib[skcnv.pen];
    this.ghost = attrib[skcnv.pen];

    this.shi =
      c.GLASS_HEALTH_FACTOR *
      apply(3 / c.GLASS_HEALTH_FACTOR - 1, attrib[skcnv.shi]);
    this.atk = apply(1, attrib[skcnv.atk]);
    this.hlt =
      c.GLASS_HEALTH_FACTOR *
      apply(2 / c.GLASS_HEALTH_FACTOR - 1, attrib[skcnv.hlt]);
    this.mob = apply(0.8, attrib[skcnv.mob]);
    this.rgn = apply(25, attrib[skcnv.rgn]);

    this.brst =
      0.3 *
      (0.5 * attrib[skcnv.atk] + 0.5 * attrib[skcnv.hlt] + attrib[skcnv.rgn]);
  }

  set(thing) {
    this.raw[0] = thing[0];
    this.raw[1] = thing[1];
    this.raw[2] = thing[2];
    this.raw[3] = thing[3];
    this.raw[4] = thing[4];
    this.raw[5] = thing[5];
    this.raw[6] = thing[6];
    this.raw[7] = thing[7];
    this.raw[8] = thing[8];
    this.raw[9] = thing[9];
    this.update();
  }

  setCaps(thing) {
    this.caps[0] = thing[0];
    this.caps[1] = thing[1];
    this.caps[2] = thing[2];
    this.caps[3] = thing[3];
    this.caps[4] = thing[4];
    this.caps[5] = thing[5];
    this.caps[6] = thing[6];
    this.caps[7] = thing[7];
    this.caps[8] = thing[8];
    this.caps[9] = thing[9];
    this.update();
  }

  maintain() {
    if (this.level < c.SKILL_CAP) {
      if (this.score - this.deduction >= this.levelScore) {
        this.deduction += this.levelScore;
        this.level += 1;
        this.points += this.levelPoints;
        if (
          this.level == c.TIER_1 ||
          this.level == c.TIER_2 ||
          this.level == c.TIER_3
        ) {
          this.canUpgrade = true;
        }
        this.update();
        return true;
      }
    }
    return false;
  }

  get levelScore() {
    return Math.ceil(1.8 * Math.pow(this.level + 1, 1.8) - 2 * this.level + 1);
  }

  get progress() {
    return this.levelScore
      ? (this.score - this.deduction) / this.levelScore
      : 0;
  }

  get levelPoints() {
    if (
      levelers.findIndex((e) => {
        return e === this.level;
      }) != -1
    ) {
      return 1;
    }
    return 0;
  }

  cap(skill, real = false) {
    if (!real && this.level < c.SKILL_SOFT_CAP) {
      return Math.round(this.caps[skcnv[skill]] * c.SOFT_MAX_SKILL);
    }
    return this.caps[skcnv[skill]];
  }

  bleed(i, j) {
    let a = ((i + 2) % 5) + 5 * j,
      b = ((i + (j === 1 ? 1 : 4)) % 5) + 5 * j;
    let value = 0;
    let denom = Math.max(c.MAX_SKILL, this.caps[i + 5 * j]);
    value +=
      (1 - Math.pow(this.raw[a] / denom - 1, 2)) * this.raw[a] * c.SKILL_LEAK;
    value -= Math.pow(this.raw[b] / denom, 2) * this.raw[b] * c.SKILL_LEAK;

    return value;
  }

  upgrade(stat) {
    if (this.points && this.amount(stat) < this.cap(stat)) {
      this.change(stat, 1);
      this.points -= 1;
      return true;
    }
    return false;
  }

  title(stat) {
    return this.name[skcnv[stat]];
  }

  /*
  let i = skcnv[skill] % 5,
      j = (skcnv[skill] - i) / 5;
  let roundvalue = Math.round(this.bleed(i, j) * 10);
  let string = '';
  if (roundvalue > 0) { string += '+' + roundvalue + '%'; }
  if (roundvalue < 0) { string += '-' + roundvalue + '%'; }
  return string;
  */

  amount(skill) {
    return this.raw[skcnv[skill]];
  }

  change(skill, levels) {
    this.raw[skcnv[skill]] += levels;
    this.update();
  }
}

const lazyRealSizes = (() => {
  let o = [1, 1, 1];
  for (var i = 3; i < 17; i++) {
    // We say that the real size of a 0-gon, 1-gon, 2-gon is one, then push the real sizes of triangles, squares, etc...
    o.push(Math.sqrt(((2 * Math.PI) / i) * (1 / Math.sin((2 * Math.PI) / i))));
  }
  return o;
})();

// Define how guns work
class Gun {
  constructor(body, info) {
    this.lastShot = {
      time: 0,
      power: 0,
    };
    this.body = body;
    this.master = body.source;
    this.label = "";
    this.controllers = [];
    this.children = [];
    this.control = {
      target: new Vector(0, 0),
      goal: new Vector(0, 0),
      main: false,
      alt: false,
      fire: false,
    };
    this.canShoot = false;
    if (info.PROPERTIES != null && info.PROPERTIES.TYPE != null) {
      this.canShoot = true;
      this.label = info.PROPERTIES.LABEL == null ? "" : info.PROPERTIES.LABEL;
      if (Array.isArray(info.PROPERTIES.TYPE)) {
        // This is to be nicer about our definitions
        this.bulletTypes = info.PROPERTIES.TYPE;
        this.natural = info.PROPERTIES.TYPE.BODY;
      } else {
        this.bulletTypes = [info.PROPERTIES.TYPE];
      }
      // Pre-load bullet definitions so we don't have to recalculate them every shot
      let natural = {};
      this.bulletTypes.forEach(function setNatural(type) {
        if (type.PARENT != null) {
          // Make sure we load from the parents first
          for (let i = 0; i < type.PARENT.length; i++) {
            setNatural(type.PARENT[i]);
          }
        }
        if (type.BODY != null) {
          // Get values if they exist
          for (let index in type.BODY) {
            natural[index] = type.BODY[index];
          }
        }
      });
      this.natural = natural; // Save it
      if (info.PROPERTIES.GUN_CONTROLLERS != null) {
        let toAdd = [];
        let self = this;
        info.PROPERTIES.GUN_CONTROLLERS.forEach(function (ioName) {
          toAdd.push(eval("new " + ioName + "(self)"));
        });
        this.controllers = toAdd.concat(this.controllers);
      }
      this.autofire =
        info.PROPERTIES.AUTOFIRE == null ? false : info.PROPERTIES.AUTOFIRE;
      this.altFire =
        info.PROPERTIES.ALT_FIRE == null ? false : info.PROPERTIES.ALT_FIRE;
      this.settings =
        info.PROPERTIES.SHOOT_SETTINGS == null
          ? []
          : info.PROPERTIES.SHOOT_SETTINGS;
      this.calculator =
        info.PROPERTIES.STAT_CALCULATOR == null
          ? "default"
          : info.PROPERTIES.STAT_CALCULATOR;
      this.waitToCycle =
        info.PROPERTIES.WAIT_TO_CYCLE == null
          ? false
          : info.PROPERTIES.WAIT_TO_CYCLE;
      this.bulletStats =
        info.PROPERTIES.BULLET_STATS == null ||
        info.PROPERTIES.BULLET_STATS == "master"
          ? "master"
          : new Skill(info.PROPERTIES.BULLET_STATS);
      this.settings =
        info.PROPERTIES.SHOOT_SETTINGS == null
          ? []
          : info.PROPERTIES.SHOOT_SETTINGS;
      this.countsOwnKids =
        info.PROPERTIES.MAX_CHILDREN == null
          ? false
          : info.PROPERTIES.MAX_CHILDREN;
      this.syncsSkills =
        info.PROPERTIES.SYNCS_SKILLS == null
          ? false
          : info.PROPERTIES.SYNCS_SKILLS;
      this.negRecoil =
        info.PROPERTIES.NEGATIVE_RECOIL == null
          ? false
          : info.PROPERTIES.NEGATIVE_RECOIL;
    }
    let position = info.POSITION;
    this.length = position[0] / 10;
    this.width = position[1] / 10;
    this.aspect = position[2];
    let _off = new Vector(position[3], position[4]);
    this.angle = (position[5] * Math.PI) / 180;
    this.direction = _off.direction;
    this.offset = _off.length / 10;
    this.delay = position[6];

    this.position = 0;
    this.motion = 0;
    if (this.canShoot) {
      this.cycle = !this.waitToCycle - this.delay;
      this.trueRecoil = this.settings.recoil;
    }
  }

  recoil() {
    if (this.motion || this.position) {
      // Simulate recoil
      this.motion -= (0.25 * this.position) / roomSpeed;
      this.position += this.motion;
      if (this.position < 0) {
        // Bouncing off the back
        this.position = 0;
        this.motion = -this.motion;
      }
      if (this.motion > 0) {
        this.motion *= 0.75;
      }
    }
    if (this.canShoot && !this.body.settings.hasNoRecoil) {
      // Apply recoil to motion
      if (this.motion > 0) {
        let recoilForce =
          (-this.position * this.trueRecoil * 0.045) / roomSpeed;
        this.body.accel.x +=
          recoilForce * Math.cos(this.body.facing + this.angle);
        this.body.accel.y +=
          recoilForce * Math.sin(this.body.facing + this.angle);
      }
    }
  }

  getSkillRaw() {
    if (this.bulletStats === "master") {
      return [
        this.body.skill.raw[0],
        this.body.skill.raw[1],
        this.body.skill.raw[2],
        this.body.skill.raw[3],
        this.body.skill.raw[4],
        0,
        0,
        0,
        0,
        0,
      ];
    }
    return this.bulletStats.raw;
  }

  getLastShot() {
    return this.lastShot;
  }

  live() {
    // Do
    this.recoil();
    // Dummies ignore this
    if (this.canShoot) {
      // Find the proper skillset for shooting
      let sk =
        this.bulletStats === "master" ? this.body.skill : this.bulletStats;
      // Decides what to do based on child-counting settings
      let shootPermission = this.countsOwnKids
        ? this.countsOwnKids >
          this.children.length * (this.calculator == "necro" ? sk.rld : 1)
        : this.body.maxChildren
        ? this.body.maxChildren >
          this.body.children.length * (this.calculator == "necro" ? sk.rld : 1)
        : true;
      // Override in invuln
      if (this.body.master.invuln) {
        shootPermission = false;
      }
      // Cycle up if we should
      if (shootPermission || !this.waitToCycle) {
        if (this.cycle < 1) {
          this.cycle +=
            1 /
            this.settings.reload /
            roomSpeed /
            (this.calculator == "necro" || this.calculator == "fixed reload"
              ? 1
              : sk.rld);
        }
      }
      // Firing routines
      if (
        shootPermission &&
        (this.autofire ||
          (this.altFire ? this.body.control.alt : this.body.control.fire))
      ) {
        if (this.cycle >= 1) {
          // Find the end of the gun barrel
          let gx =
            this.offset *
              Math.cos(this.direction + this.angle + this.body.facing) +
            (1.5 * this.length - (this.width * this.settings.size) / 2) *
              Math.cos(this.angle + this.body.facing);
          let gy =
            this.offset *
              Math.sin(this.direction + this.angle + this.body.facing) +
            (1.5 * this.length - (this.width * this.settings.size) / 2) *
              Math.sin(this.angle + this.body.facing);
          // Shoot, multiple times in a tick if needed
          while (shootPermission && this.cycle >= 1) {
            this.fire(gx, gy, sk);
            // Figure out if we may still shoot
            shootPermission = this.countsOwnKids
              ? this.countsOwnKids > this.children.length
              : this.body.maxChildren
              ? this.body.maxChildren > this.body.children.length
              : true;
            // Cycle down
            this.cycle -= 1;
          }
        } // If we're not shooting, only cycle up to where we'll have the proper firing delay
      } else if (this.cycle > !this.waitToCycle - this.delay) {
        this.cycle = !this.waitToCycle - this.delay;
      }
    }
  }

  syncChildren() {
    if (this.syncsSkills) {
      let self = this;
      this.children.forEach(function (o) {
        o.define({
          BODY: self.interpret(),
          SKILL: self.getSkillRaw(),
        });
        o.refreshBodyAttributes();
      });
    }
  }

  fire(gx, gy, sk) {
    // Recoil
    this.lastShot.time = util.time();
    this.lastShot.power =
      3 * Math.log(Math.sqrt(sk.spd) + this.trueRecoil + 1) + 1;
    this.motion += this.lastShot.power;
    // Find inaccuracy
    let ss, sd;
    do {
      ss = ran.gauss(0, Math.sqrt(this.settings.shudder));
    } while (Math.abs(ss) >= this.settings.shudder * 2);
    do {
      sd = ran.gauss(0, this.settings.spray * this.settings.shudder);
    } while (Math.abs(sd) >= this.settings.spray / 2);
    sd *= Math.PI / 180;
    // Find speed
    let s = new Vector(
      (this.negRecoil ? -1 : 1) *
        this.settings.speed *
        c.runSpeed *
        sk.spd *
        (1 + ss) *
        Math.cos(this.angle + this.body.facing + sd),
      (this.negRecoil ? -1 : 1) *
        this.settings.speed *
        c.runSpeed *
        sk.spd *
        (1 + ss) *
        Math.sin(this.angle + this.body.facing + sd)
    );
    // Boost it if we should
    if (this.body.velocity.length) {
      let extraBoost =
        Math.max(0, s.x * this.body.velocity.x + s.y * this.body.velocity.y) /
        this.body.velocity.length /
        s.length;
      if (extraBoost) {
        let len = s.length;
        s.x += (this.body.velocity.length * extraBoost * s.x) / len;
        s.y += (this.body.velocity.length * extraBoost * s.y) / len;
      }
    }
    // Create the bullet
    var o = new Entity(
      {
        x: this.body.x + this.body.size * gx - s.x,
        y: this.body.y + this.body.size * gy - s.y,
      },
      this.master.master
    );
    /*let jumpAhead = this.cycle - 1;
    if (jumpAhead) {
        o.x += s.x * this.cycle / jumpAhead;
        o.y += s.y * this.cycle / jumpAhead;
    }*/
    o.velocity = s;
    this.bulletInit(o);
    o.coreSize = o.SIZE;
  }

  bulletInit(o) {
    // Define it by its natural properties
    this.bulletTypes.forEach((type) => o.define(type));
    // Pass the gun attributes
    o.define({
      BODY: this.interpret(),
      SKILL: this.getSkillRaw(),
      SIZE: (this.body.size * this.width * this.settings.size) / 2,
      LABEL:
        this.master.label +
        (this.label ? " " + this.label : "") +
        " " +
        o.label,
    });
    o.color = this.body.master.color;
    // Keep track of it and give it the function it needs to deutil.log itself upon death
    if (this.countsOwnKids) {
      o.parent = this;
      this.children.push(o);
    } else if (this.body.maxChildren) {
      o.parent = this.body;
      this.body.children.push(o);
      this.children.push(o);
    }
    o.source = this.body;
    o.facing = o.velocity.direction;
    // Necromancers.
    if (this.calculator == 7) {
      let oo = o;
      o.necro = (host) => {
        let shootPermission = this.countsOwnKids
          ? this.countsOwnKids >
            this.children.length *
              (this.bulletStats === "master"
                ? this.body.skill.rld
                : this.bulletStats.rld)
          : this.body.maxChildren
          ? this.body.maxChildren >
            this.body.children.length *
              (this.bulletStats === "master"
                ? this.body.skill.rld
                : this.bulletStats.rld)
          : true;
        if (shootPermission) {
          let save = {
            facing: host.facing,
            size: host.SIZE,
          };
          host.define(Class.genericEntity);
          this.bulletInit(host);
          host.team = oo.master.master.team;
          host.master = oo.master;
          host.color = oo.color;
          host.facing = save.facing;
          host.SIZE = save.size;
          host.health.amount = host.health.max;
          return true;
        }
        return false;
      };
    }
    // Otherwise
    o.refreshBodyAttributes();
    o.life();
  }

  getTracking() {
    return {
      speed:
        c.runSpeed *
        (this.bulletStats == "master"
          ? this.body.skill.spd
          : this.bulletStats.spd) *
        this.settings.maxSpeed *
        this.natural.SPEED,
      range:
        Math.sqrt(
          this.bulletStats == "master"
            ? this.body.skill.spd
            : this.bulletStats.spd
        ) *
        this.settings.range *
        this.natural.RANGE,
    };
  }

  interpret() {
    let sizeFactor = this.master.size / this.master.SIZE;
    let shoot = this.settings;
    let sk = this.bulletStats == "master" ? this.body.skill : this.bulletStats;
    // Defaults
    let out = {
      SPEED: shoot.maxSpeed * sk.spd,
      HEALTH: shoot.health * sk.str,
      RESIST: shoot.resist + sk.rst,
      DAMAGE: shoot.damage * sk.dam,
      PENETRATION: Math.max(1, shoot.pen * sk.pen),
      RANGE: shoot.range / Math.sqrt(sk.spd),
      DENSITY: (shoot.density * sk.pen * sk.pen) / sizeFactor,
      PUSHABILITY: 1 / sk.pen,
      HETERO: 3 - 2.8 * sk.ghost,
    };
    // Special cases
    switch (this.calculator) {
      case "thruster":
        this.trueRecoil = this.settings.recoil * Math.sqrt(sk.rld * sk.spd);
        break;
      case "sustained":
        out.RANGE = shoot.range;
        break;
      case "swarm":
        out.PENETRATION = Math.max(1, shoot.pen * (0.5 * (sk.pen - 1) + 1));
        out.HEALTH /= shoot.pen * sk.pen;
        break;
      case "trap":
      case "block":
        out.PUSHABILITY = 1 / Math.pow(sk.pen, 0.5);
        out.RANGE = shoot.range;
        break;
      case "necro":
      case "drone":
        out.PUSHABILITY = 1;
        out.PENETRATION = Math.max(1, shoot.pen * (0.5 * (sk.pen - 1) + 1));
        out.HEALTH =
          (shoot.health * sk.str + sizeFactor) / Math.pow(sk.pen, 0.8);
        out.DAMAGE =
          shoot.damage * sk.dam * Math.sqrt(sizeFactor) * shoot.pen * sk.pen;
        out.RANGE = shoot.range * Math.sqrt(sizeFactor);
        break;
    }
    // Go through and make sure we respect its natural properties
    for (let property in out) {
      if (this.natural[property] == null || !out.hasOwnProperty(property))
        continue;
      out[property] *= this.natural[property];
    }
    return out;
  }
}
// Define entities
var minimap = [];
var views = [];
var entitiesToAvoid = [];
const dirtyCheck = (p, r) => {
  return entitiesToAvoid.some((e) => {
    return Math.abs(p.x - e.x) < r + e.size && Math.abs(p.y - e.y) < r + e.size;
  });
};
const grid = new hshg.HSHG();
var entitiesIdLog = 0;
var entities = [];
const purgeEntities = () => {
  entities = entities.filter((e) => {
    return !e.isGhost;
  });
};

var bringToLife = (() => {
  let remapTarget = (i, ref, self) => {
    if (i.target == null || (!i.main && !i.alt)) return undefined;
    return {
      x: i.target.x + ref.x - self.x,
      y: i.target.y + ref.y - self.y,
    };
  };
  let passer = (a, b, acceptsFromTop) => {
    return (index) => {
      if (
        a != null &&
        a[index] != null &&
        (b[index] == null || acceptsFromTop)
      ) {
        b[index] = a[index];
      }
    };
  };
  return (my) => {
    // Size
    if (my.SIZE - my.coreSize) my.coreSize += (my.SIZE - my.coreSize) / 10;
    // Think
    let faucet =
      my.settings.independent || my.source == null || my.source === my
        ? {}
        : my.source.control;
    let b = {
      target: remapTarget(faucet, my.source, my),
      goal: undefined,
      fire: faucet.fire,
      main: faucet.main,
      alt: faucet.alt,
      power: undefined,
    };
    // Seek attention
    if (my.settings.attentionCraver && !faucet.main && my.range) {
      my.range -= 1;
    }
    // Invisibility
    if (my.invisible[1]) {
      my.alpha = Math.max(0, my.alpha - my.invisible[1]);
      if (!my.velocity.isShorterThan(0.15) || my.damageReceived)
        my.alpha = Math.min(1, my.alpha + my.invisible[0]);
    }
    // So we start with my master's thoughts and then we filter them down through our control stack
    my.controllers.forEach((AI) => {
      let a = AI.think(b);
      let passValue = passer(a, b, AI.acceptsFromTop);
      passValue("target");
      passValue("goal");
      passValue("fire");
      passValue("main");
      passValue("alt");
      passValue("power");
    });
    my.control.target = b.target == null ? my.control.target : b.target;
    my.control.goal = b.goal;
    my.control.fire = b.fire;
    my.control.main = b.main;
    my.control.alt = b.alt;
    my.control.power = b.power == null ? 1 : b.power;
    // React
    my.move();
    my.face();
    // Handle guns and turrets if we've got them
    my.guns.forEach((gun) => gun.live());
    my.turrets.forEach((turret) => turret.life());
    if (my.skill.maintain()) my.refreshBodyAttributes();
  };
})();

class HealthType {
  constructor(health, type, resist = 0) {
    this.max = health;
    this.amount = health;
    this.type = type;
    this.resist = resist;
    this.regen = 0;
  }

  set(health, regen = 0) {
    this.amount = this.max ? (this.amount / this.max) * health : health;
    this.max = health;
    this.regen = regen;
  }

  display() {
    return this.amount / this.max;
  }

  getDamage(amount, capped = true) {
    switch (this.type) {
      case "dynamic":
        return capped
          ? Math.min(amount * this.permeability, this.amount)
          : amount * this.permeability;
      case "static":
        return capped ? Math.min(amount, this.amount) : amount;
    }
  }

  regenerate(boost = false) {
    boost /= 2;
    let cons = 5;
    switch (this.type) {
      case "static":
        if (this.amount >= this.max || !this.amount) break;
        this.amount += cons * (this.max / 10 / 60 / 2.5 + boost);
        break;
      case "dynamic":
        let r = util.clamp(this.amount / this.max, 0, 1);
        if (!r) {
          this.amount = 0.0001;
        }
        if (r === 1) {
          this.amount = this.max;
        } else {
          this.amount +=
            cons *
            ((this.regen *
              Math.exp(-50 * Math.pow(Math.sqrt(0.5 * r) - 0.4, 2))) /
              3 +
              (r * this.max) / 10 / 15 +
              boost);
        }
        break;
    }
    this.amount = util.clamp(this.amount, 0, this.max);
  }

  get permeability() {
    switch (this.type) {
      case "static":
        return 1;
      case "dynamic":
        return this.max ? util.clamp(this.amount / this.max, 0, 1) : 0;
    }
  }

  get ratio() {
    return this.max
      ? util.clamp(1 - Math.pow(this.amount / this.max - 1, 4), 0, 1)
      : 0;
  }
}

class Entity {
  constructor(position, master = this) {
    this.isGhost = false;
    this.killCount = {
      solo: 0,
      assists: 0,
      bosses: 0,
      killers: [],
    };
    this.creationTime = new Date().getTime();
    // Inheritance
    this.master = master;
    this.source = this;
    this.parent = this;
    this.nameColor = "#ffffff";
    this.alpha = 1;
    this.maxAlpha = 1;
    this.invisible = [0, 0];
    this.invulnFlash = true;
    this.control = {
      target: new Vector(0, 0),
      goal: new Vector(0, 0),
      main: false,
      alt: false,
      fire: false,
      power: 0,
    };
    this.isInGrid = false;
    this.removeFromGrid = () => {
      if (this.isInGrid) {
        grid.removeObject(this);
        this.isInGrid = false;
      }
    };
    this.addToGrid = () => {
      if (!this.isInGrid && this.bond == null) {
        grid.addObject(this);
        this.isInGrid = true;
      }
    };
    this.activation = (() => {
      let active = true;
      let timer = ran.irandom(15);
      return {
        update: () => {
          if (this.isDead()) return 0;
          // Check if I'm in anybody's view
          if (!active) {
            this.removeFromGrid();
            // Remove bullets and swarm
            if (this.settings.diesAtRange) this.kill();
            // Still have limited update cycles but do it much more slowly.
            if (!timer--) active = true;
          } else {
            this.addToGrid();
            timer = 15;
            active = views.some((v) => v.check(this, 0.6));
          }
        },
        check: () => {
          return active;
        },
      };
    })();
    this.autoOverride = false;
    this.controllers = [];
    this.blend = {
      color: "#FFFFFF",
      amount: 0,
    };
    // Objects
    this.skill = new Skill();
    this.health = new HealthType(1, "static", 0);
    this.shield = new HealthType(0, "dynamic");
    this.guns = [];
    this.turrets = [];
    this.upgrades = [];
    this.settings = {};
    this.aiSettings = {};
    this.children = [];
    // Define it
    this.SIZE = 1;
    this.define(Class.genericEntity);
    // Initalize physics and collision
    this.maxSpeed = 0;
    this.facing = 0;
    this.vfacing = 0;
    this.range = 0;
    this.damageRecieved = 0;
    this.stepRemaining = 1;
    this.x = position.x;
    this.y = position.y;
    this.savePos = {
      x: this.x,
      y: this.y,
    };
    this.velocity = new Vector(0, 0);
    this.accel = new Vector(0, 0);
    this.damp = 0.05;
    this.collisionArray = [];
    this.invuln = false;
    // ==================================================
    // Chat System.
    // ==================================================
    this.roleColorIndex = 8; // White
    // ==================================================

    // Get a new unique id
    this.id = entitiesIdLog++;
    this.team = this.id;
    this.team = master.team;
    // This is for collisions
    this.updateAABB = () => {};
    this.getAABB = (() => {
      let data = {},
        savedSize = 0;
      let getLongestEdge = (x1, y1, x2, y2) => {
        return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
      };
      this.updateAABB = (active) => {
        if (this.bond != null) return 0;
        if (!active) {
          data.active = false;
          return 0;
        }
        if (this.invuln && this.invulnFlash) {
          this.alpha = Date.now() % 150 < 75 ? 1 : 0.75;
        }
        if (
          this.x == null ||
          isNaN(this.x) ||
          this.y == null ||
          isNaN(this.y)
        ) {
          //this.sendMessage("Killing due to NaN position.");
          //this.kill();
          this.x = this.savePos.x;
          this.y = this.savePos.y;
        } else {
          this.savePos = {
            x: this.x,
            y: this.y,
          };
        }
        if (this.type === "tank") this.refreshBodyAttributes();
        // Get bounds
        let x1 =
          Math.min(this.x, this.x + this.velocity.x + this.accel.x) -
          this.realSize -
          5;
        let y1 =
          Math.min(this.y, this.y + this.velocity.y + this.accel.y) -
          this.realSize -
          5;
        let x2 =
          Math.max(this.x, this.x + this.velocity.x + this.accel.x) +
          this.realSize +
          5;
        let y2 =
          Math.max(this.y, this.y + this.velocity.y + this.accel.y) +
          this.realSize +
          5;
        // Size check
        let size = getLongestEdge(x1, y1, x2, y1);
        let sizeDiff = savedSize / size;
        // Update data
        data = {
          min: [x1, y1],
          max: [x2, y2],
          active: true,
          size: size,
        };
        // Update grid if needed
        if (sizeDiff > Math.SQRT2 || sizeDiff < Math.SQRT1_2) {
          this.removeFromGrid();
          this.addToGrid();
          savedSize = data.size;
        }
      };
      return () => {
        return data;
      };
    })();
    this.updateAABB(true);
    entities.push(this); // everything else
    views.forEach((v) => v.add(this));
  }

  life() {
    bringToLife(this);
  }

  addController(newIO) {
    if (Array.isArray(newIO)) {
      this.controllers = newIO.concat(this.controllers);
    } else {
      this.controllers.unshift(newIO);
    }
  }

  define(set) {
    this.upgrades = []; // Safety...
    if (set.PARENT != null) {
      for (let i = 0; i < set.PARENT.length; i++) {
        this.define(set.PARENT[i]);
      }
    }
    if (set.ALPHA != null) {
      this.maxAlpha = set.ALPHA;
      this.invulnFlash = false;
      this.alpha = set.ALPHA;
    }
    if (set.INVISIBLE != null) {
      this.invisible = set.INVISIBLE;
    }
    if (set.index != null) {
      this.index = set.index;
    }
    if (set.NAME != null) {
      this.name = set.NAME;
    }
    if (set.LABEL != null) {
      this.label = set.LABEL;
    }
    if (set.TYPE != null) {
      this.type = set.TYPE;
    }
    if (set.SHAPE != null) {
      this.shape = set.SHAPE;
    }
    if (set.COLOR != null) {
      this.color = set.COLOR;
    }
    if (set.CONTROLLERS != null) {
      let toAdd = [];
      set.CONTROLLERS.forEach((ioName) => {
        toAdd.push(eval("new io_" + ioName + "(this)"));
      });
      this.addController(toAdd);
    }
    if (set.MOTION_TYPE != null) {
      this.motionType = set.MOTION_TYPE;
    }
    if (set.FACING_TYPE != null) {
      this.facingType = set.FACING_TYPE;
    }
    if (set.DRAW_HEALTH != null) {
      this.settings.drawHealth = set.DRAW_HEALTH;
    }
    if (set.DRAW_SELF != null) {
      this.settings.drawShape = set.DRAW_SELF;
    }
    if (set.DAMAGE_EFFECTS != null) {
      this.settings.damageEffects = set.DAMAGE_EFFECTS;
    }
    if (set.RATIO_EFFECTS != null) {
      this.settings.ratioEffects = set.RATIO_EFFECTS;
    }
    if (set.MOTION_EFFECTS != null) {
      this.settings.motionEffects = set.MOTION_EFFECTS;
    }
    if (set.ACCEPTS_SCORE != null) {
      this.settings.acceptsScore = set.ACCEPTS_SCORE;
    }
    if (set.GIVE_KILL_MESSAGE != null) {
      this.settings.givesKillMessage = set.GIVE_KILL_MESSAGE;
    }
    if (set.CAN_GO_OUTSIDE_ROOM != null) {
      this.settings.canGoOutsideRoom = set.CAN_GO_OUTSIDE_ROOM;
    }
    if (set.HITS_OWN_TYPE != null) {
      this.settings.hitsOwnType = set.HITS_OWN_TYPE;
    }
    if (set.DIE_AT_LOW_SPEED != null) {
      this.settings.diesAtLowSpeed = set.DIE_AT_LOW_SPEED;
    }
    if (set.DIE_AT_RANGE != null) {
      this.settings.diesAtRange = set.DIE_AT_RANGE;
    }
    if (set.INDEPENDENT != null) {
      this.settings.independent = set.INDEPENDENT;
    }
    if (set.PERSISTS_AFTER_DEATH != null) {
      this.settings.persistsAfterDeath = set.PERSISTS_AFTER_DEATH;
    }
    if (set.CLEAR_ON_MASTER_UPGRADE != null) {
      this.settings.clearOnMasterUpgrade = set.CLEAR_ON_MASTER_UPGRADE;
    }
    if (set.HEALTH_WITH_LEVEL != null) {
      this.settings.healthWithLevel = set.HEALTH_WITH_LEVEL;
    }
    if (set.ACCEPTS_SCORE != null) {
      this.settings.acceptsScore = set.ACCEPTS_SCORE;
    }
    if (set.OBSTACLE != null) {
      this.settings.obstacle = set.OBSTACLE;
    }
    if (set.NECRO != null) {
      this.settings.isNecromancer = set.NECRO;
    }
    if (set.AUTO_UPGRADE != null) {
      this.settings.upgrading = set.AUTO_UPGRADE;
    }
    if (set.HAS_NO_RECOIL != null) {
      this.settings.hasNoRecoil = set.HAS_NO_RECOIL;
    }
    if (set.CRAVES_ATTENTION != null) {
      this.settings.attentionCraver = set.CRAVES_ATTENTION;
    }
    if (set.BROADCAST_MESSAGE != null) {
      this.settings.broadcastMessage =
        set.BROADCAST_MESSAGE === "" ? undefined : set.BROADCAST_MESSAGE;
    }
    if (set.DAMAGE_CLASS != null) {
      this.settings.damageClass = set.DAMAGE_CLASS;
    }
    if (set.BUFF_VS_FOOD != null) {
      this.settings.buffVsFood = set.BUFF_VS_FOOD;
    }
    if (set.CAN_BE_ON_LEADERBOARD != null) {
      this.settings.leaderboardable = set.CAN_BE_ON_LEADERBOARD;
    }
    if (set.INTANGIBLE != null) {
      this.intangibility = set.INTANGIBLE;
    }
    if (set.IS_SMASHER != null) {
      this.settings.reloadToAcceleration = set.IS_SMASHER;
    }
    if (set.STAT_NAMES != null) {
      this.settings.skillNames = set.STAT_NAMES;
    }
    if (set.AI != null) {
      this.aiSettings = set.AI;
    }
    if (set.DANGER != null) {
      this.dangerValue = set.DANGER;
    }
    if (set.VARIES_IN_SIZE != null) {
      this.settings.variesInSize = set.VARIES_IN_SIZE;
      this.squiggle = this.settings.variesInSize
        ? ran.randomRange(0.8, 1.2)
        : 1;
    }
    if (set.RESET_UPGRADES) {
      this.upgrades = [];
    }
    if (set.UPGRADES_TIER_1 != null) {
      set.UPGRADES_TIER_1.forEach((e) => {
        this.upgrades.push({
          class: e,
          level: c.TIER_1,
          index: e.index,
          tier: 1,
        });
      });
    }
    if (set.UPGRADES_TIER_2 != null) {
      set.UPGRADES_TIER_2.forEach((e) => {
        this.upgrades.push({
          class: e,
          level: c.TIER_2,
          index: e.index,
          tier: 2,
        });
      });
    }
    if (set.UPGRADES_TIER_3 != null) {
      set.UPGRADES_TIER_3.forEach((e) => {
        this.upgrades.push({
          class: e,
          level: c.TIER_3,
          index: e.index,
          tier: 3,
        });
      });
    }
    if (set.SIZE != null) {
      this.SIZE = set.SIZE * this.squiggle;
      if (this.coreSize == null) {
        this.coreSize = this.SIZE;
      }
    }
    if (set.SKILL != null && set.SKILL != []) {
      if (set.SKILL.length != 10) {
        throw "Inappropiate skill raws.";
      }
      this.skill.set(set.SKILL);
    }
    if (set.LEVEL != null) {
      if (set.LEVEL === -1) {
        this.skill.reset();
      }
      while (
        this.skill.level < c.SKILL_CHEAT_CAP &&
        this.skill.level < set.LEVEL
      ) {
        this.skill.score += this.skill.levelScore;
        this.skill.maintain();
      }
      this.refreshBodyAttributes();
    }
    if (set.SKILL_CAP != null && set.SKILL_CAP != []) {
      if (set.SKILL_CAP.length != 10) {
        throw "Inappropiate skill caps.";
      }
      this.skill.setCaps(set.SKILL_CAP);
    }
    if (set.VALUE != null) {
      this.skill.score = Math.max(this.skill.score, set.VALUE * this.squiggle);
    }
    if (set.ALT_ABILITIES != null) {
      this.abilities = set.ALT_ABILITIES;
    }
    if (set.GUNS != null) {
      let newGuns = [];
      set.GUNS.forEach((gundef) => {
        newGuns.push(new Gun(this, gundef));
      });
      this.guns = newGuns;
    }
    if (set.MAX_CHILDREN != null) {
      this.maxChildren = set.MAX_CHILDREN;
    }
    if (set.FOOD != null) {
      if (set.FOOD.LEVEL != null) {
        this.foodLevel = set.FOOD.LEVEL;
        this.foodCountup = 0;
      }
    }
    if (set.BODY != null) {
      if (set.BODY.ACCELERATION != null) {
        this.ACCELERATION = set.BODY.ACCELERATION;
      }
      if (set.BODY.SPEED != null) {
        this.SPEED = set.BODY.SPEED;
      }
      if (set.BODY.HEALTH != null) {
        this.HEALTH = set.BODY.HEALTH;
      }
      if (set.BODY.RESIST != null) {
        this.RESIST = set.BODY.RESIST;
      }
      if (set.BODY.SHIELD != null) {
        this.SHIELD = set.BODY.SHIELD;
      }
      if (set.BODY.REGEN != null) {
        this.REGEN = set.BODY.REGEN;
      }
      if (set.BODY.DAMAGE != null) {
        this.DAMAGE = set.BODY.DAMAGE;
      }
      if (set.BODY.PENETRATION != null) {
        this.PENETRATION = set.BODY.PENETRATION;
      }
      if (set.BODY.FOV != null) {
        this.FOV = set.BODY.FOV;
      }
      if (set.BODY.RANGE != null) {
        this.RANGE = set.BODY.RANGE;
      }
      if (set.BODY.SHOCK_ABSORB != null) {
        this.SHOCK_ABSORB = set.BODY.SHOCK_ABSORB;
      }
      if (set.BODY.DENSITY != null) {
        this.DENSITY = set.BODY.DENSITY;
      }
      if (set.BODY.STEALTH != null) {
        this.STEALTH = set.BODY.STEALTH;
      }
      if (set.BODY.PUSHABILITY != null) {
        this.PUSHABILITY = set.BODY.PUSHABILITY;
      }
      if (set.BODY.HETERO != null) {
        this.heteroMultiplier = set.BODY.HETERO;
      }
      this.refreshBodyAttributes();
    }
    if (set.TURRETS != null) {
      let o;
      this.turrets.forEach((o) => o.destroy());
      this.turrets = [];
      set.TURRETS.forEach((def) => {
        o = new Entity(this, this.master);
        (Array.isArray(def.TYPE) ? def.TYPE : [def.TYPE]).forEach((type) =>
          o.define(type)
        );
        o.bindToMaster(def.POSITION, this);
        o.define({ DANGER: -100 });
      });
    }
    if (set.mockup != null) {
      this.mockup = set.mockup;
    }
  }

  refreshBodyAttributes() {
    let speedReduce = Math.pow(this.size / (this.coreSize || this.SIZE), 1);

    this.acceleration = (c.runSpeed * this.ACCELERATION) / speedReduce;
    if (this.settings.reloadToAcceleration) this.acceleration *= this.skill.acl;

    this.topSpeed = (c.runSpeed * this.SPEED * this.skill.mob) / speedReduce;
    if (this.settings.reloadToAcceleration)
      this.topSpeed /= Math.sqrt(this.skill.acl);

    this.health.set(
      ((this.settings.healthWithLevel ? 2 * this.skill.level : 0) +
        this.HEALTH) *
        this.skill.hlt
    );

    this.health.resist = 1 - 1 / Math.max(1, this.RESIST + this.skill.brst);

    this.shield.set(
      ((this.settings.healthWithLevel ? 0.6 * this.skill.level : 0) +
        this.SHIELD) *
        this.skill.shi,
      Math.max(
        0,
        ((this.settings.healthWithLevel ? 0.006 * this.skill.level : 0) + 1) *
          this.REGEN *
          this.skill.rgn
      )
    );

    this.damage = this.DAMAGE * this.skill.atk;

    this.penetration =
      this.PENETRATION + 1.5 * (this.skill.brst + 0.8 * (this.skill.atk - 1));

    if (!this.settings.dieAtRange || !this.range) {
      this.range = this.RANGE;
    }

    this.fov =
      this.FOV * 250 * Math.sqrt(this.size) * (1 + 0.003 * this.skill.level);

    this.density = (1 + 0.08 * this.skill.level) * this.DENSITY;

    this.stealth = this.STEALTH;

    this.pushability = this.PUSHABILITY;
  }

  bindToMaster(position, bond) {
    this.bond = bond;
    this.source = bond;
    this.bond.turrets.push(this);
    this.skill = this.bond.skill;
    this.label = this.bond.label + " " + this.label;
    // It will not be in collision calculations any more nor shall it be seen.
    this.removeFromGrid();
    this.settings.drawShape = false;
    // Get my position.
    this.bound = {};
    this.bound.size = position[0] / 20;
    let _off = new Vector(position[1], position[2]);
    this.bound.angle = (position[3] * Math.PI) / 180;
    this.bound.direction = _off.direction;
    this.bound.offset = _off.length / 10;
    this.bound.arc = (position[4] * Math.PI) / 180;
    // Figure out how we'll be drawn.
    this.bound.layer = position[5];
    // Initalize.
    this.facing = this.bond.facing + this.bound.angle;
    this.facingType = "bound";
    this.motionType = "bound";
    this.move();
  }

  get size() {
    if (this.bond == null)
      return (this.coreSize || this.SIZE) * (1 + this.skill.level / 45);
    return this.bond.size * this.bound.size;
  }

  get mass() {
    return this.density * (this.size * this.size + 1);
  }

  get realSize() {
    return (
      this.size *
      (Math.abs(this.shape) > lazyRealSizes.length
        ? 1
        : lazyRealSizes[Math.abs(this.shape)])
    );
  }

  get m_x() {
    return (this.velocity.x + this.accel.x) / roomSpeed;
  }
  get m_y() {
    return (this.velocity.y + this.accel.y) / roomSpeed;
  }

  camera(tur = false) {
    return {
      type:
        0 +
        tur * 0x01 +
        this.settings.drawHealth * 0x02 +
        (this.type === "tank") * 0x04,
      id: this.id,
      index: this.index,
      x: this.x,
      y: this.y,
      vx: this.velocity.x,
      vy: this.velocity.y,
      size: this.size,
      rsize: this.realSize,
      status: 1,
      alpha: this.alpha,
      health: this.health.display(),
      shield: this.shield.display(),
      facing: this.facing,
      vfacing: this.vfacing,
      twiggle:
        this.facingType === "autospin" ||
        (this.facingType === "locksFacing" && this.control.alt),
      layer:
        this.bond != null
          ? this.bound.layer
          : this.type === "wall"
          ? 11
          : this.type === "food"
          ? 10
          : this.type === "tank"
          ? 5
          : this.type === "crasher"
          ? 1
          : 0,
      color: this.color,
      // ============================================================
      // Chat System.
      // ============================================================
      roleColorIndex: this.roleColorIndex,
      // ============================================================
      name: this.nameColor + this.name,
      score: this.skill.score,
      guns: this.guns.map((gun) => gun.getLastShot()),
      turrets: this.turrets.map((turret) => turret.camera(true)),
    };
  }

  skillUp(stat) {
    let suc = this.skill.upgrade(stat);
    if (suc) {
      this.refreshBodyAttributes();
      this.guns.forEach(function (gun) {
        gun.syncChildren();
      });
    }
    return suc;
  }

  upgrade(number) {
    if (
      number < this.upgrades.length &&
      this.skill.level >= this.upgrades[number].level
    ) {
      let saveMe = this.upgrades[number].class;
      this.upgrades = [];
      this.define(saveMe);
      this.sendMessage("You have upgraded to " + this.label + ".");
      let ID = this.id;
      // =============================================
// Elemental powers. Modified by attacker.
// =============================================
// slowdown speed and firerate if earth effect. It can detect now whether it has a power upon you upgrade. ....
if(saveMe.EARTH == true){
}
      entities.forEach((instance) => {
        if (
          instance.settings.clearOnMasterUpgrade &&
          instance.master.id === ID
        ) {
          instance.kill();
        }
      });
      this.skill.update();
      this.refreshBodyAttributes();
    }
  }

  damageMultiplier() {
    switch (this.type) {
      case "swarm":
        return 0.25 + 1.5 * util.clamp(this.range / (this.RANGE + 1), 0, 1);
      default:
        return 1;
    }
  }

  move() {
    let g = {
        x: this.control.goal.x - this.x,
        y: this.control.goal.y - this.y,
      },
      gactive = g.x !== 0 || g.y !== 0,
      engine = {
        x: 0,
        y: 0,
      },
      a = this.acceleration / roomSpeed;
    switch (this.motionType) {
      case "glide":
        this.maxSpeed = this.topSpeed;
        this.damp = 0.05;
        break;
          case 'freeze':
                            this.maxSpeed = 0;
                            this.velocity.x = 0;
                            this.velocity.y = 0;
                            this.SIZE += 0
                            this.damage += 1
                            this.penetration += 500
                            break;
           case 'flame':
                        this.SIZE += 4
                        this.damage += 0.5
                        this.penetration += 0.5
                        this.maxSpeed = 2
                        break;
          case 'grow':
            this.SIZE += 50
            break;
          case 'growfast':
            this.SIZE += 400
            break;
            case "ultragrow":
            	this.SIZE += 5;
            	this.maxSpeed = this.topSpeed;
            	break;

      case "motor":
        this.maxSpeed = 0;
        if (this.topSpeed) {
          this.damp = a / this.topSpeed;
        }
        if (gactive) {
          let len = Math.sqrt(g.x * g.x + g.y * g.y);
          engine = {
            x: (a * g.x) / len,
            y: (a * g.y) / len,
          };
        }
        break;
      case "swarm":
        this.maxSpeed = this.topSpeed;
        let l =
          util.getDistance(
            {
              x: 0,
              y: 0,
            },
            g
          ) + 1;
        if (gactive && l > this.size) {
          let desiredxspeed = (this.topSpeed * g.x) / l,
            desiredyspeed = (this.topSpeed * g.y) / l,
            turning = Math.sqrt(
              (this.topSpeed * Math.max(1, this.range) + 1) / a
            );
          engine = {
            x: (desiredxspeed - this.velocity.x) / Math.max(5, turning),
            y: (desiredyspeed - this.velocity.y) / Math.max(5, turning),
          };
        } else {
          if (this.velocity.length < this.topSpeed) {
            engine = {
              x: (this.velocity.x * a) / 20,
              y: (this.velocity.y * a) / 20,
            };
          }
        }
        break;
      case "chase":
        if (gactive) {
          let l = util.getDistance(
            {
              x: 0,
              y: 0,
            },
            g
          );
          if (l > this.size * 2) {
            this.maxSpeed = this.topSpeed;
            let desiredxspeed = (this.topSpeed * g.x) / l,
              desiredyspeed = (this.topSpeed * g.y) / l;
            engine = {
              x: (desiredxspeed - this.velocity.x) * a,
              y: (desiredyspeed - this.velocity.y) * a,
            };
          } else {
            this.maxSpeed = 0;
          }
        } else {
          this.maxSpeed = 0;
        }
        break;
      case "drift":
        this.maxSpeed = 0;
        engine = {
          x: g.x * a,
          y: g.y * a,
        };
        break;
      case "bound":
        let bound = this.bound,
          ref = this.bond;
        this.x =
          ref.x +
          ref.size *
            bound.offset *
            Math.cos(bound.direction + bound.angle + ref.facing);
        this.y =
          ref.y +
          ref.size *
            bound.offset *
            Math.sin(bound.direction + bound.angle + ref.facing);
        this.bond.velocity.x += bound.size * this.accel.x;
        this.bond.velocity.y += bound.size * this.accel.y;
        this.firingArc = [ref.facing + bound.angle, bound.arc / 2];
        nullVector(this.accel);
        this.blend = ref.blend;
        break;
    }
    this.accel.x += engine.x * this.control.power;
    this.accel.y += engine.y * this.control.power;
  }

  face() {
    let t = this.control.target,
      tactive = t.x !== 0 || t.y !== 0,
      oldFacing = this.facing;
    switch (this.facingType) {
      case "autospin":
        this.facing += 0.02 / roomSpeed;
        break;
      case "turnWithSpeed":
        this.facing += ((this.velocity.length / 90) * Math.PI) / roomSpeed;
        break;
      case "withMotion":
        this.facing = this.velocity.direction;
        break;
      case "smoothWithMotion":
      case "looseWithMotion":
        this.facing += util.loopSmooth(
          this.facing,
          this.velocity.direction,
          4 / roomSpeed
        );
        break;
      case "withTarget":
      case "toTarget":
        this.facing = Math.atan2(t.y, t.x);
        break;
      case "locksFacing":
        if (!this.control.alt) this.facing = Math.atan2(t.y, t.x);
        break;
      case "looseWithTarget":
      case "looseToTarget":
      case "smoothToTarget":
        this.facing += util.loopSmooth(
          this.facing,
          Math.atan2(t.y, t.x),
          4 / roomSpeed
        );
        break;
      case "bound":
        let givenangle;
        if (this.control.main) {
          givenangle = Math.atan2(t.y, t.x);
          let diff = util.angleDifference(givenangle, this.firingArc[0]);
          if (Math.abs(diff) >= this.firingArc[1]) {
            givenangle = this.firingArc[0]; // - util.clamp(Math.sign(diff), -this.firingArc[1], this.firingArc[1]);
          }
        } else {
          givenangle = this.firingArc[0];
        }
        this.facing += util.loopSmooth(this.facing, givenangle, 4 / roomSpeed);
        break;
    }
    // Loop
    while (this.facing < 0) {
      this.facing += 2 * Math.PI;
    }
    while (this.facing > 2 * Math.PI) {
      this.facing -= 2 * Math.PI;
    }
    this.vfacing = util.angleDifference(oldFacing, this.facing) * roomSpeed;
  }

  takeSelfie() {
    this.flattenedPhoto = null;
    this.photo = this.settings.drawShape
      ? this.camera()
      : (this.photo = undefined);
  }

  physics() {
    if (this.accel.x == null || this.velocity.x == null) {
      util.error("Void Error!");
      util.error(this.collisionArray);
      util.error(this.label);
      util.error(this);
      nullVector(this.accel);
      nullVector(this.velocity);
    }
    // Apply acceleration
    this.velocity.x += this.accel.x;
    this.velocity.y += this.accel.y;
    // Reset acceleration
    nullVector(this.accel);
    // Apply motion
    this.stepRemaining = 1;
    this.x += (this.stepRemaining * this.velocity.x) / roomSpeed;
    this.y += (this.stepRemaining * this.velocity.y) / roomSpeed;
  }

  friction() {
    var motion = this.velocity.length,
      excess = motion - this.maxSpeed;
    if (excess > 0 && this.damp) {
      var k = this.damp / roomSpeed,
        drag = excess / (k + 1),
        finalvelocity = this.maxSpeed + drag;
      this.velocity.x = (finalvelocity * this.velocity.x) / motion;
      this.velocity.y = (finalvelocity * this.velocity.y) / motion;
    }
  }

  confinementToTheseEarthlyShackles() {
    if (this.x == null || this.x == null) {
      util.error("Void Error!");
      util.error(this.collisionArray);
      util.error(this.label);
      util.error(this);
      nullVector(this.accel);
      nullVector(this.velocity);
      return 0;
    }
    if (!this.settings.canGoOutsideRoom) {
      this.accel.x -=
        (Math.min(this.x - this.realSize + 50, 0) * c.ROOM_BOUND_FORCE) /
        roomSpeed;
      this.accel.x -=
        (Math.max(this.x + this.realSize - room.width - 50, 0) *
          c.ROOM_BOUND_FORCE) /
        roomSpeed;
      this.accel.y -=
        (Math.min(this.y - this.realSize + 50, 0) * c.ROOM_BOUND_FORCE) /
        roomSpeed;
      this.accel.y -=
        (Math.max(this.y + this.realSize - room.height - 50, 0) *
          c.ROOM_BOUND_FORCE) /
        roomSpeed;
    }
    if (
      room.gameMode === "tdm" &&
      this.type !== "food" &&
      this.type !== "spectator"
    ) {
      let loc = {
        x: this.x,
        y: this.y,
      };
      if (
        (this.team !== -1 && room.isIn("bas1", loc)) ||
        (this.team !== -2 && room.isIn("bas2", loc)) ||
        (this.team !== -3 && room.isIn("bas3", loc)) ||
        (this.team !== -4 && room.isIn("bas4", loc))
      ) {
        this.kill();
      }
    }
  }

  contemplationOfMortality() {
    if (this.invuln) {
      this.damageRecieved = 0;
      return 0;
    }
    // Life-limiting effects
    if (this.settings.diesAtRange) {
      this.range -= 1 / roomSpeed;
      if (this.range < 0) {
        this.kill();
      }
    }
    if (this.settings.diesAtLowSpeed) {
      if (
        !this.collisionArray.length &&
        this.velocity.length < this.topSpeed / 2
      ) {
        this.health.amount -= this.health.getDamage(1 / roomSpeed);
      }
    }
    // Shield regen and damage
    if (this.shield.max) {
      if (this.damageRecieved !== 0) {
        let shieldDamage = this.shield.getDamage(this.damageRecieved);
        this.damageRecieved -= shieldDamage;
        this.shield.amount -= shieldDamage;
      }
    }
    // Health damage
    if (this.damageRecieved !== 0) {
      let healthDamage = this.health.getDamage(this.damageRecieved);
      this.blend.amount = 1;
      this.health.amount -= healthDamage;
    }
    this.damageRecieved = 0;

    // Check for death
    if (this.isDead()) {
      if (this.ondead) this.ondead();
      // Initalize message arrays
      let killers = [],
        killTools = [],
        notJustFood = false;
      // If I'm a tank, call me a nameless player
      let name =
        this.master.name == ""
          ? this.master.type === "tank"
            ? "a nameless player's " + this.label
            : this.master.type === "miniboss"
            ? "a visiting " + this.label
            : util.addArticle(this.label)
          : this.master.name + "'s " + this.label;
      // Calculate the jackpot
      let jackpot = Math.ceil(
        util.getJackpot(this.skill.score) / this.collisionArray.length
      );
      // Now for each of the things that kill me...
      this.collisionArray.forEach((instance) => {
        if (instance.type === "wall") return 0;
        if (instance.master.settings.acceptsScore) {
          // If it's not food, give its master the score
          if (
            instance.master.type === "tank" ||
            instance.master.type === "miniboss"
          )
            notJustFood = true;
          instance.master.skill.score += jackpot;
          killers.push(instance.master); // And keep track of who killed me
        } else if (instance.settings.acceptsScore) {
          instance.skill.score += jackpot;
        }
        killTools.push(instance); // Keep track of what actually killed me
      });
      // Remove duplicates
      killers = killers.filter((elem, index, self) => {
        return index == self.indexOf(elem);
      });
      // If there's no valid killers (you were killed by food), change the message to be more passive
      let killText = notJustFood ? "" : "You have been killed by ",
        dothISendAText = this.settings.givesKillMessage;
      killers.forEach((instance) => {
        this.killCount.killers.push(instance.index);
        if (this.type === "tank") {
          if (killers.length > 1) instance.killCount.assists++;
          else instance.killCount.solo++;
        } else if (this.type === "miniboss") instance.killCount.bosses++;
      });
      // Add the killers to our death message, also send them a message
      if (notJustFood) {
        killers.forEach((instance) => {
          if (
            instance.master.type !== "food" &&
            instance.master.type !== "crasher"
          ) {
            killText +=
              instance.name == ""
                ? killText == ""
                  ? "An unnamed player"
                  : "an unnamed player"
                : instance.name;
            killText += " and ";
          }
          // Only if we give messages
          if (dothISendAText) {
            instance.sendMessage(
              "You killed " +
                name +
                (killers.length > 1 ? " (with some help)." : ".")
            );
          }
        });
        // Prepare the next part of the next
        killText = killText.slice(0, -4);
        killText += "killed you with ";
      }
      // Broadcast
      if (this.settings.broadcastMessage)
        sockets.broadcast(this.settings.broadcastMessage);
      // Add the implements to the message
      killTools.forEach((instance) => {
        killText += util.addArticle(instance.label) + " and ";
      });
      // Prepare it and clear the collision array.
      killText = killText.slice(0, -5);
      if (killText === "You have been kille")
        killText = "You have died a stupid death";
      this.sendMessage(killText + ".");
      // If I'm the leader, broadcast it:
      if (this.id === room.topPlayerID) {
        let usurptText = this.name === "" ? "The leader" : this.name;
        if (notJustFood) {
          usurptText += " has been usurped by";
          killers.forEach((instance) => {
            usurptText += " ";
            usurptText +=
              instance.name === "" ? "an unnamed player" : instance.name;
            usurptText += " and";
          });
          usurptText = usurptText.slice(0, -4);
          usurptText += "!";
        } else {
          usurptText += " fought a polygon... and the polygon won.";
        }
        sockets.broadcast(usurptText);
        console.log(killText);
      }
      // Kill it
      return 1;
    }
    return 0;
  }

  protect() {
    entitiesToAvoid.push(this);
    this.isProtected = true;
  }

  sendMessage(message) {} // Dummy

  kill() {
    this.invuln = false;
    this.health.amount = -1;
  }

  destroy() {
    // Remove from the protected entities list
    if (this.isProtected)
      util.remove(entitiesToAvoid, entitiesToAvoid.indexOf(this));
    // Remove from minimap
    let i = minimap.findIndex((entry) => {
      return entry[0] === this.id;
    });
    if (i != -1) util.remove(minimap, i);

    // Remove this from views
    views.forEach((v) => v.remove(this));
    // Remove from parent lists if needed
    if (this.parent != null)
      util.remove(this.parent.children, this.parent.children.indexOf(this));
    // Kill all of its children
    let ID = this.id;
    entities.forEach((instance) => {
      if (instance.source.id === this.id) {
        if (instance.settings.persistsAfterDeath) {
          instance.source = instance;
        } else {
          instance.kill();
        }
      }
      if (instance.parent && instance.parent.id === this.id) {
        instance.parent = null;
      }
      if (instance.master.id === this.id) {
        instance.kill();
        instance.master = instance;
      }
    });
    // Remove everything bound to it
    this.turrets.forEach((t) => t.destroy());
    // Remove from the collision grid
    this.removeFromGrid();
    this.isGhost = true;
    this.kill();
  }

  isDead() {
    return this.health.amount <= 0;
  }
}

/*** SERVER SETUP ***/
// Make a speed monitor
var logs = (() => {
  let logger = (() => {
    // The two basic functions
    function set(obj) {
      obj.time = util.time();
    }

    function mark(obj) {
      obj.data.push(util.time() - obj.time);
    }

    function record(obj) {
      let o = util.averageArray(obj.data);
      obj.data = [];
      return o;
    }

    function sum(obj) {
      let o = util.sumArray(obj.data);
      obj.data = [];
      return o;
    }

    function tally(obj) {
      obj.count++;
    }

    function count(obj) {
      let o = obj.count;
      obj.count = 0;
      return o;
    }
    // Return the logger creator
    return () => {
      let internal = {
        data: [],
        time: util.time(),
        count: 0,
      };
      // Return the new logger
      return {
        set: () => set(internal),
        mark: () => mark(internal),
        record: () => record(internal),
        sum: () => sum(internal),
        count: () => count(internal),
        tally: () => tally(internal),
      };
    };
  })();
  // Return our loggers
  return {
    entities: logger(),
    collide: logger(),
    network: logger(),
    minimap: logger(),
    misc2: logger(),
    misc3: logger(),
    physics: logger(),
    life: logger(),
    selfie: logger(),
    master: logger(),
    activation: logger(),
    loops: logger(),
  };
})();

// Essential server requires
var express = require("express"),
  http = require("http"),
  url = require("url"),
  WebSocket = require("ws"),
  app = express(),
  fs = require("fs"),
  // ======================================================
  // Chat System.
  // ======================================================
  path = require("path"),
  // ======================================================
  exportDefintionsToClient = (() => {
    function rounder(val) {
      if (Math.abs(val) < 0.00001) val = 0;
      return +val.toPrecision(6);
    }
    // Define mocking up functions
    function getMockup(e, positionInfo) {
      return {
        index: e.index,
        name: e.label,
        x: rounder(e.x),
        y: rounder(e.y),
        color: e.color,
        shape: e.shape,
        size: rounder(e.size),
        realSize: rounder(e.realSize),
        facing: rounder(e.facing),
        layer: e.layer,
        statnames: e.settings.skillNames,
        position: positionInfo,
        upgrades: e.upgrades,
        guns: e.guns.map(function (gun) {
          return {
            offset: rounder(gun.offset),
            direction: rounder(gun.direction),
            length: rounder(gun.length),
            width: rounder(gun.width),
            aspect: rounder(gun.aspect),
            angle: rounder(gun.angle),
          };
        }),
        turrets: e.turrets.map(function (t) {
          let out = getMockup(t, {});
          out.sizeFactor = rounder(t.bound.size);
          out.offset = rounder(t.bound.offset);
          out.direction = rounder(t.bound.direction);
          out.layer = rounder(t.bound.layer);
          out.angle = rounder(t.bound.angle);
          return out;
        }),
      };
    }

    function getDimensions(entities) {
      /* Ritter's Algorithm (Okay it got serious modified for how we start it)
       * 1) Add all the ends of the guns to our list of points needed to be bounded and a couple points for the body of the tank..
       */
      let endpoints = [];
      let pointDisplay = [];
      let pushEndpoints = function (
        model,
        scale,
        focus = {
          x: 0,
          y: 0,
        },
        rot = 0
      ) {
        let s = Math.abs(model.shape);
        let z =
          Math.abs(s) > lazyRealSizes.length ? 1 : lazyRealSizes[Math.abs(s)];
        if (z === 1) {
          // Body (octagon if circle)
          for (let i = 0; i < 2; i += 0.5) {
            endpoints.push({
              x: focus.x + scale * Math.cos(i * Math.PI),
              y: focus.y + scale * Math.sin(i * Math.PI),
            });
          }
        } else {
          // Body (otherwise vertices)
          for (let i = s % 2 ? 0 : Math.PI / s; i < s; i++) {
            let theta = (i / s) * 2 * Math.PI;
            endpoints.push({
              x: focus.x + scale * z * Math.cos(theta),
              y: focus.y + scale * z * Math.sin(theta),
            });
          }
        }
        model.guns.forEach(function (gun) {
          let h =
            gun.aspect > 0
              ? ((scale * gun.width) / 2) * gun.aspect
              : (scale * gun.width) / 2;
          let r = Math.atan2(h, scale * gun.length) + rot;
          let l = Math.sqrt(scale * scale * gun.length * gun.length + h * h);
          let x =
            focus.x +
            scale * gun.offset * Math.cos(gun.direction + gun.angle + rot);
          let y =
            focus.y +
            scale * gun.offset * Math.sin(gun.direction + gun.angle + rot);
          endpoints.push({
            x: x + l * Math.cos(gun.angle + r),
            y: y + l * Math.sin(gun.angle + r),
          });
          endpoints.push({
            x: x + l * Math.cos(gun.angle - r),
            y: y + l * Math.sin(gun.angle - r),
          });
          pointDisplay.push({
            x: x + l * Math.cos(gun.angle + r),
            y: y + l * Math.sin(gun.angle + r),
          });
          pointDisplay.push({
            x: x + l * Math.cos(gun.angle - r),
            y: y + l * Math.sin(gun.angle - r),
          });
        });
        model.turrets.forEach(function (turret) {
          pushEndpoints(
            turret,
            turret.bound.size,
            {
              x: turret.bound.offset * Math.cos(turret.bound.angle),
              y: turret.bound.offset * Math.sin(turret.bound.angle),
            },
            turret.bound.angle
          );
        });
      };
      pushEndpoints(entities, 1);
      // 2) Find their mass center
      let massCenter = {
        x: 0,
        y: 0,
      };
      /*endpoints.forEach(function(point) {
          massCenter.x += point.x;
          massCenter.y += point.y;
      });
      massCenter.x /= endpoints.length;
      massCenter.y /= endpoints.length;*/
      // 3) Choose three different points (hopefully ones very far from each other)
      let chooseFurthestAndRemove = function (furthestFrom) {
        let index = 0;
        if (furthestFrom != -1) {
          let list = new goog.structs.PriorityQueue();
          let d;
          for (let i = 0; i < endpoints.length; i++) {
            let thisPoint = endpoints[i];
            d =
              Math.pow(thisPoint.x - furthestFrom.x, 2) +
              Math.pow(thisPoint.y - furthestFrom.y, 2) +
              1;
            list.enqueue(1 / d, i);
          }
          index = list.dequeue();
        }
        let output = endpoints[index];
        endpoints.splice(index, 1);
        return output;
      };
      let point1 = chooseFurthestAndRemove(massCenter); // Choose the point furthest from the mass center
      let point2 = chooseFurthestAndRemove(point1); // And the point furthest from that
      // And the point which maximizes the area of our triangle (a loose look at this one)
      let chooseBiggestTriangleAndRemove = function (point1, point2) {
        let list = new goog.structs.PriorityQueue();
        let index = 0;
        let a;
        for (let i = 0; i < endpoints.length; i++) {
          let thisPoint = endpoints[i];
          a =
            Math.pow(thisPoint.x - point1.x, 2) +
            Math.pow(thisPoint.y - point1.y, 2) +
            Math.pow(thisPoint.x - point2.x, 2) +
            Math.pow(thisPoint.y - point2.y, 2);
          /* We need neither to calculate the last part of the triangle
           * (because it's always the same) nor divide by 2 to get the
           * actual area (because we're just comparing it)
           */
          list.enqueue(1 / a, i);
        }
        index = list.dequeue();
        let output = endpoints[index];
        endpoints.splice(index, 1);
        return output;
      };
      let point3 = chooseBiggestTriangleAndRemove(point1, point2);
      // 4) Define our first enclosing circle as the one which seperates these three furthest points
      function circleOfThreePoints(p1, p2, p3) {
        let x1 = p1.x;
        let y1 = p1.y;
        let x2 = p2.x;
        let y2 = p2.y;
        let x3 = p3.x;
        let y3 = p3.y;
        let denom = x1 * (y2 - y3) - y1 * (x2 - x3) + x2 * y3 - x3 * y2;
        let xy1 = x1 * x1 + y1 * y1;
        let xy2 = x2 * x2 + y2 * y2;
        let xy3 = x3 * x3 + y3 * y3;
        let x =
          // Numerator
          (xy1 * (y2 - y3) + xy2 * (y3 - y1) + xy3 * (y1 - y2)) / (2 * denom);
        let y =
          // Numerator
          (xy1 * (x3 - x2) + xy2 * (x1 - x3) + xy3 * (x2 - x1)) / (2 * denom);
        let r = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
        let r2 = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        let r3 = Math.sqrt(Math.pow(x - x3, 2) + Math.pow(y - y3, 2));
        if (r != r2 || r != r3) {
          //util.log('somethings fucky');
        }
        return {
          x: x,
          y: y,
          radius: r,
        };
      }
      let c = circleOfThreePoints(point1, point2, point3);
      pointDisplay = [
        {
          x: rounder(point1.x),
          y: rounder(point1.y),
        },
        {
          x: rounder(point2.x),
          y: rounder(point2.y),
        },
        {
          x: rounder(point3.x),
          y: rounder(point3.y),
        },
      ];
      let centerOfCircle = {
        x: c.x,
        y: c.y,
      };
      let radiusOfCircle = c.radius;
      // 5) Check to see if we enclosed everything
      function checkingFunction() {
        for (var i = endpoints.length; i > 0; i--) {
          // Select the one furthest from the center of our circle and remove it
          point1 = chooseFurthestAndRemove(centerOfCircle);
          let vectorFromPointToCircleCenter = new Vector(
            centerOfCircle.x - point1.x,
            centerOfCircle.y - point1.y
          );
          // 6) If we're still outside of this circle build a new circle which encloses the old circle and the new point
          if (vectorFromPointToCircleCenter.length > radiusOfCircle) {
            pointDisplay.push({
              x: rounder(point1.x),
              y: rounder(point1.y),
            });
            // Define our new point as the far side of the cirle
            let dir = vectorFromPointToCircleCenter.direction;
            point2 = {
              x: centerOfCircle.x + radiusOfCircle * Math.cos(dir),
              y: centerOfCircle.y + radiusOfCircle * Math.sin(dir),
            };
            break;
          }
        }
        // False if we checked everything, true if we didn't
        return !!endpoints.length;
      }
      while (checkingFunction()) {
        // 7) Repeat until we enclose everything
        centerOfCircle = {
          x: (point1.x + point2.x) / 2,
          y: (point1.y + point2.y) / 2,
        };
        radiusOfCircle =
          Math.sqrt(
            Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2)
          ) / 2;
      }
      // 8) Since this algorithm isn't perfect but we know our shapes are bilaterally symmetrical, we bind this circle along the x-axis to make it behave better
      return {
        middle: {
          x: rounder(centerOfCircle.x),
          y: 0,
        },
        axis: rounder(radiusOfCircle * 2),
        points: pointDisplay,
      };
    }
    // Save them
    let mockupData = [];
    for (let k in Class) {
      try {
        if (!Class.hasOwnProperty(k)) continue;
        let type = Class[k];
        // Create a reference entities which we'll then take an image of.
        let temptank = new Entity({
          x: 0,
          y: 0,
        });
        temptank.define(type);
        temptank.name = type.LABEL; // Rename it (for the upgrades menu).
        // Fetch the mockup.
        type.mockup = {
          body: temptank.camera(true),
          position: getDimensions(temptank),
        };
        // This is to pass the size information about the mockup that we didn't have until we created the mockup
        type.mockup.body.position = type.mockup.position;
        // Add the new data to the thing.
        mockupData.push(getMockup(temptank, type.mockup.position));
        // Kill the reference entities.
        temptank.destroy();
      } catch (error) {
        util.error(error);
        util.error(k);
        util.error(Class[k]);
      }
    }
    // Remove them
    purgeEntities();
    // Build the function to return
    let writeData = JSON.stringify(mockupData); //, null, 2); // Make it easy to read <3 or don't because it causes a little loading time...
    return (loc) => {
      util.log("Preparing definition export.");
      fs.writeFileSync(loc, writeData, "utf8", (err) => {
        if (err) return util.error(err);
      });
      util.log("Mockups written to " + loc + "!");
      sysok == false;
    };
  })(),
  generateVersionControlHash = (() => {
    let crypto = require("crypto");
    let write = (() => {
      let hash = [null, null];
      return (loc, data, numb) => {
        // The callback is executed on reading completion
        hash[numb] = crypto.createHash("sha1").update(data).digest("hex");
        if (hash[0] && hash[1]) {
          let finalHash = hash[0] + hash[1];
          util.log('Client hash generated. Hash is "' + finalHash + '".');
          // Write the hash to a place the client can read it.
          fs.writeFileSync(loc, finalHash, "utf8", (err) => {
            if (err) return util.error(err);
          });
          util.log("Hash written to " + loc + "!");
        }
      };
    })();
    return (loc) => {
      let path1 = __dirname + "/client/app.js";
      let path2 = __dirname + "/lib/definitions.js";
      util.log(
        "Building client version hash, reading from " +
          path1 +
          " and " +
          path2 +
          "..."
      );
      // Read the client application
      fs.readFile(path1, "utf8", (err, data) => {
        if (err) return util.error(err);
        util.log("app.js complete.");
        write(loc, data, 0);
      });
      fs.readFile(path2, "utf8", (err, data) => {
        if (err) return util.error(err);
        util.log("definitions.js complete.");
        write(loc, data, 1);
      });
    };
  })();

// Give the client upon request
//exportDefintionsToClient(__dirname + "/./client/json/mockups.json");
//generateVersionControlHash(__dirname + "/./client/api/vhash");
app.use(express.static("client"));
app.use(express.json()); // REQUIRED! Do NOT remove.

const rateLimit = require("express-rate-limit"); // anti spam and ddos ratelimiter
function createRateLimiter(maxRequests) {
  return rateLimit({
    windowMs: 180,
    max: maxRequests  // start blocking after "maxRequests" requests  
  });
};

// redirects
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/client/index.html");
});
app.get("/home", (request, response) => {
  response.sendFile(__dirname + "/client/index.html");
});
app.get("/nerd", (request, response) => {
  response.sendFile(__dirname + "/client/nerd/index.html");
});
app.get("/devs", (request, response) => {
  response.sendFile(__dirname + "/client/devs.html");
});
app.get("/sha256", (request, response) => {
  response.sendFile(__dirname + "/client/sha256.html");
});
app.get("/ftb", (request, response) => {
  response.sendFile(__dirname + "/client/ftb/index.html");
});
app.get("/membership", (req, res) => {
  res.sendFile(__dirname + "/client/mship/login.html");
});
app.get("/membership/members", (req, res) => {
  res.sendFile(__dirname + "/client/mship/members.html");
});

// here is where I will write the API post request
app.post("/login", (request, response, next) => {
const database = require("./database.js");
const data = database.database;
// archieve
// data['username']
 // check if it includes a password for authentication
if(!request.body.password){
  response.status(406).json({
        status: 406, 
        success: false,
        message: 'Password is required.'
      });      
};
  // check if it includes an username to login with
if(!request.body.username){
 response.status(406).json({
         status: 406, 
         success: false,
        message: 'Username is required.'
      }); 
};
})
// Websocket behavior
const sockets = (() => {
  const protocol = require("./lib/fasttalk");
  let clients = [],
    players = [],
    //  bannedIPs = [],
    suspiciousIPs = [],
    connectedIPs = [],
    bannedNames = ["FREE_FOOD_LUCARIO", "FREE FOOD"];
  return {
    // ===============================================================================
    // Chat System.
    // ===============================================================================
    broadcast: (message, color = 8) => {
      clients.forEach((socket) => {
        socket.talk("m", message, color);
      });
    },

    getClients: () => {
      return clients;
    },

    isPasswordInUse: (password) => {
      const matches = clients.filter((c) => c.password === password);
      return matches.length > 0;
    },

    broadcastChatMessage: (playerName, message, messageFiltered, role) => {
      try {
        clients.forEach((socket) => {
          if (socket.enableChat) {
            let tmpMessage =
              socket.enableSwearFilter === true ? messageFiltered : message;
            let colorIndex = userAccountsChatColors[role];
            if (colorIndex) {
              socket.talk("h", playerName, tmpMessage, colorIndex);
            } else {
              socket.talk("h", playerName, tmpMessage, 12);
            }
          }
        });
      } catch (error) {
        util.error("[broadcastChatMessage()]");
        util.error(error);
      }
    },

    unicastChatMessage: (
      receiverId,
      sender,
      senderName,
      message,
      messageFiltered,
      senderRole
    ) => {
      try {
        let messageSent = false;

        for (let i = 0; i < clients.length; i++) {
          const client = clients[i];

          if (client.player.viewId === receiverId) {
            if (client.enablePM && client.player.body) {
              let tmpMessage =
                client.enableSwearFilter === true ? messageFiltered : message;
              const msgWithName = "[" + senderName + "] " + tmpMessage;
              client.player.body.sendMessage(msgWithName, pmMessageColor);
              messageSent = true;
              break;
            }
          }
        }

        if (messageSent) {
          sender.player.body.sendMessage("PM sent.", notificationMessageColor);
        } else {
          sender.player.body.sendMessage(
            "Unable to send PM.",
            errorMessageColor
          );
        }
      } catch (error) {
        util.error("[unicastChatMessage()]");
        util.error(error);
      }
    },
    // ===============================================================================
    broadcastRoom: () => {
      for (let socket of clients)
        socket.talk("R", room.width, room.height, JSON.stringify(c.ROOM_SETUP));
    },
    connect: (() => {
      // Define shared functions
      // Closing the socket
      function close(socket) {
        // Free the IP
        let n = connectedIPs.findIndex((w) => {
          return w.ip === socket.ip;
        });
        if (n !== -1) {
          util.log(socket.ip + " disconnected.");
          util.remove(connectedIPs, n);
        }
        // Free the token
        if (socket.key != "" && c.TOKEN_REQUIRED) {
        }
        // Figure out who the player was
        let player = socket.player,
          index = players.indexOf(player);
        // Remove the player if one was created
        if (index != -1) {
          // Kill the body if it exists
          if (player.body != null) {
            player.body.invuln = false;
            player.body.alpha = player.body.maxAlpha;
            setTimeout(() => {
              player.body.kill();
            }, 10000);
          }
          // Disconnect everything
          util.log("[INFO] User " + player.name + " disconnected!");
          util.remove(players, index);
          let embed = new EmbedBuilder()
            .setColor(15548997)
            .setTitle(`${player.name} left the server!`)
            .setTimestamp();
          let channel = client.channels.cache.get("1050004667402293258");
          channel.send({ embeds: [embed] });
        } else {
          util.log("[INFO] A player disconnected before entering the game.");
        }
        // Free the view
        util.remove(views, views.indexOf(socket.view));
        // Remove the socket
        util.remove(clients, clients.indexOf(socket));
        util.log(
          "[INFO] Socket closed. Views: " +
            views.length +
            ". Clients: " +
            clients.length +
            "."
        );
      }
      // Banning
      function ban(socket) {
        if (
          bannedIPs.findIndex((ip) => {
            return ip === socket.ip;
          }) === -1
        ) {
          bannedIPs.push(socket.ip);
        } // No need for duplicates
        socket.terminate();
        util.warn(socket.ip + " banned!");
      }
      // Being kicked
      function kick(socket, reason = "No reason given.") {
        let n = suspiciousIPs.findIndex((n) => {
          return n.ip === socket.ip;
        });
        if (n === -1) {
          suspiciousIPs.push({
            ip: socket.ip,
            warns: 1,
          });
          util.warn(reason + " Kicking. 1 warning.");
        } else {
          suspiciousIPs[n].warns++;
          util.warn(
            reason + " Kicking. " + suspiciousIPs[n].warns + " warnings."
          );
          if (suspiciousIPs[n].warns >= c.socketWarningLimit) {
            ban(socket);
          }
        }
        socket.lastWords("K");
      }

      // Handle incoming messages
      function incoming(message, socket) {
        // Only accept binary
        if (!(message instanceof ArrayBuffer)) {
          socket.kick("Non-binary packet.");
          return 1;
        }
        // Decode it
        let m = protocol.decode(message);
        // Make sure it looks legit
        if (m === -1) {
          socket.kick("Malformed packet.");
          return 1;
        }

        // Log the message request
        socket.status.requests++;
        // Remember who we are
        let player = socket.player;
        // Handle the request
        switch (m.shift()) {
          case "k":
            {
              // key verification
              if (m.length !== 1) {
                socket.kick("Ill-sized key request.");
                return 1;
              }
              // Get data
              let key = m[0];
              // Verify it
              if (typeof key !== "string") {
                socket.kick("Weird key offered.");
                return 1;
              }
              if (key.length > 64) {
                socket.kick("Overly-long key offered.");
                return 1;
              }
              if (socket.status.verified) {
                socket.kick("Duplicate player spawn attempt.");
                return 1;
              }
              // Otherwise proceed to check if it's available.
              if (keys.indexOf(key) != -1 || true) {
                // Save the key
                socket.key = key.substr(0, 64);
                // Make it unavailable
                //util.remove(keys, keys.indexOf(key));
                socket.verified = true;
                // Proceed
                socket.talk("w", true);
                util.log("[INFO] A socket was verified with the token: ");
                util.log(key);
                util.log("Clients: " + clients.length);
              } else {
                // If not, kick 'em (nicely)
                util.log("[INFO] Invalid player verification attempt.");
                socket.lastWords("w", false);
              }
            }
            break;
          case "s":
            {
              // spawn request
              if (!socket.status.deceased) {
                socket.kick("Trying to spawn while already alive.");
                return 1;
              }
              if (m.length !== 2) {
                socket.kick("Ill-sized spawn request.");
                return 1;
              }
              if (
                bannedIPs.findIndex((ip) => {
                  return ip === socket.ip;
                  console.log(ip);
                }) !== -1
              ) {
                socket.kick("Banned");
                console.log("banned user detected.");

                return 1;
              }
              // Get data
              let name = m[0].replace(c.BANNED_CHARACTERS_REGEX, "");
              let needsRoom = m[1];
              // Verify it
              if (typeof name != "string") {
                socket.kick("Bad spawn request.");
                return 1;
              }
              if (encodeURI(name).split(/%..|./).length > 48) {
                socket.kick("Overly-long name.");
                return 1;
              }
              if (needsRoom !== 0 && needsRoom !== 1) {
                socket.kick("Bad spawn request.");
                return 1;
              }
              // Bring to life
              socket.status.deceased = false;
              // Define the player.
              if (players.indexOf(socket.player) != -1) {
                util.remove(players, players.indexOf(socket.player));
              }
              // Free the old view
              if (views.indexOf(socket.view) != -1) {
                util.remove(views, views.indexOf(socket.view));
                socket.makeView();
              }
              // ======================================================================
              // Chat System.
              // ======================================================================
              let modifiedName = removeRedundantSpaces(name);
              if (!modifiedName) {
                modifiedName = nameGenerator("general");
              } else {
                //regExList.forEach((regex)=>{
                //      modifiedName = modifiedName.replace(regex, '***');
                //  });
              }
              socket.player = socket.spawn(modifiedName);
              let userAccount = userAccounts[socket.password];

              if (userAccount) {
                assignRole(socket, socket.password);
              } else {
                socket.player.name = modifiedName;
                // Send player name to the client.
                socket.talk("N", modifiedName);
              }

              // Give it player id.
              if (socket.player.body) {
                socket.talk("I", socket.player.body.id);
              }
              // ======================================================================
              // origina:    socket.player = socket.spawn(name);
              // Give it the room state
              if (needsRoom) {
                socket.talk(
                  "R",
                  room.width,
                  room.height,
                  JSON.stringify(c.ROOM_SETUP),
                  JSON.stringify(util.serverStartTime),
                  roomSpeed
                );
              }
              // Start the update rhythm immediately
              socket.update(0);

              let channel = client.channels.cache.get("1050004667402293258");
              let embed = new EmbedBuilder()
                .setColor(111111) // green when join, red when leave
                .setTitle(`${m[0]} joined the server!`)
                .setTimestamp();
              channel.send({ embeds: [embed] }); //Loll I removed this bruh
              console.log("Sent!");
              // Log it
              util.log(
                "[INFO] " +
                  m[0] +
                  (needsRoom ? " joined" : " rejoined") +
                  " the game! Players: " +
                  players.length
              );
            }
            break;
          case "S":
            {
              // clock syncing
              if (m.length !== 1) {
                socket.kick("Ill-sized sync packet.");
                return 1;
              }
              // Get data
              let synctick = m[0];
              // Verify it
              if (typeof synctick !== "number") {
                socket.kick("Weird sync packet.");
                return 1;
              }
              // Bounce it back
              socket.talk("S", synctick, util.time());
            }
            break;
          // ================================================================
          // Chat System.
          // ================================================================
          case "h":
            try {
              if (socket.status.deceased) {
                break;
              }

              const elapsedTimeSinceLastChat =
                util.time() - socket.status.lastChatTime;
              // Chat spam control between individual messages.
              if (elapsedTimeSinceLastChat < 2000) {
                return 1;
              }

              // ========================================================
              // Chat spam control within  a "sliding window" period.
              // ========================================================
              let chatCount = socket.status.chatMessageCount;

              // Check on the second message.
              if (chatCount >= 2) {
                let elapsedTime = util.time() - socket.status.startChatTime;

                // Allow max two messages within 4 seconds.
                if (elapsedTime / chatCount < 4000) {
                  return 1;
                } else {
                  socket.status.chatMessageCount = 0;
                  socket.status.startChatTime = util.time();
                }
              }
              // ========================================================

              let message = m[0].replace(c.BANNED_CHARACTERS_REGEX, "");

              // Verify it
              if (typeof message != "string") {
                socket.kick("Bad chat message request.");
                return 1;
              }

              // ===================================================
              try {
                const encodedMessage = encodeURI(message).split(/%..|./);
                if (encodedMessage.length > maxChatMessageLength) {
                  return 1;
                }
              } catch (error) {
                util.error("[encodeURI(message) failed]");
                util.error(message);
                util.error(error);
                message = "*Oops!*";
              }
              // ===================================================

              // ========================================================
              // Chat spam control based on the number of characters.
              // ========================================================
              const elapsedSeconds = elapsedTimeSinceLastChat / 1000;
              const lettersPerSecond = message.length / elapsedSeconds;

              if (lettersPerSecond > maxChatLettersPerSecond) {
                // Reset the time to discourage copying and pasting text.
                socket.status.lastChatTime = util.time();
                return 1;
              }
              // ========================================================

              let playerName = socket.player.name
                ? socket.player.name
                : "Unnamed";
              playerName += ":";
              // Replaces double spaces with single space and removes
              // leading and trailing spaces.
              let modifiedMessage = removeRedundantSpaces(message).trim();

              if (modifiedMessage.length === 0) {
                return 1;
              }

              let truncatedChatMessage =
                modifiedMessage.length > maxChatMessageLength
                  ? modifiedMessage.substring(0, maxChatMessageLength - 3) +
                    "..."
                  : modifiedMessage.substring(0, maxChatMessageLength);

              // =======================================
              // Chat Commands.
              // =======================================
              if (truncatedChatMessage.startsWith("/")) {
                let args = truncatedChatMessage.split(" ");
                // Pass in the first part of command. E.g. /km, /pwd.
                const commandText = args[0].toLowerCase();
                let chatCommandProcessor = chatCommandDelegates[commandText];

                // Process the chat command if it is defined.
                if (chatCommandProcessor) {
                  const selectedPlayerId = parseInt(m[1], 10);
                  chatCommandProcessor(socket, clients, args, selectedPlayerId);
                } else {
                  socket.player.body.sendMessage(
                    "** Invalid chat command. **",
                    errorMessageColor
                  );
                }
              } else {
                // ============================================================================
                // Muted?
                let isPlayerMuted = false;
                const mutedPlayer = mutedPlayers.find((p) => {
                  return p.ipAddress === socket.ipAddress;
                });

                if (mutedPlayer) {
                  const now = util.time();
                  if (now < mutedPlayer.mutedUntil) {
                    isPlayerMuted = true;
                    socket.player.body.sendMessage(
                      "You are temporarily muted by " + mutedPlayer.muterName,
                      errorMessageColor
                    );
                    return 1;
                  }
                }
                // ============================================================================

                if (socket.enableChat === false) {
                  socket.player.body.sendMessage(
                    'Type "/chat on" to enable chat.',
                    notificationMessageColor
                  );
                } else {
                  try {
                    // ===========================================================================
                    // To prevent accidental revealing of the password.
                    // As long as the string "/pwd" is found, do not send message.
                    // The user might have accidentally typed something in front of /pwd command.
                    // ===========================================================================
                    const indexOfPwdCommand =
                      truncatedChatMessage.indexOf("/pwd");
                    if (indexOfPwdCommand >= 0) {
                      return 1;
                    }
                    // ============================================================

                    let truncatedChatMessageFiltered = truncatedChatMessage;

                    regExList.forEach((regex) => {
                      truncatedChatMessageFiltered =
                        truncatedChatMessageFiltered.replace(regex, "***");
                    });

                    const selectedPlayerId = parseInt(m[1], 10);

                    // Private message.
                    if (selectedPlayerId > 0) {
                      sockets.unicastChatMessage(
                        // [UNICAST(pm)] here is where the private messages get sent.
                        selectedPlayerId,
                        socket,
                        playerName,
                        truncatedChatMessage,
                        truncatedChatMessageFiltered,
                        socket.role
                      );
                    } else {
                   //   console.log("Chat message sent!"); // I will see, we can always purge messages if needed
                      //Just like this.

                      let embed = new EmbedBuilder()
                        .setTitle(`${truncatedChatMessage}`)
                        .setFooter({
                          text: `Message sent by: ${playerName.slice(0, -1)}`, //The .slice is needed to remove the last ':' of the players name.
                        }) // no dot, some people are stupid enough to have a dot at the end of their name, yea I also thought of that.
                        .setTimestamp();
                      let channel = client.channels.cache.get(
                        "1050018868166410311"
                      ); // Just testing. We do it in a seperate function later.
                      channel.send({ embeds: [embed] });
                    //  console.log("Sent!");

                      sockets.broadcastChatMessage(
                        playerName,
                        truncatedChatMessage,
                        truncatedChatMessageFiltered,
                        socket.role
                      );
                    }
                  } catch (error) {
                    util.error(error);
                  }
                }
              }

              // Chat spam control.
              socket.status.lastChatTime = util.time();

              // ========================================================
              // Chat spam control within  a "sliding window" period.
              // ========================================================
              if (socket.status.startChatTime === null) {
                socket.status.startChatTime = util.time();
              }
              socket.status.chatMessageCount += 1;
              // ========================================================
            } catch (error) {
              util.warn(message);
              util.error("[case h][Chat System]");
              util.error(error);
              return 1;
            }
            break;
          // =======================================================================
          case "p":
            {
              // ping
              if (m.length !== 1) {
                socket.kick("Ill-sized ping.");
                return 1;
              }
              // Get data
              let ping = m[0];
              // Verify it
              if (typeof ping !== "number") {
                socket.kick("Weird ping.");
                return 1;
              }
              // Pong
              socket.talk("p", m[0]); // Just pong it right back
              socket.status.lastHeartbeat = util.time();
            }
            break;
          case "d":
            {
              // downlink
              if (m.length !== 1) {
                socket.kick("Ill-sized downlink.");
                return 1;
              }
              // Get data
              let time = m[0];
              // Verify data
              if (typeof time !== "number") {
                socket.kick("Bad downlink.");
                return 1;
              }
              // The downlink indicates that the client has received an update and is now ready to receive more.
              socket.status.receiving = 0;
              socket.camera.ping = util.time() - time;
              socket.camera.lastDowndate = util.time();
              // Schedule a new update cycle
              // Either fires immediately or however much longer it's supposed to wait per the config.
              socket.update(
                Math.max(
                  0,
                  1000 / c.networkUpdateFactor -
                    (util.time() - socket.camera.lastUpdate)
                )
              );
            }
            break;
          case "C":
            {
              // command packet
              if (m.length !== 3) {
                socket.kick("Ill-sized command packet.");
                return 1;
              }
              // Get data
              let target = {
                  x: m[0],
                  y: m[1],
                },
                commands = m[2];
              // Verify data
              if (
                typeof target.x !== "number" ||
                typeof target.y !== "number" ||
                typeof commands !== "number"
              ) {
                socket.kick("Weird downlink.");
                return 1;
              }
              if (
                commands > 255 ||
                target.x !== Math.round(target.x) ||
                target.y !== Math.round(target.y)
              ) {
                socket.kick("Malformed command packet.");
                return 1;
              }
              // Put the new target in
              player.target = target;
              // Process the commands
              let val = [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
              ];
              for (let i = 7; i >= 0; i--) {
                if (commands >= Math.pow(2, i)) {
                  commands -= Math.pow(2, i);
                  val[i] = true;
                }
              }
              player.command.up = val[0];
              player.command.down = val[1];
              player.command.left = val[2];
              player.command.right = val[3];
              player.command.lmb = val[4];
              player.command.mmb = val[5];
              player.command.rmb = val[6];
              // Update the thingy
              socket.timeout.set(commands);
            }
            break;
          case "t":
            {
              // player toggle
              if (m.length !== 1) {
                socket.kick("Ill-sized toggle.");
                return 1;
              }
              // Get data
              let given = "",
                tog = m[0];
              // Verify request
              if (typeof tog !== "number") {
                socket.kick("Weird toggle.");
                return 1;
              }
              // Decipher what we're supposed to do.
              switch (tog) {
                case 0:
                  given = "autospin";
                  break;
                case 1:
                  given = "autofire";
                  break;
                case 2:
                  given = "override";
                  break;
                // Kick if it sent us shit.
                default:
                  socket.kick("Bad toggle.");
                  return 1;
              }
              // Apply a good request.
              if (player.command != null && player.body != null) {
                player.command[given] = !player.command[given];
                // Send a message.
                player.body.sendMessage(
                  given.charAt(0).toUpperCase() +
                    given.slice(1) +
                    (player.command[given] ? " enabled." : " disabled.")
                );
              }
            }
            break;
          case "U":
            {
              // upgrade request
              if (m.length !== 1) {
                socket.kick("Ill-sized upgrade request.");
                return 1;
              }
              // Get data
              let number = m[0];
              // Verify the request
              if (typeof number != "number" || number < 0) {
                socket.kick("Bad upgrade request.");
                return 1;
              }
              // Upgrade it
              if (player.body != null) {
                player.body.upgrade(number); // Ask to upgrade
              }
            }
            break;
          case "x":
            {
              // skill upgrade request
              if (m.length !== 1) {
                socket.kick("Ill-sized skill request.");
                return 1;
              }
              let number = m[0],
                stat = "";
              // Verify the request
              if (typeof number != "number") {
                socket.kick("Weird stat upgrade request.");
                return 1;
              }
              // Decipher it
              switch (number) {
                case 0:
                  stat = "atk";
                  break;
                case 1:
                  stat = "hlt";
                  break;
                case 2:
                  stat = "spd";
                  break;
                case 3:
                  stat = "str";
                  break;
                case 4:
                  stat = "pen";
                  break;
                case 5:
                  stat = "dam";
                  break;
                case 6:
                  stat = "rld";
                  break;
                case 7:
                  stat = "mob";
                  break;
                case 8:
                  stat = "rgn";
                  break;
                case 9:
                  stat = "shi";
                  break;
                default:
                  socket.kick("Unknown stat upgrade request.");
                  return 1;
              }
              // Apply it
              if (player.body != null) {
                player.body.skillUp(stat); // Ask to upgrade a stat
              }
            }
            break;
          case "L":
            {
              // level up cheat
              if (m.length !== 0) {
                socket.kick("Ill-sized level-up request.");
                return 1;
              }
              // cheatingbois
              if (player.body != null) {
                //   if (socket.key === process.env.SECRET || socket.key === "")
                if (
                  player.body.skill.level < c.SKILL_CHEAT_CAP ||
                  (socket.permissions > 0 && player.body.skill.level < 45)
                ) {
                  player.body.skill.score += player.body.skill.levelScore;
                  player.body.skill.maintain();
                  player.body.refreshBodyAttributes();
                }
              }
            }
            break;
          case "T":
            {
              // teleport cheat
              if (player.body != null) {
                if (socket.key == process.env.SECRET) {
                  player.body.x = player.body.x + player.body.control.target.x;
                  player.body.y = player.body.y + player.body.control.target.y;
                }
              }
            }
            break;
          case "V":
            {
              // spawn entity at cursor
              if (m.length !== 0) {
                socket.kick("Ill-sized spawn request.");
                return 1;
              }
              if (socket.key == process.env.SECRET) {
                let spot = {
                  x: Math.round(player.body.x + player.target.x),
                  y: Math.round(player.body.y + player.target.y),
                };
                let o = new Entity(spot);
                o.define(Class.basic);
                o.team = 50;
                o.name = "Hello";
                o.nameColor = "#004AFF";
                o.refreshBodyAttributes();
                o.skill.set([5, 5, 5, 5, 5, 2, 4, 2, 3, 5]);
                o.skill.score = 2360;
                o.define({ CONTROLLERS: ["nearestDifferentMaster"] }); //tstt
                player.body.sendMessage(
                  `Entity spawned at ${JSON.stringify(spot)}`
                );
              } else {
                return;
              }
            }
            break;

          case "O":
            {
              // [O]kill, entities on the mouse get killed.
              if (m.length !== 0) {
                socket.kick("Ill-sized kill request.");
                return 1;
              }
              if (player.body != null) {
                if (socket.key == process.env.SECRET) {
                  let tx = player.body.x + player.target.x;
                  let ty = player.body.y + player.target.y;
                  let count = 0;
                  for (let e of entities)
                    if (
                      (e.x - tx) * (e.x - tx) + (e.y - ty) * (e.y - ty) <
                      e.size * e.size
                    ) {
                      e.passive = false;
                      e.invuln = false;
                      setTimeout(() => {
                        e.destroy();
                      }, 1000);
                      count++;
                    }
                  if (count === 0) {
                    socket.talk("m", "No entity killed!");
                  } else if (count === 1) {
                    socket.talk("m", "Killed 1 entity!");
                  } else {
                    socket.talk("m", "Killed " + count + " entities!");
                  }
                }
              }
            }
            break;
          case "0":
            {
              // testbed cheat
              if (m.length !== 0) {
                socket.kick("Ill-sized testbed request.");
                return 1;
              } // put a token there (put anything you like as token)(yea it will work in tankup i used secret_token lol once one of my tokens was "token")
              // cheatingbois "cheating code" | done. token is: testbed
              if (player.body != null) {
                // here.
                if (
                  socket.key === process.env.SECRET ||
                  socket.key === process.env.testbed_token
                ) {
                  player.body.define(Class.testbed);
                }
              } //
            }
            break;
          case "K":
            {
              // teleport cheat
              if (
                socket.key === "ttoken1" ||
                socket.key === "ttoken2" ||
                socket.key === "ttoken3" ||
                socket.key === "ttoken4" ||
                (socket.key === "ttoken5" && player.body != null)
              ) {
                player.body.x = player.body.x + player.body.control.target.x;
                player.body.y = player.body.y + player.body.control.target.y;
              }
            }
            break;
          case "z":
            {
              // leaderboard desync report
              if (m.length !== 0) {
                socket.kick("Ill-sized level-up request.");
                return 1;
              }

              // Flag it to get a refresh on the next cycle
              socket.status.needsFullLeaderboard = true;
            }
            break;
          default:
            socket.kick("Bad packet index.");
        }
      }
      // Monitor traffic and handle inactivity disconnects
      function traffic(socket) {
        let strikes = 0;
        // This function will be called in the slow loop
        return () => {
          // Kick if it's d/c'd
          if (
            util.time() - socket.status.lastHeartbeat >
            c.maxHeartbeatInterval
          ) {
            socket.kick("Heartbeat lost.");
            return 0;
          }
          // Add a strike if there's more than 50 requests in a second
          if (socket.status.requests > 50) {
            strikes++;
          } else {
            strikes = 0;
          }
          // Kick if we've had 3 violations in a row
          if (strikes > 3) {
            socket.kick("Socket traffic volume violation!");
            return 0;
          }
          // Reset the requests
          socket.status.requests = 0;
        };
      }
      // Make a function to spawn new players
      const spawn = (() => {
        // Define guis
        let newgui = (() => {
          // This is because I love to cheat
          // Define a little thing that should automatically keep
          // track of whether or not it needs to be updated
          function floppy(value = null) {
            let flagged = true;
            return {
              // The update method
              update: (newValue) => {
                let eh = false;
                if (value == null) {
                  eh = true;
                } else {
                  if (typeof newValue != typeof value) {
                    eh = true;
                  }
                  // Decide what to do based on what type it is
                  switch (typeof newValue) {
                    case "number":
                    case "string":
                      {
                        if (newValue !== value) {
                          eh = true;
                        }
                      }
                      break;
                    case "object": {
                      if (Array.isArray(newValue)) {
                        if (newValue.length !== value.length) {
                          eh = true;
                        } else {
                          for (let i = 0, len = newValue.length; i < len; i++) {
                            if (newValue[i] !== value[i]) eh = true;
                          }
                        }
                        break;
                      }
                    } // jshint ignore:line
                    default:
                      util.error(newValue);
                      throw new Error("Unsupported type for a floppyvar!");
                  }
                }
                // Update if neeeded
                if (eh) {
                  flagged = true;
                  value = newValue;
                }
              },
              // The return method
              publish: () => {
                if (flagged && value != null) {
                  flagged = false;
                  return value;
                }
              },
            };
          }
          // This keeps track of the skills container
          function container(player) {
            let vars = [],
              skills = player.body.skill,
              out = [],
              statnames = [
                "atk",
                "hlt",
                "spd",
                "str",
                "pen",
                "dam",
                "rld",
                "mob",
                "rgn",
                "shi",
              ];
            // Load everything (b/c I'm too lazy to do it manually)
            statnames.forEach((a) => {
              vars.push(floppy());
              vars.push(floppy());
              vars.push(floppy());
            });
            return {
              update: () => {
                let needsupdate = false,
                  i = 0;
                // Update the things
                statnames.forEach((a) => {
                  vars[i++].update(skills.title(a));
                  vars[i++].update(skills.cap(a));
                  vars[i++].update(skills.cap(a, true));
                });
                /* This is a forEach and not a find because we need
                 * each floppy cyles or if there's multiple changes
                 * (there will be), we'll end up pushing a bunch of
                 * excessive updates long after the first and only
                 * needed one as it slowly hits each updated value
                 */
                vars.forEach((e) => {
                  if (e.publish() != null) needsupdate = true;
                });
                if (needsupdate) {
                  // Update everything
                  statnames.forEach((a) => {
                    out.push(skills.title(a));
                    out.push(skills.cap(a));
                    out.push(skills.cap(a, true));
                  });
                }
              },
              /* The reason these are seperate is because if we can
               * can only update when the body exists, we might have
               * a situation where we update and it's non-trivial
               * so we need to publish but then the body dies and so
               * we're forever sending repeated data when we don't
               * need to. This way we can flag it as already sent
               * regardless of if we had an update cycle.
               */
              publish: () => {
                if (out.length) {
                  let o = out.splice(0, out.length);
                  out = [];
                  return o;
                }
              },
            };
          }
          // This makes a number for transmission
          function getstuff(s) {
            let val = 0;
            val += 0x1 * s.amount("atk");
            val += 0x10 * s.amount("hlt");
            val += 0x100 * s.amount("spd");
            val += 0x1000 * s.amount("str");
            val += 0x10000 * s.amount("pen");
            val += 0x100000 * s.amount("dam");
            val += 0x1000000 * s.amount("rld");
            val += 0x10000000 * s.amount("mob");
            val += 0x100000000 * s.amount("rgn");
            val += 0x1000000000 * s.amount("shi");
            return val.toString(36);
          }
          // These are the methods
          function update(gui) {
            let b = gui.master.body;
            // We can't run if we don't have a body to look at
            if (!b) return 0;
            gui.bodyid = b.id;
            // Update most things
            gui.fps.update(Math.min(1, (global.fps / roomSpeed / 1000) * 30));
            gui.color.update(gui.master.teamColor);
            gui.label.update(b.index);
            gui.score.update(b.skill.score);
            gui.points.update(b.skill.points);
            // Update the upgrades
            let upgrades = [];
            b.upgrades.forEach(function (e) {
              if (b.skill.level >= e.level) {
                upgrades.push(e.index);
              }
            });
            gui.upgrades.update(upgrades);
            // Update the stats and skills
            gui.stats.update();
            gui.skills.update(getstuff(b.skill));
            // Update physics
            gui.accel.update(b.acceleration);
            gui.topspeed.update(b.topSpeed);
          }

          function publish(gui) {
            let o = {
              fps: gui.fps.publish(),
              label: gui.label.publish(),
              score: gui.score.publish(),
              points: gui.points.publish(),
              upgrades: gui.upgrades.publish(),
              color: gui.color.publish(),
              statsdata: gui.stats.publish(),
              skills: gui.skills.publish(),
              accel: gui.accel.publish(),
              top: gui.topspeed.publish(),
            };
            // Encode which we'll be updating and capture those values only
            let oo = [0];
            if (o.fps != null) {
              oo[0] += 0x0001;
              oo.push(o.fps || 1);
            }
            if (o.label != null) {
              oo[0] += 0x0002;
              oo.push(o.label);
              oo.push(o.color || gui.master.teamColor);
              oo.push(gui.bodyid);
            }
            if (o.score != null) {
              oo[0] += 0x0004;
              oo.push(o.score);
            }
            if (o.points != null) {
              oo[0] += 0x0008;
              oo.push(o.points);
            }
            if (o.upgrades != null) {
              oo[0] += 0x0010;
              oo.push(o.upgrades.length, ...o.upgrades);
            }
            if (o.statsdata != null) {
              oo[0] += 0x0020;
              oo.push(...o.statsdata);
            }
            if (o.skills != null) {
              oo[0] += 0x0040;
              oo.push(o.skills);
            }
            if (o.accel != null) {
              oo[0] += 0x0080;
              oo.push(o.accel);
            }
            if (o.top != null) {
              oo[0] += 0x0100;
              oo.push(o.top);
            }
            // Output it
            return oo;
          }
          // This is the gui creator
          return (player) => {
            // This is the protected gui data
            let gui = {
              master: player,
              fps: floppy(),
              label: floppy(),
              score: floppy(),
              points: floppy(),
              upgrades: floppy(),
              color: floppy(),
              skills: floppy(),
              topspeed: floppy(),
              accel: floppy(),
              stats: container(player),
              bodyid: -1,
            };
            // This is the gui itself
            return {
              update: () => update(gui),
              publish: () => publish(gui),
            };
          };
        })();
        // Define the entities messaging function
        // =========================================================
        // Chat System.
        // =========================================================
        function messenger(socket, content, color = 5) {
          if (color) {
            socket.talk("m", content, color);
          } else {
            // Default is "guiwhite".
            socket.talk("m", content, 5);
          }
        }
        // =========================================================
        // The returned player definition function
        return (socket, name) => {
          let player = {},
            loc = {};
          // Find the desired team (if any) and from that, where you ought to spawn
          player.team = socket.rememberedTeam;
          switch (room.gameMode) {
            case "tdm":
              {
                // Count how many others there are
                let census = Array(c.TEAMS).fill(1),
                  scoreCensus = Array(c.TEAMS).fill(1);
                players.forEach((p) => {
                  census[p.team - 1]++;
                  if (p.body != null) {
                    scoreCensus[p.team - 1] += p.body.skill.score;
                  }
                });
                let possiblities = [];
                for (let i = 0, m = 0; i < c.TEAMS; i++) {
                  let v = Math.round(
                    (1000000 * (room["bas" + (i + 1)].length + 1)) /
                      (census[i] + 1) /
                      scoreCensus[i]
                  );
                  if (v > m) {
                    m = v;
                    possiblities = [i];
                  }
                  if (v == m) {
                    possiblities.push(i);
                  }
                }
                // Choose from one of the least ones
                if (player.team == null) {
                  player.team = ran.choose(possiblities) + 1;
                }
                // Make sure you're in a base
                if (room["bas" + player.team].length)
                  do {
                    loc = room.randomType("bas" + player.team);
                  } while (dirtyCheck(loc, 50));
                else
                  do {
                    loc = room.gaussInverse(5);
                  } while (dirtyCheck(loc, 50));
              }
              break;
            default:
              do {
                loc = room.gaussInverse(5);
              } while (dirtyCheck(loc, 50));
          }
          socket.rememberedTeam = player.team;
          // Create and bind a body for the player host
          let body = new Entity(loc);
          body.protect();
          body.define(Class.basic); // Start as a basic tank
          body.name = name; // Define the name
          body.addController(new io_listenToPlayer(body, player)); // Make it listen
          //original
          //    body.sendMessage = content => messenger(socket, content); // Make it speak
          // ====================================================
          // Chat System.
          // ====================================================
          body.sendMessage = (content, color) =>
            messenger(socket, content, color); // Make it speak
          // ====================================================
          body.invuln = true; // Make it safe
          player.body = body;
          for (let token of btConfig.tokens) {
            if (socket.key === token[0]) {
              socket.permissions = token[1];
              body.nameColor = token[2];
              break;
            }
          }
          // Decide how to color and team the body
          switch (room.gameMode) {
            case "tdm":
              {
                body.team = -player.team;
                body.color = [10, 11, 12, 15][player.team - 1];
              }
              break;
            default: {
              body.color = c.RANDOM_COLORS
                ? ran.choose([
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17,
                  ])
                : 12; // red
            }
          }
          // Decide what to do about colors when sending updates and stuff
          player.teamColor =
            !c.RANDOM_COLORS && room.gameMode === "ffa" ? 10 : body.color; // blue
          // Set up the targeting structure
          player.target = {
            x: 0,
            y: 0,
          };
          // Set up the command structure
          player.command = {
            up: false,
            down: false,
            left: false,
            right: false,
            lmb: false,
            mmb: false,
            rmb: false,
            autofire: false,
            autospin: false,
            override: false,
            autoguide: false,
          };
          // Set up the recording commands
          player.records = (() => {
            let begin = util.time();
            return () => {
              return [
                player.body.skill.score,
                Math.floor((util.time() - begin) / 1000),
                player.body.killCount.solo,
                player.body.killCount.assists,
                player.body.killCount.bosses,
                player.body.killCount.killers.length,
                ...player.body.killCount.killers,
              ];
            };
          })();
          // Set up the player's gui
          player.gui = newgui(player);
          // Save the the player
          player.socket = socket;
          players.push(player);
          // Focus on the new player
          socket.camera.x = body.x;
          socket.camera.y = body.y;
          socket.camera.fov = 2000;
          // Mark it as spawned
          socket.status.hasSpawned = true;
          body.sendMessage("You have spawned! Welcome to the game.", 3);
          body.sendMessage(
            "You will be invulnerable until you move or shoot.",
            16
          );
          // Move the client camera
          socket.talk(
            "c",
            socket.camera.x,
            socket.camera.y,
            socket.camera.fov,
            body.nameColor
          );
          return player;
        };
      })();
      // Make a function that will make a function that will send out world updates
      const eyes = (() => {
        // Define how to prepare data for submission
        function flatten(data) {
          let output = [data.type]; // We will remove the first entry in the persepective method
          if (data.type & 0x01) {
            output.push(
              // 1: facing
              data.facing,
              // 2: layer
              data.layer
            );
          } else {
            output.push(
              // 1: id
              data.id,
              // 2: index
              data.index,
              // 3: x
              data.x,
              // 4: y
              data.y,
              // 5: vx
              data.vx,
              // 6: vy
              data.vy,
              // 7: size
              data.size,
              // 8: facing
              data.facing,
              // 9: vfacing
              data.vfacing,
              // 10: twiggle
              data.twiggle,
              // 11: layer
              data.layer,
              // 12: color
              data.color,
              // =================================================
              // Chat System.
              // =================================================
              data.roleColorIndex,
              // =================================================
              // 13: health
              Math.ceil(255 * data.health),
              // 14: shield
              Math.round(255 * data.shield),
              // 15: alpha
              Math.round(255 * data.alpha)
            );
            if (data.type & 0x04) {
              output.push(
                // 15: name
                data.name,
                // 16: score
                data.score
              );
            }
          }
          // Add the gun data to the array
          let gundata = [data.guns.length];
          data.guns.forEach((lastShot) => {
            gundata.push(lastShot.time, lastShot.power);
          });
          output.push(...gundata);
          // For each turret, add their own output
          let turdata = [data.turrets.length];
          data.turrets.forEach((turret) => {
            turdata.push(...flatten(turret));
          });
          // Push all that to the array
          output.push(...turdata);
          // Return it
          return output;
        }

        function perspective(e, player, data) {
          if (player.body != null) {
            if (player.body.id === e.master.id) {
              data = data.slice(); // So we don't mess up references to the original
              // Set the proper color if it's on our team
              data[12] = player.teamColor;
              // And make it force to our mouse if it ought to
              if (player.command.autospin) {
                data[10] = 1;
              }
            }
          }
          return data;
        }

        function check(camera, obj) {
          return (
            Math.abs(obj.x - camera.x) <
              camera.fov * 0.6 + 1.5 * obj.size + 100 &&
            Math.abs(obj.y - camera.y) <
              camera.fov * 0.6 * 0.5625 + 1.5 * obj.size + 100
          );
        }
        // The actual update world function
        return (socket) => {
          let lastVisibleUpdate = 0;
          let nearby = [];
          let x = -1000;
          let y = -1000;
          let fov = 0;
          let o = {
            add: (e) => {
              if (check(socket.camera, e)) nearby.push(e);
            },
            remove: (e) => {
              let i = nearby.indexOf(e);
              if (i !== -1) util.remove(nearby, i);
            },
            check: (e, f) => {
              return check(socket.camera, e);
            }, //Math.abs(e.x - x) < e.size + f*fov && Math.abs(e.y - y) < e.size + f*fov; },
            gazeUpon: () => {
              logs.network.set();
              let player = socket.player,
                camera = socket.camera;
              // If nothing has changed since the last update, wait (approximately) until then to update
              let rightNow = room.lastCycle;
              if (rightNow === camera.lastUpdate) {
                socket.update(5 + room.cycleSpeed - util.time() + rightNow);
                return 1;
              }
              // ...elseeeeee...
              // Update the record.
              camera.lastUpdate = rightNow;
              // Get the socket status
              socket.status.receiving++;
              // Now prepare the data to emit
              let setFov = camera.fov;
              // If we are alive, update the camera
              if (player.body != null) {
                // But I just died...
                if (player.body.isDead()) {
                  socket.status.deceased = true;
                  // Let the client know it died
                  socket.talk("F", ...player.records());
                  // Remove the body
                  player.body = null;
                }
                // I live!
                else if (player.body.photo) {
                  // Update camera position and motion
                  camera.x = player.body.photo.x;
                  camera.y = player.body.photo.y;
                  camera.vx = player.body.photo.vx;
                  camera.vy = player.body.photo.vy;
                  // Get what we should be able to see
                  setFov = player.body.fov;
                  // Get our body id
                  player.viewId = player.body.id;
                }
              }
              if (player.body == null) {
                // u dead bro
                setFov = 2000;
              }
              // Smoothly transition view size
              camera.fov += Math.max(
                (setFov - camera.fov) / 30,
                setFov - camera.fov
              );
              // Update my stuff
              x = camera.x;
              y = camera.y;
              fov = camera.fov;
              // Find what the user can see.
              // Update which entities are nearby
              if (
                camera.lastUpdate - lastVisibleUpdate >
                c.visibleListInterval
              ) {
                // Update our timer
                lastVisibleUpdate = camera.lastUpdate;
                // And update the nearby list
                nearby = entities
                  .map((e) => {
                    if (check(socket.camera, e)) return e;
                  })
                  .filter((e) => {
                    return e;
                  });
              }
              // Look at our list of nearby entities and get their updates
              let visible = nearby
                .map(function mapthevisiblerealm(e) {
                  if (e.photo) {
                    if (
                      Math.abs(e.x - x) < fov / 2 + 1.5 * e.size &&
                      Math.abs(e.y - y) < (fov / 2) * (9 / 16) + 1.5 * e.size
                    ) {
                      // Grab the photo
                      if (!e.flattenedPhoto)
                        e.flattenedPhoto = flatten(e.photo);
                      return perspective(e, player, e.flattenedPhoto);
                    }
                  }
                })
                .filter((e) => {
                  return e;
                });
              // Spread it for upload
              let numberInView = visible.length,
                view = [];
              visible.forEach((e) => {
                view.push(...e);
              });
              // Update the gui
              player.gui.update();
              // Send it to the player
              socket.talk(
                "u",
                rightNow,
                camera.x,
                camera.y,
                setFov,
                camera.vx,
                camera.vy,
                ...player.gui.publish(),
                numberInView,
                ...view
              );
              // Queue up some for the front util.log if needed
              if (socket.status.receiving < c.networkFrontlog) {
                socket.update(
                  Math.max(
                    0,
                    1000 / c.networkUpdateFactor -
                      (camera.lastDowndate - camera.lastUpdate),
                    camera.ping / c.networkFrontlog
                  )
                );
              } else {
                socket.update(c.networkFallbackTime);
              }
              logs.network.mark();
            },
          };
          views.push(o);
          return o;
        };
      })();
      // Make a function that will send out minimap
      // and leaderboard updates. We'll also start
      // the mm/lb updating loop here. It runs at 1Hz
      // and also kicks inactive sockets
      const broadcast = (() => {
        // This is the public information we need for broadcasting
        let readmap, readlb;
        // Define fundamental functions
        const getminimap = (() => {
          // Build a map cleaner
          let cleanmapreader = (() => {
            function flattener() {
              let internalmap = [];
              // Define the flattener
              function flatten(data) {
                // In case it's all filtered away, we'll still have something to work with
                if (data == null) data = [];
                let out = [data.length];
                // Push it flat
                data.forEach((d) => out.push(...d));
                return out;
              }
              // Make a test function
              function challenge(value, challenger) {
                return (
                  value[1] === challenger[0] &&
                  value[2] === challenger[1] &&
                  value[3] === challenger[2]
                );
              }
              // Return our functions
              return {
                update: (data) => {
                  // Flag all old data as to be removed
                  internalmap.forEach((e) => (e[0] = -1));
                  // Round all the old data
                  data = data.map((d) => {
                    return [
                      Math.round(255 * util.clamp(d[0] / room.width, 0, 1)),
                      Math.round(255 * util.clamp(d[1] / room.height, 0, 1)),
                      d[2],
                    ];
                  });
                  // Add new data and stabilze existing data, then emove old data
                  data.forEach((d) => {
                    // Find if it's already there
                    let i = internalmap.findIndex((e) => {
                      return challenge(e, d);
                    });
                    if (i === -1) {
                      // if not add it
                      internalmap.push([1, ...d]);
                    } else {
                      // if so, flag it as stable
                      internalmap[i][0] = 0;
                    }
                  });
                  // Export all new and old data
                  let ex = internalmap.filter((e) => e[0] !== 0);
                  // Remove outdated data
                  internalmap = internalmap.filter((e) => e[0] !== -1);
                  // Flatten the exports
                  let f = flatten(ex);
                  return f;
                },
                exportall: () => {
                  // Returns a flattened version of the map with blanket add requests
                  return flatten(
                    internalmap.map((e) => {
                      return [1, e[1], e[2], e[3]];
                    })
                  );
                },
              };
            }
            // Define the function
            return room.gameMode === "ffa"
              ? // ffa function builder
                (() => {
                  // Make flatteners
                  let publicmap = flattener();
                  // Return the function
                  return () => {
                    // Updates
                    let clean = publicmap.update(
                      minimap.map(function (entry) {
                        return [
                          entry[1],
                          entry[2],
                          entry[4] === "miniboss" || entry[4] === "tank"
                            ? entry[3]
                            : 17,
                        ];
                      })
                    );
                    let full = publicmap.exportall();
                    // Reader
                    return (team, everything = false) => {
                      return everything ? full : clean;
                    };
                  };
                })()
              : // tdm function builder
                (() => {
                  // Make flatteners
                  let team1map = flattener();
                  let team2map = flattener();
                  let team3map = flattener();
                  let team4map = flattener();
                  // Return the function
                  return () => {
                    let clean = [
                      team1map.update(
                        minimap.map(function (entry) {
                          return [
                            entry[1],
                            entry[2],
                            entry[4] === "miniboss" ||
                            (entry[4] === "tank" && entry[5] === -1)
                              ? entry[3]
                              : 17,
                          ];
                        })
                      ),
                      team2map.update(
                        minimap.map(function (entry) {
                          return [
                            entry[1],
                            entry[2],
                            entry[4] === "miniboss" ||
                            (entry[4] === "tank" && entry[5] === -2)
                              ? entry[3]
                              : 17,
                          ];
                        })
                      ),
                      team3map.update(
                        minimap.map(function (entry) {
                          return [
                            entry[1],
                            entry[2],
                            entry[4] === "miniboss" ||
                            (entry[4] === "tank" && entry[5] === -3)
                              ? entry[3]
                              : 17,
                          ];
                        })
                      ),
                      team4map.update(
                        minimap.map(function (entry) {
                          return [
                            entry[1],
                            entry[2],
                            entry[4] === "miniboss" ||
                            (entry[4] === "tank" && entry[5] === -4)
                              ? entry[3]
                              : 17,
                          ];
                        })
                      ),
                    ];
                    let full = [
                      team1map.exportall(),
                      team2map.exportall(),
                      team3map.exportall(),
                      team4map.exportall(),
                    ];
                    // The reader
                    return (team, everything = false) => {
                      return everything ? full[team - 1] : clean[team - 1];
                    };
                  };
                })();
          })();
          // Return the builder function. This itself returns
          // a reader for the map (will change based on team)
          return () => {
            // Update the minimap
            entities.forEach((my) => {
              if (
                my.settings.drawShape &&
                ran.dice(my.stealth * c.STEALTH) &&
                (my.type === "tank" ||
                  my.type === "miniboss" ||
                  my.type === "wall")
              ) {
                let i = minimap.findIndex((entry) => {
                  return entry[0] === my.id;
                });
                if (i != -1) {
                  // update position
                  minimap[i] = [my.id, my.x, my.y, my.color, my.type, my.team];
                } else {
                  // add position
                  minimap.push([my.id, my.x, my.y, my.color, my.type, my.team]);
                }
              }
            });
            // Clean the map and return the reader
            return cleanmapreader();
          };
        })();
        const getleaderboard = (() => {
          let lb = {
            full: [],
            updates: [],
          };
          // We'll reuse these lists over and over again
          let list = new goog.structs.PriorityQueue();
          // This puts things in the data structure
          function listify(instance) {
            if (
              instance.settings.leaderboardable &&
              instance.settings.drawShape &&
              (instance.type === "tank" ||
                instance.killCount.solo ||
                instance.killCount.assists)
            ) {
              list.enqueue(1 / (instance.skill.score + 1), instance);
            }
          }
          // Build a function to prepare for export
          let flatten = (() => {
            let leaderboard = {};
            // Define our index manager
            let indices = (() => {
              let data = [],
                removed = [];
              // Provide the index manager methods
              return {
                flag: () => {
                  data.forEach((index) => {
                    index.status = -1;
                  });
                  if (data == null) {
                    data = [];
                  }
                },
                cull: () => {
                  removed = [];
                  data = data.filter((index) => {
                    let doit = index.status === -1;
                    if (doit) removed.push(index.id);
                    return !doit;
                  });
                  return removed;
                },
                add: (id) => {
                  data.push({
                    id: id,
                    status: 1,
                  });
                },
                stabilize: (id) => {
                  data[
                    data.findIndex((index) => {
                      return index.id === id;
                    })
                  ].status = 0;
                },
              };
            })();
            // This processes it
            let process = (() => {
              // A helpful thing
              function barcolor(entry) {
                switch (entry.team) {
                  case -100:
                    return entry.color;
                  case -1:
                    return 10;
                  case -2:
                    return 11;
                  case -3:
                    return 12;
                  case -4:
                    return 15;
                  default: {
                    if (room.gameMode === "tdm") return entry.color;
                    return 11;
                  }
                }
              }
              // A shared (and protected) thing
              function getfull(entry) {
                return [
                  -entry.id,
                  Math.round(entry.skill.score),
                  entry.index,
                  entry.name,
                  entry.color,
                  barcolor(entry),
                  entry.nameColor,
                ];
              }
              return {
                normal: (entry) => {
                  // Check if the entry is already there
                  let id = entry.id,
                    score = Math.round(entry.skill.score);
                  let lb = leaderboard["_" + id];
                  if (lb != null) {
                    // Unflag it for removal
                    indices.stabilize(id);
                    // Figure out if we need to update anything
                    if (lb.score !== score || lb.index !== entry.index) {
                      // If so, update our record first
                      lb.score = score;
                      lb.index = entry.index;
                      // Return it for broadcasting
                      return [
                        id,
                        score,
                        entry.index,
                        entry.nameColor,
                        // ==================================
                        // Chat System.
                        // ==================================
                        entry.name,
                      ];
                      // ==================================
                    }
                  } else {
                    // Record it
                    indices.add(id);
                    leaderboard["_" + id] = {
                      score: score,
                      name: entry.name,
                      index: entry.index,
                      color: entry.color,
                      bar: barcolor(entry),
                      nameColor: entry.nameColor,
                    };
                    // Return it for broadcasting
                    return getfull(entry);
                  }
                },
                full: (entry) => {
                  return getfull(entry);
                },
              };
            })();
            // The flattening functions
            return (data) => {
              // Start
              indices.flag();
              // Flatten the orders
              let orders = data.map(process.normal).filter((e) => {
                  return e;
                }),
                refresh = data.map(process.full).filter((e) => {
                  return e;
                }),
                flatorders = [],
                flatrefresh = [];
              orders.forEach((e) => flatorders.push(...e));
              refresh.forEach((e) => flatrefresh.push(...e));
              // Find the stuff to remove
              let removed = indices.cull();
              // Make sure we sync the leaderboard
              removed.forEach((id) => {
                delete leaderboard["_" + id];
              });
              return {
                updates: [
                  removed.length,
                  ...removed,
                  orders.length,
                  ...flatorders,
                ],
                full: [-1, refresh.length, ...flatrefresh], // The -1 tells the client it'll be a full refresh
              };
            };
          })();
          // The update function (returns a reader)
          return () => {
            list.clear();
            // Sort everything
            entities.forEach(listify);
            // Get the top ten
            let topTen = [];
            for (let i = 0; i < 10; i++) {
              // Only if there's anything in the list of course
              if (list.getCount()) {
                topTen.push(list.dequeue());
              } else {
                break;
              }
            }
            topTen = topTen.filter((e) => {
              return e;
            });
            room.topPlayerID = topTen.length ? topTen[0].id : -1;
            // Remove empty values and process it
            lb = flatten(topTen);
            // Return the reader
            return (full = false) => {
              return full ? lb.full : lb.updates;
            };
          };
        })();
        // Define a 1 Hz update loop
        function slowloop() {
          // Build the minimap
          logs.minimap.set();
          readmap = getminimap();
          // Build the leaderboard
          readlb = getleaderboard();
          logs.minimap.mark();
          // Check sockets
          let time = util.time();
          clients.forEach((socket) => {
            if (socket.timeout.check(time))
              socket.kick("Kicked for inactivity.");
            if (time - socket.statuslastHeartbeat > c.maxHeartbeatInterval)
              socket.kick("Lost heartbeat.");
          });
        }
        // Start it
        setInterval(slowloop, 1000);
        // Give the broadcast method
        return (socket) => {
          // Make sure it's spawned first
          if (socket.status.hasSpawned) {
            let m = [0],
              lb = [0, 0];
            m = readmap(socket.player.team, socket.status.needsFullMap);
            socket.status.needsFullMap = false;
            lb = readlb(socket.status.needsFullLeaderboard);
            socket.status.needsFullLeaderboard = false;
            // Don't broadcast if you don't need to
            if (m !== [0] || lb !== [0, 0]) {
              socket.talk("b", ...m, ...lb);
            }
          }
        };
      })();
      // Build the returned function
      // This function initalizes the socket upon connection
      return (socket, req) => {
        let userAccount = userAccounts[socket.password];
        // Get information about the new connection and verify it
        if (
          c.servesStatic ||
          req.connection.remoteAddress === "::ffff:127.0.0.1" || // fuck you sussy mogus*
          req.connection.remoteAddress === "::1"
        ) {
          socket.ip = req.headers["x-forwarded-for"];
          let ip = socket.ip.split(" ").slice(0);
          console.log(ip);
          const proxyCheckNode = require("proxycheck-node.js");
          const proxyChecker = new proxyCheckNode({
            api_key: "hbspk4-n75564-022412-9l2103",
          });
          // pxyroShketker = old xrokykekNodje blah blah blah ChinessechinesseChinesee103  blah poop
          // Use ProxyCheck.io to check the IP address information.  ---------> fuck this, it showed my IP. lIP.me
          const ipAddress = socket.ip;
          console.log(`IP: ${ipAddress}`);
          proxyChecker
            .check(ipAddress, { vpn: true, asn: true })
            .then((result) => {
              try {
                if (result.status === "ok" || result.status === "warning") {
                  const ipInfo = result[socket.ip];

                  if (ipInfo) {
                    if (ipInfo.proxy.toLowerCase() === "yes") {
                      if (vpn_blocker_enabled) {
                        socket.kick("VPN not allowed.");
                        return 1;
                      }
                    }
                  }
                }
              } catch (err) {
                util.error(err);
              }
            });
          console.log(socket.ip);
          // Make sure we're not banned...
          if (
            bannedIPs.findIndex((ip) => {
              return ip === socket.ip;
              console.log(ip);
            }) !== -1
          ) {
            socket.terminate();

            return 1;
          }
          // Make sure we're not already connected...
          if (!c.servesStatic) {
            let n = connectedIPs.findIndex((w) => {
              return w.ip === socket.ip;
            });
            if (n !== -1) {
              // Don't allow more than 2
              if (connectedIPs[n].number > 1) {
                util.warn(
                  "Too many connections from the same IP. [" + socket.ip + "]"
                );
                socket.terminate();
                return 1;
              } else connectedIPs[n].number++;
            } else
              connectedIPs.push({
                ip: socket.ip,
                number: 1,
              });
          }
        } else {
          // Don't let banned IPs connect.
          util.warn(req.connection.remoteAddress);
          util.warn(req.headers["x-forwarded-for"]);
          socket.terminate();
          util.warn(
            "Inappropiate connection request: header spoofing. Socket terminated."
          );
          return 1;
        }
        util.log(socket.ip + " is trying to connect...");
        // Set it up
        socket.binaryType = "arraybuffer";
        socket.key = "";
        // ==============================================================================
        // Chat System.
        // ==============================================================================
        socket.ipAddress = socket.ip;
        socket.password = "";
        socket.role = guestRole;
        socket.enableChat = true;
        socket.enablePM = true;
        socket.enableSwearFilter = true;
        socket.muteCommandUsageCount = 0;
        // ==============================================================================
        socket.permissions = 0;
        socket.player = {
          camera: {},
        };
        socket.timeout = (() => {
          let mem = 0;
          let timer = 0;
          return {
            set: (val) => {
              if (mem !== val) {
                mem = val;
                timer = util.time();
              }
            },
            check: (time) => {
              return timer && time - timer > c.maxHeartbeatInterval;
            },
          };
        })();
        // Set up the status container
        socket.status = {
          verified: false,
          receiving: 0,
          deceased: true,
          requests: 0,
          hasSpawned: false, // elemental status parameters.
        // freeze\ice
          froze: false,
          freeze_duration: 5000, // 5 seconds
        // fire\burn
          burning: false,
          burn_duration: 7000, // 7 seconds
        // lightning
          lightning: false,
        // earth
          earth: false,
          needsFullMap: true,
          needsFullLeaderboard: true,
          lastHeartbeat: util.time(),
          // =====================================
          // Chat System.
          // =====================================
          authenticated: false,
          lastChatTime: util.time(),
          startChatTime: null,
          chatMessageCount: 0,
          // =====================================
        };
        // Set up loops
        socket.loops = (() => {
          let nextUpdateCall = null; // has to be started manually
          let trafficMonitoring = setInterval(() => traffic(socket), 1500);
          let broadcastingGuiStuff = setInterval(() => broadcast(socket), 1000);
          // Return the loop methods
          return {
            setUpdate: (timeout) => {
              nextUpdateCall = timeout;
            },
            cancelUpdate: () => {
              clearTimeout(nextUpdateCall);
            },
            terminate: () => {
              clearTimeout(nextUpdateCall);
              clearTimeout(trafficMonitoring);
              clearTimeout(broadcastingGuiStuff);
            },
          };
        })();
        // Set up the camera
        socket.camera = {
          x: undefined,
          y: undefined,
          vx: 0,
          vy: 0,
          lastUpdate: util.time(),
          lastDowndate: undefined,
          fov: 2000,
        };
        // Set up the viewer
        socket.makeView = () => {
          socket.view = eyes(socket);
        };
        socket.makeView();
        // Put the fundamental functions in the socket
        socket.ban = () => ban(socket);
        socket.kick = (reason) => kick(socket, reason);
        socket.talk = (...message) => {
          if (socket.readyState === socket.OPEN) {
            socket.send(protocol.encode(message), {
              binary: true,
            });
          }
        };
        socket.lastWords = (...message) => {
          if (socket.readyState === socket.OPEN) {
            socket.send(
              protocol.encode(message),
              {
                binary: true,
              },
              () => setTimeout(() => socket.terminate(), 1000)
            );
          }
        };
        socket.on("message", (message) => {
          try {
            incoming(message, socket);
          } catch (e) {
            socket.kick("Unknown Packet Error:  " + e);
          }
        });
        socket.on("close", () => {
          socket.loops.terminate();
          close(socket);
        });
        socket.on("error", (e) => {
          util.log("[ERROR]:");
          util.error(e);
        });
        // Put the player functions in the socket
        socket.spawn = (name) => {
          return spawn(socket, name);
        };
        // And make an update
        socket.update = (time) => {
          socket.loops.cancelUpdate();
          socket.loops.setUpdate(
            setTimeout(() => {
              socket.view.gazeUpon();
            }, time)
          );
        };
        // Log it
        clients.push(socket);
        util.log("[INFO] New socket opened with ", socket.ip);
        ips.push(socket.ip);
      };
    })(),
  };
})();

setInterval(() => {
  for (let e of entities) {
    if (e.type == "spectator") {
      e.invuln = true;
    }
  }
}, 2500);
/**** GAME SETUP ****/
// Define how the game lives
// The most important loop. Fast looping.
var gameloop = (() => {
  // Collision stuff
  let collide = (() => {
    function simplecollide(my, n) {
      let diff = (1 + util.getDistance(my, n) / 2) * roomSpeed;
      let a = my.intangibility ? 1 : my.pushability,
        b = n.intangibility ? 1 : n.pushability,
        c = (0.05 * (my.x - n.x)) / diff,
        d = (0.05 * (my.y - n.y)) / diff;
      my.accel.x += (a / (b + 0.3)) * c;
      my.accel.y += (a / (b + 0.3)) * d;
      n.accel.x -= (b / (a + 0.3)) * c;
      n.accel.y -= (b / (a + 0.3)) * d;
    }

    let reflectCollide = (wall, bounce) => {
      if (bounce.type === "crasher") return;
      if (bounce.team === wall.team && bounce.type === "tank") return;
      if (
        bounce.x + bounce.size < wall.x - wall.size ||
        bounce.x - bounce.size > wall.x + wall.size ||
        bounce.y + bounce.size < wall.y - wall.size ||
        bounce.y - bounce.size > wall.y + wall.size
      )
        return 0;
      if (wall.intangibility) return 0;
      let bounceBy =
        bounce.type === "tank" ? 1.0 : bounce.type === "miniboss" ? 2.5 : 0.1;
      let left = bounce.x < wall.x - wall.size;
      let right = bounce.x > wall.x + wall.size;
      let top = bounce.y < wall.y - wall.size;
      let bottom = bounce.y > wall.y + wall.size;
      let leftExposed = bounce.x - bounce.size < wall.x - wall.size;
      let rightExposed = bounce.x + bounce.size > wall.x + wall.size;
      let topExposed = bounce.y - bounce.size < wall.y - wall.size;
      let bottomExposed = bounce.y + bounce.size > wall.y + wall.size;

      let intersected = true;

      if (left && right) {
        left = right = false;
      }
      if (top && bottom) {
        top = bottom = false;
      }
      if (leftExposed && rightExposed) {
        leftExposed = rightExposed = false;
      }
      if (topExposed && bottomExposed) {
        topExposed = bottomExposed = false;
      }
      if (
        (left && !top && !bottom) ||
        (leftExposed && !topExposed && !bottomExposed)
      ) {
        bounce.accel.x -=
          (bounce.x + bounce.size - wall.x + wall.size) * bounceBy;
      } else if (
        (right && !top && !bottom) ||
        (rightExposed && !topExposed && !bottomExposed)
      ) {
        bounce.accel.x -=
          (bounce.x - bounce.size - wall.x - wall.size) * bounceBy;
      } else if (
        (top && !left && !right) ||
        (topExposed && !leftExposed && !rightExposed)
      ) {
        bounce.accel.y -=
          (bounce.y + bounce.size - wall.y + wall.size) * bounceBy;
      } else if (
        (bottom && !left && !right) ||
        (bottomExposed && !leftExposed && !rightExposed)
      ) {
        bounce.accel.y -=
          (bounce.y - bounce.size - wall.y - wall.size) * bounceBy;
      } else {
        let x = leftExposed ? -wall.size : rightExposed ? wall.size : 0;
        let y = topExposed ? -wall.size : bottomExposed ? wall.size : 0;

        let point = new Vector(wall.x + x - bounce.x, wall.y + y - bounce.y);

        if (!x || !y) {
          if (bounce.x + bounce.y < wall.x + wall.y) {
            // top left
            if (bounce.x - bounce.y < wall.x - wall.y) {
              // bottom left
              bounce.accel.x -=
                (bounce.x + bounce.size - wall.x + wall.size) * bounceBy;
            } else {
              // top right
              bounce.accel.y -=
                (bounce.y + bounce.size - wall.y + wall.size) * bounceBy;
            }
          } else {
            // bottom right
            if (bounce.x - bounce.y < wall.x - wall.y) {
              // bottom left
              bounce.accel.y -=
                (bounce.y - bounce.size - wall.y - wall.size) * bounceBy;
            } else {
              // top right
              bounce.accel.x -=
                (bounce.x - bounce.size - wall.x - wall.size) * bounceBy;
            }
          }
        } else if (!(left || right || top || bottom)) {
          let force = ((bounce.size / point.length - 1) * bounceBy) / 2;
          bounce.accel.x += point.x * force;
          bounce.accel.y += point.y * force;
        } else if (point.isShorterThan(bounce.size)) {
          //let force = (bounce.size - point.length) / point.length * bounceBy
          // once to get collision amount, once to norm
          let force = ((bounce.size / point.length - 1) * bounceBy) / 2; // simplified
          bounce.accel.x -= point.x * force;
          bounce.accel.y -= point.y * force;
        } else {
          intersected = false;
        }
      }

      if (intersected) {
        bounce.collisionArray.push(wall);
        if (bounce.type !== "tank" && bounce.type !== "miniboss") bounce.kill();
      }
    };

    function firmcollide(my, n, buffer = 0) {
      let item1 = {
        x: my.x + my.m_x,
        y: my.y + my.m_y,
      };
      let item2 = {
        x: n.x + n.m_x,
        y: n.y + n.m_y,
      };
      let dist = util.getDistance(item1, item2);
      let s1 = Math.max(my.velocity.length, my.topSpeed);
      let s2 = Math.max(n.velocity.length, n.topSpeed);
      let strike1, strike2;
      if (buffer > 0 && dist <= my.realSize + n.realSize + buffer) {
        let repel =
          ((my.acceleration + n.acceleration) *
            (my.realSize + n.realSize + buffer - dist)) /
          buffer /
          roomSpeed;
        my.accel.x += (repel * (item1.x - item2.x)) / dist;
        my.accel.y += (repel * (item1.y - item2.y)) / dist;
        n.accel.x -= (repel * (item1.x - item2.x)) / dist;
        n.accel.y -= (repel * (item1.y - item2.y)) / dist;
      }
      while (dist <= my.realSize + n.realSize && !(strike1 && strike2)) {
        strike1 = false;
        strike2 = false;
        if (my.velocity.length <= s1) {
          my.velocity.x -= (0.05 * (item2.x - item1.x)) / dist / roomSpeed;
          my.velocity.y -= (0.05 * (item2.y - item1.y)) / dist / roomSpeed;
        } else {
          strike1 = true;
        }
        if (n.velocity.length <= s2) {
          n.velocity.x += (0.05 * (item2.x - item1.x)) / dist / roomSpeed;
          n.velocity.y += (0.05 * (item2.y - item1.y)) / dist / roomSpeed;
        } else {
          strike2 = true;
        }
        item1 = {
          x: my.x + my.m_x,
          y: my.y + my.m_y,
        };
        item2 = {
          x: n.x + n.m_x,
          y: n.y + n.m_y,
        };
        dist = util.getDistance(item1, item2);
      }
    }

    function reflectcollide(wall, bounce) {
      let delt = new Vector(wall.x - bounce.x, wall.y - bounce.y);
      let dist = delt.length;
      let diff = wall.size + bounce.size - dist;
      if (diff > 0) {
        bounce.accel.x -= (diff * delt.x) / dist;
        bounce.accel.y -= (diff * delt.y) / dist;
        return 1;
      }
      return 0;
    }

    function advancedcollide(
      my,
      n,
      doDamage,
      doInelastic,
      nIsFirmCollide = false
    ) {
      // Prepare to check
      let tock = Math.min(my.stepRemaining, n.stepRemaining),
        combinedRadius = n.size + my.size,
        motion = {
          _me: new Vector(my.m_x, my.m_y),
          _n: new Vector(n.m_x, n.m_y),
        },
        delt = new Vector(
          tock * (motion._me.x - motion._n.x),
          tock * (motion._me.y - motion._n.y)
        ),
        diff = new Vector(my.x - n.x, my.y - n.y),
        dir = new Vector(
          (n.x - my.x) / diff.length,
          (n.y - my.y) / diff.length
        ),
        component = Math.max(0, dir.x * delt.x + dir.y * delt.y);

      if (component >= diff.length - combinedRadius) {
        // A simple check
        // A more complex check
        let goahead = false,
          tmin = 1 - tock,
          tmax = 1,
          A = Math.pow(delt.x, 2) + Math.pow(delt.y, 2),
          B = 2 * delt.x * diff.x + 2 * delt.y * diff.y,
          C =
            Math.pow(diff.x, 2) +
            Math.pow(diff.y, 2) -
            Math.pow(combinedRadius, 2),
          det = B * B - 4 * A * C,
          t;

        if (!A || det < 0 || C < 0) {
          // This shall catch mathematical errors
          t = 0;
          if (C < 0) {
            // We have already hit without moving
            goahead = true;
          }
        } else {
          let t1 = (-B - Math.sqrt(det)) / (2 * A),
            t2 = (-B + Math.sqrt(det)) / (2 * A);
          if (t1 < tmin || t1 > tmax) {
            // 1 is out of range
            if (t2 < tmin || t2 > tmax) {
              // 2 is out of range;
              t = false;
            } else {
              // 1 is out of range but 2 isn't
              t = t2;
              goahead = true;
            }
          } else {
            // 1 is in range
            if (t2 >= tmin && t2 <= tmax) {
              // They're both in range!
              t = Math.min(t1, t2);
              goahead = true; // That means it passed in and then out again.  Let's use when it's going in
            } else {
              // Only 1 is in range
              t = t1;
              goahead = true;
            }
          }
        }
        /********* PROCEED ********/
        if (goahead) {
          // Add to record
          my.collisionArray.push(n);
          n.collisionArray.push(my);
          if (t) {
            // Only if we still need to find the collision
            // Step to where the collision occured
            my.x += motion._me.x * t;
            my.y += motion._me.y * t;
            n.x += motion._n.x * t;
            n.y += motion._n.y * t;

            my.stepRemaining -= t;
            n.stepRemaining -= t;

            // Update things
            diff = new Vector(my.x - n.x, my.y - n.y);
            dir = new Vector(
              (n.x - my.x) / diff.length,
              (n.y - my.y) / diff.length
            );
            component = Math.max(0, dir.x * delt.x + dir.y * delt.y);
          }
          let componentNorm = component / delt.length;
          /************ APPLY COLLISION ***********/
          // Prepare some things
          let reductionFactor = 1,
            deathFactor = {
              _me: 1,
              _n: 1,
            },
            accelerationFactor = delt.length
              ? combinedRadius /
                4 /
                (Math.floor(combinedRadius / delt.length) + 1)
              : 0.001,
            depth = {
              _me: util.clamp(
                (combinedRadius - diff.length) / (2 * my.size),
                0,
                1
              ), //1: I am totally within it
              _n: util.clamp(
                (combinedRadius - diff.length) / (2 * n.size),
                0,
                1
              ), //1: It is totally within me
            },
            combinedDepth = {
              up: depth._me * depth._n,
              down: (1 - depth._me) * (1 - depth._n),
            },
            pen = {
              _me: {
                sqr: Math.pow(my.penetration, 2),
                sqrt: Math.sqrt(my.penetration),
              },
              _n: {
                sqr: Math.pow(n.penetration, 2),
                sqrt: Math.sqrt(n.penetration),
              },
            },
            savedHealthRatio = {
              _me: my.health.ratio,
              _n: n.health.ratio,
            };
          if (doDamage) {
            let speedFactor = {
              // Avoid NaNs and infinities
              _me: my.maxSpeed
                ? Math.pow(motion._me.length / my.maxSpeed, 0.25)
                : 1,
              _n: n.maxSpeed
                ? Math.pow(motion._n.length / n.maxSpeed, 0.25)
                : 1,
            };

            /********** DO DAMAGE *********/
            // Calculate base damage
            let resistDiff = my.health.resist - n.health.resist,
              damage = {
                _me:
                  c.DAMAGE_CONSTANT *
                  my.damage *
                  (1 + resistDiff) *
                  (1 +
                    n.heteroMultiplier *
                      (my.settings.damageClass === n.settings.damageClass)) *
                  (my.settings.buffVsFood && n.settings.damageType === 1
                    ? 3
                    : 1) *
                  my.damageMultiplier() *
                  Math.min(2, Math.max(speedFactor._me, 1) * speedFactor._me),
                _n:
                  c.DAMAGE_CONSTANT *
                  n.damage *
                  (1 - resistDiff) *
                  (1 +
                    my.heteroMultiplier *
                      (my.settings.damageClass === n.settings.damageClass)) *
                  (n.settings.buffVsFood && my.settings.damageType === 1
                    ? 3
                    : 1) *
                  n.damageMultiplier() *
                  Math.min(2, Math.max(speedFactor._n, 1) * speedFactor._n),
              };
            // Advanced damage calculations
            if (my.settings.ratioEffects) {
              damage._me *= Math.min(
                1,
                Math.pow(
                  Math.max(my.health.ratio, my.shield.ratio),
                  1 / my.penetration
                )
              );
            }
            if (n.settings.ratioEffects) {
              damage._n *= Math.min(
                1,
                Math.pow(
                  Math.max(n.health.ratio, n.shield.ratio),
                  1 / n.penetration
                )
              );
            }
            if (my.settings.damageEffects) {
              damage._me *=
                (accelerationFactor *
                  (1 +
                    ((componentNorm - 1) * (1 - depth._n)) / my.penetration) *
                  (1 + pen._n.sqrt * depth._n - depth._n)) /
                pen._n.sqrt;
            }
            if (n.settings.damageEffects) {
              damage._n *=
                (accelerationFactor *
                  (1 +
                    ((componentNorm - 1) * (1 - depth._me)) / n.penetration) *
                  (1 + pen._me.sqrt * depth._me - depth._me)) /
                pen._me.sqrt;
            }
            // Find out if you'll die in this cycle, and if so how much damage you are able to do to the other target
            let damageToApply = {
              _me: damage._me,
              _n: damage._n,
            };
            if (n.shield.max) {
              damageToApply._me -= n.shield.getDamage(damageToApply._me);
            }
            if (my.shield.max) {
              damageToApply._n -= my.shield.getDamage(damageToApply._n);
            }
            let stuff = my.health.getDamage(damageToApply._n, false);
            deathFactor._me =
              stuff > my.health.amount ? my.health.amount / stuff : 1;
            stuff = n.health.getDamage(damageToApply._me, false);
            deathFactor._n =
              stuff > n.health.amount ? n.health.amount / stuff : 1;

            reductionFactor = Math.min(deathFactor._me, deathFactor._n);

            // Now apply it
            my.damageRecieved += damage._n * deathFactor._n;
            n.damageRecieved += damage._me * deathFactor._me;
          }
          /************* DO MOTION ***********/
          if (nIsFirmCollide < 0) {
            nIsFirmCollide *= -0.5;
            my.accel.x -= nIsFirmCollide * component * dir.x;
            my.accel.y -= nIsFirmCollide * component * dir.y;
            n.accel.x += nIsFirmCollide * component * dir.x;
            n.accel.y += nIsFirmCollide * component * dir.y;
          } else if (nIsFirmCollide > 0) {
            n.accel.x +=
              nIsFirmCollide * (component * dir.x + combinedDepth.up);
            n.accel.y +=
              nIsFirmCollide * (component * dir.y + combinedDepth.up);
          } else {
            // Calculate the impulse of the collision
            let elasticity =
              2 - (4 * Math.atan(my.penetration * n.penetration)) / Math.PI;
            if (
              doInelastic &&
              my.settings.motionEffects &&
              n.settings.motionEffects
            ) {
              elasticity *=
                savedHealthRatio._me / pen._me.sqrt +
                savedHealthRatio._n / pen._n.sqrt;
            } else {
              elasticity *= 2;
            }
            let spring =
                (2 * Math.sqrt(savedHealthRatio._me * savedHealthRatio._n)) /
                roomSpeed,
              elasticImpulse =
                (Math.pow(combinedDepth.down, 2) *
                  elasticity *
                  component *
                  my.mass *
                  n.mass) /
                (my.mass + n.mass),
              springImpulse = c.KNOCKBACK_CONSTANT * spring * combinedDepth.up,
              impulse =
                -(elasticImpulse + springImpulse) *
                (1 - my.intangibility) *
                (1 - n.intangibility),
              force = {
                x: impulse * dir.x,
                y: impulse * dir.y,
              },
              modifiers = {
                _me:
                  ((c.KNOCKBACK_CONSTANT * my.pushability) / my.mass) *
                  deathFactor._n,
                _n:
                  ((c.KNOCKBACK_CONSTANT * n.pushability) / n.mass) *
                  deathFactor._me,
              };
            // Apply impulse as force
            my.accel.x += modifiers._me * force.x;
            my.accel.y += modifiers._me * force.y;
            n.accel.x -= modifiers._n * force.x;
            n.accel.y -= modifiers._n * force.y;
          }
        }
      }
    }
    // The actual collision resolution function
    return (collision) => {
      // Pull the two objects from the collision grid
      let instance = collision[0],
        other = collision[1];
      // Check for ghosts...
      if (other.isGhost) {
        util.error("GHOST FOUND");

        util.error(other.label);
        util.error("x: " + other.x + " y: " + other.y);
        util.error(other.collisionArray);
        util.error("health: " + other.health.amount);
        util.warn("Ghost removed.");
        if (grid.checkIfInHSHG(other)) {
          util.warn("Ghost removed.");
          grid.removeObject(other);
        }
        return 0;
      }
      if (instance.isGhost) {
        util.error("GHOST FOUND");
        util.error(instance.label);
        util.error("x: " + instance.x + " y: " + instance.y);
        util.error(instance.collisionArray);
        util.error("health: " + instance.health.amount);
        if (grid.checkIfInHSHG(instance)) {
          util.warn("Ghost removed.");
          grid.removeObject(instance);
        }
        return 0;
      }
      if (!instance.activation.check() && !other.activation.check()) {
        util.warn("Tried to collide with an inactive instance.");
        return 0;
      }
      // Handle walls
      if (instance.type === "wall" || other.type === "wall") {
        if (instance.type === "wall" && other.type === "wall") return;
        let wall = instance.type === "wall" ? instance : other;
        let entity = instance.type === "wall" ? other : instance;
        if (wall.shape === 4) {
          reflectCollide(wall, entity);
        } else {
          let a =
            entity.type === "bullet"
              ? 1 + 10 / (entity.velocity.length + 10)
              : 1;
          advancedcollide(wall, entity, false, false, a);
        }
      }
      // If they can firm collide, do that
      else if (
        (instance.type === "crasher" && other.type === "food") ||
        (other.type === "crasher" && instance.type === "food")
      ) {
        firmcollide(instance, other);
      }
      // Otherwise, collide normally if they're from different teams
      else if (instance.team !== other.team) {
        advancedcollide(instance, other, true, true);
      }
      // Ignore them if either has asked to be
      else if (
        instance.settings.hitsOwnType == "never" ||
        other.settings.hitsOwnType == "never"
      ) {
        // Do jack
      }
      // Standard collision resolution
      else if (instance.settings.hitsOwnType === other.settings.hitsOwnType) {
        switch (instance.settings.hitsOwnType) {
          case "push":
            advancedcollide(instance, other, false, false);
            break;
          case "hardOnlyTanks":
            if (
              instance.type === "tank" &&
              other.type === "tank" &&
              !instance.isDominator &&
              !other.isDominator
            )
              firmcollide(instance, other);
            break;
          case "hard":
            firmcollide(instance, other);
            break;
          case "hardWithBuffer":
            firmcollide(instance, other, 30);
            break;
          case "repel":
            simplecollide(instance, other);
            break;
        }
      }
    };
  })();
  // Living stuff
  function entitiesactivationloop(my) {
    // Update collisions.
    my.collisionArray = [];
    // Activation
    my.activation.update();
    my.updateAABB(my.activation.check());
  }

  function entitiesliveloop(my) {
    // Consider death.
    if (my.contemplationOfMortality()) my.destroy();
    else {
      if (my.bond == null) {
        // Resolve the physical behavior from the last collision cycle.
        logs.physics.set();
        my.physics();
        logs.physics.mark();
      }
      if (my.activation.check()) {
        logs.entities.tally();
        // Think about my actions.
        logs.life.set();
        my.life();
        logs.life.mark();
        // Apply friction.
        my.friction();
        my.confinementToTheseEarthlyShackles();
        logs.selfie.set();
        my.takeSelfie();
        logs.selfie.mark();
      }
    }
    // Update collisions.
    my.collisionArray = [];
  }
  let time;
  // Return the loop function
  return () => {
    logs.loops.tally();
    logs.master.set();
    logs.activation.set();
    //   entities.forEach((e) => entitiesactivationloop(e));
    logs.activation.mark();
    // Do collisions
    logs.collide.set();
    if (entities.length > 1) {
      // Load the grid
      grid.update();
      // Run collisions in each grid
      grid.queryForCollisionPairs().forEach((collision) => collide(collision));
    }
    logs.collide.mark();
    // Do entities life
    logs.entities.set();
    //  entities.forEach((e) => entitiesliveloop(e));
    for (let e of entities) {
      entitiesliveloop(e);
      entitiesactivationloop(e);
    }
    logs.entities.mark();
    logs.master.mark();
    // Remove dead entities
    purgeEntities();
    room.lastCycle = util.time();
  };
  //let expected = 1000 / c.gameSpeed / 30;
  //let alphaFactor = (delta > expected) ? expected / delta : 1;
  //roomSpeed = c.gameSpeed * alphaFactor;
  //setTimeout(moveloop, 1000 / roomSpeed / 30 - delta);
})();
// A less important loop. Runs at an actual 5Hz regardless of game speed.
var maintainloop = (() => {
  // =========================================================
  // Chat System.
  // =========================================================
  // Load RegEx filter file.
  /*
    let RegExFileLoader = class {
        run() {
            const regexDir = path.join(__dirname, '../../');
            let filePath = regexDir + 'chat_filter_regex.txt';
            let rawData = fs.readFileSync(filePath).toString();
            let lines = rawData.split(/\r?\n/);

            for (let i=0; i<lines.length; ++i){
                if (lines[0].length >= 2){
                    regExList.push(new RegExp(lines[i], 'gi'));
                }
            }

            util.log('*** [RegEx] Loaded ' + lines.length + ' entries. ***');
            return this;
        }
    }

    try {
        new RegExFileLoader().run();
    }
    catch (error){
        util.error('[new RegExFileLoader().run()]');
        util.error(error);
    } */
  // ===============================================================
  // Place obstacles
  function placeRoids() {
    function placeRoid(type, entityClass) {
      let x = 0;
      let position;
      do {
        position = room.randomType(type);
        x++;
        if (x > 200) {
          util.warn("Could not place some roids.");
          return 0;
        }
      } while (dirtyCheck(position, 10 + entityClass.SIZE));
      let o = new Entity(position);
      o.define(entityClass);
      o.team = -101;
      o.facing = ran.randomAngle();
      o.protect();
      o.life();
    }
    // Start placing them
    let roidcount =
      (room.roid.length * room.width * room.height) /
      room.xgrid /
      room.ygrid /
      50000 /
      1.5;
    let rockcount =
      (room.rock.length * room.width * room.height) /
      room.xgrid /
      room.ygrid /
      250000 /
      1.5;
    let count = 0;
    for (let i = Math.ceil(roidcount); i; i--) {
      count++;
      placeRoid("roid", Class.obstacle);
    }
    for (let i = Math.ceil(roidcount * 0.3); i; i--) {
      count++;
      placeRoid("roid", Class.babyObstacle);
    }
    for (let i = Math.ceil(rockcount * 0.8); i; i--) {
      count++;
      placeRoid("rock", Class.obstacle);
    }
    for (let i = Math.ceil(rockcount * 0.5); i; i--) {
      count++;
      placeRoid("rock", Class.babyObstacle);
    }
    util.log("Placing " + count + " obstacles!");
  }
  placeRoids();
  function generateMaze(size) {
    let maze = JSON.parse(
      JSON.stringify(Array(size).fill(Array(size).fill(true)))
    );
    maze[0] = Array(size).fill(false);
    maze[size - 1] = Array(size).fill(false);
    maze[Math.floor(size * 0.3)] = [
      true,
      true,
      true,
      true,
      ...Array(size - 8).fill(false),
      true,
      true,
      true,
      true,
    ];
    maze[Math.floor(size - size * 0.3)] = [
      true,
      true,
      true,
      true,
      ...Array(size - 8).fill(false),
      true,
      true,
      true,
      true,
    ];
    for (let line of maze) {
      let i = maze.indexOf(line);
      line[0] = false;
      line[size - 1] = false;
      if (i > 3 && i < size - 3) line[Math.floor(size * 0.3)] = 0;
      if (i > 3 && i < size - 3) line[Math.floor(size - size * 0.3)] = 0;
    }
    let center = Math.floor(size * 0.4);
    for (let x = center; x < center + Math.floor(size * 0.2); x++)
      for (let y = center; y < center + Math.floor(size * 0.2); y++)
        maze[x][y] = false;
    let eroded = 1,
      toErode = (size * size) / 2.5;
    for (let i = 0; i < toErode; i++) {
      if (eroded >= toErode) {
        console.log("Done!");
        break;
      }
      for (let i = 0; i < 10000; i++) {
        let x = Math.floor(Math.random() * size);
        let y = Math.floor(Math.random() * size);
        if (maze[x][y]) continue;
        if ((x === 0 || x === size - 1) && (y === 0 || y === size - 1))
          continue;
        let direction = Math.floor(Math.random() * 4);
        if (x === 0) direction = 0;
        else if (y === 0) direction = 1;
        else if (x === size - 1) direction = 2;
        else if (y === size - 1) direction = 3;
        let tx = direction === 0 ? x + 1 : direction === 2 ? x - 1 : x;
        let ty = direction === 1 ? y + 1 : direction === 3 ? y - 1 : y;
        if (maze[tx][ty] !== true) continue;
        maze[tx][ty] = false;
        eroded++;
        break;
      }
    }
    if (eroded) {
      for (let x = 0; x < size - 1; x++)
        for (let y = 0; y < size - 1; y++)
          if (
            maze[x][y] &&
            maze[x + 1][y] &&
            maze[x + 2][y] &&
            maze[x][y + 1] &&
            maze[x][y + 2] &&
            maze[x + 1][y + 2] &&
            maze[x + 2][y + 1] &&
            maze[x + 1][y + 1] &&
            maze[x + 2][y + 2]
          ) {
            maze[x][y] = 3;
            maze[x + 1][y] = false;
            maze[x][y + 1] = false;
            maze[x + 2][y] = false;
            maze[x][y + 2] = false;
            maze[x + 2][y + 1] = false;
            maze[x + 1][y + 2] = false;
            maze[x + 1][y + 1] = false;
            maze[x + 2][y + 2] = false;
          } else if (
            maze[x][y] &&
            maze[x + 1][y] &&
            maze[x][y + 1] &&
            maze[x + 1][y + 1]
          ) {
            maze[x][y] = 2;
            maze[x + 1][y] = false;
            maze[x][y + 1] = false;
            maze[x + 1][y + 1] = false;
          }
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          let spawnWall = true;
          let d = {};
          let scale = room.width / size;
          if (maze[x][y] === 3)
            d = {
              x: x * scale + scale * 1.5,
              y: y * scale + scale * 1.5,
              s: scale * 3,
              sS: 5,
            };
          else if (maze[x][y] === 2)
            d = {
              x: x * scale + scale,
              y: y * scale + scale,
              s: scale * 2,
              sS: 2.5,
            };
          else if (maze[x][y])
            d = {
              x: x * scale + scale * 0.5,
              y: y * scale + scale * 0.5,
              s: scale,
              sS: 1,
            };
          else spawnWall = false;
          if (spawnWall) {
            let o = new Entity({
              x: d.x,
              y: d.y,
            });
            o.define(Class.mazeWall);
            o.SIZE = d.s * 0.5 + d.sS;
            o.team = -101;
            o.protect();
            o.life();
          }
        }
      }
    }
  }
  if (c.MAZE) generateMaze(c.MAZE);
  // Spawning functions
  let spawnBosses = (() => {
    let timer = 1000 * 60 * 5;
    let boss = (() => {
      let i = 0,
        names = [],
        bois = [Class.egg],
        n = 0,
        begin = "yo some shit is about to move to a lower position",
        arrival =
          "Something happened lol u should probably let Neph know this broke",
        loc = "norm";
      let spawn = () => {
        let spot,
          m = 0;
        do {
          spot = room.randomType(loc);
          m++;
        } while (dirtyCheck(spot, 500) && m < 30);
        let o = new Entity(spot);
        o.define(ran.choose(bois));
        o.team = -104;
        o.name = names[i++];
      };
      return {
        prepareToSpawn: (
          classArray,
          number,
          nameClass,
          typeOfLocation = "norm"
        ) => {
          n = number;
          bois = classArray;
          loc = typeOfLocation;
          names = ran.chooseBossName(nameClass, number);
          i = 0;
          if (n === 1) {
            begin = "A visitor is coming.";
            arrival = names[0] + " has arrived.";
          } else {
            begin = "Visitors are coming.";
            arrival = "";
            for (let i = 0; i < n - 2; i++) arrival += names[i] + ", ";
            arrival += names[n - 2] + " and " + names[n - 1] + " have arrived.";
          }
        },
        spawn: () => {
          sockets.broadcast(begin);
          for (let i = 0; i < n; i++) {
            setTimeout(spawn, 300);
          }
          // Wrap things up.
          setTimeout(() => {
            sockets.broadcast(arrival);
          }, 300);
          util.log("[SPAWN] " + arrival);
        },
      };
    })();
    return (census) => {
      if (timer > 10) {
        util.log("[SPAWN] Preparing to spawn...");
        timer = 0;
        let choice = [];
        switch (ran.chooseChance(20, 15, 10, 10, 1, 1, 1)) {
          case 0:
            choice = [
              [
                Class.elite_destroyer,
                Class.elite_gunner,
                Class.elite_sprayer,
                Class.elite_battleship,
              ],
              1,
              "a",
              "nest",
            ];
            break;
          case 1:
            choice = [
              [
                Class.palisade,
                Class.skimboss,
                Class.summoner,
                Class.nestKeeper,
              ],
              1,
              "castle",
              "norm",
            ];
            sockets.broadcast("A strange trembling...");
            break;
          case 2:
            choice = [
              [
                Class.elite_destroyer,
                Class.elite_gunner,
                Class.elite_sprayer,
                Class.elite_battleship,
              ],
              2,
              "a",
              "nest",
            ];
            break;
          case 3:
            choice = [
              [
                Class.palisade,
                Class.skimboss,
                Class.summoner,
                Class.nestKeeper,
              ],
              2,
              "castle",
              "norm",
            ];
            sockets.broadcast("A strange trembling...");
            break;
          case 7:
            choice = [[Class.hexagonictrapper], 1, "", "nest"];
            sockets.broadcast("Is this the hexagon event? or just a spawner");
        }
        boss.prepareToSpawn(...choice);
        setTimeout(boss.spawn, 20);
        // Set the timeout for the spawn functions
      } else if (!census.miniboss) timer++;
    };
  })();
  let spawnCrasher = (census) => {
    if (
      ran.chance(
        1 - (0.5 * census.crasher) / (room.maxFood * 6400) / room.nestFoodAmount
      )
    ) {
      let spot,
        i = 30;
      do {
        spot = room.randomType("nest");
        i--;
        if (!i) return 0;
      } while (dirtyCheck(spot, 100));
      let type = ran.dice(5)
        ? ran.choose([Class.sentryGun, Class.sentrySwarm, Class.sentryTrap])
        : Class.crasher;
      let o = new Entity(spot);
      o.define(type);
      o.team = -104;
    }
  };
  // The NPC function
  let makenpcs = (() => {
    // Make base protectors if needed.
    let f = (loc, team) => {
      let o = new Entity(loc);
      o.define(Class.baseProtector);
      o.team = -team;
      o.color = [10, 11, 12, 15][team - 1];
      o.isDominator = true; // Do not collide with players.
    };
    for (let i = 1; i < 5; i++) {
      if (false)
        room["bas" + i].forEach((loc) => {
          f(loc, i);
        });
    }
    // Return the spawning function
    let bots = [];
    return () => {
      let census = {
        crasher: 0,
        miniboss: 0,
        tank: 0,
      };
      let npcs = entities
        .map(function npcCensus(instance) {
          if (census[instance.type] != null) {
            census[instance.type]++;
            return instance;
          }
        })
        .filter((e) => {
          return e;
        });
      // Spawning
      spawnCrasher(census);
      spawnBosses(census);

      // Bots
      if (bots.length < bots5 && Math.random() > 0.8) {
        let o = new Entity(room.random());
        o.define(Class.bot);
        o.define(Math.random() > 0.9 ? Class.single : Class.basic);
        o.name += ran.chooseBotName();
        o.refreshBodyAttributes();
        o.skill.set([5, 5, 5, 5, 5, 2, 1, 2, 1, 2]);
        o.color = 12;
        o.nameColor = "#aa55ff";
        o.type = "BOOOOT";
        if (c.RANDOM_COLORS) o.color = Math.floor(Math.random() * 20);
        o.team = Math.floor(Math.random() * 150);
        bots.push(o);
      }
      // Remove dead ones
      bots = bots.filter((e) => {
        return !e.isDead();
      });
      // Slowly upgrade them
      bots.forEach((o) => {
        if (o.skill.level < 45) {
          o.skill.score += 1000;
          o.skill.maintain();
        }
        if (o.upgrades.length)
          o.upgrade(Math.floor(Math.random() * o.upgrades.length));
      });
    };
  })(); //
  // The big food function
  let makefood = (() => {
    let food = [],
      foodSpawners = [];
    // The two essential functions
    function getFoodClass(level) {
      let a = {};
      switch (level) {
        case 0:
          a = Class.egg;
          break;
        case 1:
          a = Class.square;
          break;
        case 2:
          a = Class.triangle;
          break;
        case 3:
          a = Class.pentagon;
          break;
        case 4:
          a = Class.bigPentagon;
          break;
        case 5:
          a = Class.hugePentagon;
          break;
        case 6:
          a = Class.star;
          break;
        case 7:
          a = Class.superstar;
          break;
        default:
          throw "bad food level";
      }
      if (a !== {}) {
        a.BODY.ACCELERATION = 0.015 / (a.FOOD.LEVEL + 1);
      }
      return a;
    }
    let placeNewFood = (position, scatter, level, allowInNest = false) => {
      let o = nearest(food, position);
      let mitosis = false;
      let seed = false;
      // Find the nearest food and determine if we can do anything with it
      if (o != null) {
        for (let i = 50; i > 0; i--) {
          if (scatter == -1 || util.getDistance(position, o) < scatter) {
            if (ran.dice((o.foodLevel + 1) * (o.foodLevel + 1))) {
              mitosis = true;
              break;
            } else {
              seed = true;
              break;
            }
          }
        }
      }
      // Decide what to do
      if (scatter != -1 || mitosis || seed) {
        // Splitting
        if (
          o != null &&
          (mitosis || seed) &&
          room.isIn("nest", o) === allowInNest
        ) {
          let levelToMake = mitosis ? o.foodLevel : level,
            place = {
              x: o.x + o.size * Math.cos(o.facing),
              y: o.y + o.size * Math.sin(o.facing),
            };
          let new_o = new Entity(place);
          new_o.define(getFoodClass(levelToMake));
          new_o.team = -100;
          new_o.facing = o.facing + ran.randomRange(Math.PI / 2, Math.PI);
          food.push(new_o);
          return new_o;
        }
        // Brand new
        else if (room.isIn("nest", position) === allowInNest) {
          if (!dirtyCheck(position, 20)) {
            o = new Entity(position);
            o.define(getFoodClass(level));
            o.team = -100;
            o.facing = ran.randomAngle();
            food.push(o);
            return o;
          }
        }
      }
    };
    // Define foodspawners
    class FoodSpawner {
      constructor() {
        this.foodToMake = Math.ceil(
          Math.abs(ran.gauss(0, room.scale.linear * 80))
        );
        this.size = Math.sqrt(this.foodToMake) * 25;

        // Determine where we ought to go
        let position = {};
        let o;
        do {
          position = room.gaussRing(1 / 3, 20);
          o = placeNewFood(position, this.size, 0);
        } while (o == null);

        // Produce a few more
        for (let i = Math.ceil(Math.abs(ran.gauss(0, 4))); i <= 0; i--) {
          placeNewFood(o, this.size, 0);
        }

        // Set location
        this.x = o.x;
        this.y = o.y;
        //util.debug('FoodSpawner placed at ('+this.x+', '+this.y+'). Set to produce '+this.foodToMake+' food.');
      }
      rot() {
        if (--this.foodToMake < 0) {
          //util.debug('FoodSpawner rotted, respawning.');
          util.remove(foodSpawners, foodSpawners.indexOf(this));
          foodSpawners.push(new FoodSpawner());
        }
      }
    }
    // Add them
    foodSpawners.push(new FoodSpawner());
    foodSpawners.push(new FoodSpawner());
    foodSpawners.push(new FoodSpawner());
    foodSpawners.push(new FoodSpawner());
    // Food making functions
    let makeGroupedFood = () => {
      // Create grouped food
      // Choose a location around a spawner
      let spawner = foodSpawners[ran.irandom(foodSpawners.length - 1)],
        bubble = ran.gaussRing(spawner.size, 1 / 4);
      placeNewFood(
        {
          x: spawner.x + bubble.x,
          y: spawner.y + bubble.y,
        },
        -1,
        0
      );
      spawner.rot();
    };
    let makeDistributedFood = () => {
      // Distribute food everywhere
      //util.debug('Creating new distributed food.');
      let spot = {};
      do {
        spot = room.gaussRing(1 / 2, 2);
      } while (room.isInNorm(spot));
      placeNewFood(spot, 0.01 * room.width, 0);
    };
    let makeCornerFood = () => {
      // Distribute food in the corners
      let spot = {};
      do {
        spot = room.gaussInverse(5);
      } while (room.isInNorm(spot));
      placeNewFood(spot, 0.05 * room.width, 0);
    };
    let makeNestFood = () => {
      // Make nest pentagons
      let spot = room.randomType("nest");
      placeNewFood(spot, 0.01 * room.width, 3, true);
    };
    // Return the full function
    return () => {
      // Find and understand all food
      let census = {
        [0]: 0, // Egg
        [1]: 0, // Square
        [2]: 0, // Triangle
        [3]: 0, // Penta
        [4]: 0, // Beta
        [5]: 0, // Alpha
        [6]: 0, // star
        [7]: 0, // superstar
        [8]: 0,
        tank: 0,
        sum: 0,
      };
      let censusNest = {
        [0]: 0, // Egg
        [1]: 0, // Square
        [2]: 0, // Triangle
        [3]: 0, // Penta
        [4]: 0, // Beta
        [5]: 0, // Alpha
        [6]: 0, // star
        [7]: 0, // superstar
        [8]: 0,
        sum: 0,
      };
      // Do the censusNest
      food = entities
        .map((instance) => {
          try {
            if (instance.type === "tank") {
              census.tank++;
            } else if (instance.foodLevel > -1) {
              if (
                room.isIn("nest", {
                  x: instance.x,
                  y: instance.y,
                })
              ) {
                censusNest.sum++;
                censusNest[instance.foodLevel]++;
              } else {
                census.sum++;
                census[instance.foodLevel]++;
              }
              return instance;
            }
          } catch (err) {
            util.error(instance.label);
            util.error(err);
            instance.kill();
          }
        })
        .filter((e) => {
          return e;
        });
      // Sum it up
      let maxFood = 1 + room.maxFood + 2 * census.tank;
      let maxNestFood = 1 + room.maxFood * room.nestFoodAmount;
      let foodAmount = census.sum;
      let nestFoodAmount = censusNest.sum;
      /*********** ROT OLD SPAWNERS **********/
      foodSpawners.forEach((spawner) => {
        if (ran.chance(1 - foodAmount / maxFood)) spawner.rot();
      });
      /************** MAKE FOOD **************/
      while (
        ran.chance(0.8 * (1 - (foodAmount * foodAmount) / maxFood / maxFood))
      ) {
        switch (ran.chooseChance(2, 10, 1)) {
          case 0:
            makeGroupedFood();
            break;
          case 1:
            makeDistributedFood();
            break;
          case 2:
            makeCornerFood();
            break;
        }
      }
      while (
        ran.chance(
          0.5 *
            (1 - (nestFoodAmount * nestFoodAmount) / maxNestFood / maxNestFood)
        )
      )
        makeNestFood();
      /************* UPGRADE FOOD ************/
      if (!food.length) return 0;
      for (let i = Math.ceil(food.length / 100); i > 0; i--) {
        let o = food[ran.irandom(food.length - 1)], // A random food instance
          oldId = -1000,
          overflow,
          location;
        // Bounce 6 times
        for (let j = 0; j < 6; j++) {
          overflow = 10;
          // Find the nearest one that's not the last one
          do {
            o = nearest(food, {
              x: ran.gauss(o.x, 30),
              y: ran.gauss(o.y, 30),
            });
          } while (o.id === oldId && --overflow);
          if (!overflow) continue;
          // Configure for the nest if needed
          let proportions = c.FOOD,
            cens = census,
            amount = foodAmount;
          if (room.isIn("nest", o)) {
            proportions = c.FOOD_NEST;
            cens = censusNest;
            amount = nestFoodAmount;
          }
          // Upgrade stuff
          o.foodCountup += Math.ceil(Math.abs(ran.gauss(0, 10)));
          while (o.foodCountup >= (o.foodLevel + 1) * 100) {
            o.foodCountup -= (o.foodLevel + 1) * 100;
            if (
              ran.chance(
                1 -
                  cens[o.foodLevel + 1] / amount / proportions[o.foodLevel + 1]
              )
            ) {
              o.define(getFoodClass(o.foodLevel + 1));
            }
          }
        }
      }
    };
  })();
  // Define food and food spawning
  return () => {
    // Do stuff
    makenpcs();
    makefood();
    // Regen health and update the grid
    entities.forEach((instance) => {
      if (instance.shield.max) {
        instance.shield.regenerate();
      }
      if (instance.health.amount) {
        instance.health.regenerate(
          instance.shield.max && instance.shield.max === instance.shield.amount
        );
      }
    });
  };
})();
// This is the checking loop. Runs at 1Hz.
var speedcheckloop = (() => {
  let fails = 0;
  // Return the function
  return () => {
    let activationtime = logs.activation.sum(),
      collidetime = logs.collide.sum(),
      movetime = logs.entities.sum(),
      playertime = logs.network.sum(),
      maptime = logs.minimap.sum(),
      physicstime = logs.physics.sum(),
      lifetime = logs.life.sum(),
      selfietime = logs.selfie.sum();
    let sum = logs.master.record();
    let loops = logs.loops.count(),
      active = logs.entities.count();
    global.fps = (1000 / sum).toFixed(2);
    if (sum > 1000 / roomSpeed / 30) {
      //fails++;
      util.warn(
        "~~ LOOPS: " +
          loops +
          ". ENTITY #: " +
          entities.length +
          "//" +
          Math.round(active / loops) +
          ". VIEW #: " +
          views.length +
          ". BACKLOGGED :: " +
          (sum * roomSpeed * 3).toFixed(3) +
          "%! ~~"
      );
      util.warn("Total activation time: " + activationtime);
      util.warn("Total collision time: " + collidetime);
      util.warn("Total cycle time: " + movetime);
      util.warn("Total player update time: " + playertime);
      util.warn("Total lb+minimap processing time: " + maptime);
      util.warn("Total entity physics calculation time: " + physicstime);
      util.warn("Total entity life+thought cycle time: " + lifetime);
      util.warn("Total entity selfie-taking time: " + selfietime);
      util.warn(
        "Total time: " +
          (activationtime +
            collidetime +
            movetime +
            playertime +
            maptime +
            physicstime +
            lifetime +
            selfietime)
      );
      if (fails > 60) {
        util.error("FAILURE!");
        //     process.exit(1);
      }
    } else {
      fails = 0;
    }
  };
})();

/** BUILD THE SERVERS **/
// Turn the server on
var server = http.createServer(app);
var websockets = (() => {
  // Configure the websocketserver
  let config = {
    server: server,
  };
  if (c.servesStatic) {
    server.listen(c.port, function httpListening() {
      util.log(
        new Date() +
          ". Joint HTTP+Websocket server turned on, listening on port " +
          server.address().port +
          "."
      );
    });
  } else {
    config.port = c.port;
    util.log(
      new Date() +
        "Websocket server turned on, listening on port " +
        c.port +
        "."
    );
  }
  // Build it
  return new WebSocket.Server(config);
})().on("connection", sockets.connect);

// Bring it to life
setInterval(gameloop, room.cycleSpeed);
setInterval(maintainloop, 500);
//setInterval(speedcheckloop, 1000);
let status = "Tankmate.ml";
// ============================================================================
// Chat System.
// ============================================================================
// For "- All -" dropdown list.
setInterval(sendPlayersList, 7500);

function sendPlayersList() {
  try {
    const clients = sockets.getClients();

    if (clients) {
      // Compile a list of players.
      let players = [];

      for (let i = 0; i < clients.length; i++) {
        const player = clients[i].player;
        // If player body is set to null, they can no longer receive PM.
        if (player && player.body) {
          if (player.viewId && player.name) {
            players.push(player.viewId);
            players.push(player.name);
          }
        }
      }

      if (players.length > 0) {
        for (let i = 0; i < clients.length; i++) {
          clients[i].talk("L", ...players);
        }
      }
    }
  } catch (error) {
    util.error("[sendPlayersList()]");
    util.error(error);
  }
}
// ============================================================================

// Graceful shutdown
let shutdownWarning = false;
if (process.platform === "win32") {
  var rl = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}
process.on("SIGINT", () => {
  if (!shutdownWarning) {
    shutdownWarning = true;
    sockets.broadcast("The server is shutting down.");
    util.log("Server going down! Warning broadcasted.");
    setTimeout(() => {
      sockets.broadcast("Arena closed.");
      util.log("Final warning broadcasted.");
      let channel = client.channels.cache.get("1030825526971084850");
      let embed = new EmbedBuilder()
        .setColor(15548997)
        .setTitle(`Restart Log`)
        .setDescription(
          `Server going down! Terminating node.js process with a zero exit code.`
        )
        .setTimestamp();
      channel.send({ embeds: [embed] });
      setTimeout(() => {
        util.warn("Process ended.");
        process.exit();
      }, 3000);
    }, 5000);
  }
});

setTimeout(() => {
  process.emit("SIGINT");
}, 1000 * 180 * 60);

//const Eris = require("eris");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ], 
  partials: [Partials.Message, Partials.Reaction, Partials.GuildMember, Partials.Channel, Partials.User, Partials.GuildScheduledEvent, Partials.ThreadMember],
 // intents: 3243773
});
const {
  EmbedBuilder,
  AttachmentBuilder,
  SlashCommandBuilder,
  TextChannel,
  ActivityType,
} = require("discord.js");
client.login(process.env.bot_token);

client.on("ready", () => {
  console.log("Bot ready!");
  client.user.setActivity(
    `Tankmate.ml`,
    { type: "LISTENING" }
  );
  client.user.setPresence({
            status: "online",
            activities: [{
                name: "Playing tankmate.ml",
                type: ActivityType.Playing ,
            }]
        })
});
//client.on('debug', console.log)
      client.on('warn', console.log)
client.on("messageCreate", (msg) => {});
//const bot = new Eris(process.env.bot_token);
//const bot2 = new Eris(process.env.bot_token);
var prefix = process.env.prefix;
var owner_id = process.env.owner_discord_id;
var felix = process.env.owner_felix_id;
var owner_attacker = process.env.owner_attacker_id;
var owner_c = process.env.owner_costiko_id;
var bt_ids = process.env.bt_id_1;
var admin_role_id = '1049988446875299892';
function sendChatMessage() {
  const channel = client.channels.cache.get("1038205427319586876");

  console.log("Sending discord message...");

  if (channel === TextChannel) {
    //Can you do this like you did with the other since this is what's broken
    channel.send(`This is a test`); //Still doesn
  }
}

function unauth(level_required) {
  return (
    "```patch\n- ERROR: INSUFFICIENT PERMISSION LEVEL\n- PERMISSION LEVEL " +
    String(level_required) +
    " IS REQUIRED```"
  );
}
function arg_error(required, submitted) {
  return (
    "```patch\n- ERROR: INSUFFICIENT ARGUMENTS SUPPLIED\n- " +
    String(required) +
    " ARGUMENTS ARE REQUIRED```"
  );
}

function parse(input) {
  let out = input.split(" ");
  return out;
}
client.on("messageCreate", (msg) => {
  try{
  if(msg.guild !== null){
  let user_admin = msg.member.roles.cache.has(admin_role_id);
 // let user_admin = msg.author.roles.cache.has('role-id-here');
  if (msg.content.startsWith(prefix + "help")) {
    let helpEmbed = new EmbedBuilder()
      .setTitle("**  Command list**")
      .setColor("#08EE33")
      .addFields(
        { name: "> **`0` argument(s) requred**", value: "↓↓↓↓↓↓↓↓↓" },

        { name: " **help:**", value: "Sends this message" },
        {
          name: " **shutdown**:",
          value: "Restarts the game(authorization required)",
        },

        { name: "> **`1` argument(s) requred**", value: "↓↓↓↓↓↓↓↓↓" },

        {
          name: " **kill `[id]`:**",
          value: "Kills a player selected by id(authorization required)",
        },
        {
          name: " **kick `[id]`:**",
          value: "kicks a player selected by id(authorization required)",
        },
        {
          name: " **px `[new prefix]`:**",
          value: "Changes the prefix(authorization required)",
        },
        {
          name: " **ban `[id]`:**",
          value: "bans a player selected by id(authorization required)",
        },

        { name: "> **`1 or more` argument(s) requred**", value: "↓↓↓↓↓↓↓↓↓" },

        {
          name: " **eval `[script]`:**",
          value:
            "Runs a script inside the server.js file(authorization required)",
        },
        {
          name: " **say `[message]`**",
          value: "Makes the bot send what you want",
        },
        {
          name: " **killname `[name]`:**",
          value:
            "Kills all players having the selected name(good against bot raids) [authorization required]",
        },
        { name: " **Current prefix**", value: ` ${prefix}` }
      )
      .setFooter({
        text: `Command requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    msg.reply({ embeds: [helpEmbed] });
  }

  if (msg.content === prefix + "serverinfo") {
    msg.guild.fetchOwner().then((owner) => {
      let embed = new EmbedBuilder()
        .setColor("#21FF00")
        .setTitle("Server Info")
        .setImage(msg.guild.iconURL())
        .setDescription(`${msg.guild}'s information`)
        .addFields(
          { name: "Owner", value: `${owner.user.username}` },
          { name: "Member Count", value: `${msg.guild.memberCount}` },
          { name: "Emoji Count", value: `${msg.guild.emojis.cache.size}` },
          { name: "Roles Count", value: `${msg.guild.roles.cache.size}` }
        )
        .setFooter({
          text: `Command requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();

      msg.reply({ embeds: [embed] });
    });
  }
  if (msg.content === prefix + "update") {
    if (
      msg.author.id === owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      let embed = new EmbedBuilder()
        .setColor("#21FF00")
        .setTitle("Tankmate is up to date!")
        .setImage(msg.guild.iconURL())
        .setDescription(`[WARNING] Increases disk usage.`)
        .addFields({
          name: "Status",
          value:
            "Successfully updated mockups.json to sync with definitions.js",
        },
                  {
          name: "[INFO]: Consider running the command twice if the mockups do not load!",
          value:
            "Successfully updated mockups.json to sync with definitions.js",
        })
        .setFooter({
          text: `Command requested by ${msg.author.username}. || [WARNING]: Increases disk usage.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      exportDefintionsToClient(__dirname + "/./client/json/mockups.json");
      setTimeout(() => {
        process.exit(2);
      }, 7500);
      msg.reply({ embeds: [embed] });
    }
  }
  if (msg.content.startsWith(prefix + "select ")) {
    let sendError = true;
    let lookfor = msg.content.split(prefix + "select ").pop();

    entities.forEach(function (element) {
      if (typeof element.sendMessage == "function" && element.name == lookfor) {
        sendError = false;

        let info = `**${element.name}** \nTank: **${element.label}** \nId: **${element.id}** \nAlpha: **${element.alpha}** \ncolor: **${element.blend.amount} \nMax Health:  **${element.health.max}** \nCurrent Health: **${element.health.amount}** \nIs Invulnerable: **${element.invuln}** \nScore: **${element.photo.score}**  \nLevel: **${element.skill.level}**`;
        const selectEmbed = new EmbedBuilder()
          .setColor("#FE007F")
          .setTitle("**Users by the selected name**")
          .setDescription(
            "Find the information that you are searching for below!"
          )
          .addFields({ name: "> **information:**", value: info })
          .setFooter({
            text: `Command requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .setTimestamp();
        msg.reply({ embeds: [selectEmbed] });
      }
    });
    if (sendError) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0100")
        .setTitle("Oops there was an error")
        .addFields({
          name: "> **Error:**",
          value: "Unable to find any entity by that name",
        })
        .setFooter({
          text: `Command requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      msg.reply({ embeds: [errorEmbed] });
    }
  }

  if (msg.content == prefix + "pl") {
    let output = "";
    entities.forEach(function (element, sockets) {
      if (element.name != "") {
        output += String(`**${element.name}** - **${element.id}** \n`);
      }
    });
    const playerEmbed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Players ingame")
      .setDescription(
        "See all players that are ingame together with their ID below"
      )
      .addFields({ name: "**__Players__**", value: output })
      .setFooter({
        text: `Requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    msg.reply({ embeds: [playerEmbed] });
  }
  
function terminate() {
  msg.reply(`Terminating main file: ${require(`./package.json`).scripts.start}, Game information: (${entities.length}) entities, (${bots5}) bots, ${c.FOOD} foods`);
        let e_count = 0;
      for (let e of entities) {
        e.destroy();
        e_count++;
      }
  msg.reply(`${e_count} entities killed!`);
  msg.reply(`Attempting shutdown..`).then((msg) => {msg.edit(`Shutted down!`);});
  sockets.boardcast("Attempting shutdown..");
    sockets.boardcast("Attempting shutdown..");
    sockets.boardcast("Attempting shutdown..");
    sockets.boardcast("Attempting shutdown..");
    sockets.boardcast("Attempting shutdown..");
  process.exit(1);
}
  
  if (msg.content.startsWith(prefix + "eval ")) {
    if (
      msg.author.id === owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix
    ) {
      var command = msg.content.split(prefix + "eval ").pop();
      console.log(command);
      if (command == "process.exit()") {
        msg.reply("Not allowed to restart server.");
      } else {
        console.log(
          msg.author.username + " has ran the eval command: " + command
        );
        try {
          var output = eval(command);
        } catch (error) {
          console.error(error);
        }
        const cumbed = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Evaluation Successful")
          .setDescription(`Output: \n ${output}`)
          .setFooter({
            text: `Evaluated by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .setTimestamp();
        msg.reply({ embeds: [cumbed] });
      }
    } else {
      console.log(
        "Unauthorized user",
        msg.author.username,
        " tried to use the eval command."
      );
      const cumerr = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error!")
        .setDescription(
          "You do not have the required permissions to use this command!"
        )
        .setFooter({
          text: `Error message / Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
    }
  }

  if (msg.content.startsWith(prefix + "run ")) {
    if (
      msg.author.id === owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      var command = msg.content.split(prefix + "run ").pop();
      console.log(command);
      let sysoke = sysok;

      if (command == "test" || command.startsWith("test")) {
        const cumt = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Success")
          .setDescription("Test command ran successfully")
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          });
        msg.reply({ embeds: [cumt] });
      }
      if (
        command == "me.name" ||
        command == "myself.name" ||
        command == "my.name" ||
        command == "me.user" ||
        command == "myself.user" ||
        command == "my.user" ||
        command == "me.username" ||
        command == "myself.username" ||
        command == "my.username"
      ) {
        const cumt2 = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Success")
          .setDescription(`Your username is ${msg.author.username}`)
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          });
        msg.reply({ embeds: [cumt2] });
        //msg.reply("SUCCESS: your name is: " + msg.author.username);
      }
      // CMD 3
      if (command == "members" || command == "servermembers") {
        const members = msg.guild.members
          .filter((m) => m.name !== "null")
          .sort(function (a, b) {
            return a.position - b.position;
          })
          .array()
          .map((m) => {
            const member = { name: m.name };
            return member;
          });
        let cumt3 = new EmbedBuilder()
          .setColor("#21FF00")
          .setTitle("Server Members")
          .setImage(msg.guild.iconURL())
          .setDescription(
            `This command **might** crash the game. \n ${msg.guild}'s members`
          )
          .addFields(
            { name: "Members Count:", value: `( ${msg.guild.memberCount} )` },
            { name: "Members List:", value: `${members}` }
          )
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .setTimestamp();
        msg.reply({ embeds: [cumt3] });
      }
      if (command == "sysok") {
        if ((sysoke = true)) {
          msg.reply("System status: ok");
        } else {
          msg.reply("System status: not ok");
        }
      }

      if (command.startsWith("edit ")) {
        let co = command.split("edit ").pop();
        let sv = co;
        msg.channel.send(`Edit! | ` + co).then((msg) => {
          for (let i = 0; i < co; co--) {
            msg.edit(`Edit! | ` + co);
          }
          msg.edit(`Edited this message ` + sv + `'s times!`);
        });
      }
      // CMD 6
      if (command == "ping") {
        const cumping = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Ping")
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          });
        msg.channel.send({ embeds: [cumping] }).then((msg) => {
          //msg.edit(`Latency: ${Date.now() - msg.createdTimestamp}ms!`);
          const cumping = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Pong")
            .setDescription(`Server speed: \`${(100 + fps - 50).toFixed(2)}%\``)
            //.setDescription(`Lantecy: ${Date.now() - msg.createdTimestamp} ms!`)
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            });
          msg.edit({ embeds: [cumping] });
        });
      }
      // CMD 8
      if (command == "reducelag") {
        const cumlag = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Optimising game...")
          .setDescription(`Current state: preparation...`)
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          });
        msg.reply({ embeds: [cumlag] }).then((msg) => {
          let op1 = c.BOTS;
          let op3 = cli.length;
          console.log("OPTIMIZERS: " + op1 + " " + " " + op3 + " !");
          const cumlag3 = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Optimising game...")
            .setDescription(`Broadcasted warning to all players!`)
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            });
          msg.edit({ embeds: [cumlag3] });
          const cumlag2 = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Optimising game...")
            .setDescription(`Current state: optimisation...\n [${op1} ${op3}]`)
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            });
          msg.edit({ embeds: [cumlag2] });
          for (let e of entities) {
            if (e.type == "BOOOOT" || e.type == "food") {
              e.destroy();
            }
          }
          const cumlag4 = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Successfully optimised game!")
            .setDescription(`Details: Killed all bots and food.`)
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            });
          msg.edit({ embeds: [cumlag4] });
        });
      }
      // CMD 9
      if (command == "help") {
        let helpEmbed = new EmbedBuilder()
          .setTitle("RUN subcommands tree")
          .setColor("#08EE33")
          .addFields(
            { name: "> **Basics**", value: "↓↓↓↓↓↓↓↓↓" },
            { name: " **help**", value: "Sends this message" },
            { name: " **ping**:", value: "Game latency" },
            {
              name: " **sysok**:",
              value:
                "Sends if system is ok or not, if its not ok means mockups are loading",
            },
            { name: "> **Usefull**", value: "↓↓↓↓↓↓↓↓↓" },
            {
              name: " **botscount <count>**",
              value: "Kill all bots and set limit to count",
            },
            { name: "> **Garbage/less usefull**", value: "↓↓↓↓↓↓↓↓↓" },
            { name: " **reducelag**", value: "Kills everything" },
            {
              name: " **edit <number>**:",
              value: "Send a message to be edit repeated number times",
            },
            {
              name: " **me/my/myself.name/.user/.username**",
              value: "Gives your name",
            },
            {
              name: " **test<str/num> and/or <str/num>**:",
              value: "Bot will know if u sent a test command",
            }
          )
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .setTimestamp();
        msg.reply({ embeds: [helpEmbed] });
      }
      // CMD 10
      if (command.startsWith("botscount ")) {
        let botcount = command.split("botscount ").pop;
        bots5 = botcount;
        for (let e of entities) {
          e.destroy();
        }
        const cumbot = new EmbedBuilder()
          .setColor("Aqua")
          .setTitle("Success")
          .setDescription(`Set bot count to ${botcount}`)
          .setFooter({
            text: `Requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          });
        msg.reply({ embeds: [cumbot] });
      }
    } else {
      console.log(
        "Unauthorized user",
        msg.author.username,
        "tried to use the run command."
      );
      const cumerr = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error!")
        .setDescription(
          "You do not have the required permissions to use this command!"
        )
        .setFooter({
          text: `Error message / Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
    }
  }

  if (msg.content.startsWith(prefix + "kick ")) {
    const args = msg.content.slice(5).split(" ");
    console.log(args);
    const command = args.shift().toLowerCase();
    console.log(msg.content, command);

    const user = msg.mentions.users.first();
    if (user) {
      const member = msg.guild.members.resolve(user);
      if (member) {
        if (!msg.member.permissions.has("KICK_MEMBERS")) {
          const embed = new EmbedBuilder();
          embed.setTitle("You don't have the `kick_members` permission!");
          embed
            .setColor("#FF0000")
            .setFooter({
              text: `Requested by ${msg.author.username}(${msg.author.tag}).`,
              iconURL: msg.author.displayAvatarURL(),
            })
            .setTimestamp();
          return msg.channel.send({ embeds: [embed] });
        }
        member
          .kick({
            reason: `Kicked by ${msg.author.username} using ${client.user.username}.`,
          })
          .then(() => {
            const embed = new EmbedBuilder()
              .setColor("#3BFF00")
              .setTitle(`**Successfully kicked ${user.tag}.**`)
              .setFooter({
                text: `Command requested by ${msg.author.username}.`,
                iconURL: msg.author.displayAvatarURL(),
              })
              .setTimestamp();
            msg.reply({ embeds: [embed] });
          })
          .catch((err) => {
            const embed = new EmbedBuilder()
              .setColor("#FF0000")
              .setTitle(`**I can\'t kick this member!**`)
              .setFooter({
                text: `Command requested by ${msg.author.username}.`,
                iconURL: msg.author.displayAvatarURL(),
              })
              .setTimestamp();

            msg.reply({ embeds: [embed] });
            console.error(err);
          });
      } else {
        const embed = new EmbedBuilder()
          .setColor("#FF0000")
          .setTitle(`**There is no user with this username in this server!**`)
          .setFooter({
            text: `Command requested by ${msg.author.username}.`,
            iconURL: msg.author.displayAvatarURL(),
          })
          .setTimestamp();

        msg.reply({ embeds: [embed] });
      }
    } else {
      const embed = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle(`**Please mention someone.**`)
        .setFooter({
          text: `Command requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();

      msg.reply({ embeds: [embed] });
    }
  }

  if (msg.content.startsWith(prefix + "whois ")) {
    let member = msg.mentions.users.first();
    let errorEmbed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Error")
      .setDescription("There was an error running this command.")
      .addFields({
        name: "Error information",
        value:
          "The member provided was invalid or does not exist within this server.",
      })
      .setFooter({
        text: `Command requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    if (!member.id) {
      msg.reply(`An error occured, please provide a valid mention.`);
      return 0;
    }
    let avatar = member.displayAvatarURL({ size: 1024, dynamic: true });
    const statuses = {
      online: "Online",
      dnd: "Dnd",
      idle: "Idle",
      offline: "Offline",
    };

    let itstatus = statuses;

    const exampleEmbed = new EmbedBuilder()
      .setTitle(member.username + "'s Profile")
      .setColor("#2f3136")
      .setThumbnail(avatar)
      .addFields(
        { name: "User Tag", value: `${member.tag}` },
        { name: "ID", value: `${member.id}` },
        {
          name: "Roles Count",
          value: ` ${
            msg.guild.members.cache.get(member.id).roles.cache.size ||
            "No Roles!"
          }`,
        },
        { name: "Avatar url", value: `[Link](${avatar})` } //should work idk why it doesnt
      ) // skill issue
      .setFooter({
        text: `Command requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();

    msg.reply({ embeds: [exampleEmbed] });
    return;
  }

  if (msg.content == prefix + "killall") {
    if (
      msg.author.id == owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      let e_count = 0;
      for (let e of entities) {
        e.destroy();
        e_count++;
      }
      // bot.createMessage(msg.channel.id, 'Entities killed successfully');
      let succesEmbed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("Success!")
        .setDescription(
          `Killed all entities successfully! \n Entity count: ${e_count}`
        )
        .setFooter({
          text: `Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      msg.reply({ embeds: [succesEmbed] });
    } else {
      //   bot.createMessage(msg.channel.id, unauth(5));
    }
  }
  if (msg.content == prefix + "link") {
    let succesEmbed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Game link")
      .setDescription(`**Main:** https://tankmate.ml\n**Proxy:** https://tankmate.glitch.me`)
      .setFooter({
        text: `Requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    msg.reply({ embeds: [succesEmbed] });
  }
  if (msg.content.startsWith(prefix + "gkick ")) {
    if (
      msg.author.id == owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      var lookfor = msg.content.split(prefix + "gkick ").pop();
      let clients = sockets.getClients();
      for (let client of clients) {
        if (client.player.viewId == lookfor) {
          client.kick(`You have been kicked by ${msg.author.username}`);

          let succesEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Success!")
            .setDescription(
              `Successfully kicked **${client.player.name}**. Id: ${lookfor}`
            )
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            })
            .setTimestamp();
          msg.reply({ embeds: [succesEmbed] });
          sockets.broadcast(
            `${msg.author.username} has kicked ${client.player.name}.`
          );
        }
      }
    } else {
      const cumerr = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error!")
        .setDescription(
          "You do not have the required permissions to use this command!"
        )
        .setFooter({
          text: `Error message / Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
    }
  }
  if (msg.content.startsWith(prefix + "ban ")) {
    if (
      msg.author.id == owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      var lookfor = msg.content.split(prefix + "ban ").pop();
      let clients = sockets.getClients();
      for (let client of clients) {
        if (client.player.viewId == lookfor) {
          bannedIPs.push(client.ip);
          let succesEmbed = new EmbedBuilder()
            .setColor("Aqua")
            .setTitle("Success!")
            .setDescription(
              `Successfully banned **${client.player.name}**. Id: ${lookfor}`
            )
            .setFooter({
              text: `Requested by ${msg.author.username}.`,
              iconURL: msg.author.displayAvatarURL(),
            })
            .setTimestamp();
          msg.reply({ embeds: [succesEmbed] });
          client.ban(`You have been banned by ${msg.author.username}`);
          sockets.broadcast(
            `${msg.author.username} has banned ${client.player.name}.`
          );
        }
      }
    } else {
      const cumerr = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error!")
        .setDescription(
          "You do not have the required permissions to use this command!"
        )
        .setFooter({
          text: `Error message / Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
    }
  }

  if (msg.content.startsWith(prefix + "bc ")) {
    if (
      msg.author.id == owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      let sendError = true;
      let lookfor = msg.content.split(prefix + "bc ").pop();
      sockets.broadcast("" + lookfor);
      let bcEmbed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle(`Successfully broadcasted message.`)
        .setDescription(`Message content: **${lookfor}**`)
        .setFooter({
          text: `Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      msg.reply({ embeds: [bcEmbed] });
      console.log("Broadcast successful!");
    } else {
      const cumerr = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Error!")
        .setDescription(
          "You do not have the required permissions to use this command!"
        )
        .setFooter({
          text: `Error message / Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
    }
  }
  function SHA256(s) {
    var chrsz = 8;
    var hexcase = 0;
    function safe_add(x, y) {
      var lsw = (x & 0xffff) + (y & 0xffff);
      var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xffff);
    }
    function S(X, n) {
      return (X >>> n) | (X << (32 - n));
    }
    function R(X, n) {
      return X >>> n;
    }
    function Ch(x, y, z) {
      return (x & y) ^ (~x & z);
    }
    function Maj(x, y, z) {
      return (x & y) ^ (x & z) ^ (y & z);
    }
    function Sigma0256(x) {
      return S(x, 2) ^ S(x, 13) ^ S(x, 22);
    }
    function Sigma1256(x) {
      return S(x, 6) ^ S(x, 11) ^ S(x, 25);
    }
    function Gamma0256(x) {
      return S(x, 7) ^ S(x, 18) ^ R(x, 3);
    }
    function Gamma1256(x) {
      return S(x, 17) ^ S(x, 19) ^ R(x, 10);
    }
    function core_sha256(m, l) {
      var K = new Array(
        0x428a2f98,
        0x71374491,
        0xb5c0fbcf,
        0xe9b5dba5,
        0x3956c25b,
        0x59f111f1,
        0x923f82a4,
        0xab1c5ed5,
        0xd807aa98,
        0x12835b01,
        0x243185be,
        0x550c7dc3,
        0x72be5d74,
        0x80deb1fe,
        0x9bdc06a7,
        0xc19bf174,
        0xe49b69c1,
        0xefbe4786,
        0xfc19dc6,
        0x240ca1cc,
        0x2de92c6f,
        0x4a7484aa,
        0x5cb0a9dc,
        0x76f988da,
        0x983e5152,
        0xa831c66d,
        0xb00327c8,
        0xbf597fc7,
        0xc6e00bf3,
        0xd5a79147,
        0x6ca6351,
        0x14292967,
        0x27b70a85,
        0x2e1b2138,
        0x4d2c6dfc,
        0x53380d13,
        0x650a7354,
        0x766a0abb,
        0x81c2c92e,
        0x92722c85,
        0xa2bfe8a1,
        0xa81a664b,
        0xc24b8b70,
        0xc76c51a3,
        0xd192e819,
        0xd6990624,
        0xf40e3585,
        0x106aa070,
        0x19a4c116,
        0x1e376c08,
        0x2748774c,
        0x34b0bcb5,
        0x391c0cb3,
        0x4ed8aa4a,
        0x5b9cca4f,
        0x682e6ff3,
        0x748f82ee,
        0x78a5636f,
        0x84c87814,
        0x8cc70208,
        0x90befffa,
        0xa4506ceb,
        0xbef9a3f7,
        0xc67178f2
      );
      var HASH = new Array(
        0x6a09e667,
        0xbb67ae85,
        0x3c6ef372,
        0xa54ff53a,
        0x510e527f,
        0x9b05688c,
        0x1f83d9ab,
        0x5be0cd19
      );
      var W = new Array(64);
      var a, b, c, d, e, f, g, h, i, j;
      var T1, T2;
      m[l >> 5] |= 0x80 << (24 - (l % 32));
      m[(((l + 64) >> 9) << 4) + 15] = l;
      for (var i = 0; i < m.length; i += 16) {
        a = HASH[0];
        b = HASH[1];
        c = HASH[2];
        d = HASH[3];
        e = HASH[4];
        f = HASH[5];
        g = HASH[6];
        h = HASH[7];
        for (var j = 0; j < 64; j++) {
          if (j < 16) W[j] = m[j + i];
          else
            W[j] = safe_add(
              safe_add(
                safe_add(Gamma1256(W[j - 2]), W[j - 7]),
                Gamma0256(W[j - 15])
              ),
              W[j - 16]
            );
          T1 = safe_add(
            safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]),
            W[j]
          );
          T2 = safe_add(Sigma0256(a), Maj(a, b, c));
          h = g;
          g = f;
          f = e;
          e = safe_add(d, T1);
          d = c;
          c = b;
          b = a;
          a = safe_add(T1, T2);
        }
        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
      }
      return HASH;
    }
    function str2binb(str) {
      var bin = Array();
      var mask = (1 << chrsz) - 1;
      for (var i = 0; i < str.length * chrsz; i += chrsz) {
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - (i % 32));
      }
      return bin;
    }
    function Utf8Encode(string) {
      string = string.replace(/\r\n/g, "\n");
      var utftext = "";
      for (var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if (c < 128) {
          utftext += String.fromCharCode(c);
        } else if (c > 127 && c < 2048) {
          utftext += String.fromCharCode((c >> 6) | 192);
          utftext += String.fromCharCode((c & 63) | 128);
        } else {
          utftext += String.fromCharCode((c >> 12) | 224);
          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
          utftext += String.fromCharCode((c & 63) | 128);
        }
      }
      return utftext;
    }
    function binb2hex(binarray) {
      var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
      var str = "";
      for (var i = 0; i < binarray.length * 4; i++) {
        str +=
          hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8 + 4)) & 0xf) +
          hex_tab.charAt((binarray[i >> 2] >> ((3 - (i % 4)) * 8)) & 0xf);
      }
      return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
  }

  if (msg.content == prefix + "shutdown") {
    if (
      msg.author.id == owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      sockets.broadcast(
        "[Warning]: The arena will be closing soon!",
        errorMessageColor
      );
      setInterval(() => {
        for (let e of entities) {
          e.isProtected = false;
          e.invuln = false;
        }
      }, 5);
      let count = 10;
      let i;
      for (i = 1; i < count + 1; i++) {
        let o = new Entity(room.random());
        o.color = 3;
        o.define(Class.arenaCloser);
        o.define({ CAN_BE_ON_LEADERBOARD: false });
        o.name = "Arena Closer";
        o.refreshBodyAttributes();
        o.color = 3;
        o.team = -100;
      }
      setTimeout(function () {}, 60000 * 20);
      let shutDownEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Shutting down!")
        .setFooter({
          text: `Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      let shutDownEmbedPhase2 = new EmbedBuilder()
        .setColor("#FF0000")
        .setTitle("Successfuly shut down")
        .setDescription(
          `Tankmate.io has been shut down by **${msg.author.username}**`
        )
        .setFooter({
          text: `Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        })
        .setTimestamp();
      msg.reply({ embeds: [shutDownEmbed] });
      setTimeout(() => {
        sockets.broadcast(
          "Disconnecting soon, save a screenshot NOW if you want your score to be legit.",
          errorMessageColor
        );
      }, 1000 * 3.5);
      console.log("[SPAWN]: Spawned 10 arena closers!");
      console.log("[SYSTEM]: INITIALIZING APP SHUTDOWN...");
      console.log("[SYSTEM]: Please wait for some moment..."); // ok no shit new error pop up
      setTimeout(() => {
        console.log("[SYSTEM]: Tankmate has shut down!"),
          msg.channel.send({ embeds: [shutDownEmbedPhase2] });
      }, 1000 * 9);
      setTimeout(() => {
        process.exit(1);
      }, 1000 * 10);
    }
  }

  if (msg.content.startsWith(prefix + "say ")) {
    if (
      msg.author.id === owner_id ||
      msg.author.id === owner_attacker ||
      msg.author.id === owner_c ||
      msg.author.id === felix || user_admin == true
    ) {
      var input = msg.content.split(prefix + "say ").pop();
      const cumerr = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("Success!")
        .setDescription(`${input}`)
        .setFooter({
          text: `Requested by ${msg.author.username}.`,
          iconURL: msg.author.displayAvatarURL(),
        });
      msg.reply({ embeds: [cumerr] });
      //   setTimeout(()=>{msg.delete();},1000);// delete the command trigger message lol
    }
  }
  } else {
      if (msg.content.startsWith(prefix + "sha256 ")) {
    var imput = msg.content.split(prefix + "sha256 ").pop();
    let output = sha256(imput).toUpperCase();
    let hashEmbed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Success!")
      .setDescription(`Your SHA256 hash is generated: **${output}**`)
      .setFooter({
        text: `Requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    msg.reply({ embeds: [hashEmbed] });
  }
   if (msg.content.startsWith(prefix + "password ")) {
    var imput = msg.content.split(prefix + "password ").pop();
    let output = sha256(imput).toUpperCase();
    let hashEmbed = new EmbedBuilder()
      .setColor("Aqua")
      .setTitle("Success!")
      .setDescription(`Your SHA256 hash is generated: **${output}**`)
      .setFooter({
        text: `Requested by ${msg.author.username}.`,
        iconURL: msg.author.displayAvatarURL(),
      })
      .setTimestamp();
    msg.reply({ embeds: [hashEmbed] });
  }
  }
  }catch(error){console.error('[ERROR messageCreate bot]:  ' + error)}
});

var botConnected = true;
