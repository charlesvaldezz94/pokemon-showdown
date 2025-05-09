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
var ladders_local_exports = {};
__export(ladders_local_exports, {
  LadderStore: () => LadderStore
});
module.exports = __toCommonJS(ladders_local_exports);
var import_lib = require("../lib");
/**
 * Ladder library
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles ladders for all servers other than
 * play.pokemonshowdown.com.
 *
 * Specifically, this is the file that handles calculating and keeping
 * track of players' Elo ratings for all formats.
 *
 * Matchmaking is currently still implemented in rooms.ts.
 *
 * @license MIT
 */
const ladderCaches = /* @__PURE__ */ new Map();
class LadderStore {
  static {
    this.formatsListPrefix = "|,LL";
  }
  static {
    this.ladderCaches = ladderCaches;
  }
  constructor(formatid) {
    this.formatid = formatid;
    this.ladder = null;
    this.ladderPromise = null;
    this.saving = false;
  }
  getLadder() {
    if (!this.ladderPromise) this.ladderPromise = this.load();
    return this.ladderPromise;
  }
  /**
   * Internal function, returns a Promise for a ladder
   */
  async load() {
    const cachedLadder = ladderCaches.get(this.formatid);
    if (cachedLadder) {
      if (cachedLadder.then) {
        const ladder = await cachedLadder;
        return this.ladder = ladder;
      }
      return this.ladder = cachedLadder;
    }
    try {
      const data = await (0, import_lib.FS)("config/ladders/" + this.formatid + ".tsv").readIfExists();
      const ladder = [];
      for (const dataLine of data.split("\n").slice(1)) {
        const line = dataLine.trim();
        if (!line) continue;
        const row = line.split("	");
        ladder.push([toID(row[1]), Number(row[0]), row[1], Number(row[2]), Number(row[3]), Number(row[4]), row[5]]);
      }
      ladderCaches.set(this.formatid, this.ladder = ladder);
      return this.ladder;
    } catch {
    }
    ladderCaches.set(this.formatid, this.ladder = []);
    return this.ladder;
  }
  /**
   * Saves the ladder in config/ladders/[formatid].tsv
   *
   * Called automatically by updateRating, so you don't need to manually
   * call this.
   */
  async save() {
    if (this.saving) return;
    this.saving = true;
    const ladder = await this.getLadder();
    if (!ladder.length) {
      this.saving = false;
      return;
    }
    const stream = (0, import_lib.FS)(`config/ladders/${this.formatid}.tsv`).createWriteStream();
    void stream.write("Elo	Username	W	L	T	Last update\r\n");
    for (const row of ladder) {
      void stream.write(row.slice(1).join("	") + "\r\n");
    }
    void stream.writeEnd();
    this.saving = false;
  }
  /**
   * Gets the index of a user in the ladder array.
   *
   * If createIfNeeded is true, the user will be created and added to
   * the ladder array if it doesn't already exist.
   */
  indexOfUser(username, createIfNeeded = false) {
    if (!this.ladder) throw new Error(`Must be called with ladder loaded`);
    const userid = toID(username);
    for (const [i, user] of this.ladder.entries()) {
      if (user[0] === userid) return i;
    }
    if (createIfNeeded) {
      const index = this.ladder.length;
      this.ladder.push([userid, 1e3, username, 0, 0, 0, ""]);
      return index;
    }
    return -1;
  }
  /**
   * Returns [formatid, html], where html is an the HTML source of a
   * ladder toplist, to be displayed directly in the ladder tab of the
   * client.
   */
  async getTop(prefix) {
    const formatid = this.formatid;
    const name = Dex.formats.get(formatid).name;
    const ladder = await this.getLadder();
    let buf = `<h3>${name} Top 100</h3>`;
    buf += `<table>`;
    buf += `<tr><th>` + ["", "Username", '<abbr title="Elo rating">Elo</abbr>', "W", "L", "T"].join(`</th><th>`) + `</th></tr>`;
    for (const [i, row] of ladder.entries()) {
      if (prefix && !row[0].startsWith(prefix)) continue;
      buf += `<tr><td>` + [
        i + 1,
        row[2],
        `<strong>${Math.round(row[1])}</strong>`,
        row[3],
        row[4],
        row[5]
      ].join(`</td><td>`) + `</td></tr>`;
    }
    return [formatid, buf];
  }
  /**
   * Returns a Promise for the Elo rating of a user
   */
  async getRating(userid) {
    const formatid = this.formatid;
    const user = Users.getExact(userid);
    if (user?.mmrCache[formatid]) {
      return user.mmrCache[formatid];
    }
    const ladder = await this.getLadder();
    const index = this.indexOfUser(userid);
    let rating = 1e3;
    if (index >= 0) {
      rating = ladder[index][1];
    }
    if (user && user.id === userid) {
      user.mmrCache[formatid] = rating;
    }
    return rating;
  }
  /**
   * Internal method. Update the Elo rating of a user.
   */
  updateRow(row, score, foeElo) {
    let elo = row[1];
    elo = this.calculateElo(elo, score, foeElo);
    row[1] = elo;
    if (score > 0.6) {
      row[3]++;
    } else if (score < 0.4) {
      row[4]++;
    } else {
      row[5]++;
    }
    row[6] = `${/* @__PURE__ */ new Date()}`;
  }
  /**
   * Update the Elo rating for two players after a battle, and display
   * the results in the passed room.
   */
  async updateRating(p1name, p2name, p1score, room) {
    if (Ladders.disabled) {
      room.addRaw(`Ratings not updated. The ladders are currently disabled.`).update();
      return [p1score, null, null];
    }
    const formatid = this.formatid;
    let p2score = 1 - p1score;
    if (p1score < 0) {
      p1score = 0;
      p2score = 0;
    }
    const ladder = await this.getLadder();
    let p1newElo;
    let p2newElo;
    try {
      const p1index = this.indexOfUser(p1name, true);
      const p1elo = ladder[p1index][1];
      let p2index = this.indexOfUser(p2name, true);
      const p2elo = ladder[p2index][1];
      this.updateRow(ladder[p1index], p1score, p2elo);
      this.updateRow(ladder[p2index], p2score, p1elo);
      p1newElo = ladder[p1index][1];
      p2newElo = ladder[p2index][1];
      let newIndex = p1index;
      while (newIndex > 0 && ladder[newIndex - 1][1] <= p1newElo) newIndex--;
      while (newIndex === p1index || ladder[newIndex] && ladder[newIndex][1] > p1newElo) newIndex++;
      if (newIndex !== p1index && newIndex !== p1index + 1) {
        const row = ladder.splice(p1index, 1)[0];
        if (newIndex > p1index) newIndex--;
        if (p2index > p1index) p2index--;
        ladder.splice(newIndex, 0, row);
        if (p2index >= newIndex) p2index++;
      }
      newIndex = p2index;
      while (newIndex > 0 && ladder[newIndex - 1][1] <= p2newElo) newIndex--;
      while (newIndex === p2index || ladder[newIndex] && ladder[newIndex][1] > p2newElo) newIndex++;
      if (newIndex !== p2index && newIndex !== p2index + 1) {
        const row = ladder.splice(p2index, 1)[0];
        if (newIndex > p2index) newIndex--;
        ladder.splice(newIndex, 0, row);
      }
      const p1 = Users.getExact(p1name);
      if (p1) p1.mmrCache[formatid] = +p1newElo;
      const p2 = Users.getExact(p2name);
      if (p2) p2.mmrCache[formatid] = +p2newElo;
      void this.save();
      if (!room.battle) {
        Monitor.warn(`room expired before ladder update was received`);
        return [p1score, null, null];
      }
      let reasons = `${Math.round(p1newElo) - Math.round(p1elo)} for ${p1score > 0.9 ? "winning" : p1score < 0.1 ? "losing" : "tying"}`;
      if (!reasons.startsWith("-")) reasons = "+" + reasons;
      room.addRaw(
        import_lib.Utils.html`${p1name}'s rating: ${Math.round(p1elo)} &rarr; <strong>${Math.round(p1newElo)}</strong><br />(${reasons})`
      );
      reasons = `${Math.round(p2newElo) - Math.round(p2elo)} for ${p2score > 0.9 ? "winning" : p2score < 0.1 ? "losing" : "tying"}`;
      if (!reasons.startsWith("-")) reasons = "+" + reasons;
      room.addRaw(
        import_lib.Utils.html`${p2name}'s rating: ${Math.round(p2elo)} &rarr; <strong>${Math.round(p2newElo)}</strong><br />(${reasons})`
      );
      room.update();
    } catch (e) {
      if (!room.battle) return [p1score, null, null];
      room.addRaw(`There was an error calculating rating changes:`);
      room.add(e.stack);
      room.update();
    }
    return [p1score, p1newElo, p2newElo];
  }
  /**
   * Returns a promise for a <tr> with all ratings for the current format.
   */
  async visualize(username) {
    const ladder = await this.getLadder();
    const index = this.indexOfUser(username, false);
    if (index < 0) return "";
    const ratings = ladder[index];
    const output = `<tr><td>${this.formatid}</td><td><strong>${Math.round(ratings[1])}</strong></td>`;
    return `${output}<td>${ratings[3]}</td><td>${ratings[4]}</td><td>${ratings[3] + ratings[4]}</td></tr>`;
  }
  /**
   * Calculates Elo based on a match result
   */
  calculateElo(oldElo, score, foeElo) {
    let K = 50;
    if (oldElo < 1200) {
      if (score < 0.5) {
        K = 10 + (oldElo - 1e3) * 40 / 200;
      } else if (score > 0.5) {
        K = 90 - (oldElo - 1e3) * 40 / 200;
      }
    } else if (oldElo > 1350 && oldElo <= 1600) {
      K = 40;
    } else {
      K = 32;
    }
    const E = 1 / (1 + 10 ** ((foeElo - oldElo) / 400));
    const newElo = oldElo + K * (score - E);
    return Math.max(newElo, 1e3);
  }
  /**
   * Returns a Promise for an array of strings of <tr>s for ladder ratings of the user
   */
  static visualizeAll(username) {
    const ratings = [];
    for (const format of Dex.formats.all()) {
      if (format.searchShow) {
        ratings.push(new LadderStore(format.id).visualize(username));
      }
    }
    return Promise.all(ratings);
  }
}
//# sourceMappingURL=ladders-local.js.map
