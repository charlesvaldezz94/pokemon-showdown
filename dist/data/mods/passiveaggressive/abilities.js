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
var abilities_exports = {};
__export(abilities_exports, {
  Abilities: () => Abilities
});
module.exports = __toCommonJS(abilities_exports);
const Abilities = {
  aftermath: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (!target.hp && this.checkMoveMakesContact(move, source, target, true)) {
        const calc = calculate(this, target, source);
        this.damage(calc * source.baseMaxhp / 4, source, target);
      }
    }
  },
  baddreams: {
    inherit: true,
    onResidual(pokemon) {
      if (!pokemon.hp) return;
      for (const target of pokemon.foes()) {
        if (target.status === "slp" || target.hasAbility("comatose")) {
          const calc = calculate(this, pokemon, target);
          this.damage(calc * target.baseMaxhp / 8, target, pokemon);
        }
      }
    }
  },
  gulpmissile: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (!source.hp || !source.isActive || target.isSemiInvulnerable()) return;
      if (["cramorantgulping", "cramorantgorging"].includes(target.species.id)) {
        const calc = calculate(this, target, source);
        if (calc) this.damage(calc * source.baseMaxhp / 4, source, target);
        if (target.species.id === "cramorantgulping") {
          this.boost({ def: -1 }, source, target, null, true);
        } else {
          source.trySetStatus("par", target, move);
        }
        target.formeChange("cramorant", move);
      }
    }
  },
  ironbarbs: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (this.checkMoveMakesContact(move, source, target, true)) {
        const calc = calculate(this, target, source);
        this.damage(calc * source.baseMaxhp / 8, source, target);
      }
    }
  },
  roughskin: {
    inherit: true,
    onDamagingHit(damage, target, source, move) {
      if (this.checkMoveMakesContact(move, source, target, true)) {
        const calc = calculate(this, target, source);
        this.damage(calc * source.baseMaxhp / 8, source, target);
      }
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
//# sourceMappingURL=abilities.js.map
