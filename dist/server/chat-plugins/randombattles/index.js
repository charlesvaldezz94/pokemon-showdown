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
var randombattles_exports = {};
__export(randombattles_exports, {
  STAT_NAMES: () => STAT_NAMES,
  commands: () => commands,
  formatNature: () => formatNature
});
module.exports = __toCommonJS(randombattles_exports);
var import_lib = require("../../../lib");
function getHTMLCriteriaDescription(criteria) {
  const format = (list) => list.map((m) => import_lib.Utils.html`<strong>${m.name}</strong>`);
  const parts = [];
  const { moves, ability, item, nature, teraType } = criteria;
  if (moves.mustHave.length) {
    parts.push(`had the move${Chat.plural(moves.mustHave)} ${Chat.toListString(format(moves.mustHave))}`);
  }
  if (moves.mustNotHave.length) {
    parts.push(`did not have the move${Chat.plural(moves.mustNotHave)} ${Chat.toListString(format(moves.mustNotHave), "or")}`);
  }
  if (ability.mustHave) {
    parts.push(import_lib.Utils.html`had the ability <strong>${ability.mustHave.name}</strong>`);
  }
  if (ability.mustNotHave.length) {
    parts.push(`did not have the ${Chat.plural(ability.mustNotHave, "abilities", "ability")} ${Chat.toListString(format(ability.mustNotHave), "or")}`);
  }
  if (item.mustHave) {
    parts.push(import_lib.Utils.html`had the item <strong>${item.mustHave.name}</strong>`);
  }
  if (item.mustNotHave.length) {
    parts.push(`did not have the item${Chat.plural(item.mustNotHave)} ${Chat.toListString(format(item.mustNotHave), "or")}`);
  }
  if (nature.mustHave) {
    parts.push(import_lib.Utils.html`had the nature <strong>${nature.mustHave.name}</strong>`);
  }
  if (nature.mustNotHave.length) {
    parts.push(`did not have the nature${Chat.plural(nature.mustNotHave)} ${Chat.toListString(format(nature.mustNotHave), "or")}`);
  }
  if (teraType.mustHave) {
    parts.push(import_lib.Utils.html`had the Tera Type <strong>${teraType.mustHave.name}</strong>`);
  }
  if (teraType.mustNotHave.length) {
    parts.push(`did not have the Tera Type${Chat.plural(teraType.mustNotHave)} ${Chat.toListString(format(teraType.mustNotHave), "or")}`);
  }
  return Chat.toListString(parts, "and");
}
function setProbability(species, format, criteria, rounds = 700) {
  const results = { rounds, matches: 0 };
  const generator = Teams.getGenerator(format);
  for (let i = 0; i < rounds; i++) {
    const set = generator.randomSet(
      species,
      {},
      false,
      format.gameType !== "singles",
      format.ruleTable?.has("dynamaxclause")
    );
    if (criteria.item.mustHave && set.item !== criteria.item.mustHave.name) continue;
    if (criteria.item.mustNotHave.some((item) => item.name === set.item)) continue;
    if (criteria.ability.mustHave && set.ability !== criteria.ability.mustHave.name) continue;
    if (criteria.ability.mustNotHave.some((ability) => ability.name === set.ability)) continue;
    if (criteria.nature.mustHave && set.nature !== criteria.nature.mustHave.name) continue;
    if (criteria.nature.mustNotHave.some((nature) => nature.name === set.nature)) continue;
    if (criteria.teraType.mustHave && set.teraType !== criteria.teraType.mustHave.name) continue;
    if (criteria.teraType.mustNotHave.some((type) => type.name === set.teraType)) continue;
    const setHasMove = (move) => {
      const id = move.id === "hiddenpower" ? `${move.id}${toID(move.type)}` : move.id;
      return set.moves.includes(id);
    };
    if (!criteria.moves.mustHave.every(setHasMove)) continue;
    if (criteria.moves.mustNotHave.some(setHasMove)) continue;
    results.matches++;
  }
  return results;
}
const GEN_NAMES = {
  gen1: "[Gen 1]",
  gen2: "[Gen 2]",
  gen3: "[Gen 3]",
  gen4: "[Gen 4]",
  gen5: "[Gen 5]",
  gen6: "[Gen 6]",
  gen7: "[Gen 7]",
  gen8: "[Gen 8]",
  gen9: "[Gen 9]"
};
const STAT_NAMES = {
  hp: "HP",
  atk: "Atk",
  def: "Def",
  spa: "SpA",
  spd: "SpD",
  spe: "Spe"
};
const TIERS = {
  uber: "Uber",
  ubers: "Uber",
  ou: "OU",
  uu: "UU",
  ru: "RU",
  nu: "NU",
  pu: "PU",
  mono: "Mono",
  monotype: "Mono",
  lc: "LC",
  littlecup: "LC"
};
function formatAbility(ability) {
  ability = Dex.abilities.get(ability);
  return `<a href="https://${Config.routes.dex}/abilities/${ability.id}" target="_blank" class="subtle" style="white-space:nowrap">${ability.name}</a>`;
}
function formatNature(n) {
  const nature = Dex.natures.get(n);
  return nature.name;
}
function formatMove(move) {
  move = Dex.moves.get(move);
  return `<a href="https://${Config.routes.dex}/moves/${move.id}" target="_blank" class="subtle" style="white-space:nowrap">${move.name}</a>`;
}
function formatItem(item) {
  if (typeof item === "string" && item === "No Item") {
    return `No Item`;
  } else {
    item = Dex.items.get(item);
    return `<a href="https://${Config.routes.dex}/items/${item.id}" target="_blank" class="subtle" style="white-space:nowrap">${item.name}</a>`;
  }
}
function formatType(type) {
  type = Dex.types.get(type);
  return type.name;
}
function getSets(species, format = "gen9randombattle") {
  const dex = Dex.forFormat(format);
  format = Dex.formats.get(format);
  species = dex.species.get(species);
  const isDoubles = format.gameType === "doubles";
  let folderName = format.mod;
  if (format.team === "randomBaby") folderName += "baby";
  if (species.isNonstandard === "CAP") folderName += "cap";
  const setsFile = JSON.parse(
    (0, import_lib.FS)(`data/random-battles/${folderName}/${isDoubles ? "doubles-" : ""}sets.json`).readIfExistsSync() || "{}"
  );
  const data = setsFile[species.id];
  if (!data?.sets?.length) return null;
  return data;
}
function getData(species, format) {
  const dex = Dex.forFormat(format);
  format = Dex.formats.get(format);
  species = dex.species.get(species);
  const dataFile = JSON.parse(
    (0, import_lib.FS)(`data/random-battles/${format.mod}/data.json`).readIfExistsSync() || "{}"
  );
  const data = dataFile[species.id];
  if (!data) return null;
  return data;
}
function getLevel(species, format) {
  const dex = Dex.forFormat(format);
  format = Dex.formats.get(format);
  species = dex.species.get(species);
  switch (format.id) {
    // Only formats where levels are not all manually assigned should be copied here
    case "gen2randombattle":
      const levelScale = {
        ZU: 81,
        ZUBL: 79,
        PU: 77,
        PUBL: 75,
        NU: 73,
        NUBL: 71,
        UU: 69,
        UUBL: 67,
        OU: 65,
        Uber: 61
      };
      return levelScale[species.tier] || 80;
  }
  return 0;
}
function getRBYMoves(species) {
  species = Dex.mod(`gen1`).species.get(species);
  const data = getData(species, "gen1randombattle");
  if (!data) return false;
  let buf = `<br/><b>Level</b>: ${data.level}`;
  if (data.comboMoves) {
    buf += `<br/><b>Combo moves</b>: `;
    buf += data.comboMoves.map(formatMove).sort().join(", ");
  }
  if (data.exclusiveMoves) {
    buf += `<br/><b>Exclusive moves</b>: `;
    buf += data.exclusiveMoves.map(formatMove).sort().join(", ");
  }
  if (data.essentialMoves) {
    buf += `<br/><b>Essential move${Chat.plural(data.essentialMoves)}</b>: `;
    buf += data.essentialMoves.map(formatMove).sort().join(", ");
  }
  if (data.moves) {
    buf += `<br/><b>Randomized moves</b>: `;
    buf += data.moves.map(formatMove).sort().join(", ");
  }
  if (!data.moves && !data.comboMoves && !data.exclusiveMoves && !data.essentialMove) {
    return false;
  }
  return buf;
}
function getLetsGoMoves(species) {
  species = Dex.species.get(species);
  const data = getData(species, "gen7letsgorandombattle");
  if (!data) return false;
  const isLetsGoLegal = (species.num <= 151 || ["Meltan", "Melmetal"].includes(species.name)) && (!species.forme || ["Alola", "Mega", "Mega-X", "Mega-Y", "Starter"].includes(species.forme));
  if (!isLetsGoLegal) return false;
  if (!data.moves?.length) return false;
  return data.moves.map(formatMove).sort().join(`, `);
}
function battleFactorySets(species, tier, gen = "gen9", isBSS = false) {
  species = Dex.species.get(species);
  if (typeof species.battleOnly === "string") {
    species = Dex.species.get(species.battleOnly);
  }
  gen = toID(gen);
  const genNum = parseInt(gen[3]);
  if (isNaN(genNum) || genNum < 6 || isBSS && genNum < 7) return null;
  const statsFile = JSON.parse(
    (0, import_lib.FS)(`data/random-battles/gen${genNum}/${isBSS ? `bss-` : ``}factory-sets.json`).readIfExistsSync() || "{}"
  );
  if (!Object.keys(statsFile).length) return null;
  let buf = ``;
  if (!isBSS) {
    if (!tier) throw new Chat.ErrorMessage(`Please provide a valid tier.`);
    if (!(toID(tier) in TIERS)) throw new Chat.ErrorMessage(`That tier isn't supported.`);
    if (!(TIERS[toID(tier)] in statsFile)) {
      throw new Chat.ErrorMessage(`${TIERS[toID(tier)]} is not included in [Gen ${genNum}] Battle Factory.`);
    }
    const t = statsFile[TIERS[toID(tier)]];
    if (!(species.id in t)) {
      const formatName = Dex.formats.get(`${gen}battlefactory`).name;
      throw new Chat.ErrorMessage(`${species.name} doesn't have any sets in ${TIERS[toID(tier)]} for ${formatName}.`);
    }
    const setObj = t[species.id];
    if (genNum >= 9) {
      buf += `Species rarity: ${setObj.weight} (higher is more common, max 10)<br />`;
    }
    buf += `<span class="gray">Sets for ${species.name} in${genNum === 8 ? `` : ` ${GEN_NAMES[gen]}`} ${TIERS[toID(tier)]}:</span><br />`;
    for (const [i, set] of setObj.sets.entries()) {
      if (genNum >= 9) {
        buf += `<details class="details"><summary>Set ${i + 1} (${set.weight}%)</summary>`;
      } else {
        buf += `<details class="details"><summary>Set ${i + 1}</summary>`;
      }
      buf += `<ul style="list-style-type:none;">`;
      buf += `<li>${set.species}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
      buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
      if (TIERS[toID(tier)] === "LC" && !set.level) buf += `<li>Level: 5</li>`;
      if (set.level && set.level < 100) buf += `<li>Level: ${set.level}</li>`;
      if (set.shiny) buf += `<li>Shiny: Yes</li>`;
      if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
      if (genNum === 9 && set.teraType) {
        buf += `<li>Tera Type: ${set.teraType.map(formatType).join(" / ")}</li>`;
      }
      if (set.evs) {
        buf += `<li>EVs: `;
        const evs = [];
        let ev;
        for (ev in set.evs) {
          if (set.evs[ev] === 0) continue;
          evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
        }
        buf += `${evs.join(" / ")}</li>`;
      }
      buf += `<li>${Array.isArray(set.nature) ? set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>`;
      if (set.ivs) {
        buf += `<li>IVs: `;
        const ivs = [];
        let iv;
        for (iv in set.ivs) {
          if (set.ivs[iv] === 31) continue;
          ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
        }
        buf += `${ivs.join(" / ")}</li>`;
      }
      for (const moveid of set.moves) {
        buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
      }
      buf += `</ul></details>`;
    }
  } else {
    const format = Dex.formats.get(`${gen}bssfactory`);
    if (!(species.id in statsFile)) throw new Chat.ErrorMessage(`${species.name} doesn't have any sets in ${format.name}.`);
    const setObj = statsFile[species.id];
    if (genNum >= 9) {
      buf += `Species rarity: ${setObj.weight} (higher is more common, max 10)<br />`;
      buf += `Sets for ${species.name} in ${format.name}:<br />`;
      for (const [i, set] of setObj.sets.entries()) {
        buf += `<details class="details"><summary>Set ${i + 1} (${set.weight}%)</summary>`;
        buf += `<ul style="list-style-type:none;padding-left:0;">`;
        buf += `<li>${Dex.forFormat(format).species.get(set.species).name} @ ${set.item.map(formatItem).join(" / ")}</li>`;
        buf += `<li>Ability: ${set.ability.map(formatAbility).join(" / ")}</li>`;
        buf += `<li>Level: 50</li>`;
        buf += `<li>Tera Type: ${set.teraType.map(formatType).join(" / ")}</li>`;
        if (set.evs) {
          buf += `<li>EVs: `;
          const evs = [];
          let ev;
          for (ev in set.evs) {
            if (!set.evs[ev]) continue;
            evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
          }
          buf += `${evs.join(" / ")}</li>`;
        }
        buf += `<li>${formatNature(set.nature)} Nature</li>`;
        if (set.ivs) {
          buf += `<li>IVs: `;
          const ivs = [];
          let iv;
          for (iv in set.ivs) {
            if (set.ivs[iv] === 31) continue;
            ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
          }
          buf += `${ivs.join(" / ")}</li>`;
        }
        for (const moveSlot of set.moves) {
          buf += `<li>- ${moveSlot.map(formatMove).join(" / ")}</li>`;
        }
        buf += `</ul></details>`;
      }
    } else {
      buf += `<span class="gray">Sets for ${species.name} in ${format.name}:</span><br />`;
      for (const [i, set] of setObj.sets.entries()) {
        buf += `<details class="details"><summary>Set ${i + 1}</summary>`;
        buf += `<ul style="list-style-type:none;padding-left:0;">`;
        buf += `<li>${set.species}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
        buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
        if (!set.level) buf += `<li>Level: 50</li>`;
        if (set.level && set.level < 50) buf += `<li>Level: ${set.level}</li>`;
        if (set.shiny) buf += `<li>Shiny: Yes</li>`;
        if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
        if (set.evs) {
          buf += `<li>EVs: `;
          const evs = [];
          let ev;
          for (ev in set.evs) {
            if (set.evs[ev] === 0) continue;
            evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
          }
          buf += `${evs.join(" / ")}</li>`;
        }
        buf += `<li>${Array.isArray(set.nature) ? set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>`;
        if (set.ivs) {
          buf += `<li>IVs: `;
          const ivs = [];
          let iv;
          for (iv in set.ivs) {
            if (set.ivs[iv] === 31) continue;
            ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
          }
          buf += `${ivs.join(" / ")}</li>`;
        }
        for (const moveid of set.moves) {
          buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
        }
        buf += `</ul></details>`;
      }
    }
  }
  return buf;
}
function CAP1v1Sets(species) {
  species = Dex.species.get(species);
  const statsFile = JSON.parse(
    (0, import_lib.FS)(`data/random-battles/gen8/cap-1v1-sets.json`).readIfExistsSync() || "{}"
  );
  if (!Object.keys(statsFile).length) return null;
  if (species.isNonstandard !== "CAP") {
    return {
      e: `[Gen 8] CAP 1v1 only allows Pok\xE9mon created by the Create-A-Pok\xE9mon Project.`,
      parse: `/cap`
    };
  }
  if (species.isNonstandard === "CAP" && !(species.name in statsFile)) {
    return { e: `${species.name} doesn't have any sets in [Gen 8] CAP 1v1.` };
  }
  let buf = `<span class="gray">Sets for ${species.name} in [Gen 8] CAP 1v1:</span><br />`;
  for (const [i, set] of statsFile[species.name].entries()) {
    buf += `<details class="details"><summary>Set ${i + 1}</summary>`;
    buf += `<ul style="list-style-type:none;">`;
    buf += `<li>${set.species || species.name}${set.gender ? ` (${set.gender})` : ``} @ ${Array.isArray(set.item) ? set.item.map(formatItem).join(" / ") : formatItem(set.item)}</li>`;
    buf += `<li>Ability: ${Array.isArray(set.ability) ? set.ability.map(formatAbility).join(" / ") : formatAbility(set.ability)}</li>`;
    if (set.level && set.level < 100) buf += `<li>Level: ${set.level}</li>`;
    if (set.shiny) buf += `<li>Shiny: Yes</li>`;
    if (set.happiness) buf += `<li>Happiness: ${set.happiness}</li>`;
    if (set.evs) {
      buf += `<li>EVs: `;
      const evs = [];
      let ev;
      for (ev in set.evs) {
        if (set.evs[ev] === 0) continue;
        evs.push(`${set.evs[ev]} ${STAT_NAMES[ev]}`);
      }
      buf += `${evs.join(" / ")}</li>`;
    }
    buf += `<li>${Array.isArray(set.nature) ? set.nature.map(formatNature).join(" / ") : formatNature(set.nature)} Nature</li>`;
    if (set.ivs) {
      buf += `<li>IVs: `;
      const ivs = [];
      let iv;
      for (iv in set.ivs) {
        if (set.ivs[iv] === 31) continue;
        ivs.push(`${set.ivs[iv]} ${STAT_NAMES[iv]}`);
      }
      buf += `${ivs.join(" / ")}</li>`;
    }
    for (const moveid of set.moves) {
      buf += `<li>- ${Array.isArray(moveid) ? moveid.map(formatMove).join(" / ") : formatMove(moveid)}</li>`;
    }
    buf += `</ul></details>`;
  }
  return buf;
}
const commands = {
  randbats: "randombattles",
  randomdoublesbattle: "randombattles",
  randdubs: "randombattles",
  babyrandombattle: "randombattles",
  babyrands: "randombattles",
  // randombattlenodmax: 'randombattles',
  // randsnodmax: 'randombattles',
  randombattles(target, room, user, connection, cmd) {
    if (!this.runBroadcast()) return;
    const battle = room?.battle;
    let isDoubles = cmd === "randomdoublesbattle" || cmd === "randdubs";
    let isBaby = cmd === "babyrandombattle" || cmd === "babyrands";
    let isNoDMax = cmd.includes("nodmax");
    if (battle) {
      if (battle.format.includes("nodmax")) isNoDMax = true;
      if (battle.format.includes("doubles") || battle.gameType === "freeforall") isDoubles = true;
      if (battle.format.includes("baby")) isBaby = true;
    }
    const args = target.split(",");
    if (!args[0]) return this.parse(`/help randombattles`);
    const { dex } = this.splitFormat(target, true);
    const isLetsGo = dex.currentMod === "gen7letsgo";
    const searchResults = dex.dataSearch(args[0], ["Pokedex"]);
    if (!searchResults?.length) {
      throw new Chat.ErrorMessage(`No Pok\xE9mon named '${args[0]}' was found${Dex.gen > dex.gen ? ` in Gen ${dex.gen}` : ""}. (Check your spelling?)`);
    }
    let inexactMsg = "";
    if (searchResults[0].isInexact) {
      inexactMsg = `No Pok\xE9mon named '${args[0]}' was found${Dex.gen > dex.gen ? ` in Gen ${dex.gen}` : ""}. Searching for '${searchResults[0].name}' instead.`;
    }
    const species = dex.species.get(searchResults[0].name);
    const extraFormatModifier = isLetsGo ? "letsgo" : dex.currentMod === "gen8bdsp" ? "bdsp" : "";
    const babyModifier = isBaby ? "baby" : "";
    const doublesModifier = isDoubles ? "doubles" : "";
    const noDMaxModifier = isNoDMax ? "nodmax" : "";
    const formatName = `gen${dex.gen}${extraFormatModifier}${babyModifier}random${doublesModifier}battle${noDMaxModifier}`;
    const format = dex.formats.get(formatName);
    const movesets = [];
    let setCount = 0;
    if (dex.gen === 1) {
      const rbyMoves = getRBYMoves(species);
      if (!rbyMoves) {
        this.sendReply(inexactMsg);
        throw new Chat.ErrorMessage(`Error: ${species.name} has no Random Battle data in ${GEN_NAMES[toID(args[1])]}`);
      }
      movesets.push(`<span class="gray">Moves for ${species.name} in ${format.name}:</span>${rbyMoves}`);
      setCount = 1;
    } else if (isLetsGo) {
      const lgpeMoves = getLetsGoMoves(species);
      if (!lgpeMoves) {
        this.sendReply(inexactMsg);
        throw new Chat.ErrorMessage(`Error: ${species.name} has no Random Battle data in [Gen 7 Let's Go]`);
      }
      movesets.push(`<span class="gray">Moves for ${species.name} in ${format.name}:</span><br />${lgpeMoves}`);
      setCount = 1;
    } else {
      const setsToCheck = [species];
      if (dex.gen >= 8 && !isNoDMax) setsToCheck.push(dex.species.get(`${args[0]}gmax`));
      if (species.otherFormes) setsToCheck.push(...species.otherFormes.map((pkmn) => dex.species.get(pkmn)));
      if ([2, 3, 4, 5, 6, 7, 9].includes(dex.gen)) {
        for (const pokemon of setsToCheck) {
          const data = getSets(pokemon, format.id);
          if (!data) continue;
          const sets = data.sets;
          const level = data.level || getLevel(pokemon, format);
          let buf2 = `<span class="gray">Moves for ${pokemon.name} in ${format.name}:</span><br/>`;
          buf2 += `<b>Level</b>: ${level}`;
          for (const set of sets) {
            buf2 += `<details class="details"><summary>${set.role}</summary>`;
            if (dex.gen === 9) {
              buf2 += `<b>Tera Type${Chat.plural(set.teraTypes)}</b>: ${set.teraTypes.join(", ")}<br/>`;
            } else if ([2, 3, 4, 5, 6, 7].includes(dex.gen) && set.preferredTypes) {
              buf2 += `<b>Preferred Type${Chat.plural(set.preferredTypes)}</b>: ${set.preferredTypes.join(", ")}<br/>`;
            }
            buf2 += `<b>Moves</b>: ${set.movepool.sort().map(formatMove).join(", ")}<br/>`;
            if (set.abilities) {
              buf2 += `<b>Abilit${Chat.plural(set.abilities, "ies", "y")}</b>: ${set.abilities.sort().join(", ")}`;
            }
            buf2 += "</details>";
            setCount++;
          }
          movesets.push(buf2);
        }
      } else {
        for (let pokemon of setsToCheck) {
          let data = getData(pokemon, format.name);
          if (!data && isNoDMax) {
            pokemon = dex.species.get(pokemon.id + "gmax");
            data = getData(pokemon, format.name);
          }
          if (!data) continue;
          if (!data.moves || pokemon.isNonstandard === "Future") continue;
          let randomMoves = data.moves;
          const level = data.level || getLevel(pokemon, format);
          if (isDoubles && data.doublesMoves) randomMoves = data.doublesMoves;
          if (isNoDMax && data.noDynamaxMoves) randomMoves = data.noDynamaxMoves;
          const m = randomMoves.slice().sort().map(formatMove);
          movesets.push(
            `<details class="details"><summary><span class="gray">Moves for ${pokemon.name} in ${format.name}:</span></summary>` + (level ? `<b>Level</b>: ${level}<br>` : "") + `${m.join(`, `)}</details>`
          );
          setCount++;
        }
      }
    }
    if (!movesets.length) {
      this.sendReply(inexactMsg);
      throw new Chat.ErrorMessage(`Error: ${species.name} has no Random Battle data in ${format.name}`);
    }
    let buf = movesets.join("<hr/>");
    if (setCount <= 2) {
      buf = buf.replace(/<details>/g, "<details open>");
    }
    this.sendReply(inexactMsg);
    this.sendReplyBox(buf);
  },
  randombattleshelp: [
    `/randombattles OR /randbats [pokemon], [gen] - Displays a Pok\xE9mon's Random Battle Moves. Defaults to Gen 9. If used in a battle, defaults to the gen of that battle.`,
    `/randomdoublesbattle OR /randdubs [pokemon], [gen] - Same as above, but instead displays Random Doubles Battle moves.`
  ],
  bssfactory: "battlefactory",
  battlefactory(target, room, user, connection, cmd) {
    if (!this.runBroadcast()) return;
    const isBSS = cmd === "bssfactory";
    if (isBSS) {
      const args = target.split(",");
      if (!args[0]) return this.parse(`/help battlefactory`);
      const species = Dex.species.get(args[0]);
      if (!species.exists) {
        throw new Chat.ErrorMessage(`Error: Pok\xE9mon '${args[0].trim()}' not found.`);
      }
      let mod = "gen9";
      if (args[1] && toID(args[1]) in Dex.dexes && Dex.dexes[toID(args[1])].gen >= 7) mod = toID(args[1]);
      const bssSets = battleFactorySets(species, null, mod, true);
      if (!bssSets) return this.parse(`/help battlefactory`);
      return this.sendReplyBox(bssSets);
    } else {
      const args = target.split(",");
      if (!args[0]) return this.parse(`/help battlefactory`);
      const species = Dex.species.get(args[0]);
      if (!species.exists) {
        throw new Chat.ErrorMessage(`Error: Pok\xE9mon '${args[0].trim()}' not found.`);
      }
      let tier = "";
      if (args[1] && toID(args[1]) in TIERS) {
        tier = TIERS[toID(args[1])];
      } else {
        tier = "ou";
      }
      const mod = args[2] || "gen9";
      let bfSets;
      if (species.name === "Necrozma-Ultra") {
        bfSets = battleFactorySets(Dex.species.get("necrozma-dawnwings"), tier, mod);
        if (bfSets) {
          bfSets += battleFactorySets(Dex.species.get("necrozma-duskmane"), tier, mod);
        }
      } else if (species.name === "Zygarde-Complete") {
        bfSets = battleFactorySets(Dex.species.get("zygarde"), tier, mod);
        if (bfSets) {
          bfSets += battleFactorySets(Dex.species.get("zygarde-10"), tier, mod);
        }
      } else {
        bfSets = battleFactorySets(species, tier, mod);
      }
      if (!bfSets) return this.parse(`/help battlefactory`);
      return this.sendReplyBox(bfSets);
    }
  },
  battlefactoryhelp: [
    `/battlefactory [pokemon], [tier], [gen] - Displays a Pok\xE9mon's Battle Factory sets. Supports Gens 6-8. Defaults to Gen 8. If no tier is provided, defaults to OU.`,
    `- Supported tiers: OU, Ubers, UU, RU, NU, PU, Monotype (Gen 7 only), LC (Gen 7 only)`,
    `/bssfactory [pokemon], [gen] - Displays a Pok\xE9mon's BSS Factory sets. Supports Gen 7-9. Defaults to Gen 9.`
  ],
  cap1v1(target, room, user) {
    if (!this.runBroadcast()) return;
    if (!target) return this.parse(`/help cap1v1`);
    const species = Dex.species.get(target);
    if (!species.exists) throw new Chat.ErrorMessage(`Error: Pok\xE9mon '${target.trim()}' not found.`);
    const cap1v1Set = CAP1v1Sets(species);
    if (!cap1v1Set) return this.parse(`/help cap1v1`);
    if (typeof cap1v1Set !== "string") {
      this.errorReply(`Error: ${cap1v1Set.e}`);
      if (cap1v1Set.parse) this.parse(cap1v1Set.parse);
      return;
    }
    return this.sendReplyBox(cap1v1Set);
  },
  cap1v1help: [
    `/cap1v1 [pokemon] - Displays a Pok\xE9mon's CAP 1v1 sets.`
  ],
  setodds: "randombattlesetprobabilities",
  randbatsodds: "randombattlesetprobabilities",
  randbatsprobabilities: "randombattlesetprobabilities",
  randombattlesetprobabilities(target, room, user) {
    const randbatsRoom = Rooms.get("randombattles");
    if (!randbatsRoom?.auth.has(user.id)) {
      this.checkCan("lock");
    }
    if (!target) return this.parse(`/help randombattlesetprobabilities`);
    this.runBroadcast();
    const args = target.split(",");
    if (args.length < 2) return this.parse(`/help randombattlesetprobabilities`);
    let format = Dex.formats.get("gen9randombattle");
    let formatOrSpecies = args.shift();
    const possibleFormat = Dex.formats.get(formatOrSpecies);
    if (possibleFormat.exists) {
      if (!possibleFormat.team) {
        throw new Chat.ErrorMessage(`${possibleFormat.name} does not have randomly-generated teams.`);
      }
      format = possibleFormat;
      formatOrSpecies = args.shift();
    }
    const dex = Dex.forFormat(format);
    const species = dex.species.get(formatOrSpecies);
    if (!species.exists) {
      throw new Chat.ErrorMessage(`Species ${species.name} does not exist in the specified format.`);
    }
    let setExists;
    if ([2, 3, 4, 5, 6, 7, 9].includes(dex.gen)) {
      setExists = !!getSets(species, format);
    } else {
      const data = getData(species, format);
      if (!data) {
        setExists = false;
      } else if (format.gameType === "doubles" || format.gameType === "freeforall") {
        setExists = !!data.doublesMoves;
      } else {
        setExists = !!data.moves;
      }
    }
    if (!setExists) {
      throw new Chat.ErrorMessage(`${species.name} does not have random battle moves in ${format.name}.`);
    }
    const criteria = {
      moves: { mustHave: [], mustNotHave: [] },
      item: { mustNotHave: [] },
      ability: { mustNotHave: [] },
      nature: { mustNotHave: [] },
      teraType: { mustNotHave: [] }
    };
    if (args.length < 1) {
      this.errorReply(`You must specify at least one condition.`);
      return this.parse(`/help randombattlesetprobabilities`);
    }
    for (const arg of args) {
      let [key, value] = arg.split("=");
      key = toID(key);
      if (!value || !key) {
        this.errorReply(`Invalid condition format: ${arg}`);
        return this.parse(`/help randombattlesetprobabilities`);
      }
      switch (key) {
        case "moves":
          for (const rawMove of value.split("&")) {
            const move = dex.moves.get(rawMove);
            if (!move.exists) {
              throw new Chat.ErrorMessage(`"${rawMove}" is not a move in the specified format.`);
            }
            const isNegation = rawMove.trim().startsWith("!");
            if (isNegation) {
              criteria.moves.mustNotHave.push(move);
            } else {
              criteria.moves.mustHave.push(move);
            }
          }
          break;
        case "item":
          const item = dex.items.get(value);
          if (!item.exists) {
            throw new Chat.ErrorMessage(`"${value}" is not an item in the specified format.`);
          }
          const itemNegation = value.trim().startsWith("!");
          if (itemNegation) {
            criteria.item.mustNotHave.push(item);
          } else {
            if (criteria.item.mustHave) {
              throw new Chat.ErrorMessage(`Impossible situation: two items (${criteria.item.mustHave.name} and ${item.name}) are required.`);
            }
            criteria.item.mustHave = item;
          }
          break;
        case "ability":
          const ability = dex.abilities.get(value);
          if (!ability.exists) {
            throw new Chat.ErrorMessage(`"${value}" is not an ability in the specified format.`);
          }
          const abilityNegation = value.trim().startsWith("!");
          if (abilityNegation) {
            criteria.ability.mustNotHave.push(ability);
          } else {
            if (criteria.ability.mustHave) {
              throw new Chat.ErrorMessage(`Impossible situation: two abilities (${criteria.ability.mustHave.name} and ${ability.name}) are required.`);
            }
            criteria.ability.mustHave = ability;
          }
          break;
        case "nature":
          const nature = dex.natures.get(value);
          if (!nature.exists) {
            throw new Chat.ErrorMessage(`"${value}" is not a nature in the specified format.`);
          }
          const natureNegation = value.trim().startsWith("!");
          if (natureNegation) {
            criteria.nature.mustNotHave.push(nature);
          } else {
            if (criteria.nature.mustHave) {
              throw new Chat.ErrorMessage(`Impossible situation: two natures (${criteria.nature.mustHave.name} and ${nature.name}) are required.`);
            }
            criteria.nature.mustHave = nature;
          }
          break;
        case "tera":
        case "teratype":
          if (dex.gen < 9) throw new Chat.ErrorMessage("Tera Types do not exist in the specified format.");
          const type = dex.types.get(value);
          if (!type.exists) {
            throw new Chat.ErrorMessage(`"${value}" is not a type in the specified format.`);
          }
          const typeNegation = value.trim().startsWith("!");
          if (typeNegation) {
            criteria.teraType.mustNotHave.push(type);
          } else {
            if (criteria.teraType.mustHave) {
              throw new Chat.ErrorMessage(`Impossible situation: two Tera Types (${criteria.teraType.mustHave.name} and ${type.name}) are required.`);
            }
            criteria.teraType.mustHave = type;
          }
          break;
        default:
          throw new Chat.ErrorMessage(`Invalid criterion: ${key}`);
      }
    }
    const results = setProbability(species, format, criteria);
    const percentage = Math.round(results.matches / results.rounds * 100);
    return this.sendReplyBox(
      import_lib.Utils.html`Generated ${results.rounds} sets for <strong>${species.name}</strong> in ${format.name}:<br />` + `Approximately <strong>${percentage}%</strong> (${results.matches} sets) ${getHTMLCriteriaDescription(criteria)}.`
    );
  },
  randombattlesetprobabilitieshelp() {
    return this.sendReplyBox(
      `<code>/randombattlesetprobabilities [optional format], [species], [conditions]</code>: Gives the probability of a set matching the conditions appearing for the given species.<br /><code>[conditions]</code> is a comma-separated list of conditions of the form <code>[component]=[matching value]</code>, where <code>[component]</code> can be any of the following: <ul><li><code>moves</code>: matches all generated sets that contain every move specified. <code>[matching value]</code> should be a list of moves separated with <code>&amp;</code>.<li><code>item</code>: matches all generated sets that have the specified item. <code>[matching value]</code> should be an item name.<li><code>ability</code>: matches all generated sets with the specified ability. <code>[matching value]</code> should be an ability name.<li><code>nature</code>: matches all generated sets with the specified nature. <code>[matching value]</code> should be a nature name.<li><code>tera</code>: matches all generated sets with the specified Tera Type. <code>[matching value]</code> should be a type. Gen 9 only.</ul>The given probability is for a set that matches EVERY provided condition. Conditions can be negated by prefixing the <code>[matching value]</code> with <code>!</code>.<br />Requires: % @ # ~ (globally or in the Random Battles room)`
    );
  },
  genteam: "generateteam",
  generateteam(target, room, user) {
    if (!Rooms.get("randombattles")?.auth.has(user.id)) this.checkCan("lock");
    this.runBroadcast(true);
    if (!target) return this.parse("/help generateteam");
    const format = Dex.formats.get(target);
    if (format.effectType !== "Format") throw new Chat.ErrorMessage(`"${target}" is not a recognized format.`);
    if (!format.team) throw new Chat.ErrorMessage(`"${format.name}" requires you to bring your own team.`);
    const team = Teams.getGenerator(format).getTeam();
    const dex = Dex.forFormat(format);
    const teamHTML = team.map((set) => {
      set.moves = set.moves.map((m) => dex.moves.get(m).name);
      set.item = dex.items.get(set.item).name;
      return `<details class="details"><summary>${set.name}</summary>${import_lib.Utils.escapeHTML(Teams.exportSet(set))}<br /></details>`;
    }).join("");
    return this.sendReplyBox(`<strong>Team for ${format.name}</strong>:` + teamHTML);
  },
  generateteamhelp: [`/genteam [format] - Generates a team for the given format. Requires: % @ ~ or Random Battles room auth`]
};
//# sourceMappingURL=index.js.map
