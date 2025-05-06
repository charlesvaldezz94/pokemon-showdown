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
  // Archas
  lilligantiumz: {
    name: "Lilligantium Z",
    spritenum: 633,
    onTakeItem: false,
    zMove: "Aura Rain",
    zMoveFrom: "Quiver Dance",
    itemUser: ["Lilligant"],
    desc: "If held by a Lilligant with Quiver Dance, it can use Aura Rain."
  },
  // Arya
  flygonite: {
    name: "Flygonite",
    spritenum: 111,
    itemUser: ["Flygon"],
    megaEvolves: "Flygon",
    megaStone: "Trapinch",
    onTakeItem(item, source) {
      if (item.megaEvolves === source.baseSpecies.baseSpecies) return false;
      return true;
    },
    desc: "If held by a Flygon, this item allows it to Mega Evolve in battle."
  },
  // Irpachuza
  irpatuziniumz: {
    name: "Irpatuzinium Z",
    spritenum: 648,
    onTakeItem: false,
    zMove: "Bibbidi-Bobbidi-Rands",
    zMoveFrom: "Fleur Cannon",
    itemUser: ["Mr. Mime"],
    desc: "If held by a Mr. Mime with Fleur Cannon, it can use Bibbidi-Bobbidi-Rands."
  },
  // Loethalion
  gardevoirite: {
    inherit: true,
    itemUser: ["Ralts"],
    megaEvolves: "Ralts",
    desc: "If held by a Ralts, this item allows it to Mega Evolve in battle."
  },
  // Peary
  pearyumz: {
    name: "Pearyum Z",
    spritenum: 647,
    onTakeItem: false,
    zMove: "1000 Gears",
    zMoveFrom: "Gear Grind",
    itemUser: ["Klinklang"],
    desc: "If held by a Klinklang with Gear Grind, it can use 1000 Gears."
  },
  // Rainshaft
  rainiumz: {
    name: "Rainium Z",
    spritenum: 652,
    onTakeItem: false,
    zMove: "Hatsune Miku's Lucky Orb",
    zMoveFrom: "Sparkling Aria",
    itemUser: ["Xerneas"],
    desc: "If held by a Xerneas with Sparkling Aria, it can use Hatsune Miku's Lucky Orb."
  },
  // Modified for other effects
  eviolite: {
    inherit: true,
    onModifyDef(def, pokemon) {
      if (pokemon.baseSpecies.nfe || pokemon.species.id === "pichuspikyeared") {
        return this.chainModify(1.5);
      }
    },
    onModifySpD(spd, pokemon) {
      if (pokemon.baseSpecies.nfe || pokemon.species.id === "pichuspikyeared") {
        return this.chainModify(1.5);
      }
    }
  },
  // modified for nya's ability
  focusband: {
    inherit: true,
    onDamage(damage, target, source, effect) {
      const chance = target.hasAbility("adorablegrace") ? 2 : 1;
      if (this.randomChance(chance, 10) && damage >= target.hp && effect && effect.effectType === "Move") {
        this.add("-activate", target, "item: Focus Band");
        return target.hp - 1;
      }
    }
  },
  quickclaw: {
    inherit: true,
    onFractionalPriority(priority, pokemon) {
      const chance = pokemon.hasAbility("adorablegrace") ? 2 : 1;
      if (priority <= 0 && this.randomChance(chance, 5)) {
        this.add("-activate", pokemon, "item: Quick Claw");
        return 0.1;
      }
    }
  },
  // modified for SexyMalasada's ability
  lifeorb: {
    inherit: true,
    onAfterMoveSecondarySelf(source, target, move) {
      if (source && source !== target && move && move.category !== "Status" && !source.forceSwitchFlag) {
        if (source.hasAbility("Ancestry Ritual")) {
          this.heal(source.baseMaxhp / 10, source, source, this.dex.items.get("lifeorb"));
        } else {
          this.damage(source.baseMaxhp / 10, source, source, this.dex.items.get("lifeorb"));
        }
      }
    }
  },
  safetygoggles: {
    inherit: true,
    onImmunity(type, pokemon) {
      if (type === "sandstorm" || type === "deserteddunes" || type === "hail" || type === "powder") return false;
    }
  },
  utilityumbrella: {
    inherit: true,
    onStart(pokemon) {
      if (!pokemon.ignoringItem()) return;
      if (["sunnyday", "raindance", "desolateland", "primordialsea", "stormsurge"].includes(this.field.effectiveWeather())) {
        this.runEvent("WeatherChange", pokemon, pokemon, this.effect);
      }
    },
    onUpdate(pokemon) {
      if (!this.effectState.inactive) return;
      this.effectState.inactive = false;
      if (["sunnyday", "raindance", "desolateland", "primordialsea", "stormsurge"].includes(this.field.effectiveWeather())) {
        this.runEvent("WeatherChange", pokemon, pokemon, this.effect);
      }
    },
    onEnd(pokemon) {
      if (["sunnyday", "raindance", "desolateland", "primordialsea", "stormsurge"].includes(this.field.effectiveWeather())) {
        this.runEvent("WeatherChange", pokemon, pokemon, this.effect);
      }
      this.effectState.inactive = true;
    }
  }
};
//# sourceMappingURL=items.js.map
