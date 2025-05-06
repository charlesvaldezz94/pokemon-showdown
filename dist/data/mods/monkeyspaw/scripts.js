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
  Scripts: () => Scripts
});
module.exports = __toCommonJS(scripts_exports);
const Scripts = {
  endTurn() {
    this.turn++;
    this.lastSuccessfulMoveThisTurn = null;
    const dynamaxEnding = [];
    for (const pokemon of this.getAllActive()) {
      if (pokemon.volatiles["dynamax"]?.turns === 3) {
        dynamaxEnding.push(pokemon);
      }
    }
    if (dynamaxEnding.length > 1) {
      this.updateSpeed();
      this.speedSort(dynamaxEnding);
    }
    for (const pokemon of dynamaxEnding) {
      pokemon.removeVolatile("dynamax");
    }
    if (this.gen === 1) {
      for (const pokemon of this.getAllActive()) {
        if (pokemon.volatiles["partialtrappinglock"]) {
          const target = pokemon.volatiles["partialtrappinglock"].locked;
          if (target.hp <= 0 || !target.volatiles["partiallytrapped"]) {
            delete pokemon.volatiles["partialtrappinglock"];
          }
        }
        if (pokemon.volatiles["partiallytrapped"]) {
          const source = pokemon.volatiles["partiallytrapped"].source;
          if (source.hp <= 0 || !source.volatiles["partialtrappinglock"]) {
            delete pokemon.volatiles["partiallytrapped"];
          }
        }
      }
    }
    const trappedBySide = [];
    const stalenessBySide = [];
    for (const side of this.sides) {
      let sideTrapped = true;
      let sideStaleness;
      for (const pokemon of side.active) {
        if (!pokemon) continue;
        pokemon.moveThisTurn = "";
        pokemon.newlySwitched = false;
        pokemon.moveLastTurnResult = pokemon.moveThisTurnResult;
        pokemon.moveThisTurnResult = void 0;
        if (this.turn !== 1) {
          pokemon.usedItemThisTurn = false;
          pokemon.statsRaisedThisTurn = false;
          pokemon.statsLoweredThisTurn = false;
          pokemon.hurtThisTurn = null;
        }
        pokemon.maybeDisabled = false;
        pokemon.maybeLocked = false;
        for (const moveSlot of pokemon.moveSlots) {
          moveSlot.disabled = false;
          moveSlot.disabledSource = "";
        }
        this.runEvent("DisableMove", pokemon);
        for (const moveSlot of pokemon.moveSlots) {
          const activeMove = this.dex.getActiveMove(moveSlot.id);
          this.singleEvent("DisableMove", activeMove, null, pokemon);
          if (activeMove.flags["cantusetwice"] && pokemon.lastMove?.id === moveSlot.id) {
            pokemon.disableMove(pokemon.lastMove.id);
          }
        }
        if (pokemon.getLastAttackedBy() && this.gen >= 7) pokemon.knownType = true;
        for (let i = pokemon.attackedBy.length - 1; i >= 0; i--) {
          const attack = pokemon.attackedBy[i];
          if (attack.source.isActive) {
            attack.thisTurn = false;
          } else {
            pokemon.attackedBy.splice(pokemon.attackedBy.indexOf(attack), 1);
          }
        }
        if (this.gen >= 7 && !pokemon.terastallized) {
          const seenPokemon = pokemon.illusion || pokemon;
          const realTypeString = seenPokemon.getTypes(true).join("/");
          if (realTypeString !== seenPokemon.apparentType) {
            this.add("-start", pokemon, "typechange", realTypeString, "[silent]");
            seenPokemon.apparentType = realTypeString;
            if (pokemon.addedType) {
              this.add("-start", pokemon, "typeadd", pokemon.addedType, "[silent]");
            }
          }
        }
        pokemon.trapped = pokemon.maybeTrapped = false;
        this.runEvent("TrapPokemon", pokemon);
        if (!pokemon.knownType || this.dex.getImmunity("trapped", pokemon)) {
          this.runEvent("MaybeTrapPokemon", pokemon);
        }
        if (this.gen > 2) {
          for (const source of pokemon.foes()) {
            const species = (source.illusion || source).species;
            if (!species.abilities) continue;
            for (const abilitySlot in species.abilities) {
              const abilityName = species.abilities[abilitySlot];
              if (abilityName === source.ability) {
                continue;
              }
              const ruleTable = this.ruleTable;
              if ((ruleTable.has("+hackmons") || !ruleTable.has("obtainableabilities")) && !this.format.team) {
                continue;
              } else if (abilitySlot === "H" && species.unreleasedHidden) {
                continue;
              }
              const ability = this.dex.abilities.get(abilityName);
              if (ruleTable.has("-ability:" + ability.id)) continue;
              if (pokemon.knownType && !this.dex.getImmunity("trapped", pokemon)) continue;
              this.singleEvent("FoeMaybeTrapPokemon", ability, {}, pokemon, source);
            }
          }
        }
        if (pokemon.fainted) continue;
        sideTrapped = sideTrapped && pokemon.trapped;
        const staleness = pokemon.volatileStaleness || pokemon.staleness;
        if (staleness) sideStaleness = sideStaleness === "external" ? sideStaleness : staleness;
        pokemon.activeTurns++;
      }
      trappedBySide.push(sideTrapped);
      stalenessBySide.push(sideStaleness);
      side.faintedLastTurn = side.faintedThisTurn;
      side.faintedThisTurn = null;
    }
    if (this.maybeTriggerEndlessBattleClause(trappedBySide, stalenessBySide)) return;
    if (this.gameType === "triples" && this.sides.every((side) => side.pokemonLeft === 1)) {
      const actives = this.getAllActive();
      if (actives.length > 1 && !actives[0].isAdjacent(actives[1])) {
        this.swapPosition(actives[0], 1, "[silent]");
        this.swapPosition(actives[1], 1, "[silent]");
        this.add("-center");
      }
    }
    this.add("turn", this.turn);
    if (this.gameType === "multi") {
      for (const side of this.sides) {
        if (side.canDynamaxNow()) {
          if (this.turn === 1) {
            this.addSplit(side.id, ["-candynamax", side.id]);
          } else {
            this.add("-candynamax", side.id);
          }
        }
      }
    }
    if (this.gen === 2) this.quickClawRoll = this.randomChance(60, 256);
    if (this.gen === 3) this.quickClawRoll = this.randomChance(1, 5);
    let buf = `<div class="broadcast-blue"><details><summary>What does which wish do?</summary>`;
    buf += `&bullet; <b>Mega Evolution:</b> <span style="font-size: 9px;">Revive one fainted Pokemon</span><br />`;
    buf += `&bullet; <b>Mega Evolution X:</b> <span style="font-size: 9px;">Gain a +2 boost in the current Pokemon's dominant attack and defense stat</span><br />`;
    buf += `&bullet; <b>Mega Evolution Y:</b> <span style="font-size: 9px;">Give the current Pokemon innate Serene Grace + Focus Energy for the rest of the game</span><br />`;
    buf += `&bullet; <b>Terastallize:</b> <span style="font-size: 9px;">Scout the active Pokemon for one of their moves</span><br />`;
    buf += `</details></div>`;
    this.add(`raw|${buf}`);
    this.makeRequest("move");
  },
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
          pokemon.setAbility(species.abilities["0"], null, true);
          pokemon.baseAbility = pokemon.ability;
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
      case "megaEvoX":
        this.actions.runMegaEvoX?.(action.pokemon);
        break;
      case "megaEvoY":
        this.actions.runMegaEvoY?.(action.pokemon);
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
        if (!action.sourceEffect) action.target.m.revivedByMonkeysPaw = true;
        this.add("-heal", action.target, action.target.getHealth, "[from] move: Revival Blessing");
        action.pokemon.side.removeSlotCondition(action.pokemon, "revivalblessing");
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
        if (!this.ended) this.add("upkeep");
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
    } else if (["megaEvo", "megaEvoX", "megaEvoY"].includes(action.choice) && this.gen === 7) {
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
          if (this.sides[i].slotConditions[pokemon.position]["revivalblessing"]) {
            reviveSwitch = true;
            continue;
          }
          pokemon.switchFlag = false;
        }
        if (!reviveSwitch) switches[i] = false;
      } else if (switches[i]) {
        for (const pokemon of this.sides[i].active) {
          if (pokemon.hp && pokemon.switchFlag && pokemon.switchFlag !== "revivalblessing" && !pokemon.skipBeforeSwitchOutEventFlag) {
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
    inherit: true,
    canMegaEvo(pokemon) {
      if (!pokemon.side.wishesRemaining) return null;
      if (!pokemon.side.wishes["life"]) return null;
      return "yes";
    },
    canMegaEvoX(pokemon) {
      if (!pokemon.side.wishesRemaining) return null;
      if (!pokemon.side.wishes["power"]) return null;
      return "yes";
    },
    canMegaEvoY(pokemon) {
      if (!pokemon.side.wishesRemaining) return null;
      if (!pokemon.side.wishes["luck"]) return null;
      return "yes";
    },
    canTerastallize(pokemon) {
      if (!pokemon.side.wishesRemaining) return null;
      if (!pokemon.side.wishes["knowledge"]) return null;
      return "Stellar";
    },
    // wish for life (dead teammate is revived, but that teammate has permanent slow start)
    runMegaEvo(pokemon) {
      if (!pokemon.canMegaEvo) return false;
      for (const ally of pokemon.side.pokemon) {
        ally.canMegaEvo = null;
      }
      pokemon.side.wishesRemaining--;
      delete pokemon.side.wishes["life"];
      this.battle.add("message", `The Monkey's Paw curls.`);
      this.battle.add("-message", `${pokemon.side.name} wishes for Life.`);
      this.battle.add("-message", `At the cost of great power, the Pokemon revived will move at a slowed pace permanently.`);
      this.battle.add("-message", `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? "" : "es"} remaining.`);
      this.useMove("revivalblessing", pokemon, { sourceEffect: this.dex.getActiveMove("monkeyspaw") });
      this.battle.runEvent("AfterMega", pokemon);
      return true;
    },
    // wish for power (+2 prominent stat/defense, -2 every other stat)
    runMegaEvoX(pokemon) {
      if (!pokemon.canMegaEvoX) return false;
      for (const ally of pokemon.side.pokemon) {
        ally.canMegaEvoX = null;
      }
      pokemon.side.wishesRemaining--;
      delete pokemon.side.wishes["power"];
      this.battle.add("message", `The Monkey's Paw curls.`);
      this.battle.add("-message", `${pokemon.side.name} wishes for Power.`);
      this.battle.add("-message", `At the cost of great power, ${pokemon.name} has become very frail.`);
      this.battle.add("-message", `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? "" : "es"} remaining.`);
      let positiveBoosts = ["atk", "def"];
      if (pokemon.getStat("spa", false, true) > pokemon.getStat("atk", false, true)) positiveBoosts = ["spa", "spd"];
      const boostsTable = {};
      let boost;
      for (boost in pokemon.boosts) {
        if (boost === "accuracy" || boost === "evasion" || boost === "spe") continue;
        if (positiveBoosts.includes(boost)) {
          boostsTable[boost] = 2;
        } else {
          boostsTable[boost] = -2;
        }
      }
      this.battle.boost(boostsTable, pokemon);
      this.battle.runEvent("AfterMega", pokemon);
      return true;
    },
    // wish for luck (serene grace + focus energy but confused)
    runMegaEvoY(pokemon) {
      if (!pokemon.canMegaEvoY) return false;
      for (const ally of pokemon.side.pokemon) {
        ally.canMegaEvoY = null;
      }
      pokemon.side.wishesRemaining--;
      delete pokemon.side.wishes["luck"];
      this.battle.add("message", `The Monkey's Paw curls.`);
      this.battle.add("-message", `${pokemon.side.name} wishes for Luck.`);
      this.battle.add("-message", `At the cost of great power, ${pokemon.name}'s luck becomes double-edged.`);
      this.battle.add("-message", `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? "" : "es"} remaining.`);
      pokemon.m.monkeyPawLuck = true;
      pokemon.addVolatile("focusenergy");
      pokemon.addVolatile("confusion", null, this.dex.conditions.get("monkeyspaw"));
      this.battle.runEvent("AfterMega", pokemon);
      return true;
    },
    // wish for knowledge
    terastallize(pokemon) {
      if (!pokemon.canTerastallize) return;
      for (const ally of pokemon.side.pokemon) {
        ally.canTerastallize = null;
      }
      pokemon.side.wishesRemaining--;
      delete pokemon.side.wishes["knowledge"];
      this.battle.add("message", `The Monkey's Paw curls.`);
      this.battle.add("-message", `${pokemon.side.name} wishes for Knowledge.`);
      this.battle.add("-message", `At the cost of great power, the knowledge gained comes with increased threat.`);
      this.battle.add("-message", `They have ${pokemon.side.wishesRemaining} wish${pokemon.side.wishesRemaining === 1 ? "" : "es"} remaining.`);
      const foeActive = pokemon.foes()[0];
      if (foeActive) {
        const move = this.dex.getActiveMove(this.battle.sample(foeActive.moveSlots).id);
        this.useMove(
          move,
          foeActive,
          { target: pokemon, zMove: move.category === "Status" ? move.name : this.Z_MOVES[move.type] }
        );
      }
      this.battle.runEvent("AfterTerastallization", pokemon);
    }
    // one more wish
  },
  side: {
    // @ts-expect-error
    wishesRemaining: 4,
    wishes: {
      luck: 1,
      power: 1,
      life: 1,
      knowledge: 1
    }
  }
};
//# sourceMappingURL=scripts.js.map
