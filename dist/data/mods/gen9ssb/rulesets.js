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
var rulesets_exports = {};
__export(rulesets_exports, {
  Rulesets: () => Rulesets
});
module.exports = __toCommonJS(rulesets_exports);
const Rulesets = {
  sleepclausemod: {
    inherit: true,
    onSetStatus(status, target, source) {
      if (source?.isAlly(target)) {
        return;
      }
      if (status.id === "slp") {
        for (const pokemon of target.side.pokemon) {
          if (pokemon.hp && pokemon.status === "slp") {
            if (!pokemon.statusState.source?.isAlly(pokemon)) {
              if (source.hasAbility("ididitagain")) {
                this.add("-ability", source, "I Did It Again");
                return;
              }
              this.add("-message", "Sleep Clause Mod activated.");
              this.hint("Sleep Clause Mod prevents players from putting more than one of their opponent's Pok\xE9mon to sleep at a time");
              return false;
            }
          }
        }
      }
    }
  }
};
//# sourceMappingURL=rulesets.js.map
