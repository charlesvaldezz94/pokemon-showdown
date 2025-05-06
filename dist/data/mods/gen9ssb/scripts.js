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
var scripts_exports = {};
__export(scripts_exports, {
  PSEUDO_WEATHERS: () => PSEUDO_WEATHERS,
  Scripts: () => Scripts,
  changeMoves: () => changeMoves,
  changeSet: () => changeSet,
  enemyStaff: () => enemyStaff,
  getName: () => getName,
  getRoomauth: () => getRoomauth
});
module.exports = __toCommonJS(scripts_exports);
var import_lib = require("../../../lib");
var import_dex_data = require("../../../sim/dex-data");
const usergroups = {};
const usergroupData = (0, import_lib.FS)("config/usergroups.csv").readIfExistsSync().split("\n");
for (const row of usergroupData) {
  if (!(0, import_dex_data.toID)(row)) continue;
  const cells = row.split(",");
  if (cells.length > 3) throw new Error(`Invalid entry when parsing usergroups.csv`);
  usergroups[(0, import_dex_data.toID)(cells[0])] = cells[1].trim() || " ";
}
const roomauth = {};
function getRoomauth(name, room) {
  const userid = (0, import_dex_data.toID)(name);
  const roomid = (0, import_dex_data.toID)(room);
  if (roomauth[roomid]) return roomauth[roomid][userid] || null;
  const roomsList = JSON.parse((0, import_lib.FS)("config/chatrooms.json").readIfExistsSync() || "[]");
  const roomData = roomsList.find((r) => (0, import_dex_data.toID)(r.title) === roomid);
  if (!roomData) return null;
  roomauth[roomid] = roomData.auth;
  return roomauth[roomid][userid] || null;
}
function getName(name) {
  const userid = (0, import_dex_data.toID)(name);
  if (!userid) throw new Error("No/Invalid name passed to getSymbol");
  let group = usergroups[userid] || " ";
  if (name === "Artemis") group = "@";
  if (name === "Jeopard-E" || name === "Ice Kyubs") group = "*";
  return `${Math.floor(Date.now() / 1e3)}|${group}${name}`;
}
function enemyStaff(pokemon) {
  const foePokemon = pokemon.side.foe.active[0];
  if (foePokemon.illusion) return foePokemon.illusion.name;
  return foePokemon.name;
}
function changeSet(context, pokemon, newSet, changeAbility = false) {
  if (pokemon.transformed) return;
  const evs = {
    hp: newSet.evs?.hp || 0,
    atk: newSet.evs?.atk || 0,
    def: newSet.evs?.def || 0,
    spa: newSet.evs?.spa || 0,
    spd: newSet.evs?.spd || 0,
    spe: newSet.evs?.spe || 0
  };
  const ivs = {
    hp: newSet.ivs?.hp || 31,
    atk: newSet.ivs?.atk || 31,
    def: newSet.ivs?.def || 31,
    spa: newSet.ivs?.spa || 31,
    spd: newSet.ivs?.spd || 31,
    spe: newSet.ivs?.spe || 31
  };
  pokemon.set.evs = evs;
  pokemon.set.ivs = ivs;
  if (newSet.nature) pokemon.set.nature = Array.isArray(newSet.nature) ? context.sample(newSet.nature) : newSet.nature;
  const oldGender = pokemon.set.gender;
  if (pokemon.set.gender !== newSet.gender && !Array.isArray(newSet.gender)) {
    pokemon.set.gender = newSet.gender;
    pokemon.gender = newSet.gender;
  }
  const oldShiny = pokemon.set.shiny;
  pokemon.set.shiny = typeof newSet.shiny === "number" ? context.randomChance(1, newSet.shiny) : !!newSet.shiny;
  let percent = pokemon.hp / pokemon.baseMaxhp;
  if (newSet.species === "Shedinja") percent = 1;
  pokemon.formeChange(newSet.species, context.effect, true);
  if (!pokemon.terastallized && newSet.teraType) {
    const allTypes = context.dex.types.names();
    pokemon.teraType = newSet.teraType === "Any" ? context.sample(allTypes) : Array.isArray(newSet.teraType) ? context.sample(newSet.teraType) : newSet.teraType;
  }
  const details = pokemon.getUpdatedDetails();
  if (oldShiny !== pokemon.set.shiny || oldGender !== pokemon.gender) context.add("replace", pokemon, details);
  if (changeAbility) pokemon.setAbility(newSet.ability, void 0, true);
  pokemon.baseMaxhp = pokemon.species.name === "Shedinja" ? 1 : Math.floor(Math.floor(
    2 * pokemon.species.baseStats.hp + pokemon.set.ivs.hp + Math.floor(pokemon.set.evs.hp / 4) + 100
  ) * pokemon.level / 100 + 10);
  const newMaxHP = pokemon.baseMaxhp;
  pokemon.hp = Math.round(newMaxHP * percent);
  pokemon.maxhp = newMaxHP;
  context.add("-heal", pokemon, pokemon.getHealth, "[silent]");
  if (pokemon.item) {
    let item = newSet.item;
    if (typeof item !== "string") item = item[context.random(item.length)];
    if (context.toID(item) !== (pokemon.item || pokemon.lastItem)) pokemon.setItem(item);
  }
  if (!pokemon.m.datacorrupt) {
    const newMoves = changeMoves(context, pokemon, newSet.moves.concat(newSet.signatureMove));
    pokemon.moveSlots = newMoves;
    pokemon.baseMoveSlots = newMoves;
  }
  pokemon.canMegaEvo = context.actions.canMegaEvo(pokemon);
  pokemon.canUltraBurst = context.actions.canUltraBurst(pokemon);
  pokemon.canTerastallize = pokemon.canTerastallize === null ? null : context.actions.canTerastallize(pokemon);
  context.add("message", `${pokemon.name} changed form!`);
}
const PSEUDO_WEATHERS = [
  // Normal pseudo weathers
  "fairylock",
  "gravity",
  "iondeluge",
  "magicroom",
  "mudsport",
  "trickroom",
  "watersport",
  "wonderroom",
  // SSB pseudo weathers
  "anfieldatmosphere"
];
function changeMoves(context, pokemon, newMoves) {
  const carryOver = pokemon.moveSlots.slice().map((m) => m.pp / m.maxpp);
  while (carryOver.length < 4) {
    carryOver.push(1);
  }
  const result = [];
  let slot = 0;
  for (const newMove of newMoves) {
    const moveName = Array.isArray(newMove) ? newMove[context.random(newMove.length)] : newMove;
    const move = context.dex.moves.get(context.toID(moveName));
    if (!move.id) continue;
    const moveSlot = {
      move: move.name,
      id: move.id,
      pp: Math.floor((move.noPPBoosts ? move.pp : move.pp * 8 / 5) * carryOver[slot]),
      maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
      target: move.target,
      disabled: false,
      disabledSource: "",
      used: false
    };
    result.push(moveSlot);
    slot++;
  }
  return result;
}
const Scripts = {
  gen: 9,
  inherit: "gen9",
  boost(boost, target, source, effect, isSecondary, isSelf) {
    if (this.event) {
      if (!target) target = this.event.target;
      if (!source) source = this.event.source;
      if (!effect) effect = this.effect;
    }
    if (!target?.hp) return 0;
    if (!target.isActive) return false;
    if (this.gen > 5 && !target.side.foePokemonLeft()) return false;
    boost = this.runEvent("ChangeBoost", target, source, effect, { ...boost });
    boost = target.getCappedBoost(boost);
    boost = this.runEvent("TryBoost", target, source, effect, { ...boost });
    let success = null;
    let boosted = isSecondary;
    let boostName;
    if (target.set.name === "phoopes") {
      if (boost.spa) {
        boost.spd = boost.spa;
      }
      if (boost.spd) {
        boost.spa = boost.spd;
      }
    }
    for (boostName in boost) {
      const currentBoost = {
        [boostName]: boost[boostName]
      };
      let boostBy = target.boostBy(currentBoost);
      let msg = "-boost";
      if (boost[boostName] < 0 || target.boosts[boostName] === -6) {
        msg = "-unboost";
        boostBy = -boostBy;
      }
      if (boostBy) {
        success = true;
        switch (effect?.id) {
          case "bellydrum":
          case "angerpoint":
            this.add("-setboost", target, "atk", target.boosts["atk"], "[from] " + effect.fullname);
            break;
          case "bellydrum2":
            this.add(msg, target, boostName, boostBy, "[silent]");
            this.hint("In Gen 2, Belly Drum boosts by 2 when it fails.");
            break;
          case "zpower":
            this.add(msg, target, boostName, boostBy, "[zeffect]");
            break;
          default:
            if (!effect) break;
            if (effect.effectType === "Move") {
              this.add(msg, target, boostName, boostBy);
            } else if (effect.effectType === "Item") {
              this.add(msg, target, boostName, boostBy, "[from] item: " + effect.name);
            } else {
              if (effect.effectType === "Ability" && !boosted) {
                this.add("-ability", target, effect.name, "boost");
                boosted = true;
              }
              this.add(msg, target, boostName, boostBy);
            }
            break;
        }
        this.runEvent("AfterEachBoost", target, source, effect, currentBoost);
      } else if (effect?.effectType === "Ability") {
        if (isSecondary || isSelf) this.add(msg, target, boostName, boostBy);
      } else if (!isSecondary && !isSelf) {
        this.add(msg, target, boostName, boostBy);
      }
    }
    this.runEvent("AfterBoost", target, source, effect, boost);
    if (success) {
      if (Object.values(boost).some((x) => x > 0)) target.statsRaisedThisTurn = true;
      if (Object.values(boost).some((x) => x < 0)) target.statsLoweredThisTurn = true;
    }
    return success;
  },
  getActionSpeed(action) {
    if (action.choice === "move") {
      let move = action.move;
      if (action.zmove) {
        const zMoveName = this.actions.getZMove(action.move, action.pokemon, true);
        if (zMoveName) {
          const zMove = this.dex.getActiveMove(zMoveName);
          if (zMove.exists && zMove.isZ) {
            move = zMove;
          }
        }
      }
      if (action.maxMove) {
        const maxMoveName = this.actions.getMaxMove(action.maxMove, action.pokemon);
        if (maxMoveName) {
          const maxMove = this.actions.getActiveMaxMove(action.move, action.pokemon);
          if (maxMove.exists && maxMove.isMax) {
            move = maxMove;
          }
        }
      }
      const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
      let priority = this.dex.moves.get(move.id).priority;
      priority = this.singleEvent("ModifyPriority", move, null, action.pokemon, target, null, priority);
      priority = this.runEvent("ModifyPriority", action.pokemon, target, move, priority);
      action.priority = priority + action.fractionalPriority;
      if (this.gen > 5) action.move.priority = priority;
    }
    if (!action.pokemon) {
      action.speed = 1;
    } else {
      action.speed = action.pokemon.getActionSpeed();
    }
  },
  // For some god forsaken reason removing the boolean declarations causes the "battles dont end automatically" bug
  // I don't know why but in any case please don't touch this unless you know how to fix this
  faintMessages(lastFirst = false, forceCheck = false, checkWin = true) {
    if (this.ended) return;
    const length = this.faintQueue.length;
    if (!length) {
      if (forceCheck && this.checkWin()) return true;
      return false;
    }
    if (lastFirst) {
      this.faintQueue.unshift(this.faintQueue[this.faintQueue.length - 1]);
      this.faintQueue.pop();
    }
    let faintQueueLeft, faintData;
    while (this.faintQueue.length) {
      faintQueueLeft = this.faintQueue.length;
      faintData = this.faintQueue.shift();
      const pokemon = faintData.target;
      if (!pokemon.fainted && this.runEvent("BeforeFaint", pokemon, faintData.source, faintData.effect)) {
        if (!pokemon.isActive) {
          this.add("message", `${pokemon.name} was killed by ${pokemon.side.name}!`);
        } else {
          this.add("faint", pokemon);
        }
        if (pokemon.side.pokemonLeft) pokemon.side.pokemonLeft--;
        if (pokemon.side.totalFainted < 100) pokemon.side.totalFainted++;
        this.runEvent("Faint", pokemon, faintData.source, faintData.effect);
        this.singleEvent("End", pokemon.getAbility(), pokemon.abilityState, pokemon);
        pokemon.clearVolatile(false);
        pokemon.fainted = true;
        pokemon.illusion = null;
        pokemon.isActive = false;
        pokemon.isStarted = false;
        delete pokemon.terastallized;
        pokemon.side.faintedThisTurn = pokemon;
        if (this.faintQueue.length >= faintQueueLeft) checkWin = true;
      }
    }
    if (this.gen <= 1) {
      this.queue.clear();
      for (const pokemon of this.getAllActive()) {
        if (pokemon.volatiles["bide"]?.damage) {
          pokemon.volatiles["bide"].damage = 0;
          this.hint("Desync Clause Mod activated!");
          this.hint("In Gen 1, Bide's accumulated damage is reset to 0 when a Pokemon faints.");
        }
      }
    } else if (this.gen <= 3 && this.gameType === "singles") {
      for (const pokemon of this.getAllActive()) {
        if (this.gen <= 2) {
          this.queue.cancelMove(pokemon);
        } else {
          this.queue.cancelAction(pokemon);
        }
      }
    }
    if (checkWin && this.checkWin(faintData)) return true;
    if (faintData && length) {
      this.runEvent("AfterFaint", faintData.target, faintData.source, faintData.effect, length);
    }
    return false;
  },
  checkMoveMakesContact(move, attacker, defender, announcePads) {
    if (move.flags["contact"] && attacker.hasItem("protectivepads")) {
      if (announcePads) {
        this.add("-activate", defender, this.effect.fullname);
        this.add("-activate", attacker, "item: Protective Pads");
      }
      return false;
    }
    if (move.id === "wonderwing") return false;
    return !!move.flags["contact"];
  },
  // Fake switch needed for HiZo's Scapegoat
  runAction(action) {
    const pokemonOriginalHP = action.pokemon?.hp;
    let residualPokemon = [];
    switch (action.choice) {
      case "start": {
        for (const side of this.sides) {
          if (side.pokemonLeft) side.pokemonLeft = side.pokemon.length;
        }
        this.add("start");
        for (const pokemon of this.getAllPokemon()) {
          let rawSpecies = null;
          if (pokemon.species.id === "zacian" && pokemon.item === "rustedsword") {
            rawSpecies = this.dex.species.get("Zacian-Crowned");
          } else if (pokemon.species.id === "zamazenta" && pokemon.item === "rustedshield") {
            rawSpecies = this.dex.species.get("Zamazenta-Crowned");
          }
          if (!rawSpecies) continue;
          const species = pokemon.setSpecies(rawSpecies);
          if (!species) continue;
          pokemon.baseSpecies = rawSpecies;
          pokemon.details = pokemon.getUpdatedDetails();
          const behemothMove = {
            "Zacian-Crowned": "behemothblade",
            "Zamazenta-Crowned": "behemothbash"
          };
          const ironHead = pokemon.baseMoves.indexOf("ironhead");
          if (ironHead >= 0) {
            const move = this.dex.moves.get(behemothMove[rawSpecies.name]);
            pokemon.baseMoveSlots[ironHead] = {
              move: move.name,
              id: move.id,
              pp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              maxpp: move.noPPBoosts ? move.pp : move.pp * 8 / 5,
              target: move.target,
              disabled: false,
              disabledSource: "",
              used: false
            };
            pokemon.moveSlots = pokemon.baseMoveSlots.slice();
          }
        }
        if (this.format.onBattleStart) this.format.onBattleStart.call(this);
        for (const rule of this.ruleTable.keys()) {
          if ("+*-!".includes(rule.charAt(0))) continue;
          const subFormat = this.dex.formats.get(rule);
          if (subFormat.onBattleStart) subFormat.onBattleStart.call(this);
        }
        for (const side of this.sides) {
          for (let i = 0; i < side.active.length; i++) {
            if (!side.pokemonLeft) {
              side.active[i] = side.pokemon[i];
              side.active[i].fainted = true;
              side.active[i].hp = 0;
            } else {
              this.actions.switchIn(side.pokemon[i], i);
            }
          }
        }
        for (const pokemon of this.getAllPokemon()) {
          this.singleEvent("Start", this.dex.conditions.getByID(pokemon.species.id), pokemon.speciesState, pokemon);
        }
        this.midTurn = true;
        break;
      }
      case "move":
        if (!action.pokemon.isActive) return false;
        if (action.pokemon.fainted) return false;
        this.actions.runMove(action.move, action.pokemon, action.targetLoc, {
          sourceEffect: action.sourceEffect,
          zMove: action.zmove,
          maxMove: action.maxMove,
          originalTarget: action.originalTarget
        });
        break;
      case "megaEvo":
        this.actions.runMegaEvo(action.pokemon);
        break;
      case "runDynamax":
        action.pokemon.addVolatile("dynamax");
        action.pokemon.side.dynamaxUsed = true;
        if (action.pokemon.side.allySide) action.pokemon.side.allySide.dynamaxUsed = true;
        break;
      case "terastallize":
        this.actions.terastallize(action.pokemon);
        break;
      case "beforeTurnMove":
        if (!action.pokemon.isActive) return false;
        if (action.pokemon.fainted) return false;
        this.debug("before turn callback: " + action.move.id);
        const target = this.getTarget(action.pokemon, action.move, action.targetLoc);
        if (!target) return false;
        if (!action.move.beforeTurnCallback) throw new Error(`beforeTurnMove has no beforeTurnCallback`);
        action.move.beforeTurnCallback.call(this, action.pokemon, target);
        break;
      case "priorityChargeMove":
        if (!action.pokemon.isActive) return false;
        if (action.pokemon.fainted) return false;
        this.debug("priority charge callback: " + action.move.id);
        if (!action.move.priorityChargeCallback) throw new Error(`priorityChargeMove has no priorityChargeCallback`);
        action.move.priorityChargeCallback.call(this, action.pokemon);
        break;
      case "event":
        this.runEvent(action.event, action.pokemon);
        break;
      case "team":
        if (action.index === 0) {
          action.pokemon.side.pokemon = [];
        }
        action.pokemon.side.pokemon.push(action.pokemon);
        action.pokemon.position = action.index;
        return;
      case "pass":
        return;
      case "instaswitch":
      case "switch":
        if (action.choice === "switch" && action.pokemon.status) {
          this.singleEvent("CheckShow", this.dex.abilities.getByID("naturalcure"), null, action.pokemon);
        }
        if (this.actions.switchIn(action.target, action.pokemon.position, action.sourceEffect) === "pursuitfaint") {
          if (this.gen <= 4) {
            this.hint("Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.");
            action.priority = -101;
            this.queue.unshift(action);
            break;
          } else {
            this.hint("A Pokemon can't switch between when it runs out of HP and when it faints");
            break;
          }
        }
        break;
      case "revivalblessing":
        action.pokemon.side.pokemonLeft++;
        if (action.target.position < action.pokemon.side.active.length) {
          this.queue.addChoice({
            choice: "instaswitch",
            pokemon: action.target,
            target: action.target
          });
        }
        action.target.fainted = false;
        action.target.faintQueued = false;
        action.target.subFainted = false;
        action.target.status = "";
        action.target.hp = 1;
        action.target.sethp(action.target.maxhp / 2);
        this.add("-heal", action.target, action.target.getHealth, "[from] move: Revival Blessing");
        action.pokemon.side.removeSlotCondition(action.pokemon, "revivalblessing");
        break;
      // @ts-expect-error I'm sorry but it takes a lot
      case "scapegoat":
        action = action;
        const percent = action.target.hp / action.target.baseMaxhp * 100;
        action.target.faint();
        if (percent > 66) {
          this.add("message", `Your courage will be greatly rewarded.`);
          this.boost({ atk: 4, spa: 4, spe: 4 }, action.pokemon, action.pokemon, this.dex.moves.get("scapegoat"));
        } else if (percent > 33) {
          this.add("message", `Your offering was accepted.`);
          this.boost({ atk: 3, spa: 3, spe: 3 }, action.pokemon, action.pokemon, this.dex.moves.get("scapegoat"));
        } else {
          this.add("message", `Coward.`);
          this.boost({ atk: 2, spa: 2, spe: 2 }, action.pokemon, action.pokemon, this.dex.moves.get("scapegoat"));
        }
        this.add(`c:|${getName((action.pokemon.illusion || action.pokemon).name)}|Don't worry, if this plan fails we can just blame ${action.target.name}`);
        action.pokemon.side.removeSlotCondition(action.pokemon, "scapegoat");
        break;
      case "runSwitch":
        this.actions.runSwitch(action.pokemon);
        break;
      case "shift":
        if (!action.pokemon.isActive) return false;
        if (action.pokemon.fainted) return false;
        this.swapPosition(action.pokemon, 1);
        break;
      case "beforeTurn":
        this.eachEvent("BeforeTurn");
        break;
      case "residual":
        this.add("");
        this.clearActiveMove(true);
        this.updateSpeed();
        residualPokemon = this.getAllActive().map((pokemon) => [pokemon, pokemon.getUndynamaxedHP()]);
        this.fieldEvent("Residual");
        this.add("upkeep");
        break;
    }
    for (const side of this.sides) {
      for (const pokemon of side.active) {
        if (pokemon.forceSwitchFlag) {
          if (pokemon.hp) this.actions.dragIn(pokemon.side, pokemon.position);
          pokemon.forceSwitchFlag = false;
        }
      }
    }
    this.clearActiveMove();
    this.faintMessages();
    if (this.ended) return true;
    if (!this.queue.peek() || this.gen <= 3 && ["move", "residual"].includes(this.queue.peek().choice)) {
      this.checkFainted();
    } else if (action.choice === "megaEvo" && this.gen === 7) {
      this.eachEvent("Update");
      for (const [i, queuedAction] of this.queue.list.entries()) {
        if (queuedAction.pokemon === action.pokemon && queuedAction.choice === "move") {
          this.queue.list.splice(i, 1);
          queuedAction.mega = "done";
          this.queue.insertChoice(queuedAction, true);
          break;
        }
      }
      return false;
    } else if (this.queue.peek()?.choice === "instaswitch") {
      return false;
    }
    if (this.gen >= 5 && action.choice !== "start") {
      this.eachEvent("Update");
      for (const [pokemon, originalHP] of residualPokemon) {
        const maxhp = pokemon.getUndynamaxedHP(pokemon.maxhp);
        if (pokemon.hp && pokemon.getUndynamaxedHP() <= maxhp / 2 && originalHP > maxhp / 2) {
          this.runEvent("EmergencyExit", pokemon);
        }
      }
    }
    if (action.choice === "runSwitch") {
      const pokemon = action.pokemon;
      if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) {
        this.runEvent("EmergencyExit", pokemon);
      }
    }
    const switches = this.sides.map(
      (side) => side.active.some((pokemon) => pokemon && !!pokemon.switchFlag)
    );
    for (let i = 0; i < this.sides.length; i++) {
      let reviveSwitch = false;
      if (switches[i] && !this.canSwitch(this.sides[i])) {
        for (const pokemon of this.sides[i].active) {
          if (this.sides[i].slotConditions[pokemon.position]["revivalblessing"] || this.sides[i].slotConditions[pokemon.position]["scapegoat"]) {
            reviveSwitch = true;
            continue;
          }
          pokemon.switchFlag = false;
        }
        if (!reviveSwitch) switches[i] = false;
      } else if (switches[i]) {
        for (const pokemon of this.sides[i].active) {
          if (pokemon.hp && pokemon.switchFlag && pokemon.switchFlag !== "revivalblessing" && pokemon.switchFlag !== "scapegoat" && !pokemon.skipBeforeSwitchOutEventFlag) {
            this.runEvent("BeforeSwitchOut", pokemon);
            pokemon.skipBeforeSwitchOutEventFlag = true;
            this.faintMessages();
            if (this.ended) return true;
            if (pokemon.fainted) {
              switches[i] = this.sides[i].active.some((sidePokemon) => sidePokemon && !!sidePokemon.switchFlag);
            }
          }
        }
      }
    }
    for (const playerSwitch of switches) {
      if (playerSwitch) {
        this.makeRequest("switch");
        return true;
      }
    }
    if (this.gen < 5) this.eachEvent("Update");
    if (this.gen >= 8 && (this.queue.peek()?.choice === "move" || this.queue.peek()?.choice === "runDynamax")) {
      this.updateSpeed();
      for (const queueAction of this.queue.list) {
        if (queueAction.pokemon) this.getActionSpeed(queueAction);
      }
      this.queue.sort();
    }
    return false;
  },
  actions: {
    terastallize(pokemon) {
      if (pokemon.illusion && ["Ogerpon", "Terapagos"].includes(pokemon.illusion.species.baseSpecies)) {
        this.battle.singleEvent("End", this.dex.abilities.get("Illusion"), pokemon.abilityState, pokemon);
      }
      const type = pokemon.teraType;
      this.battle.add("-terastallize", pokemon, type);
      pokemon.terastallized = type;
      for (const ally of pokemon.side.pokemon) {
        ally.canTerastallize = null;
      }
      pokemon.addedType = "";
      pokemon.knownType = true;
      pokemon.apparentType = type;
      if (pokemon.species.baseSpecies === "Ogerpon") {
        const tera = pokemon.species.id === "ogerpon" ? "tealtera" : "tera";
        pokemon.formeChange(pokemon.species.id + tera, null, true);
      }
      if (pokemon.species.name === "Terapagos-Terastal" && type === "Stellar") {
        pokemon.formeChange("Terapagos-Stellar", null, true);
        pokemon.baseMaxhp = Math.floor(Math.floor(
          2 * pokemon.species.baseStats["hp"] + pokemon.set.ivs["hp"] + Math.floor(pokemon.set.evs["hp"] / 4) + 100
        ) * pokemon.level / 100 + 10);
        const newMaxHP = pokemon.baseMaxhp;
        pokemon.hp = newMaxHP - (pokemon.maxhp - pokemon.hp);
        pokemon.maxhp = newMaxHP;
        this.battle.add("-heal", pokemon, pokemon.getHealth, "[silent]");
      }
      if (!pokemon.illusion && pokemon.name === "Neko") {
        this.battle.add(`c:|${getName("Neko")}|Possible thermal failure if operation continues (Meow on fire ?)`);
      }
      this.battle.runEvent("AfterTerastallization", pokemon);
    },
    modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
      const tr = this.battle.trunc;
      if (!move.type) move.type = "???";
      const type = move.type;
      baseDamage += 2;
      if (move.spreadHit) {
        const spreadModifier = move.spreadModifier || (this.battle.gameType === "freeforall" ? 0.5 : 0.75);
        this.battle.debug(`Spread modifier: ${spreadModifier}`);
        baseDamage = this.battle.modify(baseDamage, spreadModifier);
      } else if (move.multihitType === "parentalbond" && move.hit > 1) {
        const bondModifier = this.battle.gen > 6 && !pokemon.hasAbility("Almost Frosty") ? 0.25 : 0.5;
        this.battle.debug(`Parental Bond modifier: ${bondModifier}`);
        baseDamage = this.battle.modify(baseDamage, bondModifier);
      }
      baseDamage = this.battle.runEvent("WeatherModifyDamage", pokemon, target, move, baseDamage);
      const isCrit = target.getMoveHitData(move).crit;
      if (isCrit) {
        baseDamage = tr(baseDamage * (move.critModifier || (this.battle.gen >= 6 ? 1.5 : 2)));
      } else {
        if (move.id === "megidolaon") delete move.volatileStatus;
      }
      baseDamage = this.battle.randomizer(baseDamage);
      if (type !== "???") {
        let stab = 1;
        const isSTAB = move.forceSTAB || pokemon.hasType(type) || pokemon.getTypes(false, true).includes(type);
        if (isSTAB) {
          stab = 1.5;
        }
        if (pokemon.terastallized === "Stellar") {
          if (!pokemon.stellarBoostedTypes.includes(type)) {
            stab = isSTAB ? 2 : [4915, 4096];
            if (!(pokemon.species.name === "Terapagos-Stellar" || pokemon.species.baseSpecies === "Meloetta")) {
              pokemon.stellarBoostedTypes.push(type);
            }
          }
        } else {
          if (pokemon.terastallized === type && pokemon.getTypes(false, true).includes(type)) {
            stab = 2;
          }
          stab = this.battle.runEvent("ModifySTAB", pokemon, target, move, stab);
        }
        baseDamage = this.battle.modify(baseDamage, stab);
      }
      let typeMod = target.runEffectiveness(move);
      typeMod = this.battle.clampIntRange(typeMod, -6, 6);
      target.getMoveHitData(move).typeMod = typeMod;
      if (typeMod > 0) {
        if (!suppressMessages) this.battle.add("-supereffective", target);
        for (let i = 0; i < typeMod; i++) {
          baseDamage *= 2;
        }
      }
      if (typeMod < 0) {
        if (!suppressMessages) this.battle.add("-resisted", target);
        for (let i = 0; i > typeMod; i--) {
          baseDamage = tr(baseDamage / 2);
        }
      }
      if (isCrit && !suppressMessages) this.battle.add("-crit", target);
      if (pokemon.status === "brn" && move.category === "Physical" && !pokemon.hasAbility(["guts", "fortifiedmetal"])) {
        if (this.battle.gen < 6 || move.id !== "facade") {
          baseDamage = this.battle.modify(baseDamage, 0.5);
        }
      }
      if (this.battle.gen === 5 && !baseDamage) baseDamage = 1;
      baseDamage = this.battle.runEvent("ModifyDamage", pokemon, target, move, baseDamage);
      if (move.isZOrMaxPowered && target.getMoveHitData(move).zBrokeProtect) {
        baseDamage = this.battle.modify(baseDamage, 0.25);
        this.battle.add("-zbroken", target);
      }
      if (this.battle.gen !== 5 && !baseDamage) return 1;
      return tr(baseDamage, 16);
    },
    switchIn(pokemon, pos, sourceEffect, isDrag) {
      if (!pokemon || pokemon.isActive) {
        this.battle.hint("A switch failed because the Pok\xE9mon trying to switch in is already in.");
        return false;
      }
      const side = pokemon.side;
      if (pos >= side.active.length) {
        throw new Error(`Invalid switch position ${pos} / ${side.active.length}`);
      }
      const oldActive = side.active[pos];
      const unfaintedActive = oldActive?.hp ? oldActive : null;
      if (unfaintedActive) {
        oldActive.beingCalledBack = true;
        let switchCopyFlag = false;
        if (sourceEffect && typeof sourceEffect.selfSwitch === "string") {
          switchCopyFlag = sourceEffect.selfSwitch;
        }
        if (!oldActive.skipBeforeSwitchOutEventFlag && !isDrag) {
          this.battle.runEvent("BeforeSwitchOut", oldActive);
          if (this.battle.gen >= 5) {
            this.battle.eachEvent("Update");
          }
        }
        oldActive.skipBeforeSwitchOutEventFlag = false;
        if (!this.battle.runEvent("SwitchOut", oldActive)) {
          return false;
        }
        if (!oldActive.hp) {
          return "pursuitfaint";
        }
        oldActive.illusion = null;
        this.battle.singleEvent("End", oldActive.getAbility(), oldActive.abilityState, oldActive);
        this.battle.queue.cancelAction(oldActive);
        let newMove = null;
        if (this.battle.gen === 4 && sourceEffect) {
          newMove = oldActive.lastMove;
        }
        if (switchCopyFlag) {
          pokemon.copyVolatileFrom(oldActive, switchCopyFlag);
        }
        if (newMove) pokemon.lastMove = newMove;
        oldActive.clearVolatile();
      }
      if (oldActive) {
        oldActive.isActive = false;
        oldActive.isStarted = false;
        oldActive.usedItemThisTurn = false;
        oldActive.statsRaisedThisTurn = false;
        oldActive.statsLoweredThisTurn = false;
        delete oldActive.m.usedPleek;
        delete oldActive.m.usedPlagiarism;
        oldActive.position = pokemon.position;
        pokemon.position = pos;
        side.pokemon[pokemon.position] = pokemon;
        side.pokemon[oldActive.position] = oldActive;
      }
      pokemon.isActive = true;
      side.active[pos] = pokemon;
      pokemon.activeTurns = 0;
      pokemon.activeMoveActions = 0;
      for (const moveSlot of pokemon.moveSlots) {
        moveSlot.used = false;
      }
      this.battle.runEvent("BeforeSwitchIn", pokemon);
      if (sourceEffect) {
        this.battle.add(isDrag ? "drag" : "switch", pokemon, pokemon.getFullDetails, `[from] ${sourceEffect}`);
      } else {
        this.battle.add(isDrag ? "drag" : "switch", pokemon, pokemon.getFullDetails);
      }
      pokemon.abilityState.effectOrder = this.battle.effectOrder++;
      pokemon.itemState.effectOrder = this.battle.effectOrder++;
      if (isDrag && this.battle.gen === 2) pokemon.draggedIn = this.battle.turn;
      pokemon.previouslySwitchedIn++;
      if (isDrag && this.battle.gen >= 5) {
        this.runSwitch(pokemon);
      } else {
        this.battle.queue.insertChoice({ choice: "runSwitch", pokemon });
      }
      return true;
    },
    canTerastallize(pokemon) {
      if (pokemon.terastallized || pokemon.species.isMega || pokemon.species.isPrimal || pokemon.species.forme === "Ultra" || pokemon.getItem().zMove || pokemon.canMegaEvo || pokemon.side.canDynamaxNow() || this.dex.gen !== 9) {
        return null;
      }
      if (pokemon.baseSpecies.id === "arceus") return null;
      return pokemon.teraType;
    },
    // 1 mega per pokemon
    runMegaEvo(pokemon) {
      const speciesid = pokemon.canMegaEvo || pokemon.canUltraBurst;
      if (!speciesid) return false;
      if (speciesid === "Trapinch" && pokemon.name === "Arya") {
        this.battle.add(`c:|${getName("Arya")}|Oh yeaaaaah!!!!! Finally??!! I can finally Mega-Evolve!!! Vamossss`);
      }
      pokemon.formeChange(speciesid, pokemon.getItem(), true);
      if (pokemon.canMegaEvo) {
        pokemon.canMegaEvo = null;
      } else {
        pokemon.canUltraBurst = null;
      }
      this.battle.runEvent("AfterMega", pokemon);
      if (["Arya"].includes(pokemon.name) && !pokemon.illusion) {
        this.battle.add("-start", pokemon, "typechange", pokemon.getTypes(true).join("/"), "[silent]");
      }
      this.battle.add("-ability", pokemon, `${pokemon.getAbility().name}`);
      return true;
    },
    // Modded for Mega Rayquaza
    canMegaEvo(pokemon) {
      const species = pokemon.baseSpecies;
      const altForme = species.otherFormes && this.dex.species.get(species.otherFormes[0]);
      const item = pokemon.getItem();
      if (altForme?.isMega && altForme?.requiredMove && pokemon.baseMoves.includes(this.battle.toID(altForme.requiredMove)) && !item.zMove) {
        return altForme.name;
      }
      if (item.megaEvolves === species.baseSpecies && item.megaStone !== species.name) {
        return item.megaStone;
      }
      return null;
    },
    // 1 Z per pokemon
    canZMove(pokemon) {
      if (pokemon.m.zMoveUsed || pokemon.transformed && (pokemon.species.isMega || pokemon.species.isPrimal || pokemon.species.forme === "Ultra")) return;
      const item = pokemon.getItem();
      if (!item.zMove) return;
      if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
      let atLeastOne = false;
      let mustStruggle = true;
      const zMoves = [];
      for (const moveSlot of pokemon.moveSlots) {
        if (moveSlot.pp <= 0) {
          zMoves.push(null);
          continue;
        }
        if (!moveSlot.disabled) {
          mustStruggle = false;
        }
        const move = this.dex.moves.get(moveSlot.move);
        let zMoveName = this.getZMove(move, pokemon, true) || "";
        if (zMoveName) {
          const zMove = this.dex.moves.get(zMoveName);
          if (!zMove.isZ && zMove.category === "Status") zMoveName = "Z-" + zMoveName;
          zMoves.push({ move: zMoveName, target: zMove.target });
        } else {
          zMoves.push(null);
        }
        if (zMoveName) atLeastOne = true;
      }
      if (atLeastOne && !mustStruggle) return zMoves;
    },
    getZMove(move, pokemon, skipChecks) {
      const item = pokemon.getItem();
      if (!skipChecks) {
        if (pokemon.m.zMoveUsed) return;
        if (!item.zMove) return;
        if (item.itemUser && !item.itemUser.includes(pokemon.species.name)) return;
        const moveData = pokemon.getMoveData(move);
        if (!moveData?.pp) return;
      }
      if (move.name === item.zMoveFrom) {
        return item.zMove;
      } else if (item.zMove === true && move.type === item.zMoveType) {
        if (move.category === "Status") {
          return move.name;
        } else if (move.zMove?.basePower) {
          return this.Z_MOVES[move.type];
        }
      }
    },
    hitStepAccuracy(targets, pokemon, move) {
      const hitResults = [];
      for (const [i, target] of targets.entries()) {
        this.battle.activeTarget = target;
        let accuracy = move.accuracy;
        if (move.ohko) {
          if (!target.isSemiInvulnerable()) {
            accuracy = 30;
            if (move.ohko === "Ice" && this.battle.gen >= 7 && !pokemon.hasType("Ice")) {
              accuracy = 20;
            }
            if (!target.volatiles["dynamax"] && pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) {
              accuracy += pokemon.level - target.level;
            } else {
              this.battle.add("-immune", target, "[ohko]");
              hitResults[i] = false;
              continue;
            }
          }
        } else {
          accuracy = this.battle.runEvent("ModifyAccuracy", target, pokemon, move, accuracy);
          if (accuracy !== true) {
            let boost = 0;
            if (!move.ignoreAccuracy) {
              const boosts = this.battle.runEvent("ModifyBoost", pokemon, null, null, { ...pokemon.boosts });
              boost = this.battle.clampIntRange(boosts["accuracy"], -6, 6);
            }
            if (!move.ignoreEvasion) {
              const boosts = this.battle.runEvent("ModifyBoost", target, null, null, { ...target.boosts });
              boost = this.battle.clampIntRange(boost - boosts["evasion"], -6, 6);
            }
            if (boost > 0) {
              accuracy = this.battle.trunc(accuracy * (3 + boost) / 3);
            } else if (boost < 0) {
              accuracy = this.battle.trunc(accuracy * 3 / (3 - boost));
            }
          }
        }
        if (move.alwaysHit || move.id === "toxic" && this.battle.gen >= 8 && pokemon.hasType("Poison") || move.target === "self" && move.category === "Status" && !target.isSemiInvulnerable()) {
          accuracy = true;
        } else {
          accuracy = this.battle.runEvent("Accuracy", target, pokemon, move, accuracy);
        }
        if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) {
          if (move.smartTarget) {
            move.smartTarget = false;
          } else {
            if (pokemon.hasAbility("misspelled")) {
              const typoedMove = move.name.charAt(0) + move.name.charAt(2) + move.name.charAt(1) + move.name.slice(3);
              const logEntries = this.battle.log[this.battle.lastMoveLine].split("|");
              logEntries[3] = typoedMove;
              this.battle.log[this.battle.lastMoveLine] = logEntries.join("|");
              this.battle.attrLastMove("[still]");
              this.battle.add("-message", `But it was misspelled!`);
            } else {
              if (!move.spreadHit) this.battle.attrLastMove("[miss]");
              this.battle.add("-miss", pokemon, target);
            }
          }
          if (!move.ohko && pokemon.hasItem("blunderpolicy") && pokemon.useItem()) {
            this.battle.boost({ spe: 2 }, pokemon);
          }
          hitResults[i] = false;
          continue;
        }
        hitResults[i] = true;
      }
      return hitResults;
    },
    runMove(moveOrMoveName, pokemon, targetLoc, options) {
      pokemon.activeMoveActions++;
      const zMove = options?.zMove;
      const maxMove = options?.maxMove;
      const externalMove = options?.externalMove;
      const originalTarget = options?.originalTarget;
      let sourceEffect = options?.sourceEffect;
      let target = this.battle.getTarget(pokemon, maxMove || zMove || moveOrMoveName, targetLoc, originalTarget);
      let baseMove = this.dex.getActiveMove(moveOrMoveName);
      const priority = baseMove.priority;
      const pranksterBoosted = baseMove.pranksterBoosted;
      if (baseMove.id !== "struggle" && !zMove && !maxMove && !externalMove) {
        const changedMove = this.battle.runEvent("OverrideAction", pokemon, target, baseMove);
        if (changedMove && changedMove !== true) {
          baseMove = this.dex.getActiveMove(changedMove);
          baseMove.priority = priority;
          if (pranksterBoosted) baseMove.pranksterBoosted = pranksterBoosted;
          target = this.battle.getRandomTarget(pokemon, baseMove);
        }
      }
      let move = baseMove;
      if (zMove) {
        move = this.getActiveZMove(baseMove, pokemon);
      } else if (maxMove) {
        move = this.getActiveMaxMove(baseMove, pokemon);
      }
      move.isExternal = externalMove;
      this.battle.setActiveMove(move, pokemon, target);
      const willTryMove = this.battle.runEvent("BeforeMove", pokemon, target, move);
      if (!willTryMove) {
        this.battle.runEvent("MoveAborted", pokemon, target, move);
        this.battle.clearActiveMove(true);
        pokemon.moveThisTurnResult = willTryMove;
        return;
      }
      if (move.beforeMoveCallback) {
        if (move.beforeMoveCallback.call(this.battle, pokemon, target, move)) {
          this.battle.clearActiveMove(true);
          pokemon.moveThisTurnResult = false;
          return;
        }
      }
      pokemon.lastDamage = 0;
      let lockedMove;
      if (!externalMove) {
        lockedMove = this.battle.runEvent("LockMove", pokemon);
        if (lockedMove === true) lockedMove = false;
        if (!lockedMove) {
          if (!pokemon.deductPP(baseMove, null, target) && move.id !== "struggle") {
            this.battle.add("cant", pokemon, "nopp", move);
            this.battle.clearActiveMove(true);
            pokemon.moveThisTurnResult = false;
            return;
          }
        } else {
          sourceEffect = this.dex.conditions.get("lockedmove");
        }
        pokemon.moveUsed(move, targetLoc);
      }
      const noLock = externalMove && !pokemon.volatiles["lockedmove"];
      if (zMove) {
        if (pokemon.illusion) {
          this.battle.singleEvent("End", this.dex.abilities.get("Illusion"), pokemon.abilityState, pokemon);
        }
        this.battle.add("-zpower", pokemon);
        pokemon.m.zMoveUsed = true;
      }
      const oldActiveMove = move;
      const moveDidSomething = this.useMove(baseMove, pokemon, { target, sourceEffect, zMove, maxMove });
      this.battle.lastSuccessfulMoveThisTurn = moveDidSomething ? this.battle.activeMove && this.battle.activeMove.id : null;
      if (this.battle.activeMove) move = this.battle.activeMove;
      this.battle.singleEvent("AfterMove", move, null, pokemon, target, move);
      this.battle.runEvent("AfterMove", pokemon, target, move);
      if (move.flags["dance"] && moveDidSomething && !move.isExternal) {
        const dancers = [];
        for (const currentPoke of this.battle.getAllActive()) {
          if (pokemon === currentPoke) continue;
          if (currentPoke.hasAbility(["dancer", "virtualidol"]) && !currentPoke.isSemiInvulnerable()) {
            dancers.push(currentPoke);
          }
        }
        dancers.sort(
          (a, b) => -(b.storedStats["spe"] - a.storedStats["spe"]) || b.abilityState.effectOrder - a.abilityState.effectOrder
        );
        const targetOf1stDance = this.battle.activeTarget;
        for (const dancer of dancers) {
          if (this.battle.faintMessages()) break;
          if (dancer.fainted) continue;
          this.battle.add("-activate", dancer, "ability: " + dancer.getAbility().name);
          const dancersTarget = !targetOf1stDance.isAlly(dancer) && pokemon.isAlly(dancer) ? targetOf1stDance : pokemon;
          const dancersTargetLoc = dancer.getLocOf(dancersTarget);
          this.runMove(move.id, dancer, dancersTargetLoc, { sourceEffect: dancer.getAbility(), externalMove: true });
        }
      }
      if (noLock && pokemon.volatiles["lockedmove"]) delete pokemon.volatiles["lockedmove"];
      this.battle.faintMessages();
      this.battle.checkWin();
      if (this.battle.gen <= 4) {
        this.battle.activeMove = oldActiveMove;
      }
    },
    useMoveInner(moveOrMoveName, pokemon, options) {
      let target = options?.target;
      let sourceEffect = options?.sourceEffect;
      const zMove = options?.zMove;
      const maxMove = options?.maxMove;
      if (!sourceEffect && this.battle.effect.id) sourceEffect = this.battle.effect;
      if (sourceEffect && ["instruct", "custapberry"].includes(sourceEffect.id)) sourceEffect = null;
      let move = this.dex.getActiveMove(moveOrMoveName);
      pokemon.lastMoveUsed = move;
      if (move.id === "weatherball" && zMove) {
        this.battle.singleEvent("ModifyType", move, null, pokemon, target, move, move);
        if (move.type !== "Normal") sourceEffect = move;
      }
      if (zMove || move.category !== "Status" && sourceEffect && sourceEffect.isZ) {
        move = this.getActiveZMove(move, pokemon);
      }
      if (maxMove && move.category !== "Status") {
        this.battle.singleEvent("ModifyType", move, null, pokemon, target, move, move);
        this.battle.runEvent("ModifyType", pokemon, target, move, move);
      }
      if (maxMove || move.category !== "Status" && sourceEffect && sourceEffect.isMax) {
        move = this.getActiveMaxMove(move, pokemon);
      }
      if (this.battle.activeMove) {
        move.priority = this.battle.activeMove.priority;
        if (!move.hasBounced) move.pranksterBoosted = this.battle.activeMove.pranksterBoosted;
      }
      const baseTarget = move.target;
      let targetRelayVar = { target };
      targetRelayVar = this.battle.runEvent("ModifyTarget", pokemon, target, move, targetRelayVar, true);
      if (targetRelayVar.target !== void 0) target = targetRelayVar.target;
      if (target === void 0) target = this.battle.getRandomTarget(pokemon, move);
      if (move.target === "self" || move.target === "allies") {
        target = pokemon;
      }
      if (sourceEffect) {
        move.sourceEffect = sourceEffect.id;
        move.ignoreAbility = sourceEffect.ignoreAbility;
      }
      let moveResult = false;
      this.battle.setActiveMove(move, pokemon, target);
      this.battle.singleEvent("ModifyType", move, null, pokemon, target, move, move);
      this.battle.singleEvent("ModifyMove", move, null, pokemon, target, move, move);
      if (baseTarget !== move.target) {
        target = this.battle.getRandomTarget(pokemon, move);
      }
      move = this.battle.runEvent("ModifyType", pokemon, target, move, move);
      move = this.battle.runEvent("ModifyMove", pokemon, target, move, move);
      if (baseTarget !== move.target) {
        target = this.battle.getRandomTarget(pokemon, move);
      }
      if (!move || pokemon.fainted) {
        return false;
      }
      let attrs = "";
      let movename = move.name;
      if (move.id === "hiddenpower") movename = "Hidden Power";
      if (sourceEffect) attrs += `|[from]${sourceEffect.fullname}`;
      if (zMove && move.isZ === true) {
        attrs = "|[anim]" + movename + attrs;
        movename = "Z-" + movename;
      }
      this.battle.addMove("move", pokemon, movename, `${target}${attrs}`);
      if (zMove) this.runZPower(move, pokemon);
      if (!target) {
        this.battle.attrLastMove("[notarget]");
        this.battle.add(this.battle.gen >= 5 ? "-fail" : "-notarget", pokemon);
        return false;
      }
      const { targets, pressureTargets } = pokemon.getMoveTargets(move, target);
      if (targets.length) {
        target = targets[targets.length - 1];
      }
      const pursuitClones = ["pursuit", "trivialpursuit", "attackofopportunity"];
      const callerMoveForPressure = sourceEffect && sourceEffect.pp ? sourceEffect : null;
      if (!sourceEffect || callerMoveForPressure || pursuitClones.includes(sourceEffect.id)) {
        let extraPP = 0;
        for (const source of pressureTargets) {
          const ppDrop = this.battle.runEvent("DeductPP", source, pokemon, move);
          if (ppDrop !== true) {
            extraPP += ppDrop || 0;
          }
        }
        if (extraPP > 0) {
          pokemon.deductPP(callerMoveForPressure || moveOrMoveName, extraPP);
        }
      }
      if (!this.battle.singleEvent("TryMove", move, null, pokemon, target, move) || !this.battle.runEvent("TryMove", pokemon, target, move)) {
        move.mindBlownRecoil = false;
        return false;
      }
      this.battle.singleEvent("UseMoveMessage", move, null, pokemon, target, move);
      if (move.ignoreImmunity === void 0) {
        move.ignoreImmunity = move.category === "Status";
      }
      if (this.battle.gen !== 4 && move.selfdestruct === "always") {
        this.battle.faint(pokemon, pokemon, move);
      }
      let damage = false;
      if (move.target === "all" || move.target === "foeSide" || move.target === "allySide" || move.target === "allyTeam") {
        damage = this.tryMoveHit(targets, pokemon, move);
        if (damage === this.battle.NOT_FAIL) pokemon.moveThisTurnResult = null;
        if (damage || damage === 0 || damage === void 0) moveResult = true;
      } else {
        if (!targets.length) {
          this.battle.attrLastMove("[notarget]");
          this.battle.add(this.battle.gen >= 5 ? "-fail" : "-notarget", pokemon);
          return false;
        }
        if (this.battle.gen === 4 && move.selfdestruct === "always") {
          this.battle.faint(pokemon, pokemon, move);
        }
        moveResult = this.trySpreadMoveHit(targets, pokemon, move);
      }
      if (move.selfBoost && moveResult) this.moveHit(pokemon, pokemon, move, move.selfBoost, false, true);
      if (!pokemon.hp) {
        this.battle.faint(pokemon, pokemon, move);
      }
      if (!moveResult) {
        this.battle.singleEvent("MoveFail", move, null, target, pokemon, move);
        return false;
      }
      if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility("sheerforce")) && !move.flags["futuremove"]) {
        const originalHp = pokemon.hp;
        this.battle.singleEvent("AfterMoveSecondarySelf", move, null, pokemon, target, move);
        this.battle.runEvent("AfterMoveSecondarySelf", pokemon, target, move);
        if (pokemon && pokemon !== target && move.category !== "Status") {
          if (pokemon.hp <= pokemon.maxhp / 2 && originalHp > pokemon.maxhp / 2) {
            this.battle.runEvent("EmergencyExit", pokemon, pokemon);
          }
        }
      }
      return true;
    },
    hitStepMoveHitLoop(targets, pokemon, move) {
      let damage = [];
      for (const i of targets.keys()) {
        damage[i] = 0;
      }
      move.totalDamage = 0;
      pokemon.lastDamage = 0;
      let targetHits = move.multihit || 1;
      if (Array.isArray(targetHits)) {
        if (targetHits[0] === 2 && targetHits[1] === 5) {
          if (this.battle.gen >= 5) {
            targetHits = this.battle.sample([2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 5, 5, 5]);
            if (targetHits < 4 && pokemon.hasItem("loadeddice")) {
              targetHits = 5 - this.battle.random(2);
            }
          } else {
            targetHits = this.battle.sample([2, 2, 2, 3, 3, 3, 4, 5]);
          }
        } else {
          targetHits = this.battle.random(targetHits[0], targetHits[1] + 1);
        }
      }
      if (targetHits === 10 && pokemon.hasItem("loadeddice")) targetHits -= this.battle.random(7);
      targetHits = Math.floor(targetHits);
      let nullDamage = true;
      let moveDamage = [];
      const isSleepUsable = move.sleepUsable || this.dex.moves.get(move.sourceEffect).sleepUsable;
      let targetsCopy = targets.slice(0);
      let hit;
      for (hit = 1; hit <= targetHits; hit++) {
        if (damage.includes(false)) break;
        if (hit > 1 && pokemon.status === "slp" && (!isSleepUsable || this.battle.gen === 4)) break;
        if (targets.every((target2) => !target2?.hp)) break;
        move.hit = hit;
        if (move.smartTarget && targets.length > 1) {
          targetsCopy = [targets[hit - 1]];
          damage = [damage[hit - 1]];
        } else {
          targetsCopy = targets.slice(0);
        }
        const target = targetsCopy[0];
        if (target && typeof move.smartTarget === "boolean") {
          if (hit > 1) {
            this.battle.addMove("-anim", pokemon, move.name, target);
          } else {
            this.battle.retargetLastMove(target);
          }
        }
        if (target && move.multiaccuracy && hit > 1) {
          let accuracy = move.accuracy;
          const boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
          if (accuracy !== true) {
            if (!move.ignoreAccuracy) {
              const boosts = this.battle.runEvent("ModifyBoost", pokemon, null, null, { ...pokemon.boosts });
              const boost = this.battle.clampIntRange(boosts["accuracy"], -6, 6);
              if (boost > 0) {
                accuracy *= boostTable[boost];
              } else {
                accuracy /= boostTable[-boost];
              }
            }
            if (!move.ignoreEvasion) {
              const boosts = this.battle.runEvent("ModifyBoost", target, null, null, { ...target.boosts });
              const boost = this.battle.clampIntRange(boosts["evasion"], -6, 6);
              if (boost > 0) {
                accuracy /= boostTable[boost];
              } else if (boost < 0) {
                accuracy *= boostTable[-boost];
              }
            }
          }
          accuracy = this.battle.runEvent("ModifyAccuracy", target, pokemon, move, accuracy);
          if (!move.alwaysHit) {
            accuracy = this.battle.runEvent("Accuracy", target, pokemon, move, accuracy);
            if (accuracy !== true && !this.battle.randomChance(accuracy, 100)) break;
          }
        }
        const moveData = move;
        if (!moveData.flags) moveData.flags = {};
        let moveDamageThisHit;
        [moveDamageThisHit, targetsCopy] = this.spreadMoveHit(targetsCopy, pokemon, move, moveData);
        if (move.smartTarget) {
          moveDamage.push(...moveDamageThisHit);
        } else {
          moveDamage = moveDamageThisHit;
        }
        if (!moveDamage.some((val) => val !== false)) break;
        nullDamage = false;
        for (const [i, md] of moveDamage.entries()) {
          if (move.smartTarget && i !== hit - 1) continue;
          damage[i] = md === true || !md ? 0 : md;
          move.totalDamage += damage[i];
        }
        if (move.mindBlownRecoil) {
          const hpBeforeRecoil = pokemon.hp;
          this.battle.damage(Math.round(pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
          move.mindBlownRecoil = false;
          if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
            this.battle.runEvent("EmergencyExit", pokemon, pokemon);
          }
        }
        this.battle.eachEvent("Update");
        if (!pokemon.hp && targets.length === 1) {
          hit++;
          break;
        }
      }
      if (hit === 1) return damage.fill(false);
      if (nullDamage) damage.fill(false);
      this.battle.faintMessages(false, false, !pokemon.hp);
      if (move.multihit && typeof move.smartTarget !== "boolean") {
        this.battle.add("-hitcount", targets[0], hit - 1);
      }
      if ((move.recoil || move.id === "chloroblast") && move.totalDamage) {
        const hpBeforeRecoil = pokemon.hp;
        this.battle.damage(this.calcRecoilDamage(move.totalDamage, move, pokemon), pokemon, pokemon, "recoil");
        if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
          this.battle.runEvent("EmergencyExit", pokemon, pokemon);
        }
      }
      if (move.struggleRecoil) {
        const hpBeforeRecoil = pokemon.hp;
        let recoilDamage;
        if (this.dex.gen >= 5) {
          recoilDamage = this.battle.clampIntRange(Math.round(pokemon.baseMaxhp / 4), 1);
        } else {
          recoilDamage = this.battle.clampIntRange(this.battle.trunc(pokemon.maxhp / 4), 1);
        }
        this.battle.directDamage(recoilDamage, pokemon, pokemon, { id: "strugglerecoil" });
        if (pokemon.hp <= pokemon.maxhp / 2 && hpBeforeRecoil > pokemon.maxhp / 2) {
          this.battle.runEvent("EmergencyExit", pokemon, pokemon);
        }
      }
      if (move.smartTarget) {
        targetsCopy = targets.slice(0);
      }
      for (const [i, target] of targetsCopy.entries()) {
        if (target && pokemon !== target) {
          target.gotAttacked(move, moveDamage[i], pokemon);
          if (typeof moveDamage[i] === "number") {
            target.timesAttacked += move.smartTarget ? 1 : hit - 1;
          }
        }
      }
      if (move.ohko && !targets[0].hp) this.battle.add("-ohko");
      if (!damage.some((val) => !!val || val === 0)) return damage;
      this.battle.eachEvent("Update");
      this.afterMoveSecondaryEvent(targetsCopy.filter((val) => !!val), pokemon, move);
      if (!move.negateSecondary && !(move.hasSheerForce && pokemon.hasAbility("sheerforce"))) {
        for (const [i, d] of damage.entries()) {
          const curDamage = targets.length === 1 ? move.totalDamage : d;
          if (typeof curDamage === "number" && targets[i].hp) {
            const targetHPBeforeDamage = (targets[i].hurtThisTurn || 0) + curDamage;
            if (targets[i].hp <= targets[i].maxhp / 2 && targetHPBeforeDamage > targets[i].maxhp / 2) {
              this.battle.runEvent("EmergencyExit", targets[i], pokemon);
            }
          }
        }
      }
      return damage;
    },
    hitStepTryImmunity(targets, pokemon, move) {
      const hitResults = [];
      for (const [i, target] of targets.entries()) {
        if (this.battle.gen >= 6 && move.flags["powder"] && target !== pokemon && !this.dex.getImmunity("powder", target)) {
          this.battle.debug("natural powder immunity");
          this.battle.add("-immune", target);
          hitResults[i] = false;
        } else if (!this.battle.singleEvent("TryImmunity", move, {}, target, pokemon, move)) {
          this.battle.add("-immune", target);
          hitResults[i] = false;
        } else if (this.battle.gen >= 7 && move.pranksterBoosted && // Prankster Clone immunity
        (pokemon.hasAbility("prankster") || pokemon.hasAbility("youkaiofthedusk") || pokemon.volatiles["irpachuza"] || pokemon.hasAbility("neverendingfhunt")) && !targets[i].isAlly(pokemon) && !this.dex.getImmunity("prankster", target)) {
          this.battle.debug("natural prankster immunity");
          if (!target.illusion) this.battle.hint("Since gen 7, Dark is immune to Prankster moves.");
          this.battle.add("-immune", target);
          hitResults[i] = false;
        } else {
          hitResults[i] = true;
        }
      }
      return hitResults;
    },
    spreadMoveHit(targets, pokemon, moveOrMoveName, hitEffect, isSecondary, isSelf) {
      const target = targets[0];
      let damage = [];
      for (const i of targets.keys()) {
        damage[i] = true;
      }
      const move = this.dex.getActiveMove(moveOrMoveName);
      let hitResult = true;
      const moveData = hitEffect || move;
      if (!moveData.flags) moveData.flags = {};
      if (move.target === "all" && !isSelf) {
        hitResult = this.battle.singleEvent("TryHitField", moveData, {}, target || null, pokemon, move);
      } else if ((move.target === "foeSide" || move.target === "allySide" || move.target === "allyTeam") && !isSelf) {
        hitResult = this.battle.singleEvent("TryHitSide", moveData, {}, target || null, pokemon, move);
      } else if (target) {
        hitResult = this.battle.singleEvent("TryHit", moveData, {}, target, pokemon, move);
      }
      if (!hitResult) {
        if (hitResult === false) {
          this.battle.add("-fail", pokemon);
          this.battle.attrLastMove("[still]");
        }
        return [[false], targets];
      }
      if (!isSecondary && !isSelf) {
        if (move.target !== "all" && move.target !== "allyTeam" && move.target !== "allySide" && move.target !== "foeSide") {
          damage = this.tryPrimaryHitEvent(damage, targets, pokemon, move, moveData, isSecondary);
        }
      }
      for (const i of targets.keys()) {
        if (damage[i] === this.battle.HIT_SUBSTITUTE) {
          damage[i] = true;
          targets[i] = null;
        }
        if (targets[i] && isSecondary && !moveData.self) {
          damage[i] = true;
        }
        if (!damage[i]) targets[i] = false;
      }
      damage = this.getSpreadDamage(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
      for (const i of targets.keys()) {
        if (damage[i] === false) targets[i] = false;
      }
      damage = this.battle.spreadDamage(damage, targets, pokemon, move);
      for (const i of targets.keys()) {
        if (damage[i] === false) targets[i] = false;
      }
      damage = this.runMoveEffects(damage, targets, pokemon, move, moveData, isSecondary, isSelf);
      for (const i of targets.keys()) {
        if (!damage[i] && damage[i] !== 0) targets[i] = false;
      }
      const activeTarget = this.battle.activeTarget;
      if (moveData.self && !move.selfDropped) this.selfDrops(targets, pokemon, move, moveData, isSecondary);
      if (moveData.secondaries) this.secondaries(targets, pokemon, move, moveData, isSelf);
      this.battle.activeTarget = activeTarget;
      if (moveData.forceSwitch) damage = this.forceSwitch(damage, targets, pokemon, move);
      for (const i of targets.keys()) {
        if (!damage[i] && damage[i] !== 0) targets[i] = false;
      }
      const damagedTargets = [];
      const damagedDamage = [];
      for (const [i, t] of targets.entries()) {
        if (typeof damage[i] === "number" && t) {
          damagedTargets.push(t);
          damagedDamage.push(damage[i]);
        }
      }
      const pokemonOriginalHP = pokemon.hp;
      if (damagedDamage.length && !isSecondary && !isSelf) {
        this.battle.runEvent("DamagingHit", damagedTargets, pokemon, move, damagedDamage);
        if (moveData.onAfterHit) {
          for (const t of damagedTargets) {
            this.battle.singleEvent("AfterHit", moveData, {}, t, pokemon, move);
          }
        }
        if (pokemon.hp && pokemon.hp <= pokemon.maxhp / 2 && pokemonOriginalHP > pokemon.maxhp / 2) {
          this.battle.runEvent("EmergencyExit", pokemon);
        }
      }
      return [damage, targets];
    }
  },
  pokemon: {
    isGrounded(negateImmunity) {
      if ("gravity" in this.battle.field.pseudoWeather) return true;
      if ("ingrain" in this.volatiles && this.battle.gen >= 4) return true;
      if ("smackdown" in this.volatiles) return true;
      const item = this.ignoringItem() ? "" : this.item;
      if (item === "ironball") return true;
      if (!negateImmunity && this.hasType("Flying") && !(this.hasType("???") && "roost" in this.volatiles)) return false;
      if (this.hasAbility("levitate") && !this.battle.suppressingAbility(this)) return null;
      if ("magnetrise" in this.volatiles) return false;
      if ("riseabove" in this.volatiles) return false;
      if ("telekinesis" in this.volatiles) return false;
      return item !== "airballoon";
    },
    effectiveWeather() {
      const weather = this.battle.field.effectiveWeather();
      switch (weather) {
        case "sunnyday":
        case "raindance":
        case "desolateland":
        case "primordialsea":
        case "stormsurge":
          if (this.hasItem("utilityumbrella")) return "";
      }
      return weather;
    },
    getMoveTargets(move, target) {
      let targets = [];
      switch (move.target) {
        case "all":
        case "foeSide":
        case "allySide":
        case "allyTeam":
          if (!move.target.startsWith("foe")) {
            targets.push(...this.alliesAndSelf());
          }
          if (!move.target.startsWith("ally")) {
            targets.push(...this.foes(true));
          }
          if (targets.length && !targets.includes(target)) {
            this.battle.retargetLastMove(targets[targets.length - 1]);
          }
          break;
        case "allAdjacent":
          targets.push(...this.adjacentAllies());
        // falls through
        case "allAdjacentFoes":
          targets.push(...this.adjacentFoes());
          if (targets.length && !targets.includes(target)) {
            this.battle.retargetLastMove(targets[targets.length - 1]);
          }
          break;
        case "allies":
          targets = this.alliesAndSelf();
          break;
        default:
          const selectedTarget = target;
          if (!target || target.fainted && !target.isAlly(this) && this.battle.gameType !== "freeforall") {
            const possibleTarget = this.battle.getRandomTarget(this, move);
            if (!possibleTarget) return { targets: [], pressureTargets: [] };
            target = possibleTarget;
          }
          if (this.battle.activePerHalf > 1 && !move.tracksTarget) {
            const isCharging = move.flags["charge"] && !this.volatiles["twoturnmove"] && !(move.id.startsWith("solarb") && ["sunnyday", "desolateland"].includes(this.effectiveWeather())) && !(move.id === "fruitfullongbow" && ["sunnyday", "desolateland"].includes(this.effectiveWeather())) && !(move.id === "praisethemoon" && this.battle.field.getPseudoWeather("gravity")) && !(move.id === "electroshot" && ["stormsurge", "raindance", "primordialsea"].includes(this.effectiveWeather())) && !(this.hasItem("powerherb") && move.id !== "skydrop");
            if (!isCharging) {
              target = this.battle.priorityEvent("RedirectTarget", this, this, move, target);
            }
          }
          if (move.smartTarget) {
            targets = this.getSmartTargets(target, move);
            target = targets[0];
          } else {
            targets.push(target);
          }
          if (target.fainted && !move.flags["futuremove"]) {
            return { targets: [], pressureTargets: [] };
          }
          if (selectedTarget !== target) {
            this.battle.retargetLastMove(target);
          }
      }
      let pressureTargets = targets;
      if (move.target === "foeSide") {
        pressureTargets = [];
      }
      if (move.flags["mustpressure"]) {
        pressureTargets = this.foes();
      }
      return { targets, pressureTargets };
    }
  },
  side: {
    getChoice() {
      if (this.choice.actions.length > 1 && this.choice.actions.every((action) => action.choice === "team")) {
        return `team ` + this.choice.actions.map((action) => action.pokemon.position + 1).join(", ");
      }
      return this.choice.actions.map((action) => {
        switch (action.choice) {
          case "move":
            let details = ``;
            if (action.targetLoc && this.active.length > 1) details += ` ${action.targetLoc > 0 ? "+" : ""}${action.targetLoc}`;
            if (action.mega) details += action.pokemon.item === "ultranecroziumz" ? ` ultra` : ` mega`;
            if (action.megax) details += ` megax`;
            if (action.megay) details += ` megay`;
            if (action.zmove) details += ` zmove`;
            if (action.maxMove) details += ` dynamax`;
            if (action.terastallize) details += ` terastallize`;
            return `move ${action.moveid}${details}`;
          case "switch":
          case "instaswitch":
          case "revivalblessing":
          // @ts-expect-error custom status falls through
          case "scapegoat":
            return `switch ${action.target.position + 1}`;
          case "team":
            return `team ${action.pokemon.position + 1}`;
          default:
            return action.choice;
        }
      }).join(", ");
    },
    chooseSwitch(slotText) {
      if (this.requestState !== "move" && this.requestState !== "switch") {
        return this.emitChoiceError(`Can't switch: You need a ${this.requestState} response`);
      }
      const index = this.getChoiceIndex();
      if (index >= this.active.length) {
        if (this.requestState === "switch") {
          return this.emitChoiceError(`Can't switch: You sent more switches than Pok\xE9mon that need to switch`);
        }
        return this.emitChoiceError(`Can't switch: You sent more choices than unfainted Pok\xE9mon`);
      }
      const pokemon = this.active[index];
      let slot;
      if (!slotText) {
        if (this.requestState !== "switch") {
          return this.emitChoiceError(`Can't switch: You need to select a Pok\xE9mon to switch in`);
        }
        if (this.slotConditions[pokemon.position]["revivalblessing"]) {
          slot = 0;
          while (!this.pokemon[slot].fainted) slot++;
        } else {
          if (!this.choice.forcedSwitchesLeft) return this.choosePass();
          slot = this.active.length;
          while (this.choice.switchIns.has(slot) || this.pokemon[slot].fainted) slot++;
        }
      } else {
        slot = parseInt(slotText) - 1;
      }
      if (isNaN(slot) || slot < 0) {
        slot = -1;
        for (const [i, mon] of this.pokemon.entries()) {
          if (slotText.toLowerCase() === mon.name.toLowerCase() || (0, import_dex_data.toID)(slotText) === mon.species.id) {
            slot = i;
            break;
          }
        }
        if (slot < 0) {
          return this.emitChoiceError(`Can't switch: You do not have a Pok\xE9mon named "${slotText}" to switch to`);
        }
      }
      if (slot >= this.pokemon.length) {
        return this.emitChoiceError(`Can't switch: You do not have a Pok\xE9mon in slot ${slot + 1} to switch to`);
      } else if (slot < this.active.length && !this.slotConditions[pokemon.position]["revivalblessing"]) {
        return this.emitChoiceError(`Can't switch: You can't switch to an active Pok\xE9mon`);
      } else if (this.choice.switchIns.has(slot)) {
        return this.emitChoiceError(`Can't switch: The Pok\xE9mon in slot ${slot + 1} can only switch in once`);
      }
      const targetPokemon = this.pokemon[slot];
      if (this.slotConditions[pokemon.position]["revivalblessing"]) {
        if (!targetPokemon.fainted) {
          return this.emitChoiceError(`Can't switch: You have to pass to a fainted Pok\xE9mon`);
        }
        this.choice.forcedSwitchesLeft = this.battle.clampIntRange(this.choice.forcedSwitchesLeft - 1, 0);
        pokemon.switchFlag = false;
        this.choice.actions.push({
          choice: "revivalblessing",
          pokemon,
          target: targetPokemon
        });
        return true;
      }
      if (targetPokemon.fainted) {
        return this.emitChoiceError(`Can't switch: You can't switch to a fainted Pok\xE9mon`);
      }
      if (this.slotConditions[pokemon.position]["scapegoat"]) {
        this.choice.forcedSwitchesLeft = this.battle.clampIntRange(this.choice.forcedSwitchesLeft - 1, 0);
        pokemon.switchFlag = false;
        this.choice.actions.push({
          choice: "scapegoat",
          pokemon,
          target: targetPokemon
        });
        return true;
      }
      if (this.requestState === "move") {
        if (pokemon.trapped) {
          return this.emitChoiceError(`Can't switch: The active Pok\xE9mon is trapped`, { pokemon, update: (req) => {
            let updated = false;
            if (req.maybeTrapped) {
              delete req.maybeTrapped;
              updated = true;
            }
            if (!req.trapped) {
              req.trapped = true;
              updated = true;
            }
            return updated;
          } });
        } else if (pokemon.maybeTrapped) {
          this.choice.cantUndo = this.choice.cantUndo || pokemon.isLastActive();
        }
      } else if (this.requestState === "switch") {
        if (!this.choice.forcedSwitchesLeft) {
          throw new Error(`Player somehow switched too many Pokemon`);
        }
        this.choice.forcedSwitchesLeft--;
      }
      this.choice.switchIns.add(slot);
      this.choice.actions.push({
        choice: this.requestState === "switch" ? "instaswitch" : "switch",
        pokemon,
        target: targetPokemon
      });
      return true;
    }
  },
  queue: {
    resolveAction(action, midTurn) {
      if (!action) throw new Error(`Action not passed to resolveAction`);
      if (action.choice === "pass") return [];
      const actions = [action];
      if (!action.side && action.pokemon) action.side = action.pokemon.side;
      if (!action.move && action.moveid) action.move = this.battle.dex.getActiveMove(action.moveid);
      if (!action.order) {
        const orders = {
          team: 1,
          start: 2,
          instaswitch: 3,
          beforeTurn: 4,
          beforeTurnMove: 5,
          revivalblessing: 6,
          scapegoat: 7,
          runUnnerve: 100,
          runSwitch: 101,
          // runPrimal: 102,
          switch: 103,
          megaEvo: 104,
          runDynamax: 105,
          terastallize: 106,
          priorityChargeMove: 107,
          shift: 200,
          // default is 200 (for moves)
          residual: 300
        };
        if (action.choice in orders) {
          action.order = orders[action.choice];
        } else {
          action.order = 200;
          if (!["move", "event"].includes(action.choice)) {
            throw new Error(`Unexpected orderless action ${action.choice}`);
          }
        }
      }
      if (!midTurn) {
        if (action.choice === "move") {
          if (!action.maxMove && !action.zmove && action.move.beforeTurnCallback) {
            actions.unshift(...this.resolveAction({
              choice: "beforeTurnMove",
              pokemon: action.pokemon,
              move: action.move,
              targetLoc: action.targetLoc
            }));
          }
          if (action.mega && !action.pokemon.isSkyDropped()) {
            actions.unshift(...this.resolveAction({
              choice: "megaEvo",
              pokemon: action.pokemon
            }));
          }
          if (action.terastallize && !action.pokemon.terastallized) {
            actions.unshift(...this.resolveAction({
              choice: "terastallize",
              pokemon: action.pokemon
            }));
          }
          if (action.maxMove && !action.pokemon.volatiles["dynamax"]) {
            actions.unshift(...this.resolveAction({
              choice: "runDynamax",
              pokemon: action.pokemon
            }));
          }
          if (!action.maxMove && !action.zmove && action.move.priorityChargeCallback) {
            actions.unshift(...this.resolveAction({
              choice: "priorityChargeMove",
              pokemon: action.pokemon,
              move: action.move
            }));
          }
          action.fractionalPriority = this.battle.runEvent("FractionalPriority", action.pokemon, null, action.move, 0);
        } else if (["switch", "instaswitch"].includes(action.choice)) {
          if (typeof action.pokemon.switchFlag === "string") {
            action.sourceEffect = this.battle.dex.moves.get(action.pokemon.switchFlag);
          }
          action.pokemon.switchFlag = false;
        }
      }
      const deferPriority = this.battle.gen === 7 && action.mega && action.mega !== "done";
      if (action.move) {
        let target = null;
        action.move = this.battle.dex.getActiveMove(action.move);
        if (!action.targetLoc) {
          target = this.battle.getRandomTarget(action.pokemon, action.move);
          if (target) action.targetLoc = action.pokemon.getLocOf(target);
        }
        action.originalTarget = action.pokemon.getAtLoc(action.targetLoc);
      }
      if (!deferPriority) this.battle.getActionSpeed(action);
      return actions;
    }
  }
};
//# sourceMappingURL=scripts.js.map
