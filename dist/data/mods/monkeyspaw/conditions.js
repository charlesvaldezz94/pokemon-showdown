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
  monkeyspaw: {
    name: "Monkey's Paw"
  },
  confusion: {
    inherit: true,
    name: "confusion",
    // this is a volatile status
    onStart(target, source, sourceEffect) {
      if (sourceEffect?.id === "lockedmove") {
        this.add("-start", target, "confusion", "[fatigue]");
      } else if (sourceEffect?.effectType === "Ability") {
        this.add("-start", target, "confusion", "[from] ability: " + sourceEffect.name, `[of] ${source}`);
      } else {
        this.add("-start", target, "confusion");
      }
      const min = sourceEffect?.id === "axekick" ? 3 : 2;
      if (!target.m.monkeyPawLuck) this.effectState.time = this.random(min, 6);
    },
    onEnd(target) {
      this.add("-end", target, "confusion");
    },
    onBeforeMovePriority: 3,
    onBeforeMove(pokemon) {
      if (pokemon.m.monkeyPawLuck) pokemon.volatiles["confusion"].time--;
      if (!pokemon.volatiles["confusion"].time && !pokemon.m.monkeyPawLuck) {
        pokemon.removeVolatile("confusion");
        return;
      }
      this.add("-activate", pokemon, "confusion");
      if (!this.randomChance(33, 100)) {
        return;
      }
      this.activeTarget = pokemon;
      const damage = this.actions.getConfusionDamage(pokemon, 40);
      if (typeof damage !== "number") throw new Error("Confusion damage not dealt");
      const activeMove = { id: this.toID("confused"), effectType: "Move", type: "???" };
      this.damage(damage, pokemon, pokemon, activeMove);
      return false;
    }
  }
};
//# sourceMappingURL=conditions.js.map
