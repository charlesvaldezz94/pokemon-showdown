"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var roomlogs_exports = {};
__export(roomlogs_exports, {
  Roomlog: () => Roomlog,
  Roomlogs: () => Roomlogs,
  roomlogDB: () => roomlogDB,
  roomlogTable: () => roomlogTable
});
module.exports = __toCommonJS(roomlogs_exports);
var import_lib = require("../lib");
var import_database = require("../lib/database");
/**
 * Roomlogs
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles data storage for rooms.
 *
 * @license MIT
 */
const roomlogDB = (() => {
  if (!global.Config || !Config.replaysdb || Config.disableroomlogdb) return null;
  return new import_database.PGDatabase(Config.replaysdb);
})();
const roomlogTable = roomlogDB?.getTable("roomlogs");
class Roomlog {
  constructor(room, options = {}) {
    this.visibleMessageCount = 0;
    this.roomid = room.roomid;
    this.isMultichannel = !!options.isMultichannel;
    this.noAutoTruncate = !!options.noAutoTruncate;
    this.noLogTimes = !!options.noLogTimes;
    this.log = [];
    this.broadcastBuffer = [];
    this.roomlogStream = void 0;
    this.roomlogFilename = "";
    this.numTruncatedLines = 0;
    this.setupRoomlogStream();
  }
  getScrollback(channel = 0) {
    let log = this.log;
    if (!this.noLogTimes) log = [`|:|${~~(Date.now() / 1e3)}`].concat(log);
    if (!this.isMultichannel) {
      return log.join("\n") + "\n";
    }
    log = [];
    for (let i = 0; i < this.log.length; ++i) {
      const line = this.log[i];
      const split = /\|split\|p(\d)/g.exec(line);
      if (split) {
        const canSeePrivileged = channel === Number(split[1]) || channel === -1;
        const ownLine = this.log[i + (canSeePrivileged ? 1 : 2)];
        if (ownLine) log.push(ownLine);
        i += 2;
      } else {
        log.push(line);
      }
    }
    return log.join("\n") + "\n";
  }
  setupRoomlogStream() {
    if (this.roomlogStream === null) return;
    if (!Config.logchat || this.roomid.startsWith("battle-") || this.roomid.startsWith("game-")) {
      this.roomlogStream = null;
      return;
    }
    if (roomlogTable) {
      this.roomlogTable = roomlogTable;
      this.roomlogStream = null;
      return;
    }
    const date = /* @__PURE__ */ new Date();
    const dateString = Chat.toTimestamp(date).split(" ")[0];
    const monthString = dateString.split("-", 2).join("-");
    const basepath = `chat/${this.roomid}/`;
    const relpath = `${monthString}/${dateString}.txt`;
    if (relpath === this.roomlogFilename) return;
    Monitor.logPath(basepath + monthString).mkdirpSync();
    this.roomlogFilename = relpath;
    if (this.roomlogStream) void this.roomlogStream.writeEnd();
    this.roomlogStream = Monitor.logPath(basepath + relpath).createAppendStream();
    const link0 = basepath + "today.txt.0";
    Monitor.logPath(link0).unlinkIfExistsSync();
    try {
      Monitor.logPath(link0).symlinkToSync(relpath);
      Monitor.logPath(link0).renameSync(basepath + "today.txt");
    } catch {
    }
    if (!Roomlogs.rollLogTimer) Roomlogs.rollLogs();
  }
  add(message) {
    this.roomlog(message);
    if (["|c|", "|c:|", "|raw|", "|html|", "|uhtml"].some((k) => message.startsWith(k))) {
      this.visibleMessageCount++;
    }
    message = this.withTimestamp(message);
    this.log.push(message);
    this.broadcastBuffer.push(message);
    return this;
  }
  withTimestamp(message) {
    if (!this.noLogTimes && message.startsWith("|c|")) {
      return `|c:|${Math.trunc(Date.now() / 1e3)}|${message.slice(3)}`;
    } else {
      return message;
    }
  }
  hasUsername(username) {
    const userid = toID(username);
    for (const line of this.log) {
      if (line.startsWith("|c:|")) {
        const curUserid = toID(line.split("|", 4)[3]);
        if (curUserid === userid) return true;
      } else if (line.startsWith("|c|")) {
        const curUserid = toID(line.split("|", 3)[2]);
        if (curUserid === userid) return true;
      }
    }
    return false;
  }
  clearText(userids, lineCount = 0) {
    const cleared = [];
    const clearAll = lineCount === 0;
    this.log = this.log.reverse().filter((line) => {
      const parsed = this.parseChatLine(line);
      if (parsed) {
        const userid = toID(parsed.user);
        if (userids.includes(userid)) {
          if (!cleared.includes(userid)) cleared.push(userid);
          if (!this.roomlogStream && !this.roomlogTable) return true;
          if (clearAll) return false;
          if (lineCount > 0) {
            lineCount--;
            return false;
          }
          return true;
        }
      }
      return true;
    }).reverse();
    return cleared;
  }
  uhtmlchange(name, message) {
    const originalStart = "|uhtml|" + name + "|";
    const fullMessage = originalStart + message;
    for (const [i, line] of this.log.entries()) {
      if (line.startsWith(originalStart)) {
        this.log[i] = fullMessage;
        break;
      }
    }
    this.broadcastBuffer.push(fullMessage);
  }
  attributedUhtmlchange(user, name, message) {
    const start = `/uhtmlchange ${name},`;
    const fullMessage = this.withTimestamp(`|c|${user.getIdentity()}|${start}${message}`);
    let matched = false;
    for (const [i, line] of this.log.entries()) {
      if (this.parseChatLine(line)?.message.startsWith(start)) {
        this.log[i] = fullMessage;
        matched = true;
        break;
      }
    }
    if (!matched) this.log.push(fullMessage);
    this.broadcastBuffer.push(fullMessage);
  }
  parseChatLine(line) {
    const prefixes = [["|c:|", 4], ["|c|", 3]];
    for (const [messageStart, section] of prefixes) {
      if (line.startsWith(messageStart)) {
        const parts = import_lib.Utils.splitFirst(line, "|", section);
        return { user: parts[section - 1], message: parts[section] };
      }
    }
  }
  roomlog(message, date = /* @__PURE__ */ new Date()) {
    if (!Config.logchat) return;
    message = message.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, "[img]");
    if (this.roomlogTable) {
      const chatData = this.parseChatLine(message);
      const type = message.split("|")[1] || "";
      void this.insertLog(import_database.SQL`INSERT INTO roomlogs (${{
        type,
        roomid: this.roomid,
        userid: toID(chatData?.user) || null,
        time: import_database.SQL`now()`,
        log: message
      }})`);
      const dateStr = Chat.toTimestamp(date).split(" ")[0];
      void this.insertLog(import_database.SQL`INSERT INTO roomlog_dates (${{
        roomid: this.roomid,
        month: dateStr.slice(0, -3),
        date: dateStr
      }}) ON CONFLICT (roomid, date) DO NOTHING;`);
    } else if (this.roomlogStream) {
      const timestamp = Chat.toTimestamp(date).split(" ")[1] + " ";
      void this.roomlogStream.write(timestamp + message + "\n");
    }
  }
  async insertLog(query, ignoreFailure = false, retries = 3) {
    try {
      await this.roomlogTable?.query(query);
    } catch (e) {
      if (e?.code === "42P01") {
        await roomlogDB._query((0, import_lib.FS)("databases/schemas/roomlogs.sql").readSync(), []);
        return this.insertLog(query, ignoreFailure, retries);
      }
      if (!ignoreFailure && retries > 0 && e.message?.includes("Connection terminated unexpectedly")) {
        await new Promise((resolve) => {
          setTimeout(resolve, 2e3);
        });
        return this.insertLog(query, ignoreFailure, retries - 1);
      }
      const [q, vals] = roomlogDB._resolveSQL(query);
      Monitor.crashlog(e, "a roomlog database query", {
        query: q,
        values: vals
      });
    }
  }
  modlog(entry, overrideID) {
    void Rooms.Modlog.write(this.roomid, entry, overrideID);
  }
  async rename(newID) {
    await Rooms.Modlog.rename(this.roomid, newID);
    const roomlogStreamExisted = this.roomlogStream !== null;
    await this.destroy();
    if (this.roomlogTable) {
      await this.roomlogTable.updateAll({ roomid: newID })`WHERE roomid = ${this.roomid}`;
    } else {
      const roomlogPath = `chat`;
      const [roomlogExists, newRoomlogExists] = await Promise.all([
        Monitor.logPath(roomlogPath + `/${this.roomid}`).exists(),
        Monitor.logPath(roomlogPath + `/${newID}`).exists()
      ]);
      if (roomlogExists && !newRoomlogExists) {
        await Monitor.logPath(roomlogPath + `/${this.roomid}`).rename(Monitor.logPath(roomlogPath + `/${newID}`).path);
      }
      if (roomlogStreamExisted) {
        this.roomlogStream = void 0;
        this.roomlogFilename = "";
        this.setupRoomlogStream();
      }
    }
    Roomlogs.roomlogs.set(newID, this);
    this.roomid = newID;
    return true;
  }
  static rollLogs() {
    if (Roomlogs.rollLogTimer === true) return;
    if (Roomlogs.rollLogTimer) {
      clearTimeout(Roomlogs.rollLogTimer);
    }
    Roomlogs.rollLogTimer = true;
    for (const log of Roomlogs.roomlogs.values()) {
      log.setupRoomlogStream();
    }
    const time = Date.now();
    const nextMidnight = /* @__PURE__ */ new Date();
    nextMidnight.setHours(24, 0, 0, 0);
    Roomlogs.rollLogTimer = setTimeout(() => Roomlog.rollLogs(), nextMidnight.getTime() - time);
  }
  truncate() {
    if (this.noAutoTruncate) return;
    if (this.log.length > 100) {
      const truncationLength = this.log.length - 100;
      this.log.splice(0, truncationLength);
      this.numTruncatedLines += truncationLength;
    }
  }
  /**
   * Returns the total number of lines in the roomlog, including truncated lines.
   */
  getLineCount(onlyVisible = true) {
    return (onlyVisible ? this.visibleMessageCount : this.log.length) + this.numTruncatedLines;
  }
  destroy() {
    const promises = [];
    if (this.roomlogStream) {
      promises.push(this.roomlogStream.writeEnd());
      this.roomlogStream = null;
    }
    Roomlogs.roomlogs.delete(this.roomid);
    return Promise.all(promises);
  }
}
const roomlogs = /* @__PURE__ */ new Map();
function createRoomlog(room, options = {}) {
  let roomlog = Roomlogs.roomlogs.get(room.roomid);
  if (roomlog) throw new Error(`Roomlog ${room.roomid} already exists`);
  roomlog = new Roomlog(room, options);
  Roomlogs.roomlogs.set(room.roomid, roomlog);
  return roomlog;
}
const Roomlogs = {
  create: createRoomlog,
  Roomlog,
  roomlogs,
  db: roomlogDB,
  table: roomlogTable,
  rollLogs: Roomlog.rollLogs,
  rollLogTimer: null
};
//# sourceMappingURL=roomlogs.js.map
