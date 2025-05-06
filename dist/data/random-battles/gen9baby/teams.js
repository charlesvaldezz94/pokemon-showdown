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
var teams_exports = {};
__export(teams_exports, {
  RandomBabyTeams: () => RandomBabyTeams,
  default: () => teams_default
});
module.exports = __toCommonJS(teams_exports);
var import_teams = require("../gen9/teams");
var import_lib = require("../../../lib");
const CONTRARY_MOVES = [
  "armorcannon",
  "closecombat",
  "leafstorm",
  "makeitrain",
  "overheat",
  "spinout",
  "superpower",
  "vcreate"
];
const HAZARDS = [
  "spikes",
  "stealthrock",
  "stickyweb",
  "toxicspikes"
];
const PIVOT_MOVES = [
  "chillyreception",
  "flipturn",
  "partingshot",
  "shedtail",
  "teleport",
  "uturn",
  "voltswitch"
];
const PHYSICAL_SETUP = [
  "bellydrum",
  "bulkup",
  "coil",
  "curse",
  "dragondance",
  "honeclaws",
  "howl",
  "meditate",
  "poweruppunch",
  "swordsdance",
  "tidyup",
  "victorydance"
];
const RECOVERY_MOVES = [
  "healorder",
  "milkdrink",
  "moonlight",
  "morningsun",
  "recover",
  "roost",
  "shoreup",
  "slackoff",
  "softboiled",
  "strengthsap",
  "synthesis"
];
const SETUP = [
  "acidarmor",
  "agility",
  "autotomize",
  "bellydrum",
  "bulkup",
  "calmmind",
  "clangoroussoul",
  "coil",
  "cosmicpower",
  "curse",
  "dragondance",
  "flamecharge",
  "growth",
  "honeclaws",
  "howl",
  "irondefense",
  "meditate",
  "nastyplot",
  "noretreat",
  "poweruppunch",
  "quiverdance",
  "raindance",
  "rockpolish",
  "shellsmash",
  "shiftgear",
  "snowscape",
  "sunnyday",
  "swordsdance",
  "tailglow",
  "tidyup",
  "trailblaze",
  "workup",
  "victorydance"
];
const SPEED_SETUP = [
  "agility",
  "autotomize",
  "flamecharge",
  "rockpolish",
  "trailblaze"
];
const MOVE_PAIRS = [
  ["lightscreen", "reflect"],
  ["sleeptalk", "rest"],
  ["protect", "wish"]
];
class RandomBabyTeams extends import_teams.RandomTeams {
  constructor(format, prng) {
    super(format, prng);
    this.randomSets = require("./sets.json");
    this.moveEnforcementCheckers["Bug"] = (movePool, moves, abilities, types, counter) => !counter.get("Bug");
    this.moveEnforcementCheckers["Grass"] = (movePool, moves, abilities, types, counter, species) => !counter.get("Grass") && species.id !== "rowlet";
  }
  cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (moves.size + movePool.length <= this.maxMoveCount) return;
    if (moves.size === this.maxMoveCount - 2) {
      const unpairedMoves = [...movePool];
      for (const pair of MOVE_PAIRS) {
        if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
          this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[0]));
          this.fastPop(unpairedMoves, unpairedMoves.indexOf(pair[1]));
        }
      }
      if (unpairedMoves.length === 1) {
        this.fastPop(movePool, movePool.indexOf(unpairedMoves[0]));
      }
    }
    if (moves.size === this.maxMoveCount - 1) {
      for (const pair of MOVE_PAIRS) {
        if (movePool.includes(pair[0]) && movePool.includes(pair[1])) {
          this.fastPop(movePool, movePool.indexOf(pair[0]));
          this.fastPop(movePool, movePool.indexOf(pair[1]));
        }
      }
    }
    const statusMoves = this.cachedStatusMoves;
    if (teamDetails.screens && movePool.length >= this.maxMoveCount + 2) {
      if (movePool.includes("reflect")) this.fastPop(movePool, movePool.indexOf("reflect"));
      if (movePool.includes("lightscreen")) this.fastPop(movePool, movePool.indexOf("lightscreen"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.stickyWeb) {
      if (movePool.includes("stickyweb")) this.fastPop(movePool, movePool.indexOf("stickyweb"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.stealthRock) {
      if (movePool.includes("stealthrock")) this.fastPop(movePool, movePool.indexOf("stealthrock"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.defog || teamDetails.rapidSpin) {
      if (movePool.includes("defog")) this.fastPop(movePool, movePool.indexOf("defog"));
      if (movePool.includes("rapidspin")) this.fastPop(movePool, movePool.indexOf("rapidspin"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.toxicSpikes) {
      if (movePool.includes("toxicspikes")) this.fastPop(movePool, movePool.indexOf("toxicspikes"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.spikes && teamDetails.spikes >= 2) {
      if (movePool.includes("spikes")) this.fastPop(movePool, movePool.indexOf("spikes"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    const incompatiblePairs = [
      // These moves don't mesh well with other aspects of the set
      [SETUP, "defog"],
      [SETUP, PIVOT_MOVES],
      [SETUP, HAZARDS],
      [PHYSICAL_SETUP, PHYSICAL_SETUP],
      [statusMoves, ["destinybond", "healingwish", "switcheroo", "trick"]],
      ["curse", "rapidspin"],
      // These moves are redundant with each other
      [
        ["alluringvoice", "dazzlinggleam", "drainingkiss", "moonblast"],
        ["alluringvoice", "dazzlinggleam", "drainingkiss", "moonblast"]
      ],
      [["bulletseed", "gigadrain", "leafstorm", "seedbomb"], ["bulletseed", "gigadrain", "leafstorm", "seedbomb"]],
      [["hypnosis", "thunderwave", "toxic", "willowisp", "yawn"], ["hypnosis", "thunderwave", "toxic", "willowisp", "yawn"]],
      ["roar", "yawn"],
      ["dragonclaw", "outrage"],
      ["dracometeor", "dragonpulse"],
      ["toxic", "toxicspikes"],
      ["rockblast", "stoneedge"],
      ["bodyslam", "doubleedge"],
      ["gunkshot", "poisonjab"],
      [["hydropump", "liquidation"], "surf"],
      ["psychic", "psyshock"]
    ];
    for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
  }
  // Generate random moveset for a given species, role, tera type.
  randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role) {
    const moves = /* @__PURE__ */ new Set();
    let counter = this.queryMoves(moves, species, teraType, abilities);
    this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);
    if (movePool.length <= this.maxMoveCount) {
      for (const moveid of movePool) {
        moves.add(moveid);
      }
      return moves;
    }
    const runEnforcementChecker = (checkerName) => {
      if (!this.moveEnforcementCheckers[checkerName]) return false;
      return this.moveEnforcementCheckers[checkerName](
        movePool,
        moves,
        abilities,
        types,
        counter,
        species,
        teamDetails,
        isLead,
        isDoubles,
        teraType,
        role
      );
    };
    if (role === "Tera Blast user") {
      counter = this.addMove(
        "terablast",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (species.requiredMove) {
      const move = this.dex.moves.get(species.requiredMove).id;
      counter = this.addMove(
        move,
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (movePool.includes("facade") && abilities.includes("Guts")) {
      counter = this.addMove(
        "facade",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (movePool.includes("stickyweb")) {
      counter = this.addMove(
        "stickyweb",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (movePool.includes("knockoff") && role !== "Bulky Support") {
      counter = this.addMove(
        "knockoff",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
    }
    if (role === "Bulky Support" && !teamDetails.defog && !teamDetails.rapidSpin) {
      if (movePool.includes("rapidspin")) {
        counter = this.addMove(
          "rapidspin",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
      if (movePool.includes("defog")) {
        counter = this.addMove(
          "defog",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (types.length === 1 && (types.includes("Normal") || types.includes("Fighting"))) {
      if (movePool.includes("knockoff")) {
        counter = this.addMove(
          "knockoff",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (role === "Wallbreaker") {
      const priorityMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (types.includes(moveType) && (move.priority > 0 || moveid === "grassyglide" && abilities.includes("Grassy Surge")) && (move.basePower || move.basePowerCallback)) {
          priorityMoves.push(moveid);
        }
      }
      if (priorityMoves.length) {
        const moveid = this.sample(priorityMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    for (const type of types) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
          stabMoves.push(moveid);
        }
      }
      while (runEnforcementChecker(type)) {
        if (!stabMoves.length) break;
        const moveid = this.sampleNoReplace(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!counter.get("stabtera") && role !== "Bulky Support") {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && teraType === moveType) {
          stabMoves.push(moveid);
        }
      }
      if (stabMoves.length) {
        const moveid = this.sample(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!counter.get("stab")) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, teraType);
        if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && types.includes(moveType)) {
          stabMoves.push(moveid);
        }
      }
      if (stabMoves.length) {
        const moveid = this.sample(stabMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (abilities.includes("Contrary")) {
      const contraryMoves = movePool.filter((moveid) => CONTRARY_MOVES.includes(moveid));
      for (const moveid of contraryMoves) {
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (["Bulky Support", "Bulky Attacker", "Bulky Setup"].includes(role)) {
      const recoveryMoves = movePool.filter((moveid) => RECOVERY_MOVES.includes(moveid));
      if (recoveryMoves.length) {
        const moveid = this.sample(recoveryMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (role.includes("Setup") || role === "Tera Blast user") {
      const nonSpeedSetupMoves = movePool.filter((moveid) => SETUP.includes(moveid) && !SPEED_SETUP.includes(moveid));
      if (nonSpeedSetupMoves.length) {
        const moveid = this.sample(nonSpeedSetupMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      } else {
        const setupMoves = movePool.filter((moveid) => SETUP.includes(moveid));
        if (setupMoves.length) {
          const moveid = this.sample(setupMoves);
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    if (!counter.damagingMoves.size) {
      const attackingMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        if (!this.noStab.includes(moveid) && move.category !== "Status") attackingMoves.push(moveid);
      }
      if (attackingMoves.length) {
        const moveid = this.sample(attackingMoves);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          isDoubles,
          movePool,
          teraType,
          role
        );
      }
    }
    if (!["Fast Support", "Bulky Support"].includes(role) || species.id === "magnemite") {
      if (counter.damagingMoves.size === 1) {
        const currentAttackType = counter.damagingMoves.values().next().value.type;
        const coverageMoves = [];
        for (const moveid of movePool) {
          const move = this.dex.moves.get(moveid);
          const moveType = this.getMoveType(move, species, abilities, teraType);
          if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback)) {
            if (currentAttackType !== moveType) coverageMoves.push(moveid);
          }
        }
        if (coverageMoves.length) {
          const moveid = this.sample(coverageMoves);
          counter = this.addMove(
            moveid,
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    while (moves.size < this.maxMoveCount && movePool.length) {
      if (moves.size + movePool.length <= this.maxMoveCount) {
        for (const moveid2 of movePool) {
          moves.add(moveid2);
        }
        break;
      }
      const moveid = this.sample(movePool);
      counter = this.addMove(
        moveid,
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        isDoubles,
        movePool,
        teraType,
        role
      );
      for (const pair of MOVE_PAIRS) {
        if (moveid === pair[0] && movePool.includes(pair[1])) {
          counter = this.addMove(
            pair[1],
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
        if (moveid === pair[1] && movePool.includes(pair[0])) {
          counter = this.addMove(
            pair[0],
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            isDoubles,
            movePool,
            teraType,
            role
          );
        }
      }
    }
    return moves;
  }
  getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (abilities.length <= 1) return abilities[0];
    if (species.id === "rowlet" && counter.get("Grass")) return "Overgrow";
    if (species.id === "riolu") return moves.has("copycat") ? "Prankster" : "Inner Focus";
    if (species.id === "pikipek" && counter.get("skilllink")) return "Skill Link";
    if (species.id === "psyduck" && teamDetails.rain) return "Swift Swim";
    const abilityAllowed = [];
    for (const ability of abilities) {
      if (!this.shouldCullAbility(
        ability,
        types,
        moves,
        abilities,
        counter,
        teamDetails,
        species,
        isLead,
        isDoubles,
        teraType,
        role
      )) {
        abilityAllowed.push(ability);
      }
    }
    if (abilityAllowed.length >= 1) return this.sample(abilityAllowed);
    if (!abilityAllowed.length) {
      const weatherAbilities = abilities.filter(
        (a) => ["Chlorophyll", "Hydration", "Sand Force", "Sand Rush", "Slush Rush", "Solar Power", "Swift Swim"].includes(a)
      );
      if (weatherAbilities.length) return this.sample(weatherAbilities);
    }
    return this.sample(abilities);
  }
  getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (species.requiredItems) {
      return this.sample(species.requiredItems);
    }
    if (moves.has("focusenergy")) return "Scope Lens";
    if (moves.has("thief")) return "";
    if (moves.has("trick") || moves.has("switcheroo")) return "Choice Scarf";
    if (moves.has("acrobatics")) return ability === "Unburden" ? "Oran Berry" : "";
    if (moves.has("auroraveil") || moves.has("lightscreen") && moves.has("reflect")) return "Light Clay";
    if (ability === "Guts" && moves.has("facade")) return "Flame Orb";
    if (ability === "Quick Feet") return "Toxic Orb";
    if (["Harvest", "Ripen", "Unburden"].includes(ability) || moves.has("bellydrum")) return "Oran Berry";
  }
  getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role) {
    if (role === "Fast Attacker" && (!counter.get("Status") || counter.get("Status") === 1 && moves.has("destinybond"))) {
      return "Choice Scarf";
    }
    if (["Setup Sweeper", "Wallbreaker"].includes(role)) {
      return "Life Orb";
    }
    return "Eviolite";
  }
  getLevel(species) {
    if (this.adjustLevel) return this.adjustLevel;
    return this.randomSets[species.id]?.level || 10;
  }
  getForme(species) {
    if (typeof species.battleOnly === "string") {
      return species.battleOnly;
    }
    if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));
    if (["Poltchageist", "Sinistea"].includes(species.baseSpecies)) {
      return this.sample([species.name].concat(species.otherFormes));
    }
    return species.name;
  }
  randomSet(s, teamDetails = {}, isLead = false, isDoubles = false) {
    const species = this.dex.species.get(s);
    const forme = this.getForme(species);
    const sets = this.randomSets[species.id]["sets"];
    const possibleSets = [];
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    for (const set2 of sets) {
      if ((teamDetails.teraBlast || ruleTable.has("terastalclause")) && set2.role === "Tera Blast user") {
        continue;
      }
      possibleSets.push(set2);
    }
    const set = this.sampleIfArray(possibleSets);
    const role = set.role;
    const movePool = [];
    for (const movename of set.movepool) {
      movePool.push(this.dex.moves.get(movename).id);
    }
    const teraTypes = set.teraTypes;
    let teraType = this.sampleIfArray(teraTypes);
    let ability = "";
    let item = void 0;
    const evs = { hp: 85, atk: 85, def: 85, spa: 85, spd: 85, spe: 85 };
    const ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    const types = species.types;
    const abilities = set.abilities;
    const moves = this.randomMoveset(types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role);
    const counter = this.queryMoves(moves, species, teraType, abilities);
    ability = this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role);
    item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
    if (item === void 0) {
      item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
    }
    const level = this.getLevel(species);
    let hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
    let targetHP = hp;
    const minimumHP = Math.floor(Math.floor(2 * species.baseStats.hp + 100) * level / 100 + 10);
    if (item === "Life Orb") {
      targetHP = Math.floor(hp / 10) * 10 - 1;
    } else if (moves.has("bellydrum")) {
      targetHP = Math.floor(hp / 2) * 2;
    }
    if (hp > targetHP && hp - targetHP <= 3 && targetHP >= minimumHP) {
      if (Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + 100) * level / 100 + 10) >= targetHP) {
        evs.hp = 0;
        hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
        while (hp > targetHP) {
          ivs.hp -= 1;
          hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
        }
      } else {
        while (hp > targetHP) {
          evs.hp -= 4;
          hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
        }
      }
    }
    const noAttackStatMoves = [...moves].every((m) => {
      const move = this.dex.moves.get(m);
      if (move.damageCallback || move.damage) return true;
      if (move.id === "shellsidearm") return false;
      if (move.id === "terablast" && (species.id === "porygon" || species.baseStats.atk > species.baseStats.spa)) return false;
      return move.category !== "Physical" || move.id === "bodypress" || move.id === "foulplay";
    });
    if (noAttackStatMoves) {
      evs.atk = 0;
      ivs.atk = 0;
    }
    if (moves.has("gyroball") || moves.has("trickroom")) {
      evs.spe = 0;
      ivs.spe = 0;
    }
    if (this.forceTeraType) teraType = this.forceTeraType;
    const shuffledMoves = Array.from(moves);
    this.prng.shuffle(shuffledMoves);
    return {
      name: species.baseSpecies,
      species: forme,
      gender: species.gender,
      shiny: this.randomChance(1, 1024),
      level,
      moves: shuffledMoves,
      ability,
      evs,
      ivs,
      item,
      teraType,
      role
    };
  }
  randomBabyTeam() {
    this.enforceNoDirectCustomBanlistChanges();
    const seed = this.prng.getSeed();
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    const pokemon = [];
    const isMonotype = !!this.forceMonotype || ruleTable.has("sametypeclause");
    const typePool = this.dex.types.names().filter((name) => name !== "Stellar");
    const type = this.forceMonotype || this.sample(typePool);
    const baseFormes = /* @__PURE__ */ new Set();
    const typeCount = new import_lib.Utils.Multiset();
    const typeComboCount = new import_lib.Utils.Multiset();
    const typeWeaknesses = new import_lib.Utils.Multiset();
    const typeDoubleWeaknesses = new import_lib.Utils.Multiset();
    const teamDetails = {};
    const pokemonList = Object.keys(this.randomSets);
    const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
    while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
      const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
      const species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
      if (!species.exists) continue;
      if (baseFormes.has(species.baseSpecies)) continue;
      if (species.baseSpecies === "Zorua" && pokemon.length >= this.maxTeamSize - 1) continue;
      const types = species.types;
      const typeCombo = types.slice().sort().join();
      const weakToFreezeDry = this.dex.getEffectiveness("Ice", species) > 0 || this.dex.getEffectiveness("Ice", species) > -2 && types.includes("Water");
      const limitFactor = Math.round(this.maxTeamSize / 6) || 1;
      if (!isMonotype && !this.forceMonotype) {
        let skip = false;
        for (const typeName of types) {
          if (typeCount.get(typeName) >= 2 * limitFactor) {
            skip = true;
            break;
          }
        }
        if (skip) continue;
        for (const typeName of this.dex.types.names()) {
          if (this.dex.getEffectiveness(typeName, species) > 0) {
            if (typeWeaknesses.get(typeName) >= 3 * limitFactor) {
              skip = true;
              break;
            }
          }
          if (this.dex.getEffectiveness(typeName, species) > 1) {
            if (typeDoubleWeaknesses.get(typeName) >= limitFactor) {
              skip = true;
              break;
            }
          }
        }
        if (skip) continue;
        if (this.dex.getEffectiveness("Fire", species) === 0 && Object.values(species.abilities).filter((a) => ["Dry Skin", "Fluffy"].includes(a)).length && typeWeaknesses.get("Fire") >= 3 * limitFactor) continue;
        if (weakToFreezeDry) {
          if (typeWeaknesses.get("Freeze-Dry") >= 4 * limitFactor) continue;
        }
      }
      if (!this.forceMonotype && isMonotype && typeComboCount.get(typeCombo) >= 3 * limitFactor) continue;
      const set = this.randomSet(species, teamDetails, false, false);
      pokemon.push(set);
      if (pokemon.length === this.maxTeamSize) break;
      baseFormes.add(species.baseSpecies);
      for (const typeName of types) {
        typeCount.add(typeName);
      }
      typeComboCount.add(typeCombo);
      for (const typeName of this.dex.types.names()) {
        if (this.dex.getEffectiveness(typeName, species) > 0) {
          typeWeaknesses.add(typeName);
        }
        if (this.dex.getEffectiveness(typeName, species) > 1) {
          typeDoubleWeaknesses.add(typeName);
        }
      }
      if (["Dry Skin", "Fluffy"].includes(set.ability) && this.dex.getEffectiveness("Fire", species) === 0) {
        typeWeaknesses.add("Fire");
      }
      if (weakToFreezeDry) typeWeaknesses.add("Freeze-Dry");
      if (set.ability === "Drizzle" || set.moves.includes("raindance")) teamDetails.rain = 1;
      if (set.ability === "Drought" || set.moves.includes("sunnyday")) teamDetails.sun = 1;
      if (set.ability === "Sand Stream") teamDetails.sand = 1;
      if (set.ability === "Snow Warning" || set.moves.includes("snowscape") || set.moves.includes("chillyreception")) {
        teamDetails.snow = 1;
      }
      if (set.moves.includes("spikes")) {
        teamDetails.spikes = (teamDetails.spikes || 0) + 1;
      }
      if (set.moves.includes("stealthrock")) teamDetails.stealthRock = 1;
      if (set.moves.includes("stickyweb")) teamDetails.stickyWeb = 1;
      if (set.moves.includes("toxicspikes") || set.ability === "Toxic Debris") teamDetails.toxicSpikes = 1;
      if (set.moves.includes("defog")) teamDetails.defog = 1;
      if (set.moves.includes("rapidspin") || set.moves.includes("mortalspin")) teamDetails.rapidSpin = 1;
      if (set.moves.includes("auroraveil") || set.moves.includes("reflect") && set.moves.includes("lightscreen")) {
        teamDetails.screens = 1;
      }
      if (set.role === "Tera Blast user") {
        teamDetails.teraBlast = 1;
      }
    }
    if (pokemon.length < this.maxTeamSize && pokemon.length < 12 && !isMonotype) {
      throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
    }
    return pokemon;
  }
}
var teams_default = RandomBabyTeams;
//# sourceMappingURL=teams.js.map
