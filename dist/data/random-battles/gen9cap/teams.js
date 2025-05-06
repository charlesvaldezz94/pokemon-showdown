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
  RandomCAPTeams: () => RandomCAPTeams,
  default: () => teams_default
});
module.exports = __toCommonJS(teams_exports);
var import_teams = require("../gen9/teams");
const NO_LEAD_POKEMON = [
  "Zacian",
  "Zamazenta"
];
class RandomCAPTeams extends import_teams.RandomTeams {
  constructor() {
    super(...arguments);
    this.randomCAPSets = require("./sets.json");
  }
  getCAPAbility(types, moves, abilities, counter, teamDetails, species, isLead, teraType, role) {
    if (species.id === "fidgit") return moves.has("tailwind") ? "Persistent" : "Frisk";
    if (species.id === "tomohawk") return moves.has("haze") ? "Prankster" : "Intimidate";
    return this.getAbility(types, moves, abilities, counter, teamDetails, species, isLead, false, teraType, role);
  }
  getCAPPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role) {
    if (ability === "Mountaineer") return "Life Orb";
  }
  getLevel(species, isDoubles) {
    if (this.adjustLevel) return this.adjustLevel;
    return (species.num > 0 ? this.randomSets[species.id]["level"] : this.randomCAPSets[species.id]["level"]) || 80;
  }
  randomCAPSet(s, teamDetails = {}, isLead = false, isDoubles = false) {
    const species = this.dex.species.get(s);
    if (species.num > 0) return this.randomSet(s, teamDetails, isLead, isDoubles);
    const forme = this.getForme(species);
    const sets = this.randomCAPSets[species.id]["sets"];
    const possibleSets = [];
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    for (const set2 of sets) {
      const abilities2 = new Set(Object.values(species.abilities));
      if (isLead && (abilities2.has("Protosynthesis") || abilities2.has("Quark Drive")) && set2.role === "Fast Bulky Setup") {
        continue;
      }
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
    ability = this.getCAPAbility(types, moves, abilities, counter, teamDetails, species, isLead, teraType, role);
    item = this.getCAPPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
    if (item === void 0) {
      item = this.getPriorityItem(ability, types, moves, counter, teamDetails, species, isLead, isDoubles, teraType, role);
    }
    if (item === void 0) {
      item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
    }
    const level = this.getLevel(species, isDoubles);
    const srImmunity = ability === "Magic Guard" || item === "Heavy-Duty Boots";
    let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness("Rock", species);
    if (["axekick", "highjumpkick", "jumpkick"].some((m) => moves.has(m))) srWeakness = 2;
    while (evs.hp > 1) {
      const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
      if (moves.has("substitute") && ["Sitrus Berry", "Salac Berry"].includes(item)) {
        if (hp % 4 === 0) break;
      } else if ((moves.has("bellydrum") || moves.has("filletaway")) && (item === "Sitrus Berry" || ability === "Gluttony")) {
        if (hp % 2 === 0) break;
      } else if (moves.has("substitute") && moves.has("endeavor")) {
        if (hp % 4 > 0) break;
      } else {
        if (srWeakness <= 0 || ability === "Regenerator" || ["Leftovers", "Life Orb"].includes(item)) break;
        if (item !== "Sitrus Berry" && hp % (4 / srWeakness) > 0) break;
        if (item === "Sitrus Berry" && hp % (4 / srWeakness) === 0) break;
      }
      evs.hp -= 4;
    }
    const noAttackStatMoves = [...moves].every((m) => {
      const move = this.dex.moves.get(m);
      if (move.damageCallback || move.damage) return true;
      if (move.id === "shellsidearm") return false;
      if (move.id === "terablast" && (species.id === "porygon2" || moves.has("shiftgear") || species.baseStats.atk > species.baseStats.spa)) return false;
      return move.category !== "Physical" || move.id === "bodypress" || move.id === "foulplay";
    });
    if (noAttackStatMoves && !moves.has("transform") && this.format.mod !== "partnersincrime") {
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
      gender: species.baseSpecies === "Greninja" ? "M" : species.gender,
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
  randomTeam() {
    this.enforceNoDirectCustomBanlistChanges();
    const seed = this.prng.getSeed();
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    const pokemon = [];
    const isMonotype = !!this.forceMonotype || ruleTable.has("sametypeclause");
    const isDoubles = false;
    const typePool = this.dex.types.names().filter((name) => name !== "Stellar");
    const type = this.forceMonotype || this.sample(typePool);
    const baseFormes = {};
    const typeCount = {};
    const typeComboCount = {};
    const typeWeaknesses = {};
    const typeDoubleWeaknesses = {};
    const teamDetails = {};
    let numMaxLevelPokemon = 0;
    const pokemonList = Object.keys(this.randomSets);
    const capPokemonList = Object.keys(this.randomCAPSets);
    const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
    const [capPokemonPool, capBaseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, capPokemonList);
    let leadsRemaining = 1;
    while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
      let baseSpecies, species;
      if ((pokemon.length === 1 || this.randomChance(1, 5)) && capBaseSpeciesPool.length) {
        baseSpecies = this.sampleNoReplace(capBaseSpeciesPool);
        species = this.dex.species.get(this.sample(capPokemonPool[baseSpecies]));
      } else {
        baseSpecies = this.sampleNoReplace(baseSpeciesPool);
        species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
      }
      if (!species.exists) continue;
      if (baseFormes[species.baseSpecies]) continue;
      if ((species.baseSpecies === "Ogerpon" || species.baseSpecies === "Terapagos") && teamDetails.teraBlast) continue;
      if (species.baseSpecies === "Zoroark" && pokemon.length >= this.maxTeamSize - 1) continue;
      const types = species.types;
      const typeCombo = types.slice().sort().join();
      const weakToFreezeDry = this.dex.getEffectiveness("Ice", species) > 0 || this.dex.getEffectiveness("Ice", species) > -2 && types.includes("Water");
      const limitFactor = Math.round(this.maxTeamSize / 6) || 1;
      if (!isMonotype && !this.forceMonotype) {
        let skip = false;
        for (const typeName of types) {
          if (typeCount[typeName] >= 2 * limitFactor) {
            skip = true;
            break;
          }
        }
        if (skip) continue;
        for (const typeName of this.dex.types.names()) {
          if (this.dex.getEffectiveness(typeName, species) > 0) {
            if (!typeWeaknesses[typeName]) typeWeaknesses[typeName] = 0;
            if (typeWeaknesses[typeName] >= 3 * limitFactor) {
              skip = true;
              break;
            }
          }
          if (this.dex.getEffectiveness(typeName, species) > 1) {
            if (!typeDoubleWeaknesses[typeName]) typeDoubleWeaknesses[typeName] = 0;
            if (typeDoubleWeaknesses[typeName] >= limitFactor) {
              skip = true;
              break;
            }
          }
        }
        if (skip) continue;
        if (this.dex.getEffectiveness("Fire", species) === 0 && Object.values(species.abilities).filter((a) => ["Dry Skin", "Fluffy"].includes(a)).length) {
          if (!typeWeaknesses["Fire"]) typeWeaknesses["Fire"] = 0;
          if (typeWeaknesses["Fire"] >= 3 * limitFactor) continue;
        }
        if (weakToFreezeDry) {
          if (!typeWeaknesses["Freeze-Dry"]) typeWeaknesses["Freeze-Dry"] = 0;
          if (typeWeaknesses["Freeze-Dry"] >= 4 * limitFactor) continue;
        }
        if (!this.adjustLevel && this.getLevel(species, isDoubles) === 100 && numMaxLevelPokemon >= limitFactor) {
          continue;
        }
      }
      if (!this.forceMonotype && isMonotype && typeComboCount[typeCombo] >= 3 * limitFactor) continue;
      let set;
      if (leadsRemaining) {
        if (NO_LEAD_POKEMON.includes(species.baseSpecies)) {
          if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
          set = this.randomCAPSet(species, teamDetails, false, isDoubles);
          pokemon.push(set);
        } else {
          set = this.randomCAPSet(species, teamDetails, true, isDoubles);
          pokemon.unshift(set);
          leadsRemaining--;
        }
      } else {
        set = this.randomCAPSet(species, teamDetails, false, isDoubles);
        pokemon.push(set);
      }
      if (pokemon.length === this.maxTeamSize) break;
      baseFormes[species.baseSpecies] = 1;
      for (const typeName of types) {
        if (typeName in typeCount) {
          typeCount[typeName]++;
        } else {
          typeCount[typeName] = 1;
        }
      }
      if (typeCombo in typeComboCount) {
        typeComboCount[typeCombo]++;
      } else {
        typeComboCount[typeCombo] = 1;
      }
      for (const typeName of this.dex.types.names()) {
        if (this.dex.getEffectiveness(typeName, species) > 0) {
          typeWeaknesses[typeName]++;
        }
        if (this.dex.getEffectiveness(typeName, species) > 1) {
          typeDoubleWeaknesses[typeName]++;
        }
      }
      if (["Dry Skin", "Fluffy"].includes(set.ability) && this.dex.getEffectiveness("Fire", species) === 0) {
        typeWeaknesses["Fire"]++;
      }
      if (weakToFreezeDry) typeWeaknesses["Freeze-Dry"]++;
      if (set.level === 100) numMaxLevelPokemon++;
      if (set.ability === "Drizzle" || set.moves.includes("raindance")) teamDetails.rain = 1;
      if (set.ability === "Drought" || set.ability === "Orichalcum Pulse" || set.moves.includes("sunnyday")) {
        teamDetails.sun = 1;
      }
      if (set.ability === "Sand Stream") teamDetails.sand = 1;
      if (set.ability === "Snow Warning" || set.moves.includes("snowscape") || set.moves.includes("chillyreception")) {
        teamDetails.snow = 1;
      }
      if (set.moves.includes("healbell")) teamDetails.statusCure = 1;
      if (set.moves.includes("spikes") || set.moves.includes("ceaselessedge")) {
        teamDetails.spikes = (teamDetails.spikes || 0) + 1;
      }
      if (set.moves.includes("toxicspikes") || set.ability === "Toxic Debris") teamDetails.toxicSpikes = 1;
      if (set.moves.includes("stealthrock") || set.moves.includes("stoneaxe")) teamDetails.stealthRock = 1;
      if (set.moves.includes("stickyweb")) teamDetails.stickyWeb = 1;
      if (set.moves.includes("defog")) teamDetails.defog = 1;
      if (set.moves.includes("rapidspin") || set.moves.includes("mortalspin")) teamDetails.rapidSpin = 1;
      if (set.moves.includes("auroraveil") || set.moves.includes("reflect") && set.moves.includes("lightscreen")) {
        teamDetails.screens = 1;
      }
      if (set.role === "Tera Blast user" || species.baseSpecies === "Ogerpon" || species.baseSpecies === "Terapagos") {
        teamDetails.teraBlast = 1;
      }
    }
    if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
      throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
    }
    return pokemon;
  }
}
var teams_default = RandomCAPTeams;
//# sourceMappingURL=teams.js.map
