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
var items_exports = {};
__export(items_exports, {
  Items: () => Items
});
module.exports = __toCommonJS(items_exports);
const Items = {
  blacksludge: {
    inherit: true,
    onResidual(pokemon) {
      if (pokemon.hasType("Poison")) {
        this.heal(pokemon.baseMaxhp / 16);
      } else {
        const calc = calculate(this, pokemon, pokemon);
        if (calc) this.damage(calc * pokemon.baseMaxhp / 8);
      }
    }
  },
  jabocaberry: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (move.category === "Physical" && source.hp && source.isActive && !source.hasAbility("magicguard")) {
        if (target.eatItem()) {
          const calc = calculate(this, target, source);
          if (calc) this.damage(calc * source.baseMaxhp / (target.hasAbility("ripen") ? 4 : 8), source, target);
        }
      }
    }
  },
  lifeorb: {
    inherit: true,
    onAfterMoveSecondarySelf(source, target, move) {
      if (source && source !== target && move && move.category !== "Status" && !source.forceSwitchFlag) {
        const calc = calculate(this, source, source);
        if (calc) this.damage(calc * source.baseMaxhp / 10, source, source, this.dex.items.get("lifeorb"));
      }
    }
  },
  rockyhelmet: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (this.checkMoveMakesContact(move, source, target)) {
        const calc = calculate(this, target, source);
        if (calc) this.damage(calc * source.baseMaxhp / 6, source, target);
      }
    }
  },
  rowapberry: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (move.category === "Special" && source.hp && source.isActive && !source.hasAbility("magicguard")) {
        if (target.eatItem()) {
          const calc = calculate(this, target, source);
          if (calc) this.damage(calc * source.baseMaxhp / (target.hasAbility("ripen") ? 4 : 8), source, target);
        }
      }
    }
  },
  stickybarb: {
    inherit: true,
    onResidual(pokemon) {
      const calc = calculate(this, pokemon, pokemon);
      if (calc) this.damage(calc * pokemon.baseMaxhp / 8);
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
//# sourceMappingURL=items.js.map
