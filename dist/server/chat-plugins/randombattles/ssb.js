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
var ssb_exports = {};
__export(ssb_exports, {
  commands: () => commands,
  disabledSets: () => disabledSets
});
module.exports = __toCommonJS(ssb_exports);
var import_random_teams = require("../../../data/mods/gen9ssb/random-teams");
var import__ = require(".");
class SSBSetHTML extends Chat.JSX.Component {
  render() {
    const { set, dex, baseDex } = this.props;
    if (set.skip) {
      const baseSet = toID(Object.values(import_random_teams.ssbSets[set.skip]).join());
      const skipSet = toID(Object.values(set).join()).slice(0, -toID(set.skip).length);
      if (baseSet === skipSet) return null;
    }
    const sigMove = baseDex.moves.get(set.signatureMove);
    return /* @__PURE__ */ Chat.h("details", null, /* @__PURE__ */ Chat.h("summary", null, "Set"), /* @__PURE__ */ Chat.h("ul", { style: { listStyleType: "none" } }, /* @__PURE__ */ Chat.h("li", null, set.species, set.gender && /* @__PURE__ */ Chat.h(Chat.Fragment, null, " (", set.gender, ")"), set.item && " @ ", Array.isArray(set.item) ? set.item.map((x) => dex.items.get(x).name).join(" / ") : set.item && dex.items.get(set.item).name), /* @__PURE__ */ Chat.h("li", null, "Ability: ", Array.isArray(set.ability) ? set.ability.map((x) => dex.abilities.get(x).name).join(" / ") : dex.abilities.get(set.ability).name), set.teraType && /* @__PURE__ */ Chat.h("li", null, "Tera Type: ", Array.isArray(set.teraType) ? set.teraType.map((x) => dex.types.get(x).name).join(" / ") : set.teraType === "Any" ? "Any" : dex.types.get(set.teraType).name), set.shiny && /* @__PURE__ */ Chat.h("li", null, "Shiny: ", typeof set.shiny === "number" ? `1 in ${set.shiny} chance` : `Yes`), set.evs && /* @__PURE__ */ Chat.h("li", null, "EVs: ", Object.entries(set.evs).filter((v) => !!v[1]).map(([statid, ev], idx, arr) => /* @__PURE__ */ Chat.h(Chat.Fragment, null, ev, " ", import__.STAT_NAMES[statid], idx !== arr.length - 1 && " / "))), set.nature && /* @__PURE__ */ Chat.h("li", null, Array.isArray(set.nature) ? set.nature.map(import__.formatNature).join(" / ") : (0, import__.formatNature)(set.nature), " Nature"), set.ivs && /* @__PURE__ */ Chat.h("li", null, "IVs: ", Object.entries(set.ivs).filter((v) => v[1] !== 31).map(([statid, iv], idx, arr) => /* @__PURE__ */ Chat.h(Chat.Fragment, null, iv, " ", import__.STAT_NAMES[statid], idx !== arr.length - 1 && " / "))), set.moves.map(
      (moveid) => /* @__PURE__ */ Chat.h("li", null, "- ", Array.isArray(moveid) ? moveid.map((x) => dex.moves.get(x).name).join(" / ") : dex.moves.get(moveid).name)
    ), /* @__PURE__ */ Chat.h("li", null, "- ", !sigMove.exists ? /* @__PURE__ */ Chat.h("i", null, sigMove.name) : sigMove.name)));
  }
}
class SSBMoveHTML extends Chat.JSX.Component {
  render() {
    const { sigMove, dex } = this.props;
    const details = {
      Priority: String(sigMove.priority),
      Gen: String(sigMove.gen || 9)
    };
    if (sigMove.isNonstandard === "Past" && dex.gen >= 8) details["Past Gens Only"] = "x";
    if (sigMove.secondary || sigMove.secondaries || sigMove.hasSheerForce) details["Boosted by Sheer Force"] = "";
    if (sigMove.flags["contact"] && dex.gen >= 3) details["Contact"] = "";
    if (sigMove.flags["sound"] && dex.gen >= 3) details["Sound"] = "";
    if (sigMove.flags["bullet"] && dex.gen >= 6) details["Bullet"] = "";
    if (sigMove.flags["pulse"] && dex.gen >= 6) details["Pulse"] = "";
    if (!sigMove.flags["protect"] && sigMove.target !== "self") details["Bypasses Protect"] = "";
    if (sigMove.flags["bypasssub"]) details["Bypasses Substitutes"] = "";
    if (sigMove.flags["defrost"]) details["Thaws user"] = "";
    if (sigMove.flags["bite"] && dex.gen >= 6) details["Bite"] = "";
    if (sigMove.flags["punch"] && dex.gen >= 4) details["Punch"] = "";
    if (sigMove.flags["powder"] && dex.gen >= 6) details["Powder"] = "";
    if (sigMove.flags["reflectable"] && dex.gen >= 3) details["Bounceable"] = "";
    if (sigMove.flags["charge"]) details["Two-turn move"] = "";
    if (sigMove.flags["recharge"]) details["Has recharge turn"] = "";
    if (sigMove.flags["gravity"] && dex.gen >= 4) details["Suppressed by Gravity"] = "x";
    if (sigMove.flags["dance"] && dex.gen >= 7) details["Dance move"] = "";
    if (sigMove.flags["slicing"] && dex.gen >= 9) details["Slicing move"] = "";
    if (sigMove.flags["wind"] && dex.gen >= 9) details["Wind move"] = "";
    if (sigMove.zMove?.basePower) {
      details["Z-Power"] = String(sigMove.zMove.basePower);
    } else if (sigMove.zMove?.effect) {
      const zEffects = {
        clearnegativeboost: "Restores negative stat stages to 0",
        crit2: "Crit ratio +2",
        heal: "Restores HP 100%",
        curse: "Restores HP 100% if user is Ghost type, otherwise Attack +1",
        redirect: "Redirects opposing attacks to user",
        healreplacement: "Restores replacement's HP 100%"
      };
      details["Z-Effect"] = zEffects[sigMove.zMove.effect];
    } else if (sigMove.zMove?.boost) {
      details["Z-Effect"] = "";
      const boost = sigMove.zMove.boost;
      let statid;
      for (statid in boost) {
        details["Z-Effect"] += ` ${Dex.stats.mediumNames[statid]} +${boost[statid]}`;
      }
    } else if (sigMove.isZ && typeof sigMove.isZ === "string") {
      details["Z-Move"] = "";
      const zCrystal = dex.items.get(sigMove.isZ);
      details["Z-Crystal"] = zCrystal.name;
      if (zCrystal.itemUser) {
        details["User"] = zCrystal.itemUser.join(", ");
        details["Required Move"] = dex.items.get(sigMove.isZ).zMoveFrom;
      }
    } else {
      details["Z-Effect"] = "None";
    }
    const targetTypes = {
      normal: "One Adjacent Pok\xE9mon",
      self: "User",
      adjacentAlly: "One Ally",
      adjacentAllyOrSelf: "User or Ally",
      adjacentFoe: "One Adjacent Opposing Pok\xE9mon",
      allAdjacentFoes: "All Adjacent Opponents",
      foeSide: "Opposing Side",
      allySide: "User's Side",
      allyTeam: "User's Side",
      allAdjacent: "All Adjacent Pok\xE9mon",
      any: "Any Pok\xE9mon",
      all: "All Pok\xE9mon",
      scripted: "Chosen Automatically",
      randomNormal: "Random Adjacent Opposing Pok\xE9mon",
      allies: "User and Allies"
    };
    details["Target"] = targetTypes[sigMove.target] || "Unknown";
    if (sigMove.isNonstandard === "Unobtainable") {
      details[`Unobtainable in Gen ${dex.gen}`] = "";
    }
    if (sigMove.shortDesc || sigMove.desc) {
      return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("hr", null), /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: Chat.getDataMoveHTML(sigMove) } }), /* @__PURE__ */ Chat.h("font", { size: "1" }, Object.entries(details).map(([detail, value], idx, arr) => {
        const lastEntry = idx === arr.length - 1;
        if (!value) return /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\u2713 ", detail, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
        if (value === "x") return /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\u2717 ", detail, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
        return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("font", { color: "#686868" }, detail, ":"), " ", value, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
      })), sigMove.desc && sigMove.desc !== sigMove.shortDesc && /* @__PURE__ */ Chat.h("details", null, /* @__PURE__ */ Chat.h("summary", null, /* @__PURE__ */ Chat.h("strong", null, "In-Depth Description")), sigMove.desc));
    }
  }
}
class SSBItemHTML extends Chat.JSX.Component {
  render() {
    const { set, dex, baseDex } = this.props;
    if (!Array.isArray(set.item)) {
      const baseItem = baseDex.items.get(set.item);
      const sigItem = dex.items.get(set.item);
      const details = {
        Gen: String(sigItem.gen)
      };
      if (dex.gen >= 4) {
        if (sigItem.fling) {
          details["Fling Base Power"] = String(sigItem.fling.basePower);
          if (sigItem.fling.status) details["Fling Effect"] = sigItem.fling.status;
          if (sigItem.fling.volatileStatus) details["Fling Effect"] = sigItem.fling.volatileStatus;
          if (sigItem.isBerry) details["Fling Effect"] = "Activates the Berry's effect on the target.";
          if (sigItem.id === "whiteherb") details["Fling Effect"] = "Restores the target's negative stat stages to 0.";
          if (sigItem.id === "mentalherb") {
            const flingEffect = "Removes the effects of Attract, Disable, Encore, Heal Block, Taunt, and Torment from the target.";
            details["Fling Effect"] = flingEffect;
          }
        } else {
          details["Fling"] = "This item cannot be used with Fling.";
        }
      }
      if (sigItem.naturalGift && dex.gen >= 3) {
        details["Natural Gift Type"] = sigItem.naturalGift.type;
        details["Natural Gift Base Power"] = String(sigItem.naturalGift.basePower);
      }
      if (sigItem.isNonstandard && sigItem.isNonstandard !== "Custom") {
        details[`Unobtainable in Gen ${dex.gen}`] = "";
      }
      if (!baseItem.exists || (baseItem.desc || baseItem.shortDesc) !== (sigItem.desc || sigItem.shortDesc)) {
        return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("hr", null), /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: Chat.getDataItemHTML(sigItem) } }), /* @__PURE__ */ Chat.h("font", { size: "1" }, Object.entries(details).map(([detail, value], idx, arr) => {
          const lastEntry = idx === arr.length - 1;
          if (value === "") return /* @__PURE__ */ Chat.h(Chat.Fragment, null, detail, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
          return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("font", { color: "#686868" }, detail, ":"), " ", value, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
        })));
      }
    }
    return /* @__PURE__ */ Chat.h(Chat.Fragment, null);
  }
}
class SSBAbilityHTML extends Chat.JSX.Component {
  render() {
    const { set, dex, baseDex } = this.props;
    const customMegaAbilities = ["Sableye", "Ampharos"];
    if (!Array.isArray(set.ability) && (customMegaAbilities.includes(set.species) || !baseDex.abilities.get(set.ability).exists)) {
      let sigAbil = baseDex.deepClone(dex.abilities.get(set.ability));
      if (customMegaAbilities.includes(set.species)) {
        const megaAbil = dex.species.get(`${set.species}-Mega`).abilities[0];
        sigAbil = baseDex.deepClone(dex.abilities.get(megaAbil));
      }
      if (!sigAbil.desc && !sigAbil.shortDesc) {
        sigAbil.desc = `This ability doesn't have a description. Try contacting the SSB dev team.`;
      }
      const details = {
        Gen: String(sigAbil.gen || 9) || "CAP"
      };
      if (sigAbil.flags["cantsuppress"]) details["Not affected by Gastro Acid"] = "";
      if (sigAbil.flags["breakable"]) details["Ignored by Mold Breaker"] = "";
      return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("hr", null), /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: Chat.getDataAbilityHTML(sigAbil) } }), /* @__PURE__ */ Chat.h("font", { size: "1" }, Object.entries(details).map(([detail, value], idx, arr) => {
        const lastEntry = idx === arr.length - 1;
        if (value === "") return /* @__PURE__ */ Chat.h(Chat.Fragment, null, detail, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
        return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("font", { color: "#686868" }, "$", detail, ":"), " ", value, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
      })), sigAbil.desc && sigAbil.shortDesc && sigAbil.desc !== sigAbil.shortDesc && /* @__PURE__ */ Chat.h("details", null, /* @__PURE__ */ Chat.h("summary", null, /* @__PURE__ */ Chat.h("strong", null, "In-Depth Description")), sigAbil.desc));
    }
    return /* @__PURE__ */ Chat.h(Chat.Fragment, null);
  }
}
class SSBPokemonHTML extends Chat.JSX.Component {
  render() {
    const { species, dex, baseDex } = this.props;
    const origSpecies = baseDex.species.get(species);
    const newSpecies = dex.species.get(species);
    let weighthit = 20;
    if (newSpecies.weighthg >= 2e3) {
      weighthit = 120;
    } else if (newSpecies.weighthg >= 1e3) {
      weighthit = 100;
    } else if (newSpecies.weighthg >= 500) {
      weighthit = 80;
    } else if (newSpecies.weighthg >= 250) {
      weighthit = 60;
    } else if (newSpecies.weighthg >= 100) {
      weighthit = 40;
    }
    const details = {
      "Dex#": String(newSpecies.num),
      Gen: String(newSpecies.gen) || "CAP",
      Height: `${newSpecies.heightm} m`
    };
    details["Weight"] = `{newSpecies.weighthg / 10} kg <em>(${weighthit} BP)</em>`;
    if (newSpecies.color && dex.gen >= 5) details["Dex Colour"] = newSpecies.color;
    if (newSpecies.eggGroups && dex.gen >= 2) details["Egg Group(s)"] = newSpecies.eggGroups.join(", ");
    const evos = [];
    for (const evoName of newSpecies.evos) {
      const evo = dex.species.get(evoName);
      if (evo.gen <= dex.gen) {
        const condition = evo.evoCondition ? ` ${evo.evoCondition}` : ``;
        switch (evo.evoType) {
          case "levelExtra":
            evos.push(`${evo.name} (level-up${condition})`);
            break;
          case "levelFriendship":
            evos.push(`${evo.name} (level-up with high Friendship${condition})`);
            break;
          case "levelHold":
            evos.push(`${evo.name} (level-up holding ${evo.evoItem}${condition})`);
            break;
          case "useItem":
            evos.push(`${evo.name} (${evo.evoItem})`);
            break;
          case "levelMove":
            evos.push(`${evo.name} (level-up with ${evo.evoMove}${condition})`);
            break;
          case "other":
            evos.push(`${evo.name} (${evo.evoCondition})`);
            break;
          case "trade":
            evos.push(`${evo.name} (trade${evo.evoItem ? ` holding ${evo.evoItem}` : condition})`);
            break;
          default:
            evos.push(`${evo.name} (${evo.evoLevel}${condition})`);
        }
      }
    }
    if (!evos.length) {
      details[`<font color="#686868">Does Not Evolve</font>`] = "";
    } else {
      details["Evolution"] = evos.join(", ");
    }
    if (newSpecies.types.join("/") !== origSpecies.types.join("/") || Object.values(newSpecies.abilities).join("/") !== Object.values(origSpecies.abilities).join("/") || Object.values(newSpecies.baseStats).join("/") !== Object.values(origSpecies.baseStats).join("/")) {
      return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("hr", null), /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: Chat.getDataPokemonHTML(newSpecies, dex.gen, "SSB") } }), /* @__PURE__ */ Chat.h("font", { size: "1" }, Object.entries(details).map(([detail, value], idx, arr) => {
        const lastEntry = idx === arr.length - 1;
        if (detail.includes("<font")) {
          return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: detail } }), !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
        }
        return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("font", { color: "#686868" }, detail, ":"), " ", value.includes("<em>") ? /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: value } }) : value, !lastEntry && /* @__PURE__ */ Chat.h(Chat.Fragment, null, "\xA0|&ThickSpace;"));
      })));
    }
  }
}
class SSBInnateHTML extends Chat.JSX.Component {
  render() {
    const { name, dex, baseDex } = this.props;
    let effect = dex.conditions.get(name + "user");
    if (!effect.exists) effect = dex.conditions.get(name);
    const longDesc = ``;
    const baseAbility = baseDex.deepClone(baseDex.abilities.get("noability"));
    if (effect.innateName) {
      baseAbility.name = effect.innateName;
      if (!effect.desc && !effect.shortDesc) {
        baseAbility.desc = baseAbility.shortDesc = "This innate does not have a description.";
      }
      if (effect.desc) baseAbility.desc = effect.desc;
      if (effect.shortDesc) baseAbility.shortDesc = effect.shortDesc;
      return /* @__PURE__ */ Chat.h(Chat.Fragment, null, /* @__PURE__ */ Chat.h("hr", null), "Innate Ability:", /* @__PURE__ */ Chat.h("br", null), /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: Chat.getDataAbilityHTML(baseAbility) } }), /* @__PURE__ */ Chat.h("font", { size: "1" }, /* @__PURE__ */ Chat.h("font", { color: "#686868" }, "Gen:"), " 9"), longDesc && /* @__PURE__ */ Chat.h("details", null, /* @__PURE__ */ Chat.h("summary", null, /* @__PURE__ */ Chat.h("strong", null, "In-Depth Description")), longDesc));
    }
    return /* @__PURE__ */ Chat.h(Chat.Fragment, null);
  }
}
class SSBSetsHTML extends Chat.JSX.Component {
  render() {
    const target = this.props.target;
    const targetID = toID(target);
    const baseDex = Dex;
    const dex = Dex.forFormat("gen9superstaffbrosultimate");
    if (!Object.keys(import_random_teams.ssbSets).map(toID).includes(targetID)) {
      throw new Chat.ErrorMessage(`Error: ${target.trim()} doesn't have a [Gen 9] Super Staff Bros Ultimate set.`);
    }
    let name = "";
    for (const member in import_random_teams.ssbSets) {
      if (toID(member) === targetID) name = member;
    }
    const sets = [];
    for (const set in import_random_teams.ssbSets) {
      if (!set.startsWith(name)) continue;
      if (!import_random_teams.ssbSets[set].skip && set !== name) continue;
      sets.push(set);
    }
    return sets.map((setName) => {
      const set = import_random_teams.ssbSets[setName];
      const mutatedSpecies = dex.species.get(set.species);
      const item = dex.items.get(set.item);
      const sigMove = baseDex.moves.get(set.signatureMove).exists && !Array.isArray(set.item) && typeof item.zMove === "string" ? dex.moves.get(item.zMove) : dex.moves.get(set.signatureMove);
      return /* @__PURE__ */ Chat.h(Chat.Fragment, null, !set.skip ? /* @__PURE__ */ Chat.h("h1", null, /* @__PURE__ */ Chat.h("psicon", { pokemon: mutatedSpecies.id }), setName) : /* @__PURE__ */ Chat.h(
        "span",
        {
          dangerouslySetInnerHTML: { __html: `<details><summary><psicon pokemon="${set.species}" /><strong>${`${setName.split("-").slice(1).join("-")} forme`}</strong></summary>` }
        }
      ), /* @__PURE__ */ Chat.h(SSBSetHTML, { set, dex, baseDex }), (!set.skip || set.signatureMove !== import_random_teams.ssbSets[set.skip].signatureMove) && /* @__PURE__ */ Chat.h(SSBMoveHTML, { sigMove, dex }), /* @__PURE__ */ Chat.h(SSBItemHTML, { set, dex, baseDex }), /* @__PURE__ */ Chat.h(SSBAbilityHTML, { set, dex, baseDex }), /* @__PURE__ */ Chat.h(SSBInnateHTML, { name: setName, dex, baseDex }), /* @__PURE__ */ Chat.h(SSBPokemonHTML, { species: set.species, dex, baseDex }), !Array.isArray(set.item) && item.megaStone && /* @__PURE__ */ Chat.h(SSBPokemonHTML, { species: item.megaStone, dex, baseDex }), "// keys and Kennedy have an itemless forme change", ["Rayquaza"].includes(set.species) && /* @__PURE__ */ Chat.h(SSBPokemonHTML, { species: `${set.species}-Mega`, dex, baseDex }), ["Cinderace"].includes(set.species) && /* @__PURE__ */ Chat.h(SSBPokemonHTML, { species: `${set.species}-Gmax`, dex, baseDex }), set.skip && /* @__PURE__ */ Chat.h("span", { dangerouslySetInnerHTML: { __html: `</details>` } }));
    });
  }
}
const disabledSets = Chat.oldPlugins.ssb?.disabledSets || [];
function enforceDisabledSets() {
  for (const process of Rooms.PM.processes) {
    process.getProcess().send(`EVAL

Config.disabledssbsets = ${JSON.stringify(disabledSets)}`);
  }
}
enforceDisabledSets();
const commands = {
  ssb(target, room, user) {
    if (!this.runBroadcast()) return;
    if (!target) return this.parse(`/help ssb`);
    return this.sendReplyBox(/* @__PURE__ */ Chat.h(SSBSetsHTML, { target }));
  },
  ssbhelp: [
    `/ssb [staff member] - Displays a staff member's Super Staff Bros. set and custom features.`
  ],
  enablessbset: "disablessbset",
  disablessbset(target, room, user, connection, cmd) {
    this.checkCan("rangeban");
    target = toID(target);
    if (!Object.keys(import_random_teams.ssbSets).map(toID).includes(target)) {
      throw new Chat.ErrorMessage(`${target} has no SSB set.`);
    }
    const disableIdx = disabledSets.indexOf(target);
    if (cmd.startsWith("enable")) {
      if (disableIdx < 0) {
        throw new Chat.ErrorMessage(`${target}'s set is not disabled.`);
      }
      disabledSets.splice(disableIdx, 1);
      this.privateGlobalModAction(`${user.name} enabled ${target}'s SSB set.`);
    } else {
      if (disableIdx > -1) {
        throw new Chat.ErrorMessage(`That set is already disabled.`);
      }
      disabledSets.push(target);
      this.privateGlobalModAction(`${user.name} disabled the SSB set for ${target}`);
    }
    enforceDisabledSets();
  }
};
//# sourceMappingURL=ssb.js.map
