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
var cg_teams_leveling_exports = {};
__export(cg_teams_leveling_exports, {
  addPokemon: () => addPokemon,
  commands: () => commands,
  dbSetupPromise: () => dbSetupPromise,
  handlers: () => handlers,
  incrementLosses: () => incrementLosses,
  incrementWins: () => incrementWins,
  pages: () => pages
});
module.exports = __toCommonJS(cg_teams_leveling_exports);
var import_lib = require("../../lib");
var import_winrates = require("./randombattles/winrates");
var import_cg_teams = require("../../data/cg-teams");
let addPokemon = null;
let incrementWins = null;
let incrementLosses = null;
let dbSetupPromise = null;
async function setupDatabase(database) {
  await database.runFile("./databases/schemas/battlestats.sql");
  addPokemon = await database.prepare(
    "INSERT OR IGNORE INTO gen9computergeneratedteams (species_id, wins, losses, level) VALUES (?, 0, 0, ?)"
  );
  incrementWins = await database.prepare(
    "UPDATE gen9computergeneratedteams SET wins = wins + 1 WHERE species_id = ?"
  );
  incrementLosses = await database.prepare(
    "UPDATE gen9computergeneratedteams SET losses = losses + 1 WHERE species_id = ?"
  );
}
if (Config.usesqlite && Config.usesqliteleveling) {
  const database = (0, import_lib.SQL)(module, {
    file: "./databases/battlestats.db"
  });
  dbSetupPromise = setupDatabase(database);
}
function getLevelSpeciesID(set, format) {
  if (["Basculin", "Greninja"].includes(set.name)) return toID(set.species);
  return toID((0, import_winrates.getSpeciesName)(set, format || Dex.formats.get("gen9computergeneratedteams")));
}
async function updateStats(battle, winner) {
  if (!incrementWins || !incrementLosses) await dbSetupPromise;
  if (toID(battle.format) !== "gen9computergeneratedteams") return;
  if (battle.rated <= 1 && battle.room.parent?.game) {
    let parent = battle.room.parent;
    if (parent.game.gameid === "bestof" && parent.parent?.game) parent = parent.parent;
    if (parent.game.gameid !== "tournament" || parent.settings.isPrivate) return;
  } else if (battle.rated < 1e3) {
    return;
  }
  for (const player of battle.players) {
    const team = await battle.getPlayerTeam(player);
    if (!team) return;
    const increment = player.id === winner ? incrementWins : incrementLosses;
    for (const set of team) {
      const statsSpecies = getLevelSpeciesID(set, Dex.formats.get(battle.format));
      await addPokemon?.run([statsSpecies, set.level || 100]);
      await increment?.run([statsSpecies]);
    }
  }
}
const handlers = {
  onBattleEnd(battle, winner) {
    if (!Config.usesqlite || !Config.usesqliteleveling) return;
    void updateStats(battle, winner);
  }
};
const commands = {
  cgtwr: "cgtwinrates",
  cgtwinrates(target, room, user) {
    return this.parse(`/j view-cgtwinrates-${target ? "history--" + target : "current"}`);
  },
  cgtwinrateshelp: [
    "/cgtwinrates OR /cgtwr - Get a list of the current win rate data for all Pokemon in [Gen 9] Computer Generated Teams."
  ]
  // Add maintenance commands here
};
const pages = {
  async cgtwinrates(query, user) {
    if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
    if (!import_cg_teams.cgtDatabase) {
      throw new Chat.ErrorMessage(`CGT win rates are not being tracked due to the server's SQL settings.`);
    }
    query = query.join("-").split("--");
    const mode = query.shift();
    if (mode === "current") {
      let buf = `<div class="pad"><h2>Winrates for [Gen 9] Computer Generated Teams</h2>`;
      const sorter = toID(query.shift() || "alphabetical");
      if (!["alphabetical", "level"].includes(sorter)) {
        throw new Chat.ErrorMessage(`Invalid sorting method. Must be either 'alphabetical' or 'level'.`);
      }
      const otherSort = sorter === "alphabetical" ? "Level" : "Alphabetical";
      buf += `<a class="button" target="replace" href="/view-cgtwinrates-current--${toID(otherSort)}">`;
      buf += `Sort by ${otherSort} descending</a>`;
      buf += `<hr />`;
      const statData = await import_cg_teams.cgtDatabase.all(
        "SELECT species_id, wins, losses, level FROM gen9computergeneratedteams"
      );
      this.title = `[Winrates] [Gen 9] Computer Generated Teams`;
      let sortFn;
      if (sorter === "alphabetical") {
        sortFn = (data) => [data.species_id];
      } else {
        sortFn = (data) => [-data.level];
      }
      const mons = import_lib.Utils.sortBy(statData, sortFn);
      buf += `<div class="ladder pad"><table><tr><th>Pokemon</th><th>Level</th><th>Wins</th><th>Losses</th>`;
      for (const mon of mons) {
        buf += `<tr><td>${Dex.species.get(mon.species_id).name}</td>`;
        buf += `<td>${mon.level}</td><td>${mon.wins}</td><td>${mon.losses}</td></tr>`;
      }
      buf += `</table></div></div>`;
      return buf;
    } else if (mode === "history") {
      this.checkCan("modlog", null, Rooms.get("development"));
      let speciesID = query.shift();
      let buf;
      if (speciesID) {
        speciesID = getLevelSpeciesID({ species: speciesID || "" });
        const species = Dex.species.get(speciesID);
        if (!species.exists || species.isNonstandard || species.isNonstandard === "Unobtainable" || species.nfe || species.battleOnly && (!species.requiredItems?.length || species.name.endsWith("-Tera"))) {
          this.errorReply("Species has no data in [Gen 9] Computer Generated Teams");
        }
        buf = `<div class="pad"><h2>Level history for ${species.name} in [Gen 9] CGT</h2>`;
      } else {
        buf = `<div class="pad"><h2>Level history for [Gen 9] Computer Generated Teams</h2>`;
      }
      const history = await import_cg_teams.cgtDatabase.all(
        "SELECT level, species_id, timestamp FROM gen9_historical_levels"
      );
      this.title = `[History] [Gen 9] Computer Generated Teams`;
      const MAX_LINES = 100;
      buf += `<div class="ladder pad"><table><tr><th>Pokemon</th><th>Level</th><th>Timestamp</th>`;
      for (let i = history.length - 1; history.length - i <= MAX_LINES; i--) {
        const entry = history[i];
        if (speciesID && entry.species_id !== speciesID) continue;
        buf += `<tr><td>${entry.species_id}</td><td>${entry.level}</td>`;
        const timestamp = new Date(entry.timestamp);
        buf += `<td>${timestamp.toLocaleDateString()}, ${timestamp.toLocaleTimeString()}</td></tr>`;
      }
      buf += `</table></div></div>`;
      return buf;
    }
  }
};
//# sourceMappingURL=cg-teams-leveling.js.map
