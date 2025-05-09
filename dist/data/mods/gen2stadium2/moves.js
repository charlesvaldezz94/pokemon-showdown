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
var moves_exports = {};
__export(moves_exports, {
  Moves: () => Moves
});
module.exports = __toCommonJS(moves_exports);
const Moves = {
  // Belly Drum no longer boosts attack by 2 stages if under 50% health.
  bellydrum: {
    inherit: true,
    onHit(target) {
      if (target.boosts.atk >= 6 || target.hp <= target.maxhp / 2) {
        return false;
      }
      this.directDamage(target.maxhp / 2);
      const originalStage = target.boosts.atk;
      let currentStage = originalStage;
      let boosts = 0;
      let loopStage = 0;
      while (currentStage < 6) {
        loopStage = currentStage;
        currentStage++;
        if (currentStage < 6) currentStage++;
        target.boosts.atk = loopStage;
        if (target.getStat("atk", false, true) < 999) {
          target.boosts.atk = currentStage;
          continue;
        }
        target.boosts.atk = currentStage - 1;
        break;
      }
      boosts = target.boosts.atk - originalStage;
      target.boosts.atk = originalStage;
      this.boost({ atk: boosts });
    }
  },
  destinybond: {
    inherit: true,
    onPrepareHit(pokemon) {
      if (pokemon.side.pokemonLeft === 1) {
        this.hint("In Pokemon Stadium 2, Destiny Bond fails if it is being used by your last Pokemon.");
        return false;
      }
    }
  },
  /**
   * In Stadium 2, moves which affect the stat stages of a Pokemon, such as moves which boost ones own stats,
   * lower the targets stats, or Haze, causes the afflicted stat to be re-calculated without factoring in
   * status aliments, thus if a Pokemon is burned or paralyzed and either active Pokemon uses Haze, then their
   * attack and speed are re-calculated while ignoring their status ailments, so their attack would go from 50% to normal
   */
  haze: {
    inherit: true,
    onHitField() {
      this.add("-clearallboost");
      for (const pokemon of this.getAllActive()) {
        pokemon.clearBoosts();
        pokemon.removeVolatile("brnattackdrop");
        pokemon.removeVolatile("parspeeddrop");
      }
    }
  },
  perishsong: {
    inherit: true,
    onPrepareHit(pokemon) {
      if (pokemon.side.pokemonLeft === 1) {
        this.hint("In Pokemon Stadium 2, Perish Song fails if it is being used by your last Pokemon.");
        return false;
      }
    }
  }
};
//# sourceMappingURL=moves.js.map
