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
  actions: {
    secondaries(targets, source, move, moveData, isSelf) {
      if (!moveData.secondaries) return;
      for (const foe of targets) {
        if (foe === false) continue;
        const secondaries = this.battle.runEvent("ModifySecondaries", foe, source, moveData, moveData.secondaries.slice());
        for (const secondary of secondaries) {
          const secondaryRoll = this.battle.random(100);
          const secondaryOverflow = (secondary.boosts || secondary.self) && this.battle.gen <= 8;
          if (typeof secondary.chance === "undefined" || secondaryRoll < (secondaryOverflow ? secondary.chance % 256 : secondary.chance)) {
            let flag = true;
            if (moveData.secondary?.status && foe) flag = foe.setStatus(moveData.secondary.status, source);
            if (moveData.secondary?.volatileStatus && foe) flag = !(moveData.secondary.volatileStatus in foe.volatiles);
            if (moveData.secondary?.volatileStatus === "flinch" && foe) flag = flag && foe.activeTurns >= 1 && !foe.moveThisTurn;
            this.moveHit(foe, source, move, secondary, true, isSelf);
            if (moveData.secondary?.self?.boosts) {
              Object.entries(moveData.secondary.self.boosts).forEach(([stat, boost]) => {
                if (source.boosts[stat] === 6) flag = false;
              });
            } else {
              if (foe) flag = flag && !(foe.hp === void 0 || foe.hp <= 0);
            }
            if (moveData.target !== "self" && moveData.secondary?.boosts && foe) {
              const cantLower = {
                "atk": ["clearbody", "fullmetalbody", "hypercutter", "whitesmoke"],
                "def": ["bigpecks", "clearbody", "fullmetalbody", "whitesmoke"],
                "spa": ["clearbody", "fullmetalbody", "whitesmoke"],
                "spd": ["clearbody", "fullmetalbody", "whitesmoke"],
                "spe": ["clearbody", "fullmetalbody", "whitesmoke"],
                "accuracy": ["clearbody", "fullmetalbody", "keeneye", "whitesmoke"],
                "evasion": []
              };
              for (const k in moveData.secondary.boosts) {
                if (foe.boosts[k] === -6) {
                  flag = false;
                  continue;
                }
                if (foe.hasAbility(cantLower[k]) && !move.ignoreAbility) {
                  flag = false;
                  break;
                }
              }
            }
            if (source.hasAbility("sheerforce")) flag = false;
            if (foe && foe.hasAbility("shielddust") && !move.ignoreAbility && move.secondary && !move.secondary.self?.boosts) {
              flag = false;
            }
            if (flag && foe && foe.hasAbility("countermeasures") && secondary.chance) {
              this.battle.add("-activate", foe, "ability: Countermeasures");
              this.battle.damage(source.baseMaxhp * (100 - secondary.chance) / 100, source, foe);
            }
          }
        }
      }
    }
  }
};
//# sourceMappingURL=scripts.js.map
