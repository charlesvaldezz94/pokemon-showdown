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
var import_sim = require("../../../sim");
var import_field = require("../../../sim/field");
const Scripts = {
  gen: 9,
  inherit: "gen9",
  fieldEvent(eventid, targets) {
    const callbackName = `on${eventid}`;
    let getKey;
    if (eventid === "Residual") {
      getKey = "duration";
    }
    let handlers = this.findFieldEventHandlers(this.field, `onField${eventid}`, getKey);
    for (const side of this.sides) {
      if (side.n < 2 || !side.allySide) {
        handlers = handlers.concat(this.findSideEventHandlers(side, `onSide${eventid}`, getKey));
      }
      for (const active of side.active) {
        if (!active) continue;
        if (eventid === "SwitchIn") {
          handlers = handlers.concat(this.findPokemonEventHandlers(active, `onAny${eventid}`));
        }
        if (targets && !targets.includes(active)) continue;
        const ally = active.side.active.find((mon) => mon && mon !== active && !mon.fainted);
        if (eventid === "SwitchIn" && ally?.m.innate && targets && !targets.includes(ally)) {
          const volatileState = ally.volatiles[ally.m.innate];
          if (volatileState) {
            const volatile = this.dex.conditions.getByID(ally.m.innate);
            let callback = volatile[callbackName];
            if (this.gen >= 5 && !volatile.onSwitchIn && !volatile.onAnySwitchIn) {
              callback = volatile.onStart;
            }
            if (callback !== void 0) {
              const allyHandler = this.resolvePriority({
                effect: volatile,
                callback,
                state: volatileState,
                end: ally.removeVolatile,
                effectHolder: ally
              }, callbackName);
              allyHandler.speed = this.resolvePriority({
                effect: volatile,
                callback,
                state: volatileState,
                end: ally.removeVolatile,
                effectHolder: active
              }, callbackName).speed;
              handlers.push(allyHandler);
            }
          }
        }
        handlers = handlers.concat(this.findPokemonEventHandlers(active, callbackName, getKey));
        handlers = handlers.concat(this.findSideEventHandlers(side, callbackName, void 0, active));
        handlers = handlers.concat(this.findFieldEventHandlers(this.field, callbackName, void 0, active));
        handlers = handlers.concat(this.findBattleEventHandlers(callbackName, getKey, active));
      }
    }
    this.speedSort(handlers);
    while (handlers.length) {
      const handler = handlers[0];
      handlers.shift();
      const effect = handler.effect;
      if (handler.effectHolder.fainted || handler.state?.pic?.fainted) continue;
      if (eventid === "Residual" && handler.end && handler.state?.duration) {
        handler.state.duration--;
        if (!handler.state.duration) {
          const endCallArgs = handler.endCallArgs || [handler.effectHolder, effect.id];
          handler.end.call(...endCallArgs);
          if (this.ended) return;
          continue;
        }
      }
      if (handler.state?.target instanceof import_sim.Pokemon) {
        let expectedStateLocation;
        if (effect.effectType === "Ability" && !handler.state.id.startsWith("ability:")) {
          expectedStateLocation = handler.state.target.abilityState;
        } else if (effect.effectType === "Item" && !handler.state.id.startsWith("item:")) {
          expectedStateLocation = handler.state.target.itemState;
        } else if (effect.effectType === "Status") {
          expectedStateLocation = handler.state.target.statusState;
        } else {
          expectedStateLocation = handler.state.target.volatiles[effect.id];
        }
        if (expectedStateLocation !== handler.state) {
          continue;
        }
      } else if (handler.state?.target instanceof import_sim.Side && !handler.state.isSlotCondition) {
        if (handler.state.target.sideConditions[effect.id] !== handler.state) {
          continue;
        }
      } else if (handler.state?.target instanceof import_field.Field) {
        let expectedStateLocation;
        if (effect.effectType === "Weather") {
          expectedStateLocation = handler.state.target.weatherState;
        } else if (effect.effectType === "Terrain") {
          expectedStateLocation = handler.state.target.terrainState;
        } else {
          expectedStateLocation = handler.state.target.pseudoWeather[effect.id];
        }
        if (expectedStateLocation !== handler.state) {
          continue;
        }
      }
      let handlerEventid = eventid;
      if (handler.effectHolder.sideConditions) handlerEventid = `Side${eventid}`;
      if (handler.effectHolder.pseudoWeather) handlerEventid = `Field${eventid}`;
      if (handler.callback) {
        this.singleEvent(handlerEventid, effect, handler.state, handler.effectHolder, null, null, void 0, handler.callback);
      }
      this.faintMessages();
      if (this.ended) return;
    }
  },
  endTurn() {
    this.turn++;
    this.lastSuccessfulMoveThisTurn = null;
    for (const side of this.sides) {
      for (const pokemon of side.active) {
        pokemon.moveSlots = pokemon.moveSlots.filter((move) => pokemon.m.curMoves.includes(move.id));
        pokemon.m.curMoves = this.dex.deepClone(pokemon.moves);
        const ally = side.active.find((mon) => mon && mon !== pokemon && !mon.fainted);
        let allyMoves = ally ? this.dex.deepClone(ally.moveSlots) : [];
        if (ally) {
          allyMoves = allyMoves.filter((move) => !pokemon.moves.includes(move.id) && ally.m.curMoves.includes(move.id));
          for (const aMove of allyMoves) {
            aMove.pp = this.clampIntRange(aMove.maxpp - (pokemon.m.trackPP.get(aMove.id) || 0), 0);
          }
        }
        pokemon.moveSlots = pokemon.moveSlots.concat(allyMoves);
      }
    }
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
        if (pokemon.volatiles["encore"]) {
          const encoredMove = pokemon.volatiles["encore"].move;
          if (!pokemon.moves.includes(encoredMove)) {
            pokemon.removeVolatile("encore");
          }
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
        if (this.gen >= 7) {
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
    this.makeRequest("move");
  },
  pokemon: {
    setAbility(ability, source, isFromFormeChange) {
      if (!this.hp) return false;
      const BAD_ABILITIES = ["trace", "imposter", "neutralizinggas", "illusion", "wanderingspirit"];
      if (typeof ability === "string") ability = this.battle.dex.abilities.get(ability);
      const oldAbility = this.ability;
      if (!isFromFormeChange) {
        if (ability.flags["cantsuppress"] || this.getAbility().flags["cantsuppress"]) return false;
      }
      if (!this.battle.runEvent("SetAbility", this, source, this.battle.effect, ability)) return false;
      this.battle.singleEvent("End", this.battle.dex.abilities.get(oldAbility), this.abilityState, this, source);
      const ally = this.side.active.find((mon) => mon && mon !== this && !mon.fainted);
      if (ally?.m.innate) {
        ally.removeVolatile(ally.m.innate);
        delete ally.m.innate;
      }
      if (this.battle.effect && this.battle.effect.effectType === "Move" && !isFromFormeChange) {
        this.battle.add(
          "-endability",
          this,
          this.battle.dex.abilities.get(oldAbility),
          `[from] move: ${this.battle.dex.moves.get(this.battle.effect.id)}`
        );
      }
      this.ability = ability.id;
      this.abilityState = this.battle.initEffectState({ id: ability.id, target: this });
      if (ability.id && this.battle.gen > 3) {
        this.battle.singleEvent("Start", ability, this.abilityState, this, source);
        if (ally && ally.ability !== this.ability) {
          if (!this.m.innate) {
            this.m.innate = "ability:" + ally.getAbility().id;
            this.addVolatile(this.m.innate);
          }
          if (!BAD_ABILITIES.includes(ability.id)) {
            ally.m.innate = "ability:" + ability.id;
            ally.addVolatile(ally.m.innate);
          }
        }
      }
      if (this.m.innate?.endsWith(ability.id)) {
        this.removeVolatile(this.m.innate);
        delete this.m.innate;
      }
      return oldAbility;
    },
    hasAbility(ability) {
      if (this.ignoringAbility()) return false;
      const ownAbility = this.ability;
      const ally = this.side.active.find((mon) => mon && mon !== this && !mon.fainted);
      const allyAbility = ally ? ally.ability : "";
      if (!Array.isArray(ability)) {
        if (ownAbility === this.battle.toID(ability) || allyAbility === this.battle.toID(ability)) return true;
      } else {
        if (ability.map(this.battle.toID).includes(ownAbility) || ability.map(this.battle.toID).includes(allyAbility)) {
          return true;
        }
      }
      return false;
    },
    transformInto(pokemon, effect) {
      const species = pokemon.species;
      if (pokemon.fainted || this.illusion || pokemon.illusion || pokemon.volatiles["substitute"] && this.battle.gen >= 5 || pokemon.transformed && this.battle.gen >= 2 || this.transformed && this.battle.gen >= 5 || species.name === "Eternatus-Eternamax" || ["Ogerpon", "Terapagos"].includes(species.baseSpecies) && (this.terastallized || pokemon.terastallized)) {
        return false;
      }
      if (this.battle.dex.currentMod === "gen1stadium" && (species.name === "Ditto" || this.species.name === "Ditto" && pokemon.moves.includes("transform"))) {
        return false;
      }
      if (!this.setSpecies(species, effect, true)) return false;
      this.transformed = true;
      this.weighthg = pokemon.weighthg;
      const types = pokemon.getTypes(true, true);
      this.setType(pokemon.volatiles["roost"] ? pokemon.volatiles["roost"].typeWas : types, true);
      this.addedType = pokemon.addedType;
      this.knownType = this.isAlly(pokemon) && pokemon.knownType;
      this.apparentType = pokemon.apparentType;
      let statName;
      for (statName in this.storedStats) {
        this.storedStats[statName] = pokemon.storedStats[statName];
        if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats[statName];
      }
      this.moveSlots = [];
      this.hpType = this.battle.gen >= 5 ? this.hpType : pokemon.hpType;
      this.hpPower = this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower;
      this.timesAttacked = pokemon.timesAttacked;
      for (const moveSlot of pokemon.moveSlots) {
        let moveName = moveSlot.move;
        if (!pokemon.m.curMoves.includes(moveSlot.id)) continue;
        if (moveSlot.id === "hiddenpower") {
          moveName = "Hidden Power " + this.hpType;
        }
        this.moveSlots.push({
          move: moveName,
          id: moveSlot.id,
          pp: moveSlot.maxpp === 1 ? 1 : 5,
          maxpp: this.battle.gen >= 5 ? moveSlot.maxpp === 1 ? 1 : 5 : moveSlot.maxpp,
          target: moveSlot.target,
          disabled: false,
          used: false,
          virtual: true
        });
      }
      this.m.curMoves = pokemon.m.curMoves;
      let boostName;
      for (boostName in pokemon.boosts) {
        this.boosts[boostName] = pokemon.boosts[boostName];
      }
      if (this.battle.gen >= 6) {
        const volatilesToCopy = ["dragoncheer", "focusenergy", "gmaxchistrike", "laserfocus"];
        for (const volatile of volatilesToCopy) this.removeVolatile(volatile);
        for (const volatile of volatilesToCopy) {
          if (pokemon.volatiles[volatile]) {
            this.addVolatile(volatile);
            if (volatile === "gmaxchistrike") this.volatiles[volatile].layers = pokemon.volatiles[volatile].layers;
            if (volatile === "dragoncheer") this.volatiles[volatile].hasDragonType = pokemon.volatiles[volatile].hasDragonType;
          }
        }
      }
      if (effect) {
        this.battle.add("-transform", this, pokemon, "[from] " + effect.fullname);
      } else {
        this.battle.add("-transform", this, pokemon);
      }
      if (this.terastallized) {
        this.knownType = true;
        this.apparentType = this.terastallized;
      }
      if (this.battle.gen > 2) this.setAbility(pokemon.ability, this, true, true);
      if (this.battle.gen === 4) {
        if (this.species.num === 487) {
          if (this.species.name === "Giratina" && this.item === "griseousorb") {
            this.formeChange("Giratina-Origin");
          } else if (this.species.name === "Giratina-Origin" && this.item !== "griseousorb") {
            this.formeChange("Giratina");
          }
        }
        if (this.species.num === 493) {
          const item = this.getItem();
          const targetForme = item?.onPlate ? "Arceus-" + item.onPlate : "Arceus";
          if (this.species.name !== targetForme) {
            this.formeChange(targetForme);
          }
        }
      }
      if (this.species.baseSpecies === "Ogerpon" && this.canTerastallize) this.canTerastallize = false;
      if (this.species.baseSpecies === "Terapagos" && this.canTerastallize) this.canTerastallize = false;
      return true;
    },
    deductPP(move, amount, target) {
      const gen = this.battle.gen;
      move = this.battle.dex.moves.get(move);
      const ppData = this.getMoveData(move);
      if (!ppData) return 0;
      ppData.used = true;
      if (!ppData.pp && gen > 1) return 0;
      if (!amount) amount = 1;
      ppData.pp -= amount;
      if (ppData.pp < 0 && gen > 1) {
        amount += ppData.pp;
        ppData.pp = 0;
      }
      if (!this.m.curMoves.includes(move.id)) {
        this.m.trackPP.set(move.id, (this.m.trackPP.get(move.id) || 0) + amount);
      }
      return amount;
    }
  }
};
//# sourceMappingURL=scripts.js.map
