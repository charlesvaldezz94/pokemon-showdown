"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var teams_exports = {};
__export(teams_exports, {
  RandomGen2Teams: () => RandomGen2Teams,
  default: () => teams_default
});
module.exports = __toCommonJS(teams_exports);
var import_teams = __toESM(require("../gen3/teams"));
const RECOVERY_MOVES = [
  "milkdrink",
  "moonlight",
  "morningsun",
  "painsplit",
  "recover",
  "softboiled",
  "synthesis"
];
const PHYSICAL_SETUP = [
  "bellydrum",
  "curse",
  "meditate",
  "swordsdance"
];
const SETUP = [
  "agility",
  "bellydrum",
  "curse",
  "growth",
  "meditate",
  "raindance",
  "sunnyday",
  "swordsdance"
];
const NO_STAB = [
  "explosion",
  "icywind",
  "machpunch",
  "pursuit",
  "quickattack",
  "rapidspin",
  "selfdestruct",
  "skyattack",
  "thief"
];
const MOVE_PAIRS = [
  ["sleeptalk", "rest"],
  ["meanlook", "perishsong"]
];
class RandomGen2Teams extends import_teams.default {
  constructor(format, prng) {
    super(format, prng);
    this.randomSets = require("./sets.json");
    this.noStab = NO_STAB;
    this.moveEnforcementCheckers = {
      Electric: (movePool, moves, abilities, types, counter) => !counter.get("Electric"),
      Fire: (movePool, moves, abilities, types, counter) => !counter.get("Fire"),
      Flying: (movePool, moves, abilities, types, counter, species) => !counter.get("Flying") && ["gligar", "murkrow", "xatu"].includes(species.id),
      Ground: (movePool, moves, abilities, types, counter) => !counter.get("Ground"),
      Ice: (movePool, moves, abilities, types, counter) => !counter.get("Ice"),
      Normal: (movePool, moves, abilities, types, counter) => !counter.get("Normal"),
      Poison: (movePool, moves, abilities, types, counter) => !counter.get("Poison"),
      Psychic: (movePool, moves, abilities, types, counter, species) => !counter.get("Psychic") && species.id !== "starmie",
      Rock: (movePool, moves, abilities, types, counter, species) => !counter.get("Rock") && species.id !== "magcargo",
      Water: (movePool, moves, abilities, types, counter) => !counter.get("Water")
    };
  }
  cullMovePool(types, moves, abilities = {}, counter, movePool, teamDetails, species, isLead, preferredType, role) {
    let hasHiddenPower = false;
    for (const move of moves) {
      if (move.startsWith("hiddenpower")) hasHiddenPower = true;
    }
    if (hasHiddenPower) {
      let movePoolHasHiddenPower = true;
      while (movePoolHasHiddenPower) {
        movePoolHasHiddenPower = false;
        for (const moveid of movePool) {
          if (moveid.startsWith("hiddenpower")) {
            this.fastPop(movePool, movePool.indexOf(moveid));
            movePoolHasHiddenPower = true;
            break;
          }
        }
      }
    }
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
    if (teamDetails.spikes) {
      if (movePool.includes("spikes")) this.fastPop(movePool, movePool.indexOf("spikes"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.rapidSpin) {
      if (movePool.includes("rapidspin")) this.fastPop(movePool, movePool.indexOf("rapidspin"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (teamDetails.statusCure) {
      if (movePool.includes("healbell")) this.fastPop(movePool, movePool.indexOf("healbell"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    const incompatiblePairs = [
      // These moves don't mesh well with other aspects of the set
      [PHYSICAL_SETUP, PHYSICAL_SETUP],
      [SETUP, "haze"],
      ["bodyslam", "thunderwave"],
      [["stunspore", "thunderwave"], "toxic"],
      // These attacks are redundant with each other
      ["surf", "hydropump"],
      [["bodyslam", "return"], ["bodyslam", "doubleedge"]],
      ["fireblast", "flamethrower"],
      ["thunder", "thunderbolt"]
    ];
    for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
    if (!role.includes("Bulky")) this.incompatibleMoves(moves, movePool, ["rest", "sleeptalk"], "roar");
  }
  // Generate random moveset for a given species, role, preferred type.
  randomMoveset(types, abilities, teamDetails, species, isLead, movePool, preferredType, role) {
    const preferredTypes = preferredType ? preferredType.split(",") : [];
    const moves = /* @__PURE__ */ new Set();
    let counter = this.newQueryMoves(moves, species, preferredType, abilities);
    this.cullMovePool(
      types,
      moves,
      abilities,
      counter,
      movePool,
      teamDetails,
      species,
      isLead,
      preferredType,
      role
    );
    if (movePool.length <= this.maxMoveCount) {
      while (movePool.length) {
        const moveid = this.sample(movePool);
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          movePool,
          preferredType,
          role
        );
      }
      return moves;
    }
    const runEnforcementChecker = (checkerName) => {
      if (!this.moveEnforcementCheckers[checkerName]) return false;
      return this.moveEnforcementCheckers[checkerName](
        movePool,
        moves,
        abilities,
        new Set(types),
        counter,
        species,
        teamDetails
      );
    };
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
        movePool,
        preferredType,
        role
      );
    }
    for (const moveid of ["destinybond", "explosion", "present", "spikes", "spore"]) {
      if (movePool.includes(moveid)) {
        counter = this.addMove(
          moveid,
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          movePool,
          preferredType,
          role
        );
      }
    }
    if (movePool.includes("batonpass") && species.id === "smeargle") {
      counter = this.addMove(
        "batonpass",
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        movePool,
        preferredType,
        role
      );
    }
    for (const type of preferredTypes) {
      if (!counter.get(type)) {
        const stabMoves = [];
        for (const moveid of movePool) {
          const move = this.dex.moves.get(moveid);
          const moveType = this.getMoveType(move, species, abilities, preferredType);
          if (!this.noStab.includes(moveid) && (move.basePower || move.basePowerCallback) && type === moveType) {
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
            movePool,
            preferredType,
            role
          );
        }
      }
    }
    for (const type of types) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, preferredType);
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
          movePool,
          preferredType,
          role
        );
      }
    }
    if (!counter.get("stab")) {
      const stabMoves = [];
      for (const moveid of movePool) {
        const move = this.dex.moves.get(moveid);
        const moveType = this.getMoveType(move, species, abilities, preferredType);
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
          movePool,
          preferredType,
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
          movePool,
          preferredType,
          role
        );
      }
      if (movePool.includes("rest")) {
        counter = this.addMove(
          "rest",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          movePool,
          preferredType,
          role
        );
      }
      if (movePool.includes("sleeptalk")) {
        counter = this.addMove(
          "sleeptalk",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          movePool,
          preferredType,
          role
        );
      }
    }
    if (role.includes("Setup")) {
      const nonSpeedSetupMoves = movePool.filter((moveid) => SETUP.includes(moveid) && moveid !== "agility");
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
          movePool,
          preferredType,
          role
        );
      } else {
        if (movePool.includes("agility")) {
          counter = this.addMove(
            "agility",
            moves,
            types,
            abilities,
            teamDetails,
            species,
            isLead,
            movePool,
            preferredType,
            role
          );
        }
      }
    }
    if (role === "Thief user") {
      if (movePool.includes("thief")) {
        counter = this.addMove(
          "thief",
          moves,
          types,
          abilities,
          teamDetails,
          species,
          isLead,
          movePool,
          preferredType,
          role
        );
      }
    }
    if (!counter.damagingMoves.size && !moves.has("present")) {
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
          movePool,
          preferredType,
          role
        );
      }
    }
    if (["Fast Attacker", "Setup Sweeper", "Bulky Attacker"].includes(role)) {
      if (counter.damagingMoves.size === 1) {
        const currentAttackType = counter.damagingMoves.values().next().value.type;
        const coverageMoves = [];
        for (const moveid of movePool) {
          const move = this.dex.moves.get(moveid);
          const moveType = this.getMoveType(move, species, abilities, preferredType);
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
            movePool,
            preferredType,
            role
          );
        }
      }
    }
    while (moves.size < this.maxMoveCount && movePool.length) {
      const moveid = this.sample(movePool);
      counter = this.addMove(
        moveid,
        moves,
        types,
        abilities,
        teamDetails,
        species,
        isLead,
        movePool,
        preferredType,
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
            movePool,
            preferredType,
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
            movePool,
            preferredType,
            role
          );
        }
      }
    }
    return moves;
  }
  getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role) {
    if (species.id === "ditto") return "Metal Powder";
    if (species.id === "marowak") return "Thick Club";
    if (species.id === "pikachu") return "Light Ball";
    if (moves.has("thief")) return "";
    if (moves.has("flail")) return "Pink Bow";
    if (moves.has("reversal")) return "Black Belt";
    if (moves.has("rest") && !moves.has("sleeptalk") && !role.includes("Bulky")) return "Mint Berry";
    if (moves.has("bellydrum") && !counter.get("recovery") && this.randomChance(1, 2)) return "Miracle Berry";
    return "Leftovers";
  }
  randomSet(species, teamDetails = {}, isLead = false) {
    species = this.dex.species.get(species);
    const forme = this.getForme(species);
    const sets = this.randomSets[species.id]["sets"];
    const set = this.sampleIfArray(sets);
    const role = set.role;
    const movePool = Array.from(set.movepool);
    const preferredTypes = set.preferredTypes;
    const preferredType = preferredTypes ? preferredTypes.join() : "";
    const ability = "";
    let item = void 0;
    const evs = { hp: 255, atk: 255, def: 255, spa: 255, spd: 255, spe: 255 };
    const ivs = { hp: 30, atk: 30, def: 30, spa: 30, spd: 30, spe: 30 };
    const types = species.types;
    const abilities = [];
    const moves = this.randomMoveset(
      types,
      abilities,
      teamDetails,
      species,
      isLead,
      movePool,
      preferredType,
      role
    );
    const counter = this.newQueryMoves(moves, species, preferredType, abilities);
    item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, preferredType, role);
    const level = this.getLevel(species);
    let hasHiddenPower = false;
    for (const move of moves) {
      if (move.startsWith("hiddenpower")) hasHiddenPower = true;
    }
    if (hasHiddenPower) {
      let hpType;
      for (const move of moves) {
        if (move.startsWith("hiddenpower")) hpType = move.substr(11);
      }
      if (!hpType) throw new Error(`hasHiddenPower is true, but no Hidden Power move was found.`);
      const hpIVs = {
        dragon: { def: 28 },
        ice: { def: 26 },
        psychic: { def: 24 },
        electric: { atk: 28 },
        grass: { atk: 28, def: 28 },
        water: { atk: 28, def: 26 },
        fire: { atk: 28, def: 24 },
        steel: { atk: 26 },
        ghost: { atk: 26, def: 28 },
        bug: { atk: 26, def: 26 },
        rock: { atk: 26, def: 24 },
        ground: { atk: 24 },
        poison: { atk: 24, def: 28 },
        flying: { atk: 24, def: 26 },
        fighting: { atk: 24, def: 24 }
      };
      let iv;
      for (iv in hpIVs[hpType]) {
        ivs[iv] = hpIVs[hpType][iv];
      }
      if (ivs.atk === 28 || ivs.atk === 24) ivs.hp = 14;
      if (ivs.def === 28 || ivs.def === 24) ivs.hp -= 8;
    }
    while (evs.hp > 1) {
      const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
      if (moves.has("substitute") && item !== "Leftovers") {
        if (hp % 4 > 0) break;
      } else if (moves.has("bellydrum") && item !== "Leftovers") {
        if (hp % 2 === 0) break;
      } else {
        break;
      }
      evs.hp -= 4;
    }
    const shuffledMoves = Array.from(moves);
    this.prng.shuffle(shuffledMoves);
    return {
      name: species.baseSpecies,
      species: forme,
      level,
      moves: shuffledMoves,
      ability: "No Ability",
      evs,
      ivs,
      item,
      role,
      // No shiny chance because Gen 2 shinies have bad IVs
      shiny: false,
      gender: species.gender ? species.gender : "M"
    };
  }
}
var teams_default = RandomGen2Teams;
//# sourceMappingURL=teams.js.map
