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
          const calc = calculate(this.battle, pokemon, pokemon, move.id);
          this.battle.damage(Math.round(calc * pokemon.maxhp / 2), pokemon, pokemon, this.dex.conditions.get(move.id), true);
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
        const recoilDamage = this.calcRecoilDamage(move.totalDamage, move, pokemon);
        if (recoilDamage !== 1.1) this.battle.damage(recoilDamage, pokemon, pokemon, "recoil");
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
    calcRecoilDamage(damageDealt, move, pokemon) {
      const calc = calculate(this.battle, pokemon, pokemon, move.id);
      if (calc === 0) return 1.1;
      if (move.id === "chloroblast") return Math.round(calc * pokemon.maxhp / 2);
      const recoil = Math.round(damageDealt * calc * move.recoil[0] / move.recoil[1]);
      return this.battle.clampIntRange(recoil, 1);
    }
  }
};
function calculate(battle, source, pokemon, moveid = "tackle") {
  const move = battle.dex.getActiveMove(moveid);
  move.type = source.getTypes()[0];
  const typeMod = 2 ** battle.clampIntRange(pokemon.runEffectiveness(move), -6, 6);
  if (!pokemon.runImmunity(move.type)) return 0;
  return typeMod;
}
//# sourceMappingURL=scripts.js.map
