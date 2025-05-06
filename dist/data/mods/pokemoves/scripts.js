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
  gen: 9,
  field: {
    suppressingWeather() {
      for (const pokemon of this.battle.getAllActive()) {
        const pokemove = pokemon.m.pokemove;
        if (pokemon && !pokemon.ignoringAbility() && (pokemon.getAbility().suppressWeather || pokemove && pokemon.volatiles["ability:" + this.battle.toID(pokemove.abilities["0"])] && this.battle.dex.abilities.get(pokemove.abilities["0"]).suppressWeather)) {
          return true;
        }
      }
      return false;
    }
  },
  pokemon: {
    hasAbility(ability) {
      if (this.ignoringAbility()) return false;
      if (Array.isArray(ability)) return ability.some((abil) => this.hasAbility(abil));
      const abilityid = this.battle.toID(ability);
      return this.ability === abilityid || !!this.volatiles["ability:" + abilityid];
    },
    ignoringAbility() {
      let neutralizinggas = false;
      for (const pokemon of this.battle.getAllActive()) {
        if ((pokemon.ability === "neutralizinggas" || pokemon.volatiles["ability:neutralizinggas"]) && !pokemon.volatiles["gastroacid"] && !pokemon.abilityState.ending) {
          neutralizinggas = true;
          break;
        }
      }
      return !!(this.battle.gen >= 5 && !this.isActive || (this.volatiles["gastroacid"] || neutralizinggas && (this.ability !== "neutralizinggas" || this.volatiles["ability:neutralizinggas"])) && !this.getAbility().flags["cantsuppress"]);
    }
  }
};
//# sourceMappingURL=scripts.js.map
