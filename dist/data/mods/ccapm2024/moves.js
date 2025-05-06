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
  leechlife: {
    inherit: true,
    onModifyMove(move, pokemon) {
      if (!pokemon.volatiles["bloodsucking"]) return;
      move.basePower = 20;
      move.drain = [1, 1];
      if (pokemon.getStat("atk", false, true) > pokemon.getStat("spa", false, true)) move.category = "Physical";
      pokemon.removeVolatile("bloodsucking");
    }
  },
  // fake moves
  fishingtokens: {
    accuracy: true,
    basePower: 0,
    category: "Status",
    name: "Fishing Tokens",
    pp: 30,
    priority: 0,
    flags: { snatch: 1 },
    sideCondition: "fishingtokens",
    condition: {
      onSideStart(side) {
        this.add("-sidestart", side, "Fishing Tokens");
        this.effectState.layers = 1;
      },
      onSideRestart(side) {
        this.add("-sidestart", side, "Fishing Tokens");
        this.effectState.layers++;
      },
      onSideResidualOrder: 26,
      onSideResidualSubOrder: 2,
      onSideEnd(side) {
        this.add("-sideend", side, "move: Fishing Tokens");
      }
    },
    secondary: null,
    target: "allySide",
    type: "Water",
    zMove: { boost: { spd: 1 } },
    contestType: "Beautiful"
    // they sure are
  }
};
//# sourceMappingURL=moves.js.map
