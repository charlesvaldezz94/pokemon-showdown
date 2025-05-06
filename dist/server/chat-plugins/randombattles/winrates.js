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
var winrates_exports = {};
__export(winrates_exports, {
  commands: () => commands,
  getSpeciesName: () => getSpeciesName,
  handlers: () => handlers,
  pages: () => pages,
  saveStats: () => saveStats,
  stats: () => stats
});
module.exports = __toCommonJS(winrates_exports);
var import_lib = require("../../../lib");
const STATS_PATH = Monitor.logPath("randbats/{{MONTH}}-winrates.json").path;
const stats = getDefaultStats();
try {
  const path = STATS_PATH.replace("{{MONTH}}", getMonth());
  if (!Monitor.logPath("randbats/").existsSync()) {
    Monitor.logPath("randbats/").mkdirSync();
  }
  const savedStats = JSON.parse((0, import_lib.FS)(path).readSync());
  stats.elo = savedStats.elo;
  stats.month = savedStats.month;
  for (const k in stats.formats) {
    stats.formats[k] = savedStats.formats[k] || stats.formats[k];
  }
} catch {
}
function getDefaultStats() {
  return {
    elo: 1500,
    month: getMonth(),
    formats: {
      // all of these requested by rands staff. they don't anticipate it being changed much
      // so i'm not spending the time to add commands to toggle this
      gen9randombattle: { mons: {} },
      gen9randomdoublesbattle: { mons: {} },
      gen9babyrandombattle: { mons: {} },
      gen9superstaffbrosultimate: { mons: {} },
      gen8randombattle: { mons: {} },
      gen7randombattle: { mons: {} },
      gen6randombattle: { mons: {} },
      gen5randombattle: { mons: {} },
      gen4randombattle: { mons: {} },
      gen3randombattle: { mons: {} },
      gen2randombattle: { mons: {} },
      gen1randombattle: { mons: {} }
    }
  };
}
function saveStats(month = getMonth()) {
  const curStats = { ...stats };
  (0, import_lib.FS)(STATS_PATH.replace("{{MONTH}}", month)).writeUpdate(() => JSON.stringify(curStats));
}
function getMonth() {
  return Chat.toTimestamp(/* @__PURE__ */ new Date()).split(" ")[0].slice(0, -3);
}
function getSpeciesName(set, format) {
  const species = set.species;
  const item = Dex.items.get(set.item);
  const moves = set.moves;
  const megaRayquazaPossible = ["gen6", "gen7"].includes(format.mod) && !format.ruleset.includes("Mega Rayquaza Clause");
  if (species.startsWith("Pikachu-")) {
    return "Pikachu";
  } else if (species.startsWith("Unown-")) {
    return "Unown";
  } else if (species === "Gastrodon-East") {
    return "Gastrodon";
  } else if (species === "Magearna-Original") {
    return "Magearna";
  } else if (species === "Genesect-Douse") {
    return "Genesect";
  } else if (species === "Dudunsparce-Three-Segment") {
    return "Dudunsparce";
  } else if (species === "Maushold-Four") {
    return "Maushold";
  } else if (species === "Greninja-Bond") {
    return "Greninja";
  } else if (species === "Keldeo-Resolute") {
    return "Keldeo";
  } else if (species === "Zarude-Dada") {
    return "Zarude";
  } else if (species === "Polteageist-Antique") {
    return "Polteageist";
  } else if (species === "Sinistcha-Masterpiece") {
    return "Sinistcha";
  } else if (species === "Squawkabilly-Blue") {
    return "Squawkabilly";
  } else if (species === "Squawkabilly-White") {
    return "Squawkabilly-Yellow";
  } else if (species.startsWith("Basculin-")) {
    return "Basculin";
  } else if (species.startsWith("Sawsbuck-")) {
    return "Sawsbuck";
  } else if (species.startsWith("Vivillon-")) {
    return "Vivillon";
  } else if (species.startsWith("Florges-")) {
    return "Florges";
  } else if (species.startsWith("Furfrou-")) {
    return "Furfrou";
  } else if (species.startsWith("Minior-")) {
    return "Minior";
  } else if (species.startsWith("Toxtricity-")) {
    return "Toxtricity";
  } else if (species.startsWith("Tatsugiri-")) {
    return "Tatsugiri";
  } else if (species.startsWith("Alcremie-")) {
    return "Alcremie";
  } else if (species === "Zacian" && item.name === "Rusted Sword") {
    return "Zacian-Crowned";
  } else if (species === "Zamazenta" && item.name === "Rusted Shield") {
    return "Zamazenta-Crowned";
  } else if (species === "Kyogre" && item.name === "Blue Orb") {
    return "Kyogre-Primal";
  } else if (species === "Groudon" && item.name === "Red Orb") {
    return "Groudon-Primal";
  } else if (item.megaStone) {
    return item.megaStone;
  } else if (species === "Rayquaza" && moves.includes("Dragon Ascent") && !item.zMove && megaRayquazaPossible) {
    return "Rayquaza-Mega";
  } else if (species === "Poltchageist-Artisan") {
    return "Poltchageist";
  } else if (species === "Shellos-East") {
    return "Shellos";
  } else if (species === "Sinistea-Antique") {
    return "Sinistea";
  } else if (species.startsWith("Deerling-")) {
    return "Deerling";
  } else if (species.startsWith("Flabe\u0301be\u0301-")) {
    return "Flabe\u0301be\u0301";
  } else {
    return species;
  }
}
function checkRollover() {
  if (stats.month !== getMonth()) {
    saveStats(stats.month);
    Object.assign(stats, getDefaultStats());
    saveStats();
  }
}
const getZScore = (data) => 2 * Math.sqrt(data.timesGenerated) * (data.numWins / data.timesGenerated - 0.5);
const handlers = {
  onBattleEnd(battle, winner, players) {
    void collectStats(battle, winner, players);
  }
};
async function collectStats(battle, winner, players) {
  const formatData = stats.formats[battle.format];
  let eloFloor = stats.elo;
  const format = Dex.formats.get(battle.format);
  if (format.mod === "gen2" || format.team === "randomBaby") {
    eloFloor = 1150;
  } else if (format.mod !== `gen${Dex.gen}`) {
    eloFloor = 1300;
  } else if (format.gameType === "doubles") {
    eloFloor = 1400;
  }
  if (!formatData || format.mod !== "gen9ssb" && battle.rated < eloFloor || !winner) return;
  checkRollover();
  for (const p of battle.players) {
    const team = await battle.getPlayerTeam(p);
    if (!team) return;
    const mons = team.map((f) => getSpeciesName(f, format));
    for (const mon of mons) {
      if (!formatData.mons[mon]) formatData.mons[mon] = { timesGenerated: 0, numWins: 0 };
      formatData.mons[mon].timesGenerated++;
      if (toID(winner) === toID(p.name)) {
        formatData.mons[mon].numWins++;
      }
    }
  }
  saveStats();
}
const commands = {
  rwr: "randswinrates",
  randswinrates(target, room, user) {
    target = toID(target);
    if (/^(gen|)[0-9]+$/.test(target)) {
      if (target.startsWith("gen")) target = target.slice(3);
      target = `gen${target}randombattle`;
    }
    return this.parse(`/j view-winrates-${target ? Dex.formats.get(target).id : `gen${Dex.gen}randombattle`}`);
  },
  randswinrateshelp: [
    "/randswinrates OR /rwr [format] - Get a list of the win rates for all Pokemon in the given Random Battles format."
  ],
  async removewinrates(target, room, user) {
    this.checkCan("rangeban");
    if (!/^[0-9]{4}-[0-9]{2}$/.test(target) || target === getMonth()) {
      throw new Chat.ErrorMessage(`Invalid month: ${target}`);
    }
    const path = STATS_PATH.replace("{{MON}}", target);
    if (!await (0, import_lib.FS)(path).exists()) {
      throw new Chat.ErrorMessage(`No stats for the month ${target}.`);
    }
    await (0, import_lib.FS)(path).unlinkIfExists();
    this.globalModlog("REMOVEWINRATES", null, target);
    this.privateGlobalModAction(`${user.name} removed Random Battle winrates for the month of ${target}`);
  }
};
const pages = {
  async winrates(query, user) {
    if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
    query = query.join("-").split("--");
    const format = toID(query.shift());
    if (!format) throw new Chat.ErrorMessage(`Specify a format to view winrates for.`);
    if (!stats.formats[format]) {
      throw new Chat.ErrorMessage(`That format does not have winrates tracked.`);
    }
    checkRollover();
    const sorter = toID(query.shift() || "zscore");
    if (!["zscore", "raw"].includes(sorter)) {
      throw new Chat.ErrorMessage(`Invalid sorting method. Must be either 'zscore' or 'raw'.`);
    }
    const month = query.shift() || getMonth();
    if (!/^[0-9]{4}-[0-9]{2}$/.test(month)) {
      throw new Chat.ErrorMessage(`Invalid month: ${month}`);
    }
    const isOldMonth = month !== getMonth();
    if (isOldMonth && !await (0, import_lib.FS)(STATS_PATH.replace("{{MONTH}}", month)).exists()) {
      throw new Chat.ErrorMessage(`There are no winrates for that month.`);
    }
    const prevMonth = new Date((/* @__PURE__ */ new Date(`${month}-15`)).getTime() - 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 7);
    const nextMonth = new Date((/* @__PURE__ */ new Date(`${month}-15`)).getTime() + 30 * 24 * 60 * 60 * 1e3).toISOString().slice(0, 7);
    const prevMonthExists = await (0, import_lib.FS)(STATS_PATH.replace("{{MONTH}}", prevMonth)).exists();
    const nextMonthExists = await (0, import_lib.FS)(STATS_PATH.replace("{{MONTH}}", nextMonth)).exists();
    const statData = month === stats.month ? stats : JSON.parse(await (0, import_lib.FS)(STATS_PATH.replace("{{MONTH}}", month)).read());
    const formatData = statData.formats[format];
    if (!formatData) {
      return /* @__PURE__ */ Chat.h("div", { class: "pad" }, /* @__PURE__ */ Chat.h(
        WinratesHeader,
        {
          formatID: format,
          month,
          sorter,
          prevMonth,
          prevMonthExists,
          nextMonth,
          nextMonthExists
        }
      ), /* @__PURE__ */ Chat.h("div", { class: "message-error" }, "No stats for that format found on that month."));
    }
    this.title = `[Winrates] [${format}] ${month}`;
    let sortFn;
    if (sorter === "zscore") {
      sortFn = ([_, data]) => [-getZScore(data), -data.timesGenerated];
    } else {
      sortFn = ([_, data]) => [
        -(data.numWins / data.timesGenerated),
        -data.numWins,
        -data.timesGenerated
      ];
    }
    const mons = import_lib.Utils.sortBy(Object.entries(formatData.mons), sortFn);
    return /* @__PURE__ */ Chat.h("div", { class: "pad" }, /* @__PURE__ */ Chat.h(
      WinratesHeader,
      {
        formatID: format,
        month,
        sorter,
        prevMonth,
        prevMonthExists,
        nextMonth,
        nextMonthExists
      }
    ), /* @__PURE__ */ Chat.h("div", { class: "ladder pad" }, /* @__PURE__ */ Chat.h("table", null, /* @__PURE__ */ Chat.h("tr", null, /* @__PURE__ */ Chat.h("th", null, "Pokemon"), /* @__PURE__ */ Chat.h("th", null, "Win %"), /* @__PURE__ */ Chat.h("th", null, "Z-Score"), /* @__PURE__ */ Chat.h("th", null, "Raw wins"), /* @__PURE__ */ Chat.h("th", null, "Times generated")), mons.map(([mon, data]) => /* @__PURE__ */ Chat.h("tr", null, /* @__PURE__ */ Chat.h("td", null, Dex.species.get(mon).name), /* @__PURE__ */ Chat.h("td", null, (data.numWins / data.timesGenerated * 100).toFixed(2), "%"), /* @__PURE__ */ Chat.h("td", null, getZScore(data).toFixed(3)), /* @__PURE__ */ Chat.h("td", null, data.numWins), /* @__PURE__ */ Chat.h("td", null, data.timesGenerated))))));
  }
};
class WinratesHeader extends Chat.JSX.Component {
  render() {
    const { formatID, month, sorter, prevMonth, prevMonthExists, nextMonth, nextMonthExists } = this.props;
    const formatName = Dex.formats.get(formatID).name;
    const otherSort = sorter === "zscore" ? "Raw" : "Z-Score";
    return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("h2", null, "Winrates for ", formatName, " (", month, ")"), prevMonthExists && /* @__PURE__ */ Chat.h("a", { class: "button", href: `/view-winrates-${formatID}--${sorter}--${prevMonth}` }, "Previous month"), prevMonthExists && nextMonthExists && " | ", nextMonthExists && /* @__PURE__ */ Chat.h("a", { class: "button", href: `/view-winrates-${formatID}--${sorter}--${nextMonth}` }, "Next month"), (prevMonthExists || nextMonthExists) && " | ", /* @__PURE__ */ Chat.h("a", { class: "button", target: "replace", href: `/view-winrates-${formatID}--${toID(otherSort)}--${month}` }, "Sort by ", otherSort, " descending"), /* @__PURE__ */ Chat.h("hr", null));
  }
}
//# sourceMappingURL=winrates.js.map
