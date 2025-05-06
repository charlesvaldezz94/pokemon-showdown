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
var conditions_exports = {};
__export(conditions_exports, {
  Conditions: () => Conditions
});
module.exports = __toCommonJS(conditions_exports);
const Conditions = {
  tox: {
    inherit: true,
    onResidual(pokemon) {
      if (this.effectState.stage < 15) {
        this.effectState.stage++;
      }
      const calc = calculate(this, this.effectState.source, pokemon);
      this.damage(calc * this.clampIntRange(pokemon.baseMaxhp / 16, 1) * this.effectState.stage);
    }
  },
  brn: {
    inherit: true,
    onResidual(pokemon) {
      const calc = calculate(this, this.effectState.source, pokemon);
      this.damage(calc * pokemon.baseMaxhp / 16);
    }
  },
  psn: {
    inherit: true,
    onResidual(pokemon) {
      const calc = calculate(this, this.effectState.source, pokemon);
      this.damage(calc * pokemon.baseMaxhp / 8);
    }
  },
  partiallytrapped: {
    inherit: true,
    onResidual(pokemon) {
      const source = this.effectState.source;
      const gmaxEffect = ["gmaxcentiferno", "gmaxsandblast"].includes(this.effectState.sourceEffect.id);
      if (source && (!source.isActive || source.hp <= 0 || !source.activeTurns) && !gmaxEffect) {
        delete pokemon.volatiles["partiallytrapped"];
        this.add("-end", pokemon, this.effectState.sourceEffect, "[partiallytrapped]", "[silent]");
        return;
      }
      const calc = calculate(this, source, pokemon);
      this.damage(calc * pokemon.baseMaxhp / this.effectState.boundDivisor);
    }
  },
  sandstorm: {
    inherit: true,
    onWeather(target) {
      const calc = calculate(this, this.effectState.source, target);
      this.damage(calc * target.baseMaxhp / 16);
    }
  }
};
function calculate(battle, source, pokemon) {
  const move = battle.dex.getActiveMove("tackle");
  move.type = source.getTypes()[0];
  const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
  if (!pokemon.runImmunity(move.type)) return 0;
  return typeMod;
}
//# sourceMappingURL=conditions.js.map
