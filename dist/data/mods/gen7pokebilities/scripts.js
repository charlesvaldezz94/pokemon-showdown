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
  inherit: "gen7",
  field: {
    suppressingWeather() {
      for (const pokemon of this.battle.getAllActive()) {
        if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() && (pokemon.getAbility().suppressWeather || pokemon.m.innates?.some((k) => this.battle.dex.abilities.get(k).suppressWeather))) {
          return true;
        }
      }
      return false;
    }
  },
  pokemon: {
    ignoringAbility() {
      let neutralizinggas = false;
      for (const pokemon of this.battle.getAllActive()) {
        if ((pokemon.ability === "neutralizinggas" || pokemon.m.innates?.some((k) => k === "neutralizinggas")) && !pokemon.volatiles["gastroacid"] && !pokemon.abilityState.ending) {
          neutralizinggas = true;
          break;
        }
      }
      return !!(this.battle.gen >= 5 && !this.isActive || (this.volatiles["gastroacid"] || neutralizinggas && (this.ability !== "neutralizinggas" || this.m.innates?.some((k) => k === "neutralizinggas"))) && !this.getAbility().flags["cantsuppress"]);
    },
    hasAbility(ability) {
      if (this.ignoringAbility()) return false;
      if (Array.isArray(ability)) return ability.some((abil) => this.hasAbility(abil));
      ability = this.battle.toID(ability);
      return this.ability === ability || !!this.volatiles["ability:" + ability];
    },
    transformInto(pokemon, effect) {
      const species = pokemon.species;
      if (pokemon.fainted || this.illusion || pokemon.illusion || pokemon.volatiles["substitute"] && this.battle.gen >= 5 || pokemon.transformed && this.battle.gen >= 2 || this.transformed && this.battle.gen >= 5 || species.name === "Eternatus-Eternamax") {
        return false;
      }
      if (!this.setSpecies(species, effect, true)) return false;
      this.transformed = true;
      this.weighthg = pokemon.weighthg;
      const types = pokemon.getTypes(true, true);
      this.setType(pokemon.volatiles["roost"] ? pokemon.volatiles["roost"].typeWas : types, true);
      this.addedType = pokemon.addedType;
      this.knownType = this.isAlly(pokemon) && pokemon.knownType;
      this.apparentType = pokemon.apparentType;
      let statName;
      for (statName in this.storedStats) {
        this.storedStats[statName] = pokemon.storedStats[statName];
        if (this.modifiedStats) this.modifiedStats[statName] = pokemon.modifiedStats[statName];
      }
      this.moveSlots = [];
      this.set.ivs = this.battle.gen >= 5 ? this.set.ivs : pokemon.set.ivs;
      this.hpType = this.battle.gen >= 5 ? this.hpType : pokemon.hpType;
      this.hpPower = this.battle.gen >= 5 ? this.hpPower : pokemon.hpPower;
      this.timesAttacked = pokemon.timesAttacked;
      for (const moveSlot of pokemon.moveSlots) {
        let moveName = moveSlot.move;
        if (moveSlot.id === "hiddenpower") {
          moveName = "Hidden Power " + this.hpType;
        }
        this.moveSlots.push({
          move: moveName,
          id: moveSlot.id,
          pp: moveSlot.maxpp === 1 ? 1 : 5,
          maxpp: this.battle.gen >= 5 ? moveSlot.maxpp === 1 ? 1 : 5 : moveSlot.maxpp,
          target: moveSlot.target,
          disabled: false,
          used: false,
          virtual: true
        });
      }
      let boostName;
      for (boostName in pokemon.boosts) {
        this.boosts[boostName] = pokemon.boosts[boostName];
      }
      if (this.battle.gen >= 6) {
        const volatilesToCopy = ["dragoncheer", "focusenergy", "gmaxchistrike", "laserfocus"];
        for (const volatile of volatilesToCopy) this.removeVolatile(volatile);
        for (const volatile of volatilesToCopy) {
          if (pokemon.volatiles[volatile]) {
            this.addVolatile(volatile);
            if (volatile === "gmaxchistrike") this.volatiles[volatile].layers = pokemon.volatiles[volatile].layers;
            if (volatile === "dragoncheer") this.volatiles[volatile].hasDragonType = pokemon.volatiles[volatile].hasDragonType;
          }
        }
      }
      if (effect) {
        this.battle.add("-transform", this, pokemon, "[from] " + effect.fullname);
      } else {
        this.battle.add("-transform", this, pokemon);
      }
      if (this.terastallized && this.terastallized !== this.apparentType) {
        this.battle.add("-start", this, "typechange", this.terastallized, "[silent]");
        this.apparentType = this.terastallized;
      }
      if (this.battle.gen > 2) {
        this.setAbility(pokemon.ability, this, true);
        if (this.m.innates) {
          for (const innate of this.m.innates) {
            this.removeVolatile("ability:" + innate);
          }
        }
        if (pokemon.m.innates) {
          for (const innate of pokemon.m.innates) {
            this.addVolatile("ability:" + innate, this);
          }
        }
      }
      if (this.battle.gen === 4) {
        if (this.species.num === 487) {
          if (this.species.name === "Giratina" && this.item === "griseousorb") {
            this.formeChange("Giratina-Origin");
          } else if (this.species.name === "Giratina-Origin" && this.item !== "griseousorb") {
            this.formeChange("Giratina");
          }
        }
        if (this.species.num === 493) {
          const item = this.getItem();
          const targetForme = item?.onPlate ? "Arceus-" + item.onPlate : "Arceus";
          if (this.species.name !== targetForme) {
            this.formeChange(targetForme);
          }
        }
      }
      return true;
    },
    /**
     * Changes this Pokemon's forme to match the given speciesId (or species).
     * This function handles all changes to stats, ability, type, species, etc.
     * as well as sending all relevant messages sent to the client.
     */
    formeChange(speciesId, source, isPermanent, message) {
      if (!source) source = this.battle.effect;
      const rawSpecies = this.battle.dex.species.get(speciesId);
      const species = this.setSpecies(rawSpecies, source);
      if (!species) return false;
      if (this.battle.gen <= 2) return true;
      const apparentSpecies = this.illusion ? this.illusion.species.name : species.baseSpecies;
      if (isPermanent) {
        this.baseSpecies = rawSpecies;
        this.details = this.getUpdatedDetails();
        this.battle.add("detailschange", this, (this.illusion || this).details);
        if (source.effectType === "Item") {
          this.canTerastallize = null;
          if (source.zMove) {
            this.battle.add("-burst", this, apparentSpecies, species.requiredItem);
            this.moveThisTurnResult = true;
          } else if (source.isPrimalOrb) {
            if (this.illusion) {
              this.ability = "";
              this.battle.add("-primal", this.illusion);
            } else {
              this.battle.add("-primal", this);
            }
          } else {
            this.battle.add("-mega", this, apparentSpecies, species.requiredItem);
            this.moveThisTurnResult = true;
          }
        } else if (source.effectType === "Status") {
          this.battle.add("-formechange", this, species.name, message);
        }
      } else {
        if (source.effectType === "Ability") {
          this.battle.add("-formechange", this, species.name, message, `[from] ability: ${source.name}`);
        } else {
          this.battle.add("-formechange", this, this.illusion ? this.illusion.species.name : species.name, message);
        }
      }
      if (isPermanent && !["disguise", "iceface", "ability:disguise", "ability:iceface"].includes(source.id)) {
        if (this.illusion) {
          this.ability = "";
        }
        this.setAbility(species.abilities["0"], null, true);
        this.baseAbility = this.ability;
      }
      if (this.terastallized && this.terastallized !== this.apparentType) {
        this.battle.add("-start", this, "typechange", this.terastallized, "[silent]");
        this.apparentType = this.terastallized;
      }
      return true;
    }
  }
};
//# sourceMappingURL=scripts.js.map
