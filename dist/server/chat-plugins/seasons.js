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
var seasons_exports = {};
__export(seasons_exports, {
  BADGE_THRESHOLDS: () => BADGE_THRESHOLDS,
  FIXED_FORMATS: () => FIXED_FORMATS,
  FORMATS_PER_SEASON: () => FORMATS_PER_SEASON,
  FORMAT_POOL: () => FORMAT_POOL,
  PUBLIC_PHASE_LENGTH: () => PUBLIC_PHASE_LENGTH,
  SEASONS_PER_YEAR: () => SEASONS_PER_YEAR,
  commands: () => commands,
  data: () => data,
  destroy: () => destroy,
  generateFormatSchedule: () => generateFormatSchedule,
  getBadges: () => getBadges,
  getLadderTop: () => getLadderTop,
  handlers: () => handlers,
  pages: () => pages,
  rollSeason: () => rollSeason,
  rollTimer: () => rollTimer,
  saveData: () => saveData,
  setFormatSchedule: () => setFormatSchedule,
  updateBadgeholders: () => updateBadgeholders,
  updateTimeout: () => updateTimeout
});
module.exports = __toCommonJS(seasons_exports);
var import_lib = require("../../lib");
const SEASONS_PER_YEAR = 4;
const FORMATS_PER_SEASON = 4;
const BADGE_THRESHOLDS = {
  gold: 3,
  silver: 30,
  bronze: 100
};
const FIXED_FORMATS = ["randombattle", "ou"];
const FORMAT_POOL = ["ubers", "uu", "ru", "nu", "pu", "lc", "doublesou", "monotype"];
const PUBLIC_PHASE_LENGTH = 3;
let data;
try {
  data = JSON.parse((0, import_lib.FS)("config/chat-plugins/seasons.json").readSync());
} catch {
  data = {
    // force a reroll
    current: { season: null, year: null, formatsGeneratedAt: null, period: null },
    formatSchedule: {},
    badgeholders: {}
  };
}
function getBadges(user, curFormat) {
  let userBadges = [];
  const season = data.current.season;
  for (const format in data.badgeholders[season]) {
    const badges = data.badgeholders[season][format];
    for (const type in badges) {
      if (badges[type].includes(user.id)) {
        userBadges.push({ type, format });
      }
    }
  }
  let curFormatBadge;
  for (const [i, badge] of userBadges.entries()) {
    if (badge.format === curFormat) {
      userBadges.splice(i, 1);
      curFormatBadge = badge;
    }
  }
  userBadges = import_lib.Utils.sortBy(userBadges, (x) => Object.keys(BADGE_THRESHOLDS).indexOf(x.type)).slice(0, 2);
  if (curFormatBadge) userBadges.unshift(curFormatBadge);
  return userBadges;
}
function getUserHTML(user, format) {
  const buf = `<username>${user.name}</username>`;
  const badgeType = getBadges(user, format).find((x) => x.format === format)?.type;
  if (badgeType) {
    let formatType = format.split(/gen\d+/)[1];
    if (!["ou", "randombattle"].includes(formatType)) formatType = "rotating";
    return `<img src="https://${Config.routes.client}/sprites/misc/${formatType}_${badgeType}.png" />` + buf;
  }
  return buf;
}
function setFormatSchedule() {
  if (data.current.formatsGeneratedAt === getYear()) return;
  data.current.formatsGeneratedAt = getYear();
  const formats = generateFormatSchedule();
  for (const [i, formatList] of formats.entries()) {
    data.formatSchedule[i + 1] = FIXED_FORMATS.concat(formatList.slice());
  }
  saveData();
}
class ScheduleGenerator {
  constructor() {
    this.items = /* @__PURE__ */ new Map();
    this.formats = new Array(SEASONS_PER_YEAR).fill(null).map(() => []);
    for (const format of FORMAT_POOL) this.items.set(format, 0);
  }
  generate() {
    for (let i = 0; i < this.formats.length; i++) {
      this.step([i, 0]);
    }
    for (let i = 1; i < SEASONS_PER_YEAR; i++) {
      this.step([0, i]);
    }
    return this.formats;
  }
  swap(x, y) {
    const item = this.formats[x][y];
    for (let i = 0; i < SEASONS_PER_YEAR; i++) {
      if (this.formats[i].includes(item)) continue;
      for (const [j, cur] of this.formats[i].entries()) {
        if (cur === item) continue;
        if (this.formats[x].includes(cur)) continue;
        this.formats[i][j] = item;
        return cur;
      }
    }
    throw new Error("Couldn't find swap target for " + item + ": " + JSON.stringify(this.formats));
  }
  select(x, y) {
    const items = Array.from(this.items).filter((entry) => entry[1] < 2);
    const item = import_lib.Utils.randomElement(items);
    if (item[1] >= 2) {
      this.items.delete(item[0]);
      return this.select(x, y);
    }
    this.items.set(item[0], item[1] + 1);
    if (item[0] && this.formats[x].includes(item[0])) {
      this.formats[x][y] = item[0];
      return this.swap(x, y);
    }
    return item[0];
  }
  step(start) {
    let [x, y] = start;
    while (x < this.formats.length && y < FORMATS_PER_SEASON) {
      const item = this.select(x, y);
      this.formats[x][y] = item;
      x++;
      y++;
    }
  }
}
function generateFormatSchedule() {
  return new ScheduleGenerator().generate();
}
async function getLadderTop(format) {
  try {
    const results = await (0, import_lib.Net)(`https://${Config.routes.root}/ladder/?format=${toID(format)}&json`).get();
    const reply = JSON.parse(results);
    return reply.toplist;
  } catch (e) {
    Monitor.crashlog(e, "A season ladder request");
    return null;
  }
}
async function updateBadgeholders() {
  rollSeason();
  const period = `${data.current.season}`;
  if (!data.badgeholders[period]) {
    data.badgeholders[period] = {};
  }
  for (const formatName of data.formatSchedule[findPeriod()]) {
    const formatid = `gen${Dex.gen}${formatName}`;
    const response = await getLadderTop(formatid);
    if (!response) continue;
    const newHolders = {};
    for (const [i, row] of response.entries()) {
      let badgeType = null;
      for (const type in BADGE_THRESHOLDS) {
        if (i + 1 <= BADGE_THRESHOLDS[type]) {
          badgeType = type;
          break;
        }
      }
      if (!badgeType) break;
      if (!newHolders[badgeType]) newHolders[badgeType] = [];
      newHolders[badgeType].push(row.userid);
    }
    data.badgeholders[period][formatid] = newHolders;
  }
  saveData();
}
function getYear() {
  return (/* @__PURE__ */ new Date()).getFullYear();
}
function findPeriod(modifier = 0) {
  return Math.floor(((/* @__PURE__ */ new Date()).getMonth() + modifier) / (SEASONS_PER_YEAR - 1)) + 1;
}
function checkPublicPhase() {
  const daysInCurrentMonth = new Date((/* @__PURE__ */ new Date()).getFullYear(), (/* @__PURE__ */ new Date()).getMonth() + 1, 0).getDate();
  return (/* @__PURE__ */ new Date()).getDate() >= daysInCurrentMonth - PUBLIC_PHASE_LENGTH && findPeriod() !== findPeriod(1);
}
function saveData() {
  (0, import_lib.FS)("config/chat-plugins/seasons.json").writeUpdate(() => JSON.stringify(data));
}
function rollSeason() {
  const year = getYear();
  if (data.current.year !== year) {
    data.current.year = year;
    setFormatSchedule();
  }
  if (findPeriod() !== data.current.period) {
    data.current.season++;
    data.badgeholders[data.current.season] = {};
    for (const k of data.formatSchedule[findPeriod()]) {
      data.badgeholders[data.current.season][`gen${Dex.gen}${k}`] = {};
    }
    data.current.period = findPeriod();
    saveData();
  }
}
let updateTimeout = null;
function rollTimer() {
  if (updateTimeout === true) return;
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
  updateTimeout = true;
  void updateBadgeholders();
  const time = Date.now();
  const next = /* @__PURE__ */ new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  updateTimeout = setTimeout(() => rollTimer(), next.getTime() - time);
  const discussionRoom = Rooms.search("seasondiscussion");
  if (discussionRoom) {
    if (checkPublicPhase() && discussionRoom.settings.isPrivate) {
      discussionRoom.setPrivate(false);
      discussionRoom.settings.modchat = "autoconfirmed";
      discussionRoom.add(
        `|html|<div class="broadcast-blue"><strong>The public phase of the month has now started!</strong><br /> Badged battles are now forced public, and this room is open for use.</div>`
      ).update();
    } else if (!checkPublicPhase() && !discussionRoom.settings.isPrivate) {
      discussionRoom.setPrivate("unlisted");
      discussionRoom.add(
        `|html|<div class="broadcast-blue">The public phase of the month has ended.</div>`
      ).update();
    }
  }
}
function destroy() {
  if (updateTimeout && typeof updateTimeout !== "boolean") {
    clearTimeout(updateTimeout);
  }
}
rollTimer();
const commands = {
  seasonschedule: "seasons",
  seasons() {
    return this.parse(`/join view-seasonschedule`);
  }
};
const pages = {
  seasonschedule() {
    this.checkCan("globalban");
    let buf = `<div class="pad"><h2>Season schedule for ${getYear()}</h2><br />`;
    buf += `<div class="ladder pad"><table><tr><th>Season #</th><th>Formats</th></tr>`;
    for (const period in data.formatSchedule) {
      const match = findPeriod() === Number(period);
      const formatString = data.formatSchedule[period].sort().map((x) => Dex.formats.get(x).name.replace(`[Gen ${Dex.gen}]`, "")).join(", ");
      buf += `<tr><td>${match ? `<strong>${period}</strong>` : period}</td>`;
      buf += `<td>${match ? `<strong>${formatString}</strong>` : formatString}</td></tr>`;
    }
    buf += `</tr></table></div>`;
    return buf;
  },
  seasonladder(query, user) {
    const format = toID(query.shift());
    const season = toID(query.shift()) || `${data.current.season}`;
    if (!data.badgeholders[season]) {
      throw new Chat.ErrorMessage(`Season ${season} not found.`);
    }
    this.title = `[Seasons]`;
    let buf = '<div class="pad">';
    if (!Object.keys(data.badgeholders[season]).includes(format)) {
      this.title += ` All`;
      buf += `<h2>Season Records</h2>`;
      const seasonsDesc = import_lib.Utils.sortBy(
        Object.keys(data.badgeholders),
        (s) => s.split("-").map((x) => -Number(x))
      );
      for (const s of seasonsDesc) {
        buf += `<h3>Season ${s}</h3><hr />`;
        for (const f in data.badgeholders[s]) {
          buf += `<a class="button" name="send" target="replace" href="/view-seasonladder-${f}-${s}">${Dex.formats.get(f).name}</a>`;
        }
        buf += `<br />`;
      }
      return buf;
    }
    this.title += ` ${format} [Season ${season}]`;
    const uppercase = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    let formatName = Dex.formats.get(format).name;
    const room = Rooms.search(import_lib.Utils.splitFirst(format, /\d+/)[1] || "");
    if (room) {
      formatName = `<a href="/${room.roomid}">${formatName}</a>`;
    }
    buf += `<h2>Season results for ${formatName} [${season}]</h2>`;
    buf += `<small><a target="replace" href="/view-seasonladder">View past seasons</a></small>`;
    let i = 0;
    for (const badgeType in data.badgeholders[season][format]) {
      buf += `<div class="ladder pad"><table>`;
      let formatType = format.split(/gen\d+/)[1];
      if (!["ou", "randombattle"].includes(formatType)) formatType = "rotating";
      buf += `<tr><h2><img src="https://${Config.routes.client}/sprites/misc/${formatType}_${badgeType}.png" /> ${uppercase(badgeType)}</h2></tr>`;
      for (const userid of data.badgeholders[season][format][badgeType]) {
        i++;
        buf += `<tr><td>${i}</td><td><a href="https://${Config.routes.root}/users/${userid}">${userid}</a></td></tr>`;
      }
      buf += `</table></div>`;
    }
    return buf;
  }
};
const handlers = {
  onBattleStart(user, room) {
    if (!room.battle) return;
    const badges = getBadges(user, room.battle.format);
    if (!badges.length) return;
    const slot = room.battle.playerTable[user.id]?.slot;
    if (!slot) return;
    for (const badge of badges) {
      room.add(`|badge|${slot}|${badge.type}|${badge.format}|${BADGE_THRESHOLDS[badge.type]}-${data.current.season}`);
    }
    if (checkPublicPhase() && !room.battle.forcedSettings.privacy && badges.filter((x) => x.format === room.battle.format).length && room.battle.rated) {
      room.battle.forcedSettings.privacy = "medal";
      room.add(
        `|html|<div class="broadcast-red"><strong>This battle is required to be public due to one or more player having a season medal.</strong><br />During the public phase, you can discuss the state of the ladder <a href="/seasondiscussion">in a special chatroom.</a></div>`
      );
      room.setPrivate(false);
      const seasonRoom = Rooms.search("seasondiscussion");
      if (seasonRoom) {
        const p1html = getUserHTML(user, room.battle.format);
        const otherPlayer = user.id === room.battle.p1.id ? room.battle.p2 : room.battle.p1;
        const otherUser = otherPlayer.getUser();
        const p2html = otherUser ? getUserHTML(otherUser, room.battle.format) : `<username>${otherPlayer.name}</username>`;
        const formatName = Dex.formats.get(room.battle.format).name;
        seasonRoom.add(
          `|raw|<a href="/${room.roomid}" class="ilink">${formatName} battle started between ${p1html} and ${p2html}. (rating: ${Math.floor(room.battle.rated)})</a>`
        ).update();
      }
    }
    room.add(
      `|uhtml|medal-msg|<div class="broadcast-blue">Curious what those medals under the avatar are? PS now has Ladder Seasons! For more information, check out the <a href="https://www.smogon.com/forums/threads/3740067/">thread on Smogon.</a></div>`
    );
    room.update();
  }
};
//# sourceMappingURL=seasons.js.map
