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
  MoveCounter: () => MoveCounter,
  RandomTeams: () => RandomTeams,
  default: () => teams_default
});
module.exports = __toCommonJS(teams_exports);
var import_dex = require("../../../sim/dex");
var import_lib = require("../../../lib");
var import_prng = require("../../../sim/prng");
var import_tags = require("./../../tags");
var import_teams = require("../../../sim/teams");
class MoveCounter extends import_lib.Utils.Multiset {
  constructor() {
    super();
    this.damagingMoves = /* @__PURE__ */ new Set();
  }
}
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
const SPECIAL_SETUP = [
  "calmmind",
  "chargebeam",
  "geomancy",
  "nastyplot",
  "quiverdance",
  "tailglow",
  "takeheart",
  "torchsong"
];
const MIXED_SETUP = [
  "clangoroussoul",
  "growth",
  "happyhour",
  "holdhands",
  "noretreat",
  "shellsmash",
  "workup"
];
const SPEED_SETUP = [
  "agility",
  "autotomize",
  "flamecharge",
  "rockpolish",
  "snowscape",
  "trailblaze"
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
  "rockpolish",
  "shellsmash",
  "shiftgear",
  "swordsdance",
  "tailglow",
  "takeheart",
  "tidyup",
  "trailblaze",
  "workup",
  "victorydance"
];
const SPEED_CONTROL = [
  "electroweb",
  "glare",
  "icywind",
  "lowsweep",
  "nuzzle",
  "quash",
  "tailwind",
  "thunderwave",
  "trickroom"
];
const NO_STAB = [
  "accelerock",
  "aquajet",
  "bounce",
  "breakingswipe",
  "bulletpunch",
  "chatter",
  "chloroblast",
  "clearsmog",
  "covet",
  "dragontail",
  "doomdesire",
  "electroweb",
  "eruption",
  "explosion",
  "fakeout",
  "feint",
  "flamecharge",
  "flipturn",
  "futuresight",
  "grassyglide",
  "iceshard",
  "icywind",
  "incinerate",
  "infestation",
  "machpunch",
  "meteorbeam",
  "mortalspin",
  "nuzzle",
  "pluck",
  "pursuit",
  "quickattack",
  "rapidspin",
  "reversal",
  "selfdestruct",
  "shadowsneak",
  "skydrop",
  "snarl",
  "strugglebug",
  "suckerpunch",
  "uturn",
  "vacuumwave",
  "voltswitch",
  "watershuriken",
  "waterspout"
];
const HAZARDS = [
  "spikes",
  "stealthrock",
  "stickyweb",
  "toxicspikes"
];
const PROTECT_MOVES = [
  "banefulbunker",
  "burningbulwark",
  "protect",
  "silktrap",
  "spikyshield"
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
const MOVE_PAIRS = [
  ["lightscreen", "reflect"],
  ["sleeptalk", "rest"],
  ["protect", "wish"],
  ["leechseed", "protect"],
  ["leechseed", "substitute"]
];
const PRIORITY_POKEMON = [
  "breloom",
  "brutebonnet",
  "cacturne",
  "honchkrow",
  "mimikyu",
  "ragingbolt",
  "scizor"
];
const NO_LEAD_POKEMON = [
  "Zacian",
  "Zamazenta"
];
const DOUBLES_NO_LEAD_POKEMON = [
  "Basculegion",
  "Houndstone",
  "Iron Bundle",
  "Roaring Moon",
  "Zacian",
  "Zamazenta"
];
const DEFENSIVE_TERA_BLAST_USERS = [
  "alcremie",
  "bellossom",
  "comfey",
  "fezandipiti",
  "florges",
  "raikou"
];
function sereneGraceBenefits(move) {
  return move.secondary?.chance && move.secondary.chance > 20 && move.secondary.chance < 100;
}
class RandomTeams {
  constructor(format, prng) {
    this.randomSets = require("./sets.json");
    this.randomDoublesSets = require("./doubles-sets.json");
    this.randomFactorySets = require("./factory-sets.json");
    this.randomBSSFactorySets = require("./bss-factory-sets.json");
    this.randomDraftFactoryMatchups = require("./draft-factory-matchups.json").matchups;
    this.rdfMatchupIndex = -1;
    this.rdfMatchupSide = -1;
    format = import_dex.Dex.formats.get(format);
    this.dex = import_dex.Dex.forFormat(format);
    this.gen = this.dex.gen;
    this.noStab = NO_STAB;
    const ruleTable = import_dex.Dex.formats.getRuleTable(format);
    this.maxTeamSize = ruleTable.maxTeamSize;
    this.adjustLevel = ruleTable.adjustLevel;
    this.maxMoveCount = ruleTable.maxMoveCount;
    const forceMonotype = ruleTable.valueRules.get("forcemonotype");
    this.forceMonotype = forceMonotype && this.dex.types.get(forceMonotype).exists ? this.dex.types.get(forceMonotype).name : void 0;
    const forceTeraType = ruleTable.valueRules.get("forceteratype");
    this.forceTeraType = forceTeraType && this.dex.types.get(forceTeraType).exists ? this.dex.types.get(forceTeraType).name : void 0;
    this.factoryTier = "";
    this.format = format;
    this.prng = import_prng.PRNG.get(prng);
    this.moveEnforcementCheckers = {
      Bug: (movePool, moves, abilities, types, counter) => movePool.includes("megahorn") || movePool.includes("xscissor") || !counter.get("Bug") && (types.includes("Electric") || types.includes("Psychic")),
      Dark: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles, teraType, role) => {
        if (counter.get("Dark") < 2 && PRIORITY_POKEMON.includes(species.id) && role === "Wallbreaker") return true;
        return !counter.get("Dark");
      },
      Dragon: (movePool, moves, abilities, types, counter) => !counter.get("Dragon"),
      Electric: (movePool, moves, abilities, types, counter) => !counter.get("Electric"),
      Fairy: (movePool, moves, abilities, types, counter) => !counter.get("Fairy"),
      Fighting: (movePool, moves, abilities, types, counter) => !counter.get("Fighting"),
      Fire: (movePool, moves, abilities, types, counter, species) => !counter.get("Fire"),
      Flying: (movePool, moves, abilities, types, counter) => !counter.get("Flying"),
      Ghost: (movePool, moves, abilities, types, counter) => !counter.get("Ghost"),
      Grass: (movePool, moves, abilities, types, counter, species) => !counter.get("Grass") && (movePool.includes("leafstorm") || species.baseStats.atk >= 100 || types.includes("Electric") || abilities.includes("Seed Sower")),
      Ground: (movePool, moves, abilities, types, counter) => !counter.get("Ground"),
      Ice: (movePool, moves, abilities, types, counter) => movePool.includes("freezedry") || movePool.includes("blizzard") || !counter.get("Ice"),
      Normal: (movePool, moves, types, counter) => movePool.includes("boomburst") || movePool.includes("hypervoice"),
      Poison: (movePool, moves, abilities, types, counter) => {
        if (types.includes("Ground")) return false;
        return !counter.get("Poison");
      },
      Psychic: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => {
        if ((isDoubles || species.id === "bruxish") && movePool.includes("psychicfangs")) return true;
        if (species.id === "hoopaunbound" && movePool.includes("psychic")) return true;
        if (["Dark", "Steel", "Water"].some((m) => types.includes(m))) return false;
        return !counter.get("Psychic");
      },
      Rock: (movePool, moves, abilities, types, counter, species) => !counter.get("Rock") && species.baseStats.atk >= 80,
      Steel: (movePool, moves, abilities, types, counter, species, teamDetails, isLead, isDoubles) => !counter.get("Steel") && (isDoubles || species.baseStats.atk >= 90 || movePool.includes("gigatonhammer") || movePool.includes("makeitrain")),
      Water: (movePool, moves, abilities, types, counter) => !counter.get("Water") && !types.includes("Ground")
    };
    this.poolsCacheKey = void 0;
    this.cachedPool = void 0;
    this.cachedSpeciesPool = void 0;
    this.cachedStatusMoves = this.dex.moves.all().filter((move) => move.category === "Status").map((move) => move.id);
  }
  setSeed(prng) {
    this.prng = import_prng.PRNG.get(prng);
  }
  getTeam(options = null) {
    const generatorName = typeof this.format.team === "string" && this.format.team.startsWith("random") ? this.format.team + "Team" : "";
    return this[generatorName || "randomTeam"](options);
  }
  randomChance(numerator, denominator) {
    return this.prng.randomChance(numerator, denominator);
  }
  sample(items) {
    return this.prng.sample(items);
  }
  sampleIfArray(item) {
    if (Array.isArray(item)) {
      return this.sample(item);
    }
    return item;
  }
  random(m, n) {
    return this.prng.random(m, n);
  }
  /**
   * Remove an element from an unsorted array significantly faster
   * than .splice
   */
  fastPop(list, index) {
    const length = list.length;
    if (index < 0 || index >= list.length) {
      throw new Error(`Index ${index} out of bounds for given array`);
    }
    const element = list[index];
    list[index] = list[length - 1];
    list.pop();
    return element;
  }
  /**
   * Remove a random element from an unsorted array and return it.
   * Uses the battle's RNG if in a battle.
   */
  sampleNoReplace(list) {
    const length = list.length;
    if (length === 0) return null;
    const index = this.random(length);
    return this.fastPop(list, index);
  }
  /**
   * Removes n random elements from an unsorted array and returns them.
   * If n is less than the array's length, randomly removes and returns all the elements
   * in the array (so the returned array could have length < n).
   */
  multipleSamplesNoReplace(list, n) {
    const samples = [];
    while (samples.length < n && list.length) {
      samples.push(this.sampleNoReplace(list));
    }
    return samples;
  }
  /**
   * Check if user has directly tried to ban/unban/restrict things in a custom battle.
   * Doesn't count bans nested inside other formats/rules.
   */
  hasDirectCustomBanlistChanges() {
    if (this.format.ruleTable?.has("+pokemontag:cap")) return false;
    if (this.format.banlist.length || this.format.restricted.length || this.format.unbanlist.length) return true;
    if (!this.format.customRules) return false;
    for (const rule of this.format.customRules) {
      for (const banlistOperator of ["-", "+", "*"]) {
        if (rule.startsWith(banlistOperator)) return true;
      }
    }
    return false;
  }
  /**
   * Inform user when custom bans are unsupported in a team generator.
   */
  enforceNoDirectCustomBanlistChanges() {
    if (this.hasDirectCustomBanlistChanges()) {
      throw new Error(`Custom bans are not currently supported in ${this.format.name}.`);
    }
  }
  /**
   * Inform user when complex bans are unsupported in a team generator.
   */
  enforceNoDirectComplexBans() {
    if (!this.format.customRules) return false;
    for (const rule of this.format.customRules) {
      if (rule.includes("+") && !rule.startsWith("+")) {
        throw new Error(`Complex bans are not currently supported in ${this.format.name}.`);
      }
    }
  }
  /**
   * Validate set element pool size is sufficient to support size requirements after simple bans.
   */
  enforceCustomPoolSizeNoComplexBans(effectTypeName, basicEffectPool, requiredCount, requiredCountExplanation) {
    if (basicEffectPool.length >= requiredCount) return;
    throw new Error(`Legal ${effectTypeName} count is insufficient to support ${requiredCountExplanation} (${basicEffectPool.length} / ${requiredCount}).`);
  }
  queryMoves(moves, species, teraType, abilities) {
    const counter = new MoveCounter();
    const types = species.types;
    if (!moves?.size) return counter;
    const categories = { Physical: 0, Special: 0, Status: 0 };
    for (const moveid of moves) {
      const move = this.dex.moves.get(moveid);
      const moveType = this.getMoveType(move, species, abilities, teraType);
      if (move.damage || move.damageCallback) {
        counter.add("damage");
        counter.damagingMoves.add(move);
      } else {
        categories[move.category]++;
      }
      if (moveid === "lowkick" || move.basePower && move.basePower <= 60 && moveid !== "rapidspin") {
        counter.add("technician");
      }
      if (move.multihit && Array.isArray(move.multihit) && move.multihit[1] === 5) counter.add("skilllink");
      if (move.recoil || move.hasCrashDamage) counter.add("recoil");
      if (move.drain) counter.add("drain");
      if (move.basePower || move.basePowerCallback) {
        if (!this.noStab.includes(moveid) || PRIORITY_POKEMON.includes(species.id) && move.priority > 0) {
          counter.add(moveType);
          if (types.includes(moveType)) counter.add("stab");
          if (teraType === moveType) counter.add("stabtera");
          counter.damagingMoves.add(move);
        }
        if (move.flags["bite"]) counter.add("strongjaw");
        if (move.flags["punch"]) counter.add("ironfist");
        if (move.flags["sound"]) counter.add("sound");
        if (move.priority > 0 || moveid === "grassyglide" && abilities.includes("Grassy Surge")) {
          counter.add("priority");
        }
      }
      if (move.secondary || move.hasSheerForce) {
        counter.add("sheerforce");
        if (sereneGraceBenefits(move)) {
          counter.add("serenegrace");
        }
      }
      if (move.accuracy && move.accuracy !== true && move.accuracy < 90) counter.add("inaccurate");
      if (RECOVERY_MOVES.includes(moveid)) counter.add("recovery");
      if (CONTRARY_MOVES.includes(moveid)) counter.add("contrary");
      if (PHYSICAL_SETUP.includes(moveid)) counter.add("physicalsetup");
      if (SPECIAL_SETUP.includes(moveid)) counter.add("specialsetup");
      if (MIXED_SETUP.includes(moveid)) counter.add("mixedsetup");
      if (SPEED_SETUP.includes(moveid)) counter.add("speedsetup");
      if (SETUP.includes(moveid)) counter.add("setup");
      if (HAZARDS.includes(moveid)) counter.add("hazards");
    }
    counter.set("Physical", Math.floor(categories["Physical"]));
    counter.set("Special", Math.floor(categories["Special"]));
    counter.set("Status", categories["Status"]);
    return counter;
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
    if (teamDetails.screens) {
      if (movePool.includes("auroraveil")) this.fastPop(movePool, movePool.indexOf("auroraveil"));
      if (movePool.length >= this.maxMoveCount + 2) {
        if (movePool.includes("reflect")) this.fastPop(movePool, movePool.indexOf("reflect"));
        if (movePool.includes("lightscreen")) this.fastPop(movePool, movePool.indexOf("lightscreen"));
      }
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
    if (teamDetails.statusCure) {
      if (movePool.includes("healbell")) this.fastPop(movePool, movePool.indexOf("healbell"));
      if (moves.size + movePool.length <= this.maxMoveCount) return;
    }
    if (isDoubles) {
      const doublesIncompatiblePairs = [
        // In order of decreasing generalizability
        [SPEED_CONTROL, SPEED_CONTROL],
        [HAZARDS, HAZARDS],
        ["rockslide", "stoneedge"],
        [SETUP, ["fakeout", "helpinghand"]],
        [PROTECT_MOVES, "wideguard"],
        [["fierydance", "fireblast"], "heatwave"],
        ["dazzlinggleam", ["fleurcannon", "moonblast"]],
        ["poisongas", ["toxicspikes", "willowisp"]],
        [RECOVERY_MOVES, ["healpulse", "lifedew"]],
        ["healpulse", "lifedew"],
        ["haze", "icywind"],
        [["hydropump", "muddywater"], ["muddywater", "scald"]],
        ["disable", "encore"],
        ["freezedry", "icebeam"],
        ["energyball", "leafstorm"],
        ["earthpower", "sandsearstorm"],
        ["coaching", ["helpinghand", "howl"]]
      ];
      for (const pair of doublesIncompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
      if (role !== "Offensive Protect") this.incompatibleMoves(moves, movePool, PROTECT_MOVES, ["flipturn", "uturn"]);
    }
    const incompatiblePairs = [
      // These moves don't mesh well with other aspects of the set
      [statusMoves, ["healingwish", "switcheroo", "trick"]],
      [SETUP, PIVOT_MOVES],
      [SETUP, HAZARDS],
      [SETUP, ["defog", "nuzzle", "toxic", "yawn", "haze"]],
      [PHYSICAL_SETUP, PHYSICAL_SETUP],
      [SPECIAL_SETUP, "thunderwave"],
      ["substitute", PIVOT_MOVES],
      [SPEED_SETUP, ["aquajet", "rest", "trickroom"]],
      ["curse", ["irondefense", "rapidspin"]],
      ["dragondance", "dracometeor"],
      ["yawn", "roar"],
      ["trick", "uturn"],
      // These attacks are redundant with each other
      [["psychic", "psychicnoise"], ["psyshock", "psychicnoise"]],
      ["surf", "hydropump"],
      ["liquidation", "wavecrash"],
      ["aquajet", "flipturn"],
      ["gigadrain", "leafstorm"],
      ["powerwhip", "hornleech"],
      ["airslash", "hurricane"],
      ["knockoff", "foulplay"],
      ["throatchop", ["crunch", "lashout"]],
      ["doubleedge", ["bodyslam", "headbutt"]],
      ["fireblast", ["fierydance", "flamethrower"]],
      ["lavaplume", "magmastorm"],
      ["thunderpunch", "wildcharge"],
      ["thunderbolt", "discharge"],
      ["gunkshot", ["direclaw", "poisonjab", "sludgebomb"]],
      ["aurasphere", "focusblast"],
      ["closecombat", "drainpunch"],
      [["dragonpulse", "spacialrend"], "dracometeor"],
      ["heavyslam", "flashcannon"],
      ["alluringvoice", "dazzlinggleam"],
      // These status moves are redundant with each other
      ["taunt", "disable"],
      [["thunderwave", "toxic"], ["thunderwave", "willowisp"]],
      [["thunderwave", "toxic", "willowisp"], "toxicspikes"],
      // This space reserved for assorted hardcodes that otherwise make little sense out of context
      // Landorus and Thundurus
      ["nastyplot", ["rockslide", "knockoff"]],
      // Persian
      ["switcheroo", "fakeout"],
      // Amoonguss, though this can work well as a general rule later
      ["toxic", "clearsmog"],
      // Chansey and Blissey
      ["healbell", "stealthrock"],
      // Araquanid and Magnezone
      ["mirrorcoat", ["hydropump", "bodypress"]]
    ];
    for (const pair of incompatiblePairs) this.incompatibleMoves(moves, movePool, pair[0], pair[1]);
    if (!types.includes("Ice")) this.incompatibleMoves(moves, movePool, "icebeam", "icywind");
    if (!isDoubles) this.incompatibleMoves(moves, movePool, "taunt", "encore");
    if (!types.includes("Dark") && teraType !== "Dark") this.incompatibleMoves(moves, movePool, "knockoff", "suckerpunch");
    if (!abilities.includes("Prankster")) this.incompatibleMoves(moves, movePool, "thunderwave", "yawn");
    if (species.id === "barraskewda") {
      this.incompatibleMoves(moves, movePool, ["psychicfangs", "throatchop"], ["poisonjab", "throatchop"]);
    }
    if (species.id === "quagsire") this.incompatibleMoves(moves, movePool, "spikes", "icebeam");
    if (species.id === "cyclizar") this.incompatibleMoves(moves, movePool, "taunt", "knockoff");
    if (species.id === "camerupt") this.incompatibleMoves(moves, movePool, "roar", "willowisp");
    if (species.id === "coalossal") this.incompatibleMoves(moves, movePool, "flamethrower", "overheat");
  }
  // Checks for and removes incompatible moves, starting with the first move in movesA.
  incompatibleMoves(moves, movePool, movesA, movesB) {
    const moveArrayA = Array.isArray(movesA) ? movesA : [movesA];
    const moveArrayB = Array.isArray(movesB) ? movesB : [movesB];
    if (moves.size + movePool.length <= this.maxMoveCount) return;
    for (const moveid1 of moves) {
      if (moveArrayB.includes(moveid1)) {
        for (const moveid2 of moveArrayA) {
          if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
            this.fastPop(movePool, movePool.indexOf(moveid2));
            if (moves.size + movePool.length <= this.maxMoveCount) return;
          }
        }
      }
      if (moveArrayA.includes(moveid1)) {
        for (const moveid2 of moveArrayB) {
          if (moveid1 !== moveid2 && movePool.includes(moveid2)) {
            this.fastPop(movePool, movePool.indexOf(moveid2));
            if (moves.size + movePool.length <= this.maxMoveCount) return;
          }
        }
      }
    }
  }
  // Adds a move to the moveset, returns the MoveCounter
  addMove(move, moves, types, abilities, teamDetails, species, isLead, isDoubles, movePool, teraType, role) {
    moves.add(move);
    this.fastPop(movePool, movePool.indexOf(move));
    const counter = this.queryMoves(moves, species, teraType, abilities);
    this.cullMovePool(types, moves, abilities, counter, movePool, teamDetails, species, isLead, isDoubles, teraType, role);
    return counter;
  }
  // Returns the type of a given move for STAB/coverage enforcement purposes
  getMoveType(move, species, abilities, teraType) {
    if (move.id === "terablast") return teraType;
    if (["judgment", "revelationdance"].includes(move.id)) return species.types[0];
    if (move.name === "Raging Bull" && species.name.startsWith("Tauros-Paldea")) {
      if (species.name.endsWith("Combat")) return "Fighting";
      if (species.name.endsWith("Blaze")) return "Fire";
      if (species.name.endsWith("Aqua")) return "Water";
    }
    if (move.name === "Ivy Cudgel" && species.name.startsWith("Ogerpon")) {
      if (species.name.endsWith("Wellspring")) return "Water";
      if (species.name.endsWith("Hearthflame")) return "Fire";
      if (species.name.endsWith("Cornerstone")) return "Rock";
    }
    const moveType = move.type;
    if (moveType === "Normal") {
      if (abilities.includes("Aerilate")) return "Flying";
      if (abilities.includes("Galvanize")) return "Electric";
      if (abilities.includes("Pixilate")) return "Fairy";
      if (abilities.includes("Refrigerate")) return "Ice";
    }
    return moveType;
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
    for (const moveid of ["nightshade", "revelationdance", "revivalblessing", "stickyweb"]) {
      if (movePool.includes(moveid)) {
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
    if (movePool.includes("trickroom") && role === "Doubles Wallbreaker") {
      counter = this.addMove(
        "trickroom",
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
    if (!teamDetails.screens && movePool.includes("auroraveil")) {
      counter = this.addMove(
        "auroraveil",
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
    if (!isDoubles && types.length === 1 && (types.includes("Normal") || types.includes("Fighting"))) {
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
    if (species.id === "smeargle") {
      if (movePool.includes("spore")) {
        counter = this.addMove(
          "spore",
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
    if (isDoubles) {
      const doublesEnforcedMoves = ["mortalspin", "spore"];
      for (const moveid of doublesEnforcedMoves) {
        if (movePool.includes(moveid)) {
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
      if (movePool.includes("fakeout") && species.baseStats.spe <= 50) {
        counter = this.addMove(
          "fakeout",
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
      if (movePool.includes("tailwind") && (abilities.includes("Prankster") || abilities.includes("Gale Wings"))) {
        counter = this.addMove(
          "tailwind",
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
      if (movePool.includes("thunderwave") && abilities.includes("Prankster")) {
        counter = this.addMove(
          "thunderwave",
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
    if (["Bulky Attacker", "Bulky Setup", "Wallbreaker", "Doubles Wallbreaker"].includes(role) || PRIORITY_POKEMON.includes(species.id)) {
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
    if (!counter.get("stabtera") && !["Bulky Support", "Doubles Support"].includes(role)) {
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
    if (role === "AV Pivot") {
      const pivotMoves = movePool.filter((moveid) => ["uturn", "voltswitch"].includes(moveid));
      if (pivotMoves.length) {
        const moveid = this.sample(pivotMoves);
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
    if (role === "Doubles Support") {
      for (const moveid of ["fakeout", "followme", "ragepowder"]) {
        if (movePool.includes(moveid)) {
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
      const speedControl = movePool.filter((moveid) => SPEED_CONTROL.includes(moveid));
      if (speedControl.length) {
        const moveid = this.sample(speedControl);
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
    if (role.includes("Protect")) {
      const protectMoves = movePool.filter((moveid) => PROTECT_MOVES.includes(moveid));
      if (protectMoves.length) {
        const moveid = this.sample(protectMoves);
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
    if (!["AV Pivot", "Fast Support", "Bulky Support", "Bulky Protect", "Doubles Support"].includes(role)) {
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
  shouldCullAbility(ability, types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role) {
    switch (ability) {
      // Abilities which are primarily useful for certain moves or with team support
      case "Chlorophyll":
      case "Solar Power":
        return !teamDetails.sun;
      case "Defiant":
        return species.id === "thundurus" && !!counter.get("Status");
      case "Hydration":
      case "Swift Swim":
        return !teamDetails.rain;
      case "Iron Fist":
      case "Skill Link":
        return !counter.get((0, import_dex.toID)(ability));
      case "Overgrow":
        return !counter.get("Grass");
      case "Prankster":
        return !counter.get("Status");
      case "Sand Force":
      case "Sand Rush":
        return !teamDetails.sand;
      case "Slush Rush":
        return !teamDetails.snow;
      case "Swarm":
        return !counter.get("Bug");
      case "Torrent":
        return !counter.get("Water") && !moves.has("flipturn");
    }
    return false;
  }
  getAbility(types, moves, abilities, counter, teamDetails, species, isLead, isDoubles, teraType, role) {
    if (this.format.gameType === "freeforall") {
      if (species.id === "bellossom") return "Chlorophyll";
      if (species.id === "sinistcha") return "Heatproof";
      if (abilities.length === 1 && abilities[0] === "Telepathy") {
        return species.id === "oranguru" ? "Inner Focus" : "Pressure";
      }
      if (species.id === "duraludon") return "Light Metal";
      if (species.id === "clefairy") return "Magic Guard";
      if (species.id === "blissey") return "Natural Cure";
      if (species.id === "barraskewda") return "Swift Swim";
    }
    if (abilities.length <= 1) return abilities[0];
    if (species.id === "drifblim") return moves.has("defog") ? "Aftermath" : "Unburden";
    if (abilities.includes("Flash Fire") && this.dex.getEffectiveness("Fire", teraType) >= 1) return "Flash Fire";
    if (species.id === "hitmonchan" && counter.get("ironfist")) return "Iron Fist";
    if ((species.id === "thundurus" || species.id === "tornadus") && !counter.get("Physical")) return "Prankster";
    if (species.id === "swampert" && (counter.get("Water") || moves.has("flipturn"))) return "Torrent";
    if (species.id === "toucannon" && counter.get("skilllink")) return "Skill Link";
    if (abilities.includes("Slush Rush") && moves.has("snowscape")) return "Slush Rush";
    if (species.id === "golduck" && teamDetails.rain) return "Swift Swim";
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
    if (!isDoubles) {
      if (role === "Fast Bulky Setup" && (ability === "Quark Drive" || ability === "Protosynthesis")) {
        return "Booster Energy";
      }
      if (species.id === "lokix") {
        return role === "Fast Attacker" ? "Silver Powder" : "Life Orb";
      }
    }
    if (species.requiredItems) {
      if (species.baseSpecies === "Arceus") {
        return species.requiredItems[0];
      }
      return this.sample(species.requiredItems);
    }
    if (role === "AV Pivot") return "Assault Vest";
    if (species.id === "pikachu") return "Light Ball";
    if (species.id === "regieleki") return "Magnet";
    if (types.includes("Normal") && moves.has("doubleedge") && moves.has("fakeout")) return "Silk Scarf";
    if (species.id === "froslass" || moves.has("populationbomb") || ability === "Hustle" && counter.get("setup") && !isDoubles && this.randomChance(1, 2)) return "Wide Lens";
    if (species.id === "smeargle" && !isDoubles) return "Focus Sash";
    if (moves.has("clangoroussoul") || species.id === "toxtricity" && moves.has("shiftgear")) return "Throat Spray";
    if (species.baseSpecies === "Magearna" && role === "Tera Blast user" || species.id === "necrozmaduskmane" || species.id === "calyrexice" && isDoubles) return "Weakness Policy";
    if (["dragonenergy", "lastrespects", "waterspout"].some((m) => moves.has(m))) return "Choice Scarf";
    if (!isDoubles && (ability === "Imposter" || species.id === "magnezone" && role === "Fast Attacker")) return "Choice Scarf";
    if (species.id === "rampardos" && (role === "Fast Attacker" || isDoubles)) return "Choice Scarf";
    if (species.id === "palkia" && counter.get("Special") < 4) return "Lustrous Orb";
    if (moves.has("courtchange") || !isDoubles && (species.id === "luvdisc" || species.id === "terapagos" && !moves.has("rest"))) return "Heavy-Duty Boots";
    if (moves.has("bellydrum") && moves.has("substitute")) return "Salac Berry";
    if (["Cheek Pouch", "Cud Chew", "Harvest", "Ripen"].some((m) => ability === m) || moves.has("bellydrum") || moves.has("filletaway")) {
      return "Sitrus Berry";
    }
    if (["healingwish", "switcheroo", "trick"].some((m) => moves.has(m))) {
      if (species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && role !== "Wallbreaker" && role !== "Doubles Wallbreaker" && !counter.get("priority")) {
        return "Choice Scarf";
      } else {
        return counter.get("Physical") > counter.get("Special") ? "Choice Band" : "Choice Specs";
      }
    }
    if (counter.get("Status") && (species.name === "Latias" || species.name === "Latios")) return "Soul Dew";
    if (species.id === "scyther" && !isDoubles) return isLead && !moves.has("uturn") ? "Eviolite" : "Heavy-Duty Boots";
    if (ability === "Poison Heal" || ability === "Quick Feet") return "Toxic Orb";
    if (species.nfe) return "Eviolite";
    if ((ability === "Guts" || moves.has("facade")) && !moves.has("sleeptalk")) {
      return types.includes("Fire") || ability === "Toxic Boost" ? "Toxic Orb" : "Flame Orb";
    }
    if (ability === "Magic Guard" || ability === "Sheer Force" && counter.get("sheerforce")) return "Life Orb";
    if (ability === "Anger Shell") return this.sample(["Rindo Berry", "Passho Berry", "Scope Lens", "Sitrus Berry"]);
    if (moves.has("dragondance") && isDoubles) return "Clear Amulet";
    if (counter.get("skilllink") && ability !== "Skill Link" && species.id !== "breloom") return "Loaded Dice";
    if (ability === "Unburden") {
      return moves.has("closecombat") || moves.has("leafstorm") ? "White Herb" : "Sitrus Berry";
    }
    if (moves.has("shellsmash") && ability !== "Weak Armor") return "White Herb";
    if (moves.has("meteorbeam") || moves.has("electroshot") && !teamDetails.rain) return "Power Herb";
    if (moves.has("acrobatics") && ability !== "Protosynthesis") return "";
    if (moves.has("auroraveil") || moves.has("lightscreen") && moves.has("reflect")) return "Light Clay";
    if (ability === "Gluttony") return `${this.sample(["Aguav", "Figy", "Iapapa", "Mago", "Wiki"])} Berry`;
    if (species.id === "giratina" && !isDoubles && moves.has("rest") && !moves.has("sleeptalk")) return "Leftovers";
    if (moves.has("rest") && !moves.has("sleeptalk") && ability !== "Natural Cure" && ability !== "Shed Skin") {
      return "Chesto Berry";
    }
    if (species.id !== "yanmega" && this.dex.getEffectiveness("Rock", species) >= 2 && (!types.includes("Flying") || !isDoubles)) return "Heavy-Duty Boots";
  }
  /** Item generation specific to Random Doubles */
  getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role) {
    const scarfReqs = !counter.get("priority") && ability !== "Speed Boost" && role !== "Doubles Wallbreaker" && species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && this.randomChance(1, 2);
    const offensiveRole = ["Doubles Fast Attacker", "Doubles Wallbreaker", "Doubles Setup Sweeper", "Offensive Protect"].some((m) => role === m);
    const doublesLeftoversHardcodes = moves.has("acidarmor") || moves.has("wish") || ["eternatus", "garganacl", "regigigas", "toxapex"].includes(species.id);
    if (species.id === "ursalunabloodmoon" && moves.has("protect")) return "Silk Scarf";
    if (moves.has("flipturn") && moves.has("protect") && (moves.has("aquajet") || moves.has("jetpunch"))) return "Mystic Water";
    if (counter.get("speedsetup") && role === "Doubles Bulky Setup") return "Weakness Policy";
    if (moves.has("blizzard") && ability !== "Snow Warning" && !teamDetails.snow) return "Blunder Policy";
    if (role === "Choice Item user") {
      if (scarfReqs || counter.get("Physical") < 4 && counter.get("Special") < 3 && !moves.has("memento")) {
        return "Choice Scarf";
      }
      return counter.get("Physical") >= 3 ? "Choice Band" : "Choice Specs";
    }
    if (counter.get("Physical") >= 4 && ["fakeout", "feint", "firstimpression", "rapidspin", "suckerpunch"].every((m) => !moves.has(m)) && (moves.has("flipturn") || moves.has("uturn") || role === "Doubles Wallbreaker")) {
      return scarfReqs ? "Choice Scarf" : "Choice Band";
    }
    if ((counter.get("Special") >= 4 && (moves.has("voltswitch") || role === "Doubles Wallbreaker") || counter.get("Special") >= 3 && (moves.has("uturn") || moves.has("flipturn"))) && !moves.has("electroweb")) {
      return scarfReqs ? "Choice Scarf" : "Choice Specs";
    }
    if (species.baseStats.spe <= 70 && (moves.has("ragepowder") || moves.has("followme"))) return "Rocky Helmet";
    if (role === "Bulky Protect" && counter.get("setup") || moves.has("substitute") || moves.has("irondefense") || moves.has("coil") || doublesLeftoversHardcodes) return "Leftovers";
    if (species.id === "sylveon") return "Pixie Plate";
    if (ability === "Intimidate" && this.dex.getEffectiveness("Rock", species) >= 1) return "Heavy-Duty Boots";
    if ((offensiveRole || role === "Tera Blast user" && (species.baseStats.spe >= 80 || moves.has("trickroom"))) && (!moves.has("fakeout") || species.id === "ambipom") && !moves.has("incinerate") && (!moves.has("uturn") || types.includes("Bug") || ability === "Libero") && (!moves.has("icywind") && !moves.has("electroweb") || species.id === "ironbundle")) {
      return (ability === "Quark Drive" || ability === "Protosynthesis") && !isLead && species.id !== "ironvaliant" && ["dracometeor", "firstimpression", "uturn", "voltswitch"].every((m) => !moves.has(m)) ? "Booster Energy" : "Life Orb";
    }
    if (isLead && (species.id === "glimmora" || ["Doubles Fast Attacker", "Doubles Wallbreaker", "Offensive Protect"].includes(role) && species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 230)) return "Focus Sash";
    if (["Doubles Fast Attacker", "Doubles Wallbreaker", "Offensive Protect"].includes(role) && moves.has("fakeout") || moves.has("incinerate")) {
      return this.dex.getEffectiveness("Rock", species) >= 1 ? "Heavy-Duty Boots" : "Clear Amulet";
    }
    if (!counter.get("Status")) return "Assault Vest";
    return "Sitrus Berry";
  }
  getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role) {
    if (species.id !== "jirachi" && counter.get("Physical") >= 4 && ["dragontail", "fakeout", "firstimpression", "flamecharge", "rapidspin"].every((m) => !moves.has(m))) {
      const scarfReqs = role !== "Wallbreaker" && (species.baseStats.atk >= 100 || ability === "Huge Power" || ability === "Pure Power") && species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && ability !== "Speed Boost" && !counter.get("priority") && !moves.has("aquastep");
      return scarfReqs && this.randomChance(1, 2) ? "Choice Scarf" : "Choice Band";
    }
    if (counter.get("Special") >= 4 || counter.get("Special") >= 3 && ["flipturn", "uturn"].some((m) => moves.has(m))) {
      const scarfReqs = role !== "Wallbreaker" && species.baseStats.spa >= 100 && species.baseStats.spe >= 60 && species.baseStats.spe <= 108 && ability !== "Speed Boost" && ability !== "Tinted Lens" && !moves.has("uturn") && !counter.get("priority");
      return scarfReqs && this.randomChance(1, 2) ? "Choice Scarf" : "Choice Specs";
    }
    if (counter.get("speedsetup") && role === "Bulky Setup") return "Weakness Policy";
    if (!counter.get("Status") && !["Fast Attacker", "Wallbreaker", "Tera Blast user"].includes(role)) {
      return "Assault Vest";
    }
    if (species.id === "golem") return counter.get("speedsetup") ? "Weakness Policy" : "Custap Berry";
    if (moves.has("substitute")) return "Leftovers";
    if (moves.has("stickyweb") && isLead && species.baseStats.hp + species.baseStats.def + species.baseStats.spd <= 235) return "Focus Sash";
    if (this.dex.getEffectiveness("Rock", species) >= 1) return "Heavy-Duty Boots";
    if (moves.has("chillyreception") || role === "Fast Support" && [...PIVOT_MOVES, "defog", "mortalspin", "rapidspin"].some((m) => moves.has(m)) && !types.includes("Flying") && ability !== "Levitate") return "Heavy-Duty Boots";
    if (ability === "Rough Skin" || ability === "Regenerator" && (role === "Bulky Support" || role === "Bulky Attacker") && species.baseStats.hp + species.baseStats.def >= 180 && this.randomChance(1, 2) || ability !== "Regenerator" && !counter.get("setup") && counter.get("recovery") && this.dex.getEffectiveness("Fighting", species) < 1 && species.baseStats.hp + species.baseStats.def > 200 && this.randomChance(1, 2)) return "Rocky Helmet";
    if (moves.has("outrage") && counter.get("setup")) return "Lum Berry";
    if (moves.has("protect") && ability !== "Speed Boost") return "Leftovers";
    if (role === "Fast Support" && isLead && !counter.get("recovery") && !counter.get("recoil") && (counter.get("hazards") || counter.get("setup")) && species.baseStats.hp + species.baseStats.def + species.baseStats.spd < 258) return "Focus Sash";
    if (!counter.get("setup") && ability !== "Levitate" && this.dex.getEffectiveness("Ground", species) >= 2) return "Air Balloon";
    if (["Bulky Attacker", "Bulky Support", "Bulky Setup"].some((m) => role === m)) return "Leftovers";
    if (species.id === "pawmot" && moves.has("nuzzle")) return "Leppa Berry";
    if (role === "Fast Support" || role === "Fast Bulky Setup") {
      return counter.get("Physical") + counter.get("Special") >= 3 && !moves.has("nuzzle") ? "Life Orb" : "Leftovers";
    }
    if (role === "Tera Blast user" && DEFENSIVE_TERA_BLAST_USERS.includes(species.id)) return "Leftovers";
    if (["flamecharge", "rapidspin", "trailblaze"].every((m) => !moves.has(m)) && ["Fast Attacker", "Setup Sweeper", "Tera Blast user", "Wallbreaker"].some((m) => role === m)) return "Life Orb";
    return "Leftovers";
  }
  getLevel(species, isDoubles) {
    if (this.adjustLevel) return this.adjustLevel;
    if (isDoubles && this.randomDoublesSets[species.id]["level"]) return this.randomDoublesSets[species.id]["level"];
    if (!isDoubles && this.randomSets[species.id]["level"]) return this.randomSets[species.id]["level"];
    const tier = species.tier;
    const tierScale = {
      Uber: 76,
      OU: 80,
      UUBL: 81,
      UU: 82,
      RUBL: 83,
      RU: 84,
      NUBL: 85,
      NU: 86,
      PUBL: 87,
      PU: 88,
      "(PU)": 88,
      NFE: 88
    };
    return tierScale[tier] || 80;
  }
  getForme(species) {
    if (typeof species.battleOnly === "string") {
      return species.battleOnly;
    }
    if (species.cosmeticFormes) return this.sample([species.name].concat(species.cosmeticFormes));
    if (["Dudunsparce", "Magearna", "Maushold", "Polteageist", "Sinistcha", "Zarude"].includes(species.baseSpecies)) {
      return this.sample([species.name].concat(species.otherFormes));
    }
    if (species.baseSpecies === "Basculin") return "Basculin" + this.sample(["", "-Blue-Striped"]);
    if (species.baseSpecies === "Pikachu") {
      return "Pikachu" + this.sample(
        ["", "-Original", "-Hoenn", "-Sinnoh", "-Unova", "-Kalos", "-Alola", "-Partner", "-World"]
      );
    }
    return species.name;
  }
  randomSet(s, teamDetails = {}, isLead = false, isDoubles = false) {
    const species = this.dex.species.get(s);
    const forme = this.getForme(species);
    const sets = this[`random${isDoubles ? "Doubles" : ""}Sets`][species.id]["sets"];
    const possibleSets = [];
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    for (const set2 of sets) {
      const abilities2 = set2.abilities;
      if (isLead && (abilities2.includes("Protosynthesis") || abilities2.includes("Quark Drive")) && set2.role === "Fast Bulky Setup") continue;
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
      if (isDoubles) {
        item = this.getDoublesItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
      } else {
        item = this.getItem(ability, types, moves, counter, teamDetails, species, isLead, teraType, role);
      }
    }
    const level = this.getLevel(species, isDoubles);
    const srImmunity = ability === "Magic Guard" || item === "Heavy-Duty Boots";
    let srWeakness = srImmunity ? 0 : this.dex.getEffectiveness("Rock", species);
    if (["axekick", "highjumpkick", "jumpkick", "supercellslam"].some((m) => moves.has(m))) srWeakness = 2;
    while (evs.hp > 1) {
      const hp = Math.floor(Math.floor(2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4) + 100) * level / 100 + 10);
      if (moves.has("substitute") && ["Sitrus Berry", "Salac Berry"].includes(item) || species.id === "minior") {
        if (hp % 4 === 0) break;
      } else if ((moves.has("bellydrum") || moves.has("filletaway") || moves.has("shedtail")) && (item === "Sitrus Berry" || ability === "Gluttony")) {
        if (hp % 2 === 0) break;
      } else if (moves.has("substitute") && moves.has("endeavor")) {
        if (hp % 4 > 0) break;
      } else {
        if (isDoubles) break;
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
      if (move.id === "terablast" && (species.id === "porygon2" || ["Contrary", "Defiant"].includes(ability) || moves.has("shiftgear") || species.baseStats.atk > species.baseStats.spa)) return false;
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
  getPokemonPool(type, pokemonToExclude = [], isMonotype = false, pokemonList) {
    const exclude = pokemonToExclude.map((p) => (0, import_dex.toID)(p.species));
    const pokemonPool = {};
    const baseSpeciesPool = [];
    for (const pokemon of pokemonList) {
      let species = this.dex.species.get(pokemon);
      if (exclude.includes(species.id)) continue;
      if (isMonotype) {
        if (!species.types.includes(type)) continue;
        if (typeof species.battleOnly === "string") {
          species = this.dex.species.get(species.battleOnly);
          if (!species.types.includes(type)) continue;
        }
      }
      if (species.baseSpecies in pokemonPool) {
        pokemonPool[species.baseSpecies].push(pokemon);
      } else {
        pokemonPool[species.baseSpecies] = [pokemon];
      }
    }
    for (const baseSpecies of Object.keys(pokemonPool)) {
      const weight = baseSpecies === "Squawkabilly" ? 1 : Math.min(Math.ceil(pokemonPool[baseSpecies].length / 3), 3);
      for (let i = 0; i < weight; i++) baseSpeciesPool.push(baseSpecies);
    }
    return [pokemonPool, baseSpeciesPool];
  }
  randomTeam() {
    this.enforceNoDirectCustomBanlistChanges();
    const seed = this.prng.getSeed();
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    const pokemon = [];
    const isMonotype = !!this.forceMonotype || ruleTable.has("sametypeclause");
    const isDoubles = this.format.gameType !== "singles";
    const typePool = this.dex.types.names().filter((name) => name !== "Stellar");
    const type = this.forceMonotype || this.sample(typePool);
    const usePotD = global.Config && Config.potd && ruleTable.has("potd");
    const potd = usePotD ? this.dex.species.get(Config.potd) : null;
    const baseFormes = {};
    const typeCount = {};
    const typeComboCount = {};
    const typeWeaknesses = {};
    const typeDoubleWeaknesses = {};
    const teamDetails = {};
    let numMaxLevelPokemon = 0;
    const pokemonList = isDoubles ? Object.keys(this.randomDoublesSets) : Object.keys(this.randomSets);
    const [pokemonPool, baseSpeciesPool] = this.getPokemonPool(type, pokemon, isMonotype, pokemonList);
    let leadsRemaining = this.format.gameType === "doubles" ? 2 : 1;
    while (baseSpeciesPool.length && pokemon.length < this.maxTeamSize) {
      const baseSpecies = this.sampleNoReplace(baseSpeciesPool);
      let species = this.dex.species.get(this.sample(pokemonPool[baseSpecies]));
      if (!species.exists) continue;
      if (baseFormes[species.baseSpecies]) continue;
      if (["ogerpon", "ogerponhearthflame", "terapagos"].includes(species.id) && teamDetails.teraBlast) continue;
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
      if (potd?.exists && (pokemon.length === 1 || this.maxTeamSize === 1)) species = potd;
      let set;
      if (leadsRemaining) {
        if (isDoubles && DOUBLES_NO_LEAD_POKEMON.includes(species.baseSpecies) || !isDoubles && NO_LEAD_POKEMON.includes(species.baseSpecies)) {
          if (pokemon.length + leadsRemaining === this.maxTeamSize) continue;
          set = this.randomSet(species, teamDetails, false, isDoubles);
          pokemon.push(set);
        } else {
          set = this.randomSet(species, teamDetails, true, isDoubles);
          pokemon.unshift(set);
          leadsRemaining--;
        }
      } else {
        set = this.randomSet(species, teamDetails, false, isDoubles);
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
      if (set.role === "Tera Blast user" || ["ogerpon", "ogerponhearthflame", "terapagos"].includes(species.id)) {
        teamDetails.teraBlast = 1;
      }
    }
    if (pokemon.length < this.maxTeamSize && pokemon.length < 12) {
      throw new Error(`Could not build a random team for ${this.format} (seed=${seed})`);
    }
    return pokemon;
  }
  randomCCTeam() {
    this.enforceNoDirectCustomBanlistChanges();
    const dex = this.dex;
    const team = [];
    const natures = this.dex.natures.all();
    const items = this.dex.items.all();
    const randomN = this.randomNPokemon(this.maxTeamSize, this.forceMonotype, void 0, void 0, true);
    for (let forme of randomN) {
      let species = dex.species.get(forme);
      if (species.isNonstandard) species = dex.species.get(species.baseSpecies);
      let item = "";
      let isIllegalItem;
      let isBadItem;
      if (this.gen >= 2) {
        do {
          item = this.sample(items).name;
          isIllegalItem = this.dex.items.get(item).gen > this.gen || this.dex.items.get(item).isNonstandard;
          isBadItem = item.startsWith("TR") || this.dex.items.get(item).isPokeball;
        } while (isIllegalItem || isBadItem && this.randomChance(19, 20));
      }
      if (species.battleOnly) {
        if (typeof species.battleOnly === "string") {
          species = dex.species.get(species.battleOnly);
        } else {
          species = dex.species.get(this.sample(species.battleOnly));
        }
        forme = species.name;
      } else if (species.requiredItems && !species.requiredItems.some((req) => (0, import_dex.toID)(req) === item)) {
        if (!species.changesFrom) throw new Error(`${species.name} needs a changesFrom value`);
        species = dex.species.get(species.changesFrom);
        forme = species.name;
      }
      let itemData = this.dex.items.get(item);
      if (itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies) {
        do {
          itemData = this.sample(items);
          item = itemData.name;
        } while (itemData.gen > this.gen || itemData.isNonstandard || itemData.forcedForme && forme === this.dex.species.get(itemData.forcedForme).baseSpecies);
      }
      const abilities = Object.values(species.abilities).filter((a) => this.dex.abilities.get(a).gen <= this.gen);
      const ability = this.gen <= 2 ? "No Ability" : this.sample(abilities);
      let pool = ["struggle"];
      if (forme === "Smeargle") {
        pool = this.dex.moves.all().filter((move) => !(move.isNonstandard || move.isZ || move.isMax || move.realMove)).map((m) => m.id);
      } else {
        pool = [...this.dex.species.getMovePool(species.id)];
      }
      const moves = this.multipleSamplesNoReplace(pool, this.maxMoveCount);
      const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
      const s = ["hp", "atk", "def", "spa", "spd", "spe"];
      let evpool = 510;
      do {
        const x = this.sample(s);
        const y = this.random(Math.min(256 - evs[x], evpool + 1));
        evs[x] += y;
        evpool -= y;
      } while (evpool > 0);
      const ivs = {
        hp: this.random(32),
        atk: this.random(32),
        def: this.random(32),
        spa: this.random(32),
        spd: this.random(32),
        spe: this.random(32)
      };
      const nature = this.sample(natures).name;
      const mbstmin = 1307;
      let stats = species.baseStats;
      if (species.baseSpecies === "Wishiwashi") stats = import_dex.Dex.species.get("wishiwashischool").baseStats;
      if (species.baseSpecies === "Terapagos") stats = import_dex.Dex.species.get("terapagosterastal").baseStats;
      let mbst = stats["hp"] * 2 + 31 + 21 + 100 + 10;
      mbst += stats["atk"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["def"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spa"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spd"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spe"] * 2 + 31 + 21 + 100 + 5;
      let level;
      if (this.adjustLevel) {
        level = this.adjustLevel;
      } else {
        level = Math.floor(100 * mbstmin / mbst);
        while (level < 100) {
          mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
          mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
          mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
          mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          if (mbst >= mbstmin) break;
          level++;
        }
      }
      const happiness = this.random(256);
      const shiny = this.randomChance(1, 1024);
      const set = {
        name: species.baseSpecies,
        species: species.name,
        gender: species.gender,
        item,
        ability,
        moves,
        evs,
        ivs,
        nature,
        level,
        happiness,
        shiny
      };
      if (this.gen === 9) {
        if (species.forceTeraType) set.teraType = species.forceTeraType;
        if (this.forceTeraType) {
          set.teraType = this.forceTeraType;
        } else {
          set.teraType = this.sample(this.dex.types.names());
        }
      }
      team.push(set);
    }
    return team;
  }
  getPools(requiredType, minSourceGen, ruleTable, requireMoves = false) {
    const isNotCustom = !ruleTable;
    let pool = [];
    let speciesPool = [];
    const ck = this.poolsCacheKey;
    if (ck && this.cachedPool && this.cachedSpeciesPool && ck[0] === requiredType && ck[1] === minSourceGen && ck[2] === ruleTable && ck[3] === requireMoves) {
      speciesPool = this.cachedSpeciesPool.slice();
      pool = this.cachedPool.slice();
    } else if (isNotCustom) {
      speciesPool = [...this.dex.species.all()];
      for (const species of speciesPool) {
        if (species.isNonstandard && species.isNonstandard !== "Unobtainable") continue;
        if (requireMoves) {
          const hasMovesInCurrentGen = this.dex.species.getMovePool(species.id).size;
          if (!hasMovesInCurrentGen) continue;
        }
        if (requiredType && !species.types.includes(requiredType)) continue;
        if (minSourceGen && species.gen < minSourceGen) continue;
        const num = species.num;
        if (num <= 0 || pool.includes(num)) continue;
        pool.push(num);
      }
      this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
      this.cachedPool = pool.slice();
      this.cachedSpeciesPool = speciesPool.slice();
    } else {
      const EXISTENCE_TAG = ["past", "future", "lgpe", "unobtainable", "cap", "custom", "nonexistent"];
      const nonexistentBanReason = ruleTable.check("nonexistent");
      for (const species of this.dex.species.all()) {
        if (requiredType && !species.types.includes(requiredType)) continue;
        let banReason = ruleTable.check("pokemon:" + species.id);
        if (banReason) continue;
        if (banReason !== "") {
          if (species.isMega && ruleTable.check("pokemontag:mega")) continue;
          banReason = ruleTable.check("basepokemon:" + (0, import_dex.toID)(species.baseSpecies));
          if (banReason) continue;
          if (banReason !== "" || this.dex.species.get(species.baseSpecies).isNonstandard !== species.isNonstandard) {
            const nonexistentCheck = import_tags.Tags.nonexistent.genericFilter(species) && nonexistentBanReason;
            let tagWhitelisted = false;
            let tagBlacklisted = false;
            for (const ruleid of ruleTable.tagRules) {
              if (ruleid.startsWith("*")) continue;
              const tagid = ruleid.slice(12);
              const tag = import_tags.Tags[tagid];
              if ((tag.speciesFilter || tag.genericFilter)(species)) {
                const existenceTag = EXISTENCE_TAG.includes(tagid);
                if (ruleid.startsWith("+")) {
                  if (!existenceTag && nonexistentCheck) continue;
                  tagWhitelisted = true;
                  break;
                }
                tagBlacklisted = true;
                break;
              }
            }
            if (tagBlacklisted) continue;
            if (!tagWhitelisted) {
              if (ruleTable.check("pokemontag:allpokemon")) continue;
            }
          }
        }
        speciesPool.push(species);
        const num = species.num;
        if (pool.includes(num)) continue;
        pool.push(num);
      }
      this.poolsCacheKey = [requiredType, minSourceGen, ruleTable, requireMoves];
      this.cachedPool = pool.slice();
      this.cachedSpeciesPool = speciesPool.slice();
    }
    return { pool, speciesPool };
  }
  randomNPokemon(n, requiredType, minSourceGen, ruleTable, requireMoves = false) {
    if (requiredType && !this.dex.types.get(requiredType).exists) {
      throw new Error(`"${requiredType}" is not a valid type.`);
    }
    const { pool, speciesPool } = this.getPools(requiredType, minSourceGen, ruleTable, requireMoves);
    const isNotCustom = !ruleTable;
    const hasDexNumber = {};
    for (let i = 0; i < n; i++) {
      const num = this.sampleNoReplace(pool);
      hasDexNumber[num] = i;
    }
    const formes = [];
    for (const species of speciesPool) {
      if (!(species.num in hasDexNumber)) continue;
      if (isNotCustom && (species.gen > this.gen || species.isNonstandard && species.isNonstandard !== "Unobtainable")) continue;
      if (requiredType && !species.types.includes(requiredType)) continue;
      if (!formes[hasDexNumber[species.num]]) formes[hasDexNumber[species.num]] = [];
      formes[hasDexNumber[species.num]].push(species.name);
    }
    if (formes.length < n) {
      throw new Error(`Legal Pokemon forme count insufficient to support Max Team Size: (${formes.length} / ${n}).`);
    }
    const nPokemon = [];
    for (let i = 0; i < n; i++) {
      if (!formes[i].length) {
        throw new Error(`Invalid pokemon gen ${this.gen}: ${JSON.stringify(formes)} numbers ${JSON.stringify(hasDexNumber)}`);
      }
      nPokemon.push(this.sample(formes[i]));
    }
    return nPokemon;
  }
  randomHCTeam() {
    const hasCustomBans = this.hasDirectCustomBanlistChanges();
    const ruleTable = this.dex.formats.getRuleTable(this.format);
    const hasNonexistentBan = hasCustomBans && ruleTable.check("nonexistent");
    const hasNonexistentWhitelist = hasCustomBans && hasNonexistentBan === "";
    if (hasCustomBans) {
      this.enforceNoDirectComplexBans();
    }
    const doItemsExist = this.gen > 1;
    let itemPool = [];
    if (doItemsExist) {
      if (!hasCustomBans) {
        itemPool = [...this.dex.items.all()].filter((item) => item.gen <= this.gen && !item.isNonstandard);
      } else {
        const hasAllItemsBan = ruleTable.check("pokemontag:allitems");
        for (const item of this.dex.items.all()) {
          let banReason = ruleTable.check("item:" + item.id);
          if (banReason) continue;
          if (banReason !== "" && item.id) {
            if (hasAllItemsBan) continue;
            if (item.isNonstandard) {
              banReason = ruleTable.check("pokemontag:" + (0, import_dex.toID)(item.isNonstandard));
              if (banReason) continue;
              if (banReason !== "" && item.isNonstandard !== "Unobtainable") {
                if (hasNonexistentBan) continue;
                if (!hasNonexistentWhitelist) continue;
              }
            }
          }
          itemPool.push(item);
        }
        if (ruleTable.check("item:noitem")) {
          this.enforceCustomPoolSizeNoComplexBans("item", itemPool, this.maxTeamSize, "Max Team Size");
        }
      }
    }
    const doAbilitiesExist = this.gen > 2 && this.dex.currentMod !== "gen7letsgo";
    let abilityPool = [];
    if (doAbilitiesExist) {
      if (!hasCustomBans) {
        abilityPool = [...this.dex.abilities.all()].filter((ability) => ability.gen <= this.gen && !ability.isNonstandard);
      } else {
        const hasAllAbilitiesBan = ruleTable.check("pokemontag:allabilities");
        for (const ability of this.dex.abilities.all()) {
          let banReason = ruleTable.check("ability:" + ability.id);
          if (banReason) continue;
          if (banReason !== "") {
            if (hasAllAbilitiesBan) continue;
            if (ability.isNonstandard) {
              banReason = ruleTable.check("pokemontag:" + (0, import_dex.toID)(ability.isNonstandard));
              if (banReason) continue;
              if (banReason !== "") {
                if (hasNonexistentBan) continue;
                if (!hasNonexistentWhitelist) continue;
              }
            }
          }
          abilityPool.push(ability);
        }
        if (ruleTable.check("ability:noability")) {
          this.enforceCustomPoolSizeNoComplexBans("ability", abilityPool, this.maxTeamSize, "Max Team Size");
        }
      }
    }
    const setMoveCount = ruleTable.maxMoveCount;
    let movePool = [];
    if (!hasCustomBans) {
      movePool = [...this.dex.moves.all()].filter((move) => move.gen <= this.gen && !move.isNonstandard);
    } else {
      const hasAllMovesBan = ruleTable.check("pokemontag:allmoves");
      for (const move of this.dex.moves.all()) {
        let banReason = ruleTable.check("move:" + move.id);
        if (banReason) continue;
        if (banReason !== "") {
          if (hasAllMovesBan) continue;
          if (move.isNonstandard) {
            banReason = ruleTable.check("pokemontag:" + (0, import_dex.toID)(move.isNonstandard));
            if (banReason) continue;
            if (banReason !== "" && move.isNonstandard !== "Unobtainable") {
              if (hasNonexistentBan) continue;
              if (!hasNonexistentWhitelist) continue;
            }
          }
        }
        movePool.push(move);
      }
      this.enforceCustomPoolSizeNoComplexBans("move", movePool, this.maxTeamSize * setMoveCount, "Max Team Size * Max Move Count");
    }
    const doNaturesExist = this.gen > 2;
    let naturePool = [];
    if (doNaturesExist) {
      if (!hasCustomBans) {
        naturePool = [...this.dex.natures.all()];
      } else {
        const hasAllNaturesBan = ruleTable.check("pokemontag:allnatures");
        for (const nature of this.dex.natures.all()) {
          let banReason = ruleTable.check("nature:" + nature.id);
          if (banReason) continue;
          if (banReason !== "" && nature.id) {
            if (hasAllNaturesBan) continue;
            if (nature.isNonstandard) {
              banReason = ruleTable.check("pokemontag:" + (0, import_dex.toID)(nature.isNonstandard));
              if (banReason) continue;
              if (banReason !== "" && nature.isNonstandard !== "Unobtainable") {
                if (hasNonexistentBan) continue;
                if (!hasNonexistentWhitelist) continue;
              }
            }
          }
          naturePool.push(nature);
        }
      }
    }
    const randomN = this.randomNPokemon(
      this.maxTeamSize,
      this.forceMonotype,
      void 0,
      hasCustomBans ? ruleTable : void 0
    );
    const team = [];
    for (const forme of randomN) {
      const species = this.dex.species.get(forme);
      let item = "";
      let itemData;
      let isBadItem;
      if (doItemsExist) {
        do {
          itemData = this.sampleNoReplace(itemPool);
          item = itemData?.name;
          isBadItem = item.startsWith("TR") || itemData.isPokeball;
        } while (isBadItem && this.randomChance(19, 20) && itemPool.length > this.maxTeamSize);
      }
      let ability = "No Ability";
      let abilityData;
      if (doAbilitiesExist) {
        abilityData = this.sampleNoReplace(abilityPool);
        ability = abilityData?.name;
      }
      const m = [];
      do {
        const move = this.sampleNoReplace(movePool);
        m.push(move.id);
      } while (m.length < setMoveCount);
      const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
      if (this.gen === 6) {
        let evpool = 510;
        do {
          const x = this.sample(import_dex.Dex.stats.ids());
          const y = this.random(Math.min(256 - evs[x], evpool + 1));
          evs[x] += y;
          evpool -= y;
        } while (evpool > 0);
      } else {
        for (const x of import_dex.Dex.stats.ids()) {
          evs[x] = this.random(256);
        }
      }
      const ivs = {
        hp: this.random(32),
        atk: this.random(32),
        def: this.random(32),
        spa: this.random(32),
        spd: this.random(32),
        spe: this.random(32)
      };
      let nature = "";
      if (doNaturesExist && naturePool.length > 0) {
        nature = this.sample(naturePool).name;
      }
      const mbstmin = 1307;
      const stats = species.baseStats;
      let mbst = stats["hp"] * 2 + 31 + 21 + 100 + 10;
      mbst += stats["atk"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["def"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spa"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spd"] * 2 + 31 + 21 + 100 + 5;
      mbst += stats["spe"] * 2 + 31 + 21 + 100 + 5;
      let level;
      if (this.adjustLevel) {
        level = this.adjustLevel;
      } else {
        level = Math.floor(100 * mbstmin / mbst);
        while (level < 100) {
          mbst = Math.floor((stats["hp"] * 2 + 31 + 21 + 100) * level / 100 + 10);
          mbst += Math.floor(((stats["atk"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
          mbst += Math.floor((stats["def"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          mbst += Math.floor(((stats["spa"] * 2 + 31 + 21 + 100) * level / 100 + 5) * level / 100);
          mbst += Math.floor((stats["spd"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          mbst += Math.floor((stats["spe"] * 2 + 31 + 21 + 100) * level / 100 + 5);
          if (mbst >= mbstmin) break;
          level++;
        }
      }
      const happiness = this.random(256);
      const shiny = this.randomChance(1, 1024);
      const set = {
        name: species.baseSpecies,
        species: species.name,
        gender: species.gender,
        item,
        ability,
        moves: m,
        evs,
        ivs,
        nature,
        level,
        happiness,
        shiny
      };
      if (this.gen === 9) {
        if (this.forceTeraType) {
          set.teraType = this.forceTeraType;
        } else {
          set.teraType = this.sample(this.dex.types.names());
        }
      }
      team.push(set);
    }
    return team;
  }
  randomFactorySet(species, teamData, tier) {
    const id = (0, import_dex.toID)(species.name);
    const setList = this.randomFactorySets[tier][id].sets;
    const itemsLimited = ["choicespecs", "choiceband", "choicescarf"];
    const movesLimited = {
      stealthrock: "stealthRock",
      stoneaxe: "stealthRock",
      spikes: "spikes",
      ceaselessedge: "spikes",
      toxicspikes: "toxicSpikes",
      rapidspin: "hazardClear",
      defog: "hazardClear"
    };
    const abilitiesLimited = {
      toxicdebris: "toxicSpikes"
    };
    const effectivePool = [];
    for (const set of setList) {
      let reject = false;
      if (set.wantsTera && teamData.wantsTeraCount) {
        continue;
      }
      const allowedItems = [];
      for (const itemString of set.item) {
        const itemId = (0, import_dex.toID)(itemString);
        if (itemsLimited.includes(itemId) && teamData.has[itemId]) continue;
        allowedItems.push(itemString);
      }
      if (!allowedItems.length) continue;
      const item2 = this.sample(allowedItems);
      const abilityId = (0, import_dex.toID)(this.sample(set.ability));
      if (abilitiesLimited[abilityId] && teamData.has[abilitiesLimited[abilityId]]) continue;
      const moves2 = [];
      for (const move of set.moves) {
        const allowedMoves = [];
        for (const m of move) {
          const moveId = (0, import_dex.toID)(m);
          if (movesLimited[moveId] && teamData.has[movesLimited[moveId]]) continue;
          allowedMoves.push(m);
        }
        if (!allowedMoves.length) {
          reject = true;
          break;
        }
        moves2.push(this.sample(allowedMoves));
      }
      if (reject) continue;
      effectivePool.push({ set, moves: moves2, item: item2 });
    }
    if (!effectivePool.length) {
      if (!teamData.forceResult) return null;
      for (const set of setList) {
        effectivePool.push({ set });
      }
    }
    let setData = this.sample(effectivePool);
    const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
    const setRand = this.random(total);
    let cur = 0;
    for (const set of effectivePool) {
      cur += set.set.weight;
      if (cur > setRand) {
        setData = set;
        break;
      }
    }
    const moves = [];
    for (const [i, moveSlot] of setData.set.moves.entries()) {
      moves.push(setData.moves ? setData.moves[i] : this.sample(moveSlot));
    }
    const item = setData.item || this.sample(setData.set.item);
    return {
      name: species.baseSpecies,
      species: typeof species.battleOnly === "string" ? species.battleOnly : species.name,
      teraType: this.sample(setData.set.teraType),
      gender: setData.set.gender || species.gender || (tier === "OU" ? "F" : ""),
      // F for Cute Charm Enamorus
      item,
      ability: this.sample(setData.set.ability),
      shiny: setData.set.shiny || this.randomChance(1, 1024),
      level: this.adjustLevel || (tier === "LC" ? 5 : 100),
      happiness: 255,
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
      nature: this.sample(setData.set.nature) || "Serious",
      moves,
      wantsTera: setData.set.wantsTera
    };
  }
  randomFactoryTeam(side, depth = 0) {
    this.enforceNoDirectCustomBanlistChanges();
    const forceResult = depth >= 12;
    if (!this.factoryTier) {
      this.factoryTier = this.sample(["Uber", "OU", "UU", "RU", "NU", "PU"]);
    }
    const tierValues = {
      Uber: 5,
      OU: 4,
      UUBL: 4,
      UU: 3,
      RUBL: 3,
      RU: 2,
      NUBL: 2,
      NU: 1,
      PUBL: 1,
      PU: 0
    };
    const pokemon = [];
    const pokemonPool = Object.keys(this.randomFactorySets[this.factoryTier]);
    const teamData = {
      typeCount: {},
      typeComboCount: {},
      baseFormes: {},
      has: {},
      wantsTeraCount: 0,
      forceResult,
      weaknesses: {},
      resistances: {}
    };
    const resistanceAbilities = {
      dryskin: ["Water"],
      waterabsorb: ["Water"],
      stormdrain: ["Water"],
      flashfire: ["Fire"],
      heatproof: ["Fire"],
      waterbubble: ["Fire"],
      wellbakedbody: ["Fire"],
      lightningrod: ["Electric"],
      motordrive: ["Electric"],
      voltabsorb: ["Electric"],
      sapsipper: ["Grass"],
      thickfat: ["Ice", "Fire"],
      eartheater: ["Ground"],
      levitate: ["Ground"]
    };
    const movesLimited = {
      stealthrock: "stealthRock",
      stoneaxe: "stealthRock",
      spikes: "spikes",
      ceaselessedge: "spikes",
      toxicspikes: "toxicSpikes",
      rapidspin: "hazardClear",
      defog: "hazardClear"
    };
    const abilitiesLimited = {
      toxicdebris: "toxicSpikes"
    };
    const limitFactor = Math.ceil(this.maxTeamSize / 6);
    const shuffledSpecies = [];
    for (const speciesName of pokemonPool) {
      const sortObject = {
        speciesName,
        score: this.prng.random() ** (1 / this.randomFactorySets[this.factoryTier][speciesName].weight)
      };
      shuffledSpecies.push(sortObject);
    }
    shuffledSpecies.sort((a, b) => a.score - b.score);
    while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
      const species = this.dex.species.get(shuffledSpecies.pop().speciesName);
      if (!species.exists) continue;
      if (this.factoryTier in tierValues && species.tier in tierValues && tierValues[species.tier] > tierValues[this.factoryTier]) continue;
      if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;
      if (teamData.baseFormes[species.baseSpecies]) continue;
      const types = species.types;
      let skip = false;
      if (!this.forceMonotype) {
        for (const type of types) {
          if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
            skip = true;
            break;
          }
        }
      }
      if (skip) continue;
      if (!teamData.forceResult && !this.forceMonotype) {
        for (const typeName of this.dex.types.names()) {
          if (this.dex.getEffectiveness(typeName, species) > 0 && this.dex.getImmunity(typeName, types)) {
            if (teamData.weaknesses[typeName] >= 3 * limitFactor) {
              skip = true;
              break;
            }
          }
        }
      }
      if (skip) continue;
      const set = this.randomFactorySet(species, teamData, this.factoryTier);
      if (!set) continue;
      let typeCombo = types.slice().sort().join();
      if (set.ability === "Drought" || set.ability === "Drizzle") {
        typeCombo = set.ability;
      }
      if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;
      pokemon.push(set);
      for (const type of types) {
        if (type in teamData.typeCount) {
          teamData.typeCount[type]++;
        } else {
          teamData.typeCount[type] = 1;
        }
      }
      if (typeCombo in teamData.typeComboCount) {
        teamData.typeComboCount[typeCombo]++;
      } else {
        teamData.typeComboCount[typeCombo] = 1;
      }
      teamData.baseFormes[species.baseSpecies] = 1;
      teamData.has[(0, import_dex.toID)(set.item)] = 1;
      if (set.wantsTera) {
        if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
        teamData.wantsTeraCount++;
      }
      for (const move of set.moves) {
        const moveId = (0, import_dex.toID)(move);
        if (movesLimited[moveId]) {
          teamData.has[movesLimited[moveId]] = 1;
        }
      }
      const ability = this.dex.abilities.get(set.ability);
      if (abilitiesLimited[ability.id]) {
        teamData.has[abilitiesLimited[ability.id]] = 1;
      }
      for (const typeName of this.dex.types.names()) {
        const typeMod = this.dex.getEffectiveness(typeName, types);
        if (typeMod < 0 || resistanceAbilities[ability.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
          teamData.resistances[typeName] = 1;
        } else if (typeMod > 0) {
          teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
        }
      }
    }
    if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomFactoryTeam(side, ++depth);
    if (!teamData.forceResult && !this.forceMonotype) {
      for (const type in teamData.weaknesses) {
        if (teamData.resistances[type]) continue;
        if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomFactoryTeam(side, ++depth);
      }
      if (!teamData.has["stealthRock"] && this.factoryTier !== "Uber") return this.randomFactoryTeam(side, ++depth);
    }
    return pokemon;
  }
  randomBSSFactorySet(species, teamData) {
    const id = (0, import_dex.toID)(species.name);
    const setList = this.randomBSSFactorySets[id].sets;
    const movesMax = {
      batonpass: 1,
      stealthrock: 1,
      toxicspikes: 1,
      trickroom: 1,
      auroraveil: 1
    };
    const weatherAbilities = ["drizzle", "drought", "snowwarning", "sandstream"];
    const terrainAbilities = {
      electricsurge: "electric",
      psychicsurge: "psychic",
      grassysurge: "grassy",
      seedsower: "grassy",
      mistysurge: "misty"
    };
    const terrainItemsRequire = {
      electricseed: "electric",
      psychicseed: "psychic",
      grassyseed: "grassy",
      mistyseed: "misty"
    };
    const maxWantsTera = 2;
    const effectivePool = [];
    for (const curSet of setList) {
      let reject = false;
      if (curSet.wantsTera && teamData.wantsTeraCount && teamData.wantsTeraCount >= maxWantsTera) {
        continue;
      }
      if (teamData.weather && weatherAbilities.includes(curSet.ability)) {
        continue;
      }
      if (terrainAbilities[curSet.ability]) {
        if (!teamData.terrain) teamData.terrain = [];
        teamData.terrain.push(terrainAbilities[curSet.ability]);
      }
      for (const item of curSet.item) {
        if (terrainItemsRequire[item] && !teamData.terrain?.includes(terrainItemsRequire[item])) {
          reject = true;
          break;
        }
      }
      const curSetMoveVariants = [];
      for (const move of curSet.moves) {
        const variantIndex = this.random(move.length);
        const moveId = (0, import_dex.toID)(move[variantIndex]);
        if (movesMax[moveId] && teamData.has[moveId] >= movesMax[moveId]) {
          reject = true;
          break;
        }
        curSetMoveVariants.push(variantIndex);
      }
      if (reject) continue;
      const set = { set: curSet, moveVariants: curSetMoveVariants };
      effectivePool.push(set);
    }
    if (!effectivePool.length) {
      if (!teamData.forceResult) return null;
      for (const curSet of setList) {
        effectivePool.push({ set: curSet });
      }
    }
    let setData = this.sample(effectivePool);
    const total = effectivePool.reduce((a, b) => a + b.set.weight, 0);
    const setRand = this.random(total);
    let cur = 0;
    for (const set of effectivePool) {
      cur += set.set.weight;
      if (cur > setRand) {
        setData = set;
        break;
      }
    }
    const moves = [];
    for (const [i, moveSlot] of setData.set.moves.entries()) {
      moves.push(setData.moveVariants ? moveSlot[setData.moveVariants[i]] : this.sample(moveSlot));
    }
    return {
      name: setData.set.species || species.baseSpecies,
      species: setData.set.species,
      teraType: this.sampleIfArray(setData.set.teraType),
      gender: setData.set.gender || species.gender || (this.randomChance(1, 2) ? "M" : "F"),
      item: this.sampleIfArray(setData.set.item) || "",
      ability: this.sampleIfArray(setData.set.ability),
      shiny: this.randomChance(1, 1024),
      level: 50,
      happiness: 255,
      evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0, ...setData.set.evs },
      ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31, ...setData.set.ivs },
      nature: setData.set.nature || "Serious",
      moves,
      wantsTera: setData.set.wantsTera
    };
  }
  randomBSSFactoryTeam(side, depth = 0) {
    this.enforceNoDirectCustomBanlistChanges();
    const forceResult = depth >= 4;
    const pokemon = [];
    const pokemonPool = Object.keys(this.randomBSSFactorySets);
    const teamData = {
      typeCount: {},
      typeComboCount: {},
      baseFormes: {},
      has: {},
      wantsTeraCount: 0,
      forceResult,
      weaknesses: {},
      resistances: {}
    };
    const weatherAbilitiesSet = {
      drizzle: "raindance",
      drought: "sunnyday",
      snowwarning: "hail",
      sandstream: "sandstorm"
    };
    const resistanceAbilities = {
      waterabsorb: ["Water"],
      flashfire: ["Fire"],
      lightningrod: ["Electric"],
      voltabsorb: ["Electric"],
      thickfat: ["Ice", "Fire"],
      levitate: ["Ground"]
    };
    const limitFactor = Math.ceil(this.maxTeamSize / 6);
    const shuffledSpecies = [];
    for (const speciesName of pokemonPool) {
      const sortObject = {
        speciesName,
        score: this.prng.random() ** (1 / this.randomBSSFactorySets[speciesName].weight)
      };
      shuffledSpecies.push(sortObject);
    }
    shuffledSpecies.sort((a, b) => a.score - b.score);
    while (shuffledSpecies.length && pokemon.length < this.maxTeamSize) {
      const species = this.dex.species.get(shuffledSpecies.pop().speciesName);
      if (!species.exists) continue;
      if (this.forceMonotype && !species.types.includes(this.forceMonotype)) continue;
      if (teamData.baseFormes[species.baseSpecies]) continue;
      const types = species.types;
      let skip = false;
      if (!this.forceMonotype) {
        for (const type of types) {
          if (teamData.typeCount[type] >= 2 * limitFactor && this.randomChance(4, 5)) {
            skip = true;
            break;
          }
        }
      }
      if (skip) continue;
      const set = this.randomBSSFactorySet(species, teamData);
      if (!set) continue;
      let typeCombo = types.slice().sort().join();
      if (set.ability === "Drought" || set.ability === "Drizzle") {
        typeCombo = set.ability;
      }
      if (!this.forceMonotype && teamData.typeComboCount[typeCombo] >= limitFactor) continue;
      const itemData = this.dex.items.get(set.item);
      if (teamData.has[itemData.id]) continue;
      pokemon.push(set);
      for (const type of types) {
        if (type in teamData.typeCount) {
          teamData.typeCount[type]++;
        } else {
          teamData.typeCount[type] = 1;
        }
      }
      if (typeCombo in teamData.typeComboCount) {
        teamData.typeComboCount[typeCombo]++;
      } else {
        teamData.typeComboCount[typeCombo] = 1;
      }
      teamData.baseFormes[species.baseSpecies] = 1;
      teamData.has[itemData.id] = 1;
      if (set.wantsTera) {
        if (!teamData.wantsTeraCount) teamData.wantsTeraCount = 0;
        teamData.wantsTeraCount++;
      }
      const abilityState = this.dex.abilities.get(set.ability);
      if (abilityState.id in weatherAbilitiesSet) {
        teamData.weather = weatherAbilitiesSet[abilityState.id];
      }
      for (const move of set.moves) {
        const moveId = (0, import_dex.toID)(move);
        if (moveId in teamData.has) {
          teamData.has[moveId]++;
        } else {
          teamData.has[moveId] = 1;
        }
      }
      for (const typeName of this.dex.types.names()) {
        if (teamData.resistances[typeName] >= 1) continue;
        if (resistanceAbilities[abilityState.id]?.includes(typeName) || !this.dex.getImmunity(typeName, types)) {
          teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
          if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
          continue;
        }
        const typeMod = this.dex.getEffectiveness(typeName, types);
        if (typeMod < 0) {
          teamData.resistances[typeName] = (teamData.resistances[typeName] || 0) + 1;
          if (teamData.resistances[typeName] >= 1) teamData.weaknesses[typeName] = 0;
        } else if (typeMod > 0) {
          teamData.weaknesses[typeName] = (teamData.weaknesses[typeName] || 0) + 1;
        }
      }
    }
    if (!teamData.forceResult && pokemon.length < this.maxTeamSize) return this.randomBSSFactoryTeam(side, ++depth);
    if (!teamData.forceResult && !this.forceMonotype) {
      for (const type in teamData.weaknesses) {
        if (teamData.weaknesses[type] >= 3 * limitFactor) return this.randomBSSFactoryTeam(side, ++depth);
      }
    }
    return pokemon;
  }
  randomDraftFactoryTeam(side) {
    this.enforceNoDirectCustomBanlistChanges();
    if (this.rdfMatchupIndex === -1) this.rdfMatchupIndex = this.random(0, this.randomDraftFactoryMatchups.length);
    if (this.rdfMatchupSide === -1) this.rdfMatchupSide = this.random(0, 2);
    const matchup = this.randomDraftFactoryMatchups[this.rdfMatchupIndex];
    const team = import_teams.Teams.unpack(matchup[this.rdfMatchupSide]);
    if (!team) throw new Error(`Invalid team for draft factory matchup ${this.rdfMatchupIndex}`);
    this.rdfMatchupSide = 1 - this.rdfMatchupSide;
    return team.map((set) => {
      let species = this.dex.species.get(set.species);
      if (species.battleOnly) {
        if (typeof species.battleOnly !== "string") {
          throw new Error(`Invalid species ${species.name} for draft factory matchup ${this.rdfMatchupIndex} team ${this.rdfMatchupSide}`);
        }
        species = this.dex.species.get(species.battleOnly);
      }
      return {
        name: species.baseSpecies,
        species: species.name,
        gender: set.gender,
        moves: set.moves,
        ability: set.ability,
        evs: set.evs,
        ivs: set.ivs,
        item: set.item,
        level: this.adjustLevel || set.level,
        shiny: !!set.shiny,
        nature: set.nature,
        teraType: set.teraType,
        teraCaptain: set.name === "Tera Captain"
      };
    });
  }
}
var teams_default = RandomTeams;
//# sourceMappingURL=teams.js.map
