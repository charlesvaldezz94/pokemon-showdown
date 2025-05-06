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
var conditions_exports = {};
__export(conditions_exports, {
  Conditions: () => Conditions
});
module.exports = __toCommonJS(conditions_exports);
var import_random_teams = require("./random-teams");
var import_scripts = require("./scripts");
const Conditions = {
  /*
  // Example:
  userid: {
  	noCopy: true,
  	onStart() {
  		this.add(`c:|${getName('Username')}|Switch In Message`);
  	},
  	onSwitchOut() {
  		this.add(`c:|${getName('Username')}|Switch Out Message`);
  	},
  	onFaint() {
  		this.add(`c:|${getName('Username')}|Faint Message`);
  	},
  	// Innate effects go here
  },
  IMPORTANT: Obtain the username from getName
  */
  // Please keep statuses organized alphabetically based on staff member name!
  aegii: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("aegii")}|**It is now aegii's turn to beat you down.**`);
    },
    onSwitchOut(pokemon) {
      if (this.randomChance(2, 100)) {
        this.add(`c:|${(0, import_scripts.getName)("aegii")}|...right, I was saying in SSB4 to "stan loona", but this has to be changed now that we've found out that the company managing loona is shady af. I would like to amend that to "stan the individual members of loona" (or if you want, you can choose to stan any other group of your choice!)`);
      } else {
        pokemon.side.addSlotCondition(pokemon, "aegiibpmsg");
      }
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("aegii")}|nerd`);
    }
  },
  aegiibpmsg: {
    onSwitchIn(target) {
      if (!target.fainted) {
        this.add(`c:|${(0, import_scripts.getName)("aegii")}|~yes ${target.name}`);
        target.side.removeSlotCondition(target, "aegiibpmsg");
      }
    }
  },
  aelita: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Aelita")}|You know, no one appreciates the work that goes into making weapons and towers.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Aelita")}|Gotta use this tower to change sectors, BRB.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Aelita")}|Well, I hope the Lyoko Warriors are at least well equipped.`);
    }
  },
  aethernum: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Aethernum")}|We are the Shadow Garden, and your time has come. Prepare yourself`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Aethernum")}|Better play the side character for now, i'll wait a more favorable opportunity`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Aethernum")}|There are important things that i have to attend, i don't have any more time for you`);
    }
  },
  akir: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Akir")}|hey whats up`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Akir")}|ok c ya`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Akir")}|oh woops`);
    }
  },
  alex: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Alex")}|meow`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Alex")}|meow meow`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Alex")}|:3`);
    }
  },
  alexander489: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Alexander489")}|gm`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Alexander489")}|gn`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Alexander489")}|kek`);
    }
  },
  apple: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Apple")}|An Apple a day keeps the Opplesite mon away!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Apple")}|Going to the teachers desk!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Apple")}|I crumbled like an Apple Pie :(`);
    }
  },
  appletunalamode: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Appletun a la Mode")}|QuQ`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Appletun a la Mode")}|QnQ`);
    },
    innateName: "Ripen",
    shortDesc: "When this Pokemon eats certain Berries, the effects are doubled.",
    onTryHeal(damage, target, source, effect) {
      if (!effect || target.illusion) return;
      if (effect.name === "Berry Juice" || effect.name === "Leftovers") {
        this.add("-activate", target, "ability: Ripen");
      }
      if (effect.isBerry) return this.chainModify(2);
    },
    onChangeBoost(boost, target, source, effect) {
      if (target.illusion) return;
      if (effect && effect.isBerry) {
        let b;
        for (b in boost) {
          boost[b] *= 2;
        }
      }
    },
    onSourceModifyDamagePriority: -1,
    onSourceModifyDamage(damage, source, target, move) {
      if (target.illusion) return;
      if (target.abilityState.berryWeaken) {
        target.abilityState.berryWeaken = false;
        return this.chainModify(0.5);
      }
    },
    onTryEatItemPriority: -1,
    onTryEatItem(item, pokemon) {
      if (pokemon.illusion) return;
      this.add("-activate", pokemon, "ability: Ripen");
    },
    onEatItem(item, pokemon) {
      if (pokemon.illusion) return;
      const weakenBerries = [
        "Babiri Berry",
        "Charti Berry",
        "Chilan Berry",
        "Chople Berry",
        "Coba Berry",
        "Colbur Berry",
        "Haban Berry",
        "Kasib Berry",
        "Kebia Berry",
        "Occa Berry",
        "Passho Berry",
        "Payapa Berry",
        "Rindo Berry",
        "Roseli Berry",
        "Shuca Berry",
        "Tanga Berry",
        "Wacan Berry",
        "Yache Berry"
      ];
      pokemon.abilityState.berryWeaken = weakenBerries.includes(item.name);
    }
  },
  april: {
    noCopy: true,
    onStart(pokemon) {
      if (this.ruleTable.has("zmovesclause")) {
        this.add(`c:|${(0, import_scripts.getName)("April")}|Fool's Day`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("April")}|I said, "Do you have something against dogs?"`);
      }
    },
    onSwitchOut() {
      if (this.ruleTable.has("zmovesclause")) {
        this.add(`c:|${(0, import_scripts.getName)("April")}|Fool's Day`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("April")}|(Is it the chorus yet?)`);
      }
    },
    onFaint() {
      if (this.ruleTable.has("zmovesclause")) {
        this.add(`c:|${(0, import_scripts.getName)("April")}|Fool's Day`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("April")}|Don't get too impressed, you might lose your breath...`);
      }
    },
    onTryHit() {
      if (this.ruleTable.has("zmovesclause")) {
        this.add(`c:|${(0, import_scripts.getName)("April")}|Fool's Day`);
      }
    }
  },
  aqrator: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("aQrator")}|Let me tell you my sTori.`);
      if (this.toID((0, import_scripts.enemyStaff)(pokemon)) === "warriorgallade") {
        this.add(`c:|${(0, import_scripts.getName)("aQrator")}|Hey Zeiol, how's your brother?`);
      }
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("aQrator")}|A few Water Guns and Force Palms later, Tori and Riolu- Wait where are you going?`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("aQrator")}|But I only got to part 3...`);
    }
  },
  aquagtothepast: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("A Quag To The Past")}|I'm coming out of my cage and I've been doing just fine`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("A Quag To The Past")}|so true`);
    },
    onFaint() {
      const lines = [
        "Anger he felt",
        "Before Showderp he knelt",
        "A moderator so quiet",
        "Inventing his riot",
        "[[]]",
        "Onward he gazed",
        "As his cattle had grazed",
        "Wolves on the hills",
        "Mom paying his bills",
        "[[]]",
        "His keyboard he used",
        "His power: abused",
        '"Silent as me"',
        '"You must be"',
        "[[]]",
        "The chatroom is dead",
        "Yet quickly he fled",
        "Before retaliation, he made fast",
        "A Quag To The Past"
      ];
      for (const line of lines) {
        this.add(`c:|${(0, import_scripts.getName)("A Quag To The Past")}|${line}`);
      }
    }
  },
  archas: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Archas")}|We'll get over this barrier together!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Archas")}|Stand your ground, everyone!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Archas")}|What would Grandfather... think of me now...`);
    }
  },
  archfaewild: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Archfaewild")}|Ready for Initiative? Cause I'm gonna Clickity Clackity, Roll to Attackity!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Archfaewild")}|Dropping out of Initiative`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Archfaewild")}|Guess I didn't roll high enough`);
    }
  },
  arcueid: {
    noCopy: true,
    onStart() {
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u287F\u283F\u281B\u281B\u281B\u281B\u283F\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u287F\u281B\u2809\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2809\u283B\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u285F\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2818\u28BF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u285F\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28FE\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u280B\u2808\u2800\u2800\u2800\u2800\u2810\u283A\u28D6\u2884\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u284F\u2880\u2846\u2800\u2800\u2800\u288B\u28ED\u28FD\u285A\u28AE\u28F2\u2806\u2800\u2800\u2800\u2800\u2800\u2800\u28B9\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2847\u287C\u2800\u2800\u2800\u2800\u2808\u283B\u28C5\u28E8\u2807\u2808\u2800\u2830\u28C0\u28C0\u28C0\u2840\u2800\u28B8\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2847\u2801\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28DF\u28B7\u28F6\u2836\u28C3\u2880\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2845\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28BF\u2800\u2808\u2813\u281A\u28B8\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2847\u2800\u2800\u2800\u2800\u2880\u2860\u2800\u2844\u28C0\u2800\u2800\u2800\u28BB\u2800\u2800\u2800\u28E0\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2847\u2800\u2800\u2800\u2810\u2809\u2800\u2800\u2819\u2809\u2800\u2820\u2876\u28F8\u2801\u2800\u28E0\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28E6\u2846\u2800\u2810\u2812\u2822\u28A4\u28C0\u2870\u2801\u2807\u2808\u2818\u28B6\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u2847\u2800\u2800\u2800\u2800\u2820\u28C4\u28C9\u28D9\u2849\u2813\u2880\u28FE\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28F7\u28C4\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u28F0\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
      this.add("-message", `\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28F7\u28E4\u28C0\u28C0\u2800\u28C0\u28E0\u28FE\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF\u28FF`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Arcueid")}|change da world,,, my final message. Goodb ye`);
    }
  },
  arsenal: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Arsenal")}|Show me your true form!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Arsenal")}|I should write something`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Arsenal")}|Dont forget this feeling !`);
    }
  },
  artemis: {
    noCopy: true,
    onFoeAfterFaint(target, source, effect) {
      this.add("message", `${source.name} was banned from Pok\xE9mon Showdown!`);
    }
  },
  arya: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Arya")}|NORMAL SUMMON DEEP SEA DIVA`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Arya")}|Oleeeee too good for this fight!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Arya")}|Nevermind, happy tuesday and let's pray for the 33.`);
    },
    onAfterMega() {
      this.add(`c:|${(0, import_scripts.getName)("Arya")}|W-whats this? Oh, come on...!!!`);
    }
  },
  audiino: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Audiino")}|anyone up for othello, scrabble, connect 4, splendor, codenames, catan, actually that's a long enough list already so don't actually take me up on all of those simultaneously`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Audiino")}|im only thinking, ill be back...`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Audiino")}|ggs, with that i take my leave`);
    }
  },
  autumn: {
    noCopy: true,
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("autumn")}|lost ggs`);
    }
  },
  ausma: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("ausma")}|what it Do what it Be`);
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "umuwo":
          this.add(`c:|${(0, import_scripts.getName)("ausma")}|it's.... chu......`);
          break;
        case "spoo":
          this.add(`c:|${(0, import_scripts.getName)("ausma")}|LOOL SPOOP?!`);
          break;
        case "rumia":
          this.add(`c:|${(0, import_scripts.getName)("ausma")}|oh no... it's poomia....`);
          break;
        case "lily":
          this.add(`c:|${(0, import_scripts.getName)("ausma")}|togedemaru`);
          break;
        case "lumari":
          this.add(`c:|${(0, import_scripts.getName)("ausma")}|we should watch the next ladybug ep after this tbh`);
          break;
      }
    },
    onSwitchOut() {
      const phrases = [
        "vr shift",
        "commission",
        "bio lab",
        "lab report",
        "council post",
        "anti-tera blast propaganda post"
      ];
      this.add(`c:|${(0, import_scripts.getName)("ausma")}|oh shit i forgot to do this ${this.sample(phrases)} hang on`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ausma")}|God has punished me for my hubris.`);
    },
    onTryMove(source, target, move) {
      this.effectState.foeMemory = target.name;
    },
    onFoeSwitchOut(pokemon) {
      if (this.effectState.foeMemory && pokemon.species.name === "Fennekin") {
        (0, import_scripts.changeSet)(this, pokemon, import_random_teams.ssbSets[this.effectState.foeMemory]);
      }
    },
    onFoeFaint(target, source, effect) {
      if (this.effectState.foeMemory && target.species.name === "Fennekin") {
        (0, import_scripts.changeSet)(this, target, import_random_teams.ssbSets[this.effectState.foeMemory]);
      }
    }
  },
  auzbat: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("AuzBat")}|I'm Batman`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("AuzBat")}|I believe what doesn't kill you simply makes you, stranger`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("AuzBat")}|All I have are negative thoughts.`);
    }
  },
  avarice: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("avarice")}|so what's tea`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("avarice")}|l8r h8r`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("avarice")}|gg ig`);
    }
  },
  beowulf: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Beowulf")}|Fear the bee`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Beowulf")}|/me buzzes`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Beowulf")}|/me buzzes`);
    }
  },
  berry: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("berry")}|berry`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("berry")}|rock`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("berry")}|and all I got was this lousy t-shirt`);
    }
  },
  bert122: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Bert122")}|*cackling laughter and gem crunching noises*`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Bert122")}|Off to collect more shiny rocks! Hehehe!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Bert122")}|Ack, all my gems are gone!`);
    }
  },
  billo: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Billo")}|So where did you say you got this mon from again?`);
    },
    onFaint(pokemon) {
      if (pokemon.species.name === "Solgaleo" && !pokemon.getVolatile("perishsong")) {
        this.add(`c:|${(0, import_scripts.getName)("Billo")}|Bruh this is the worst hack I've ever seen...`);
      } else if (pokemon.species.name === "Solgaleo") {
        this.add(`c:|${(0, import_scripts.getName)("Billo")}|@Room Owner this user needs blacklisting but I have to head to bed.`);
      } else if (pokemon.species.name === "Lunala") {
        this.add(`c:|${(0, import_scripts.getName)("Billo")}|Someone take me to the hozzy please.`);
      }
    },
    innateName: "Sheer Force/Reckless",
    shortDesc: "Lunala: Sheer Force. Solgaleo: Reckless",
    onModifyMove(move, pokemon) {
      if (!pokemon.illusion && pokemon.species.name === "Lunala") {
        if (move.secondaries) {
          delete move.secondaries;
          delete move.self;
          if (move.id === "clangoroussoulblaze") delete move.selfBoost;
          move.hasSheerForce = true;
        }
      }
    },
    onBasePowerPriority: 21,
    onBasePower(basePower, pokemon, target, move) {
      if (move.hasSheerForce) return this.chainModify([5325, 4096]);
      if (!pokemon.illusion && pokemon.species.name === "Solgaleo") {
        if (move.recoil || move.hasCrashDamage) {
          this.debug("Reckless boost");
          return this.chainModify([4915, 4096]);
        }
      }
    }
  },
  blazeofvictory: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("blazeofvictory")}|blazeofvictorys in ur puter, askin u trivia questinz`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("blazeofvictory")}|I'll let you have bp... for now...`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("blazeofvictory")}|[ bleps at you sadly :( ]`);
    }
  },
  blitzuser: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Blitz")}|Hey guys, did you know that Chi-Yu is a Water/Dark-type Pok\xE9mon introduced in Generation IX? Chi-Yu is number 1004 in the National Dex, and a member of the Undiscovered egg group. Chi-Yu has no evolutionary relatives. Chi-Yu has a base stat total of 570, as do all the Treasures of Ruin, and it has the ability Blitz of Ruin. Chi-Yu learns various strong moves, such as Fiery Wrath, Lava Plume, and Nasty Plot. Chi-Yu is a blue Pok\xE9mon with a fish-like build, weighing in at 10.8 pounds and standing 1'04" feet tall. Chi-Yu's design is inspired by goldfish, flames, and beads. Chi-Yu controls flames burning at over 5,400 degrees Fahrenheit, and casually swims through the sea of lava it creates by melting rock and sand, according to various Pokedex entries. Chi-Yu is the only Treasure of Ruin in Generation IX that was quickbanned from Smogon's OverUsed tier. Many Trainers like Chi-Yu for its design, which mixes cool and cute, as well as its good stats and movepool.`);
      this.add("-start", pokemon, "typechange", "Water/Dark", "[silent]");
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Blitz")}|Splashyyy!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Blitz")}|https://www.youtube.com/watch?v=lPGipwoJiOM`);
    }
  },
  breadey: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Breadey")}|I loeuf you <3`);
    },
    // onSwitchOut implemented in ability instead
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Breadey")}|Oh, ma vie... c'est 'pitable'...`);
    },
    onFoeFaint(target, source, effect) {
      if (source === this.effectState.target && effect?.name === "Painful Exit") {
        this.add(`c:|${(0, import_scripts.getName)("Breadey")}|Ashes to ashes, crust to crust.`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Breadey")}|Ope, someone's swallowing fishes.`);
      }
    },
    innateName: "Well-Baked Body",
    shortDesc: "This Pokemon's Defense is raised 2 stages if hit by a Fire move; Fire immunity.",
    onTryHit(target, source, move) {
      if (!target.illusion && target !== source && move.type === "Fire") {
        if (!this.boost({ def: 2 })) {
          this.add("-immune", target, "[from] ability: Well-Baked Body");
        }
        return null;
      }
    }
  },
  cake: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Cake")}|randem batels`);
      if (pokemon.illusion) return;
      this.effectState.moves = [
        pokemon.moveSlots[0].id,
        pokemon.moveSlots[1].id,
        pokemon.moveSlots[2].id
      ];
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Cake")}|hustle is a good ability`);
      if (!this.effectState.moves) return;
      for (const [i, moveid] of this.effectState.moves.entries()) {
        const replacement = this.dex.moves.get(moveid);
        const replacementMove = {
          move: replacement.name,
          id: replacement.id,
          pp: replacement.pp,
          maxpp: replacement.pp,
          target: replacement.target,
          disabled: false,
          used: false
        };
        pokemon.moveSlots[i] = replacementMove;
        pokemon.baseMoveSlots[i] = replacementMove;
      }
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Cake")}|livid washed is a nerd`);
    }
  },
  calmvibes: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("calmvibes \u266B")}|Is that a __rat__?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("calmvibes \u266B")}|Here for a good time, not a long time!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("calmvibes \u266B")}|The vibes are off... :(`);
    }
  },
  chaos: {
    noCopy: true
  },
  chloe: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Chloe")}|hey!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Chloe")}|cya soon o/`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Chloe")}|ouch :(`);
    }
  },
  chris: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Chris")}|Sun is down, freezing cold`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Chris")}|She thought it was the ocean, it's just the pool!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Chris")}|Had me out like a light (like a light)`);
    }
  },
  ciran: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("ciran")}|Nobody expects the Spanish Inquisition!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("ciran")}|Had enough, eh? Just a flesh wound!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ciran")}|Alright then, we'll call it a draw.`);
    }
  },
  clefableuser: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Clefable")}|LF: A win`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Clefable")}|Catch you on the flip side!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Clefable")}|I needed a VISA to be in Paldea, Wasn't even worth it. Bloody Brexit.`);
    },
    innateName: "Oblivious",
    desc: "This Pokemon cannot be infatuated or taunted. Gaining this Ability while infatuated or taunted cures it. This Pokemon is immune to the effect of the Intimidate Ability.",
    shortDesc: "This Pokemon cannot be infatuated or taunted. Immune to Intimidate.",
    onUpdate(pokemon) {
      if (pokemon.illusion) return;
      if (pokemon.volatiles["attract"]) {
        this.add("-activate", pokemon, "ability: Oblivious");
        pokemon.removeVolatile("attract");
        this.add("-end", pokemon, "move: Attract", "[from] ability: Oblivious");
      }
      if (pokemon.volatiles["taunt"]) {
        this.add("-activate", pokemon, "ability: Oblivious");
        pokemon.removeVolatile("taunt");
      }
    },
    onImmunity(type, pokemon) {
      if (pokemon.illusion) return;
      if (type === "attract") return false;
    },
    onTryHit(pokemon, target, move) {
      if (pokemon.illusion) return;
      if (move.id === "attract" || move.id === "captivate" || move.id === "taunt") {
        this.add("-immune", pokemon, "[from] ability: Oblivious");
        return null;
      }
    },
    onTryBoost(boost, target, source, effect) {
      if (target.illusion) return;
      if (effect.name === "Intimidate" && boost.atk) {
        delete boost.atk;
        this.add("-fail", target, "unboost", "Attack", "[from] ability: Oblivious", `[of] ${target}`);
      }
    }
  },
  clem: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Clem")}|Je suis peut-\xEAtre con comme une table`);
    },
    onSwitchOut(pokemon) {
      if (pokemon.volatiles["flipped"]) {
        pokemon.removeVolatile("flipped");
        (0, import_scripts.changeSet)(this, pokemon, import_random_teams.ssbSets["Clem"]);
        this.add(`c:|${(0, import_scripts.getName)("Clem")}|\u252C\u2500\u2500\u252C\u25E1\uFF89(\xB0 -\xB0\uFF89)`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Clem")}|I fucking love air-conditioning.`);
      }
    },
    onAnySwitchIn(pokemon) {
      if ((pokemon.illusion || pokemon).name === "Kennedy") {
        this.add(`c:|${(0, import_scripts.getName)("Clem")}|yikes`);
      }
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Clem")}|ofc`);
    }
  },
  clerica: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("clerica")}|gm`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("clerica")}|gn`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("clerica")}|unfort`);
    }
  },
  clouds: {
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Clouds")}|i can feel it coming in the air tonight...`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Clouds")}|oh lord`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Clouds")}|and i've been waiting for this moment for all my life`);
    }
  },
  coolcodename: {
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Coolcodename")}|LFGI ${pokemon.side.name}`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Coolcodename")}|right, i forgot i have a skill issue`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Coolcodename")}|mb LOL`);
    }
  },
  corthius: {
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Corthius")}|*exessively drums on its chest*`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Corthius")}|I left my oven on, brb.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Corthius")}|Maurice, I can't "move it move it" anymore.`);
    }
  },
  dawnofartemis: {
    noCopy: true,
    onStart(pokemon) {
      const god = pokemon.species.id === "necrozmaultra" ? "Ares" : "Artemis";
      this.add(`c:|${(0, import_scripts.getName)("Dawn of Artemis")}|Time for you to witness the power of ${god}!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Dawn of Artemis")}|You'll witness it again later.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Dawn of Artemis")}|Sad.`);
    }
  },
  dawoblefet: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("DaWoblefet")}|What's going on guys? This is DaWoblefet, and welcome to Mechanics Monday.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("DaWoblefet")}|Until next time, have a good one.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("DaWoblefet")}|mished`);
    }
  },
  deftinwolf: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("deftinwolf")}|Run, little rabbit.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("deftinwolf")}|I'll give you a moment to say your prayers.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("deftinwolf")}|Death is only the beginning.`);
    }
  },
  dhelmiseuser: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("dhelmise")}|skibidi`);
      if (pokemon.illusion) return;
      pokemon.m.stealth = true;
      this.add("-message", `${pokemon.name}'s Stealth made it harder to hit!`);
      this.add("-start", pokemon, "stealth");
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("dhelmise")}|skibidi`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("dhelmise")}|skibidi`);
    },
    innateName: "Stealth",
    shortDesc: "Until using EMP, targeted moves are 25% less accurate, this Pokemon's moves do half damage, and this Pokemon only takes 3/4 damage.",
    onModifyAccuracyPriority: -1,
    onModifyAccuracy(accuracy, target, source) {
      if (typeof accuracy !== "number") return;
      if (target.illusion) return;
      if (!target.m.stealth) return;
      this.debug("Sand Veil - decreasing accuracy");
      return this.chainModify(0.75);
    },
    onSourceModifyDamage(damage, source, target, move) {
      if (target.illusion) return;
      if (!target.m.stealth) return;
      return this.chainModify(0.75);
    },
    onModifyDamage(damage, source, target, move) {
      if (source.illusion) return;
      if (!source.m.stealth) return this.chainModify(1.1);
      return this.chainModify(0.5);
    }
  },
  easyonthehills: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("EasyOnTheHills")}|Yo`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("EasyOnTheHills")}|Would you rather have unlimited bacon, but no more video games, or would you rather have games, unlimited games, but no more games.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("EasyOnTheHills")}|__loud Dorito bag crinkling noises__`);
    }
  },
  elliot: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Elliot")}|Anyone fancy a brew?`);
    },
    onFaint(pokemon) {
      if (pokemon.getVolatile("boiled")) {
        this.add(`c:|${(0, import_scripts.getName)("Elliot")}|Also try Vimbos!`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Elliot")}|We've ran out of teabags :(`);
      }
    }
  },
  elly: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Elly")}|any`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Elly")}|ok bye`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Elly")}|that wasn't very nice, ${(0, import_scripts.enemyStaff)(pokemon)}.`);
    }
  },
  emboar02: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Emboar02")}|I'm the best fire-fighting starter!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Emboar02")}|This is boaring...`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Emboar02")}|Too much recoil D:`);
    }
  },
  fame: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Fame")}|:hi:`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Fame")}|:bye:`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Fame")}|NOOOOOOOOOOOO! I'M A STAR! PLEASE, IM A STAR!`);
    }
  },
  felucia: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Felucia")}|Good morning gamers! Just here to fix a few things`);
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Felucia")}|I have bots to make and chatrooms to manage...`);
      if (pokemon.illusion) return;
      pokemon.heal(pokemon.baseMaxhp / 3);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Felucia")}|Okay that's enough work for today`);
    },
    innateName: "Regenerator",
    shortDesc: "Regenerator + innate +1 Speed.",
    onModifySpe(spe, pokemon) {
      if (pokemon.illusion) return;
      return this.chainModify(1.5);
    }
  },
  froggeh: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Froggeh")}|Hello. Froggeh the dad here. And welcome to The Happy Place!`);
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "valerian":
          this.add(`c:|${(0, import_scripts.getName)("Froggeh")}|See that frog, she is green, diggin the froggy queen!`);
          break;
        case "queeni":
          this.add(`c:|${(0, import_scripts.getName)("Froggeh")}|Imagine if you will- a frog with a smol crown on her head.`);
          break;
      }
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Froggeh")}|It's not easy being dad.`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Froggeh")}|URG! I've croaked...`);
    }
  },
  frostyicelad: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Frostyicelad")}|why am I a Qwilfish`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Frostyicelad")}|time to bring in the Ice types`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Frostyicelad")}|Why am I not lapras`);
    }
  },
  frozoid: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Frozoid")}|Let's do this`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Frozoid")}|Wait let me finish what i was doi-`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Frozoid")}|Man.`);
    }
  },
  ganjafin: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Ganjafin")}|How's it going guys, Ganjafin here`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Ganjafin")}|And I'll see you guys, in the next one`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Ganjafin")}|I knew I'd die before Silksong came out`);
    }
  },
  hasteinky: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Haste Inky")}|Wanna see whatever weird thing I can do?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Haste Inky")}|Good call! I wasn't liking this situation either.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Haste Inky")}| I am NOT feeling full of beans rn\u2026`);
    }
  },
  havi: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("havi")}|kos, or some say kosm`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("havi")}|grant us eyes, grant us eyes`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("havi")}|the nightmare swirls and churns unending n_n`);
    }
  },
  hecate: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Hecate")}|git pull ps hecate`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Hecate")}|git switch`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Hecate")}|git checkout --detach HEAD && git commit -m "war crimes"`);
    }
  },
  hizo: {
    noCopy: true,
    onStart() {
      const tier = this.sample(["Partners in Crime", "Sketchmons", "OMMs", "Triples"]);
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|Why am I needed here, I was busy playing ${tier} with friends`);
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|Did I break something again`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|This isn't my fault this time I swear`);
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|Ok maybe it is but that doesn't mean you should blame me automatically`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|What did I do to deserve this`);
      this.add(`c:|${(0, import_scripts.getName)("HiZo")}|Actually on second thought don't answer that question`);
    }
  },
  hoeenhero: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("HoeenHero")}|Ok what did Hippopotas break now?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("HoeenHero")}|TODO think of a switch out message later.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("HoeenHero")}|I should of reprogrammed the RNG to be in my favor too...`);
    }
  },
  hsy: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("hsy")}|BANJO!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("hsy")}|LEMME SCRAP COWARD`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("hsy")}|https://www.youtube.com/watch?v=g104OJIh9hs`);
    }
  },
  hydrostaticsuser: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Hydrostatics")}|Straighten your backs and get some hydration :]`);
      this.add("-start", pokemon, "typechange", "Electric/Water", "[silent]");
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Hydrostatics")}|Brb getting some water :d`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Hydrostatics")}|Seems like you were more hydrated than me :c`);
      if (pokemon.side.pokemon.some((mon) => mon.name === "PartMan")) {
        this.add(`c:|${(0, import_scripts.getName)("PartMan")}|Hydro here have a tiara`);
      }
    }
  },
  inthehills: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("in the hills")}|in (the hills)`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("in the hills")}|i'll be out back`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("in the hills")}|im starting to feel kinda stupid can i please leave`);
    }
  },
  ironwater: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("ironwater")}|Jirachi Ban Hammer!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("ironwater")}|Let me grab a bigger hammer`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ironwater")}|I'll ban you in the next game...`);
    }
  },
  irpachuza: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Irpachuza!")}|Hf. I never say gl because I sincerely don't want my oppo to have better luck than me in rands n.n`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Irpachuza!")}|bye and HOOP HOOP n.n`);
    },
    onFaint(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Irpachuza!")}|how DARE YOU ${pokemon.side.foe.name} ;-; n.n`);
    },
    innateName: "Prankster",
    desc: "This Pokemon's non-damaging moves have their priority increased by 1. Opposing Dark-type Pokemon are immune to these moves, and any move called by these moves, if the resulting user of the move has this Ability.",
    shortDesc: "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.",
    onModifyPriority(priority, pokemon, target, move) {
      if (pokemon.illusion) return;
      if (move?.category === "Status") {
        move.pranksterBoosted = true;
        return priority + 1;
      }
    }
  },
  isaiah: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Isaiah")}|Who dyin'?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Isaiah")}|Misclick`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Isaiah")}|Bruh, nice cteam`);
    }
  },
  j0rdy004: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("J0rdy004 \u266B")}|Get-get-get-get, got-got-got-got`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("J0rdy004 \u266B")}|I've seen footage, I stay noided`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("J0rdy004 \u266B")}|So softly a supergod dies...`);
    }
  },
  kalalokki: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Kalalokki")}|FLAMIGOOOO!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Kalalokki")}|Flamigoooo...`);
    },
    innateName: "Tinted Lens",
    shortDesc: "Resisted moves hit with double power.",
    onModifyDamage(damage, source, target, move) {
      if (source.illusion) return;
      if (target.getMoveHitData(move).typeMod < 0) {
        this.debug("Tinted Lens boost");
        return this.chainModify(2);
      }
    }
  },
  karthik: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Karthik")}|>>> const staraptor = battle.player('${pokemon.side.name}').active[0]`);
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Karthik")}|>>> staraptor.heal(staraptor.baseMaxhp / 3)`);
      if (!pokemon.illusion) pokemon.heal(pokemon.baseMaxhp / 3);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Karthik")}|>>> staraptor.faint()`);
    },
    innateName: "Regenerator",
    shortDesc: "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out."
  },
  ken: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("ken")}|gm.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("ken")}|whoopsies`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ken")}|have a good day!`);
    }
  },
  kenn: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("kenn")}|*old man grumbling*`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("kenn")}|Ope`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("kenn")}|I'm too old for this shi-`);
    }
  },
  kennedy: {
    noCopy: true,
    innateName: "Battle Bond",
    shortDesc: "After KOing a Pokemon: becomes Cinderace-Gmax.",
    onStart(target, source, effect) {
      const message = this.sample(["Justice for the 97", "up the reds"]);
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|${message}`);
      if (source?.name === "Clem") {
        if (source.volatiles["flipped"]) {
          source.removeVolatile("flipped");
          (0, import_scripts.changeSet)(this, source, import_random_teams.ssbSets["Clem"]);
          this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|\u252C\u2500\u2500\u252C\u25E1\uFF89(\xB0 -\xB0\uFF89)`);
        } else {
          source.addVolatile("flipped", target, this.effect);
          (0, import_scripts.changeSet)(this, source, import_random_teams.ssbSets["Clem-Flipped"]);
          this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|(\u256F\xB0o\xB0\uFF09\u256F\uFE35 \u253B\u2501\u253B`);
        }
      }
      if (target.species.id === "cinderacegmax" && !target.terastallized) {
        this.add("-start", target, "typechange", target.getTypes(true, true).join("/"), "[silent]");
      }
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|Stream some Taylor Swift whilst I'm gone!`);
    },
    onAnySwitchIn(pokemon) {
      switch ((pokemon.illusion || pokemon).name) {
        case "Clem":
          this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|Not the Fr*nch....`);
          break;
        case "dhelmise":
          this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|fuck that`);
          this.effectState.target.faint();
          this.add("message", "Kennedy fainted mysteriously.....");
          break;
      }
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|FUCK OFF, REALLY?????`);
    },
    onSourceAfterFaint(length, target, source, effect) {
      const message = this.sample(["ALLEZZZZZ", "VAMOSSSSS", "FORZAAAAA", "LET'S GOOOOO"]);
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|${message}`);
      if (source.species.id === "cinderace" && this.field.pseudoWeather["anfieldatmosphere"] && !source.transformed && effect?.effectType === "Move" && source.hp && source.side.foePokemonLeft()) {
        this.add("-activate", source, "ability: Battle Bond");
        source.formeChange("Cinderace-Gmax", this.effect, true);
        source.baseMaxhp = Math.floor(Math.floor(
          2 * source.species.baseStats["hp"] + source.set.ivs["hp"] + Math.floor(source.set.evs["hp"] / 4) + 100
        ) * source.level / 100 + 10);
        const newMaxHP = source.volatiles["dynamax"] ? 2 * source.baseMaxhp : source.baseMaxhp;
        source.hp = newMaxHP - (source.maxhp - source.hp);
        source.maxhp = newMaxHP;
        this.add("-heal", source, source.getHealth, "[silent]");
      }
    },
    onUpdate(pokemon) {
      if (pokemon.volatiles["attract"]) {
        this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|NAAA FUCK OFF, I'd rather be dead`);
        pokemon.faint();
        this.add("message", "Kennedy would have been infatuated but fainted mysteriously");
      }
    },
    onSourceCriticalHit(pokemon, source, move) {
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|LOOOOOOL ffs`);
    },
    onFlinch(pokemon) {
      if (pokemon.illusion) return;
      this.add(`c:|${(0, import_scripts.getName)("Kennedy")}|LOOOOOOL ffs`);
    }
  },
  keys: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("keys")}|It's Prime Time`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("keys")}|Don't worry, I'll be back`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("keys")}|...`);
    }
  },
  kingbaruk: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("kingbaruk")}|Pressure pushing down on me`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("kingbaruk")}|Pressing down on you`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("kingbaruk")}|Why can't we give love that one more chance?`);
    },
    innateName: "Multiscale",
    onSourceModifyDamage(damage, source, target, move) {
      if (target.illusion) return;
      if (target.hp >= target.maxhp) {
        this.debug("Multiscale weaken");
        return this.chainModify(0.5);
      }
    }
  },
  kiwi: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Kiwi")}|Hey, are you a goldfish or a shark? I guess it depends on how quickly you get flushed down`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Kiwi")}|You're lively, but I'm not done peeling off your scales`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Kiwi")}|Too late, the manifestation has completed. You'll be reduced to a fillet one day unexpectedly...`);
    }
  },
  klmondo: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Klmondo")}|Gm`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Klmondo")}|I need a snack`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Klmondo")}|It's Klmondover`);
    }
  },
  kolohe: {
    noCopy: true,
    onStart(pokemon) {
      const foe = (0, import_scripts.enemyStaff)(pokemon);
      if (foe === "Rumia") {
        this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|You come around here often?`);
      } else if (foe === "spoo") {
        this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|Big bald head spotted...`);
      } else if (foe === "ausma") {
        this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|The weekly Smogon furry convention starts NOW`);
      } else if (foe === "Peary") {
        this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|Any arters or culturers?`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|Hey, howzit!`);
      }
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|Wait, I just got started!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("kolohe \u272E\u5F61")}|change da world... my final message. goodbye`);
    }
  },
  kry: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Kry")}|:3`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Kry")}|PartMan is a nerd`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Kry")}|Guys whatever you do don't say Farigiraf backwards`);
    }
  },
  lasen: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Lasen")}|That's a Hungarian yield sign, easy Budapest guess.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Lasen")}|Will give QC 2/2 after implementation.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Lasen")}|I'm out and NOT about...`);
    }
  },
  letsgoshuckles: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Lets go shuckles")}|Behold the magnificence of Shuckle.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Lets go shuckles")}|Wise men don't fight battles they cannot win.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Lets go shuckles")}|He who lives by the Shuckle shall die by the Shuckle.`);
    }
  },
  lily: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Lily")}|buying gf`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Lily")}|accidentally burnt the shrimps`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Lily")}|oh dear, i am dead`);
    }
  },
  loethalion: {
    noCopy: true,
    onStart(pokemon) {
      const foe = (0, import_scripts.enemyStaff)(pokemon);
      if (foe === "WigglyTree") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|No, I'm not drawing Dialga on a bike again.`);
      } else if (foe === "Swiffix") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|Oh hi Stinky.`);
      } else if (foe === "Mex") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|I'm in Spain without the A.`);
      } else if (foe === "Billo") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|So your saying I can't ban myself?`);
      } else if (foe === "Clefable") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|But what if I hack a tiny bit?`);
      } else if (foe === "Lunell") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|We bean posting?`);
      } else if (foe === "Ciran") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|THE FR*CK WORD STAYS BANNED.`);
      } else if (foe === "Appletun a la Mode") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|OOOUUGGHHHH OOOUUUWWAAAA.`);
      } else if (foe === "SexyMalasada") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|I forgot how to rng this mon again, what singular step did I miss?`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|...from Zero`);
      }
    },
    onSourceAfterFaint(length, target, source, effect) {
      if ((0, import_scripts.enemyStaff)(source) === "Swiffix") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|It's still pfp...`);
      } else if ((0, import_scripts.enemyStaff)(source) === "Appletun a la Mode") {
        this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|\u1D52\u1D52\u1D58\u1D4D\u02B0\u02B0 \u1D52\u1D52\u1D58\u1D58\u02B7\u1D43\u1D43`);
      }
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Loethalion")}| I don't remember why I'm even here __walks out the room__`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Loethalion")}|__Wheezing laugh__`);
    }
  },
  lumari: {
    noCopy: true,
    // quotes added later
    onSwitchOut(pokemon) {
      if (pokemon.illusion) return;
      pokemon.heal(pokemon.baseMaxhp / 3);
    },
    innateName: "Regenerator",
    shortDesc: "User will heal 33% of their max HP on switch-out."
  },
  lunell: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Lunell")}|vapowo`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Lunell")}|brb looking for bean images, don't disturb`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Lunell")}|*sad vaporeon noises*`);
    }
  },
  lyna: {
    noCopy: true,
    onStart(pokemon) {
      let phrase = "";
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "alex":
        case "nya":
          this.add(`c:|${(0, import_scripts.getName)("Lyna \u6C37")}|Oh, a cat <3`);
          break;
        case "r8":
        case "clem":
        case "teclis":
        case "swiffix":
        case "ironwater":
          phrase = "slt";
          break;
        default:
          phrase = "Hey <3";
          break;
      }
      this.add(`c:|${(0, import_scripts.getName)("Lyna \u6C37")}|${phrase}`);
    },
    onSwitchOut(pokemon) {
      let phrase = "";
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "alex":
        case "nya":
          phrase = "You're so cute, I can't hit you...";
          break;
        case "r8":
        case "clem":
        case "teclis":
        case "swiffix":
        case "ironwater":
          phrase = "**Tournoi Hebdo sur <<arcade>> !**";
          break;
        default:
          phrase = "Nvm I'm too busy for that, cya!";
          break;
      }
      this.add(`c:|${(0, import_scripts.getName)("Lyna \u6C37")}|${phrase}`);
    },
    onFaint(pokemon) {
      let phrase = "";
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "alex":
        case "nya":
          phrase = "You're definitely too cute...";
          break;
        case "r8":
          phrase = "ok mais on dit pain au chocolat.";
          break;
        case "clem":
        case "teclis":
        case "swiffix":
        case "ironwater":
          phrase = "t'as de la chance que je sois sympa..";
          break;
        default:
          phrase = "The flames were too frozen...";
          break;
      }
      this.add(`c:|${(0, import_scripts.getName)("Lyna \u6C37")}|${phrase}`);
    }
  },
  maia: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Maia")}|gm ${(0, import_scripts.enemyStaff)(pokemon)}`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Maia")}|(cat)ch you later`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Maia")}|gn`);
    }
  },
  mathy: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Mathy")}|Nooooo i broke tera again`);
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Mathy")}|whatever i'll make ${(0, import_scripts.enemyStaff)(pokemon)} fix it`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Mathy")}|thanks for making my job harder :/`);
    }
  },
  merritty: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Merritty")}|Deadline.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Merritty")}|If you believe there's been a mistake, please let me know ASAP.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Merritty")}|congratulations to our winner`);
    },
    innateName: "Tourban",
    shortDesc: "Takes half damage from Ghost moves, deals double damage to Ghost-types.",
    onSourceModifyDamage(damage, source, target, move) {
      if (source.illusion) return;
      if (move.type === "Ghost") {
        this.debug("Tourban Ghost weaken");
        return this.chainModify(0.5);
      }
    },
    onModifyDamage(damage, source, target, move) {
      if (source.illusion) return;
      if (target?.hasType("Ghost")) {
        this.debug("Tourban boost");
        return this.chainModify(2);
      }
    }
  },
  meteordash: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Meteordash")}|hi`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Meteordash")}|oh`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Meteordash")}|man.`);
    }
  },
  mex: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Mex")}|Time to make the donuts.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Mex")}|Brb, there's a Dialga raid.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Mex")}|pain.`);
    }
  },
  miojo: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Miojo")}|They see me rollin'`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Miojo")}|They hatin'`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Miojo")}|Em caso de investiga\xE7\xE3o policial, eu declaro que n\xE3o tenho envolvimento com este grupo e n\xE3o sei como estou no mesmo, provavelmente fui inserido por terceiros, declaro que estou disposto a colaborar com as investiga\xE7\xF5es e estou disposto a me apresentar a depoimento se necess\xE1rio`);
    }
  },
  monkey: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Monkey")}|Hmm, monke`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Monkey")}|Don't mind me I was just monkeying around`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Monkey")}|I'm a seeker too. But my dreams aren't like yours. I can't help thinking that somewhere in the universe there has to be something better than man. Has to be.`);
    }
  },
  mypearl: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("MyPearl")}|sim, estou no ssb, like se amaste`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("MyPearl")}|nossa, ela \xE9 t\xE3aaao regina george`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("MyPearl")}|ta permitido isso?`);
    }
  },
  neko: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Neko")}|Gmeow :3`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Neko")}|Meow go poof :3c`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Neko")}|Chien-Meow is cute when it doesn't scratch the ground, between it and Flutter Mane its dangerous to go out and ladder. You have been warned ;w;`);
    }
  },
  ney: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Ney")}|Hi I'm Ney. I love mischiefs.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Ney")}|Unloading more tricks.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Ney")}|How long am I banned for?`);
    }
  },
  notater517: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Notater517")}|OwO What's This?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Notater517")}|brb, dealing with mobile connection, here's a song to listen to before I return: https://www.youtube.com/watch?v=dQw4w9WgXcQ`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Notater517")}|ngl that was pretty sus \u0DA9`);
    }
  },
  nya: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("nya~ \u2764")}|:3`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("nya~ \u2764")}|nya~`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("nya~ \u2764")}|>~<`);
    },
    innateName: "Fickle Beam",
    shortDesc: "This Pokemon's moves have a 30% chance to be doubled in power.",
    onBasePower(basePower, attacker, defender, move) {
      if (attacker.illusion) return;
      if (this.randomChance(3, 10)) {
        let allOutAnim = "Draco Meteor";
        switch (move.id) {
          case "voltswitch":
            allOutAnim = "Thunder";
            break;
          case "freezedry":
            allOutAnim = "Glacial Lance";
            break;
          case "triattack":
            allOutAnim = "Blood Moon";
            break;
          case "3":
            allOutAnim = "Fleur Cannon";
            break;
        }
        this.attrLastMove("[anim] " + allOutAnim);
        this.add("-activate", attacker, "move: Fickle Beam");
        return this.chainModify(2);
      }
    }
  },
  pants: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("pants")}|hell yeah, bro`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("pants")}|cya, dude :)`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("pants")}|peace, bud`);
    }
  },
  partman: {
    noCopy: true,
    onStart(pokemon) {
      let message;
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "partman":
          message = "Hii Q - oh, it's just me.";
          break;
        case "arsenal":
          message = "Do I count as a gunner?";
          break;
        case "aqrator":
          message = "Speaking of cafes - this Pokemon is so popular, it has an entire cafe dedicated to it in the Pokemon world! Alongside the cafe, there's also stuff like a bus tour where you can sit one-on-one with the Pokemon and admire its beauty.";
          break;
        case "beowulf":
          message = "BEE";
          break;
        case "breadey":
          message = "BREADBOWL";
          break;
        case "clerica":
          message = "SMELY HIIII";
          break;
        case "computerwizard8800":
          message = "CWIZ SLEEP";
          break;
        case "hydrostatics":
          message = "Here to bully Hydro";
          break;
        case "kennedy":
          message = "Down the reds!";
          break;
        case "kry":
          this.add(`c:|${(0, import_scripts.getName)("PartMan")}|%r 14 // @Kry`);
          this.add(`c:|${(0, import_scripts.getName)("Ice Kyubs")}|Roll: 14`);
          message = null;
          break;
        case "mex":
          message = "Probopass moment";
          break;
        case "monkey":
          message = "Remember to smile!";
          break;
        case "notater517":
          message = "E-excuse me s-senpai >///<";
          break;
        case "pissog":
          message = "Ma ciaomi queste noci";
          break;
        case "pyro":
          message = "Fight me you boiled potato";
          break;
        case "rsb":
          message = "/me hugs";
          break;
        case "siegfried":
          message = "Is Sieg baked or boiled?";
          break;
        case "softflex":
          message = "/me softly flexes";
          break;
        case "sulo":
          message = "...Sulo's AFK again, aren't they?";
          break;
        case "trace":
          this.add("-message", `PartMan's Neutralizing Gas filled the area! (but not really)`);
          message = null;
          break;
        case "warriorgallade":
          message = "Berry nice to meet you!";
          break;
        case "za":
          message = "/me shitposts";
          break;
        case "zalm":
          message = "<(:O)00000>";
          break;
        default:
          message = "Hiii QT :3";
      }
      if (message) this.add(`c:|${(0, import_scripts.getName)("PartMan")}|${message}`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("PartMan")}|Deez nuts`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("PartMan")}|Okay weeb`);
    },
    onAnySwitchIn(pokemon) {
      if (pokemon.name === "Hydrostatics") {
        this.add(`c:|${(0, import_scripts.getName)("PartMan")}|LUAAAAA!`);
        this.add(`c:|${(0, import_scripts.getName)("PartMan")}|/me pats`);
      }
    },
    onFoeFaint(target, source, effect) {
      if (target.name === "Hydrostatics") return;
      this.add(`c:|${(0, import_scripts.getName)("PartMan")}|Skill issue`);
    },
    onHit(target, source, move) {
      if (!move.num) {
        this.add(`c:|${(0, import_scripts.getName)("PartMan")}|That's what she said!`);
      }
    },
    innateName: "Skill Issue",
    shortDesc: "Any move that does damage equal to this Pokemon's max HP fails.",
    // onDamagePriority: 1,
    onDamage(damage, target, source, effect) {
      if (target.illusion) return;
      if (effect?.effectType === "Move" && damage >= target.maxhp) {
        this.add("-activate", target, "ability: Skill Issue");
        this.add(`c:|${(0, import_scripts.getName)("PartMan")}|THAT'S WHAT SHE SAID!`);
        return false;
      }
    }
  },
  pastorgigas: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Pastor Gigas")}|Turn back to God`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Pastor Gigas")}|I'll leave, but God stays forever`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Pastor Gigas")}|I'm going to pray for you`);
    }
  },
  peary: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Peary")}|This bout to grind yalls gears`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Peary")}|Did my Part, no Man`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Peary")}|Blood all on my gears... damn`);
    }
  },
  phoopes: {
    noCopy: true,
    innateName: "Gen 1 Special Stat",
    desc: "SpA stat changes also change SpD and vice versa.",
    // implemented in scripts
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("phoopes")}|phoopes! (There It Is)`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("phoopes")}|phoopes! (There He Goes)`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("phoopes")}|Jynx! Knock on wood`);
    }
  },
  pissog: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Pissog")}|Hi I'm Pissog ^^`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Pissog")}|^^ gossiP m'I iH`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Pissog")}|Yes, there are two paths you can go by, but in the long run`);
    }
  },
  pokemonvortex: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("pokemonvortex")}|i just like the bowtie`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("pokemonvortex")}|ok`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("pokemonvortex")}|\u4EBA\u4E0D\u53EF\u8C8C\u76F8\uFF0C\u6D77\u6C34\u4E0D\u53EF\u6597\u91CF`);
    }
  },
  princessautumn: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Princess Autumn")}|good meowning, here's why you're wrong.`);
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Princess Autumn")}|good nyight, I'm always right.`);
      if (pokemon.illusion || !pokemon.status) return;
      this.add("-curestatus", pokemon, pokemon.status, "[from] ability: Natural Cure");
      pokemon.clearStatus();
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Princess Autumn")}|We let TPP cook too hard...`);
    },
    innateName: "Natural Cure"
  },
  ptoad: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("ptoad")}|/me enters the stage`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("ptoad")}|Taking 5!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ptoad")}|Who told you you're allowed to rain on my parade?`);
    }
  },
  pulseks: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Pulse_kS")}|Mid Skill, God Luck`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Pulse_kS")}|brb lemme run the numbers`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Pulse_kS")}|If my model is accurate (it isn't)`);
    }
  },
  pyro: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("PYRO")}|and I'm your host, the Supervillain`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("PYRO")}|Operation: Lifesaver is in effect, as of right now`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("PYRO")}|Just remember ALL CAPS when you spell the man name...`);
    },
    onSourceAfterFaint(length, target, source, effect) {
      if (effect?.effectType === "Move") {
        if (effect.id === "meatgrinder") {
          this.add(`c:|${(0, import_scripts.getName)("PYRO")}|Tripping off the beat kinda, dripping off the meat grinder`);
          return;
        }
        if (!source.m.msgPlayed) {
          this.add(`c:|${(0, import_scripts.getName)("PYRO")}|This Villain was a ruthless mass conqueror, with aspirations to dominate the universe`);
          source.m.msgPlayed = true;
        }
      }
    }
  },
  quitequiet: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Quite Quiet")}|what are we even doing here`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Quite Quiet")}|hm`);
    }
  },
  quziel: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("quziel")}|Gaze`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("quziel")}|See y-disconnects`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("quziel")}|I am become Tilt`);
    }
  },
  r8: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("R8")}|!randcat`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("R8")}|wow emoji`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("R8")}|Getting KOed won't prevent me from making propaganda: https://www.smogon.com/forums/forums/national-dex-other-tiers.738/`);
    }
  },
  rainshaft: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Rainshaft")}|Hello ${pokemon.side.name} and ${pokemon.side.foe.name} :P`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Rainshaft")}|Hope you got lucky there...`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Rainshaft")}|You weren't lucky enough, join <<survivor>> for more practice XD`);
    }
  },
  ransei: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Ransei")}|Heyo, I'm hosting a program known as Pok\xE9mon Lore Tutoring this generation and I was wondering if any of you guys would be interested in tutoring. Every generation of Pok\xE9mon lore is available for tutoring, however we are in need of tutors to start off with. If you are interested let me know. Oh yeah I'm also hosting a program known as OM Tutoring.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Ransei")}|A perfect world of Pok\xE9mon has everything balanced, whether it's truth and ideals, life and death, time and space, or the organisms of nature and the organisms of whom were genetically engineered. All Pok\xE9mon are welcomed as long as they help maintain this balance. Remember this. It's what Arceus always wanted.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Ransei")}|Well, at least I tried. ripsei.`);
    }
  },
  returntomonkey: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("ReturnToMonkey")}|Where banana`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("ReturnToMonkey")}|**Monkey Scream**`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("ReturnToMonkey")}|Reject the humanity...if you dare...`);
    }
  },
  riovidal: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Rio Vidal")}|It's not my fault you're, like, in love with me!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Rio Vidal")}|That's why her hair is so big. It's full of secrets.`);
    },
    onFoeSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Rio Vidal")}|You wanna do something fun? You wanna go to Taco Bell?`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Rio Vidal")}|Gretchen, I'm sorry I laughed at you that time you got diarrhea at Barnes & Noble. And I'm sorry for telling everyone about it. And I'm sorry for repeating it now.`);
    }
  },
  rissoux: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Rissoux")}|:squad:`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Rissoux")}|Welcome to the Family`);
    }
  },
  rsb: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("RSB")}|Time to take a bite out of crime!`);
      const dog = this.toID((0, import_scripts.enemyStaff)(pokemon));
      if (dog === "rsb" || dog === "shiloh" || dog === "valerian" || dog === "breadey" || dog === "yuki") {
        this.add(`c:|${(0, import_scripts.getName)("RSB")}|DOGGO!`);
      }
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("RSB")}|Requesting backup!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("RSB")}|Officer down.`);
    },
    onBasePowerPriority: 19,
    onBasePower(basePower, attacker, defender, move) {
      if (!attacker.illusion && move.flags["bite"]) {
        return this.chainModify(1.5);
      }
    },
    onTryHit(target, source, move) {
      if (!target.illusion && target !== source && move.type === "Fire") {
        move.accuracy = true;
        if (!target.addVolatile("flashfire")) {
          this.add("-immune", target, "[from] ability: Flash Fire");
        }
        return null;
      }
    },
    onEnd(pokemon) {
      pokemon.removeVolatile("flashfire");
    },
    innateName: "Flash Fire + Strong Jaw",
    shortDesc: "Flash Fire + Strong Jaw."
  },
  rumia: {
    noCopy: true,
    onStart(pokemon) {
      if ((0, import_scripts.enemyStaff)(pokemon) === "kolohe") {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|OMG who could that be (\u2060\u25CF\u2060\u2661\u2060\u2200\u2060\u2661\u2060)`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|is the mon in front of me the edible kind?`);
      }
    },
    onSwitchOut(pokemon) {
      if ((0, import_scripts.enemyStaff)(pokemon) === "kolohe") {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|i cant bring myself to do this...`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|brb ^_^`);
      }
    },
    onFaint(pokemon) {
      if ((0, import_scripts.enemyStaff)(pokemon) === "kolohe") {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|this is the best way to go out...`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("Rumia")}|is that sooooo...`);
      }
    }
  },
  scotteh: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Scotteh")}|\`\`Compilation completed successfully. Executing...\`\``);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Scotteh")}|\`\`Execution temporarily paused.\`\``);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Scotteh")}|\`\`Segmentation fault (core dumped)\`\``);
    }
  },
  sexymalasada: {
    noCopy: true,
    onStart(pokemon) {
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "wigglytree":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Hey Wiggles! I made pizza again! Wanna learn more RNG btw?`);
          break;
        case "appletunalamode":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|And now you must learn how to RNG with nothing but a sundial for a timer! __Trust me!__`);
          break;
        case "loethalion":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|For the hundredth time Loe, check. the. pins.`);
          break;
        case "nicolic":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Hi Nic! Why you keep postponing learning old-gen RNG? q_q`);
          break;
        case "swiffix":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|....something smells in here`);
          break;
        case "mex":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Today is the day you finally learn RNG Mex, deal with it!`);
          break;
        case "clefable":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Oi! I'm not hacking, it's RNG!`);
          break;
        case "billo":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Billo help! The tool isn't working again q_q`);
          break;
        default:
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Hello! Do you have some time to talk about RNGesus and its awesome teachings: The Art of RNG abuse??`);
          break;
      }
    },
    onSwitchOut(pokemon) {
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "loethalion":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|fricking heck`);
          break;
        case "swiffix":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Just shower already!`);
          break;
        case "billo":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Fiiiine I'll read the wiki...`);
          break;
        default:
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Crap! I missed my frame... Resetting... q_q`);
          break;
      }
    },
    onFaint(pokemon) {
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "loethalion":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|fricking heck`);
          break;
        case "swiffix":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Just shower already!`);
          break;
        case "billo":
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Fiiiine I'll read the wiki...`);
          break;
        default:
          this.add(`c:|${(0, import_scripts.getName)("SexyMalasada")}|Well then.. have fun soft-resetting for your shiny! >:( Cya on the flipside \u{1F576}\uFE0F`);
          break;
      }
    }
  },
  sharpclaw: {
    noCopy: true,
    onStart(pokemon) {
      if (pokemon.species.name === "Sneasel") {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|Hi, I'm Tumble! hf :D`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|Hi, I'm Rough! gl >:)`);
      }
    },
    onSwitchOut(pokemon) {
      if (pokemon.species.name === "Sneasel") {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|brb, getting my brother :3`);
        if (pokemon.illusion) return;
        (0, import_scripts.changeSet)(this, pokemon, import_random_teams.ssbSets["sharp_claw-Rough"]);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|brb, getting my sister c:`);
        if (pokemon.illusion) return;
        (0, import_scripts.changeSet)(this, pokemon, import_random_teams.ssbSets["sharp_claw"]);
      }
    },
    onFaint(pokemon) {
      if (pokemon.species.name === "Sneasel") {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|ur no fun ;~;`);
      } else {
        this.add(`c:|${(0, import_scripts.getName)("sharp_claw")}|ur no fun T_T`);
      }
    },
    innateName: "Rough and Tumble",
    shortDesc: "Changes Sneasel forme on switch out."
  },
  siegfried: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Siegfried")}|You say goodbye and I say hello`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Siegfried")}|Oh, I get by with a little help from my friends.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Siegfried")}|Living is easy with eyes closed.`);
    }
  },
  sificon: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Sificon~")}|gm (it's 4pm and I woke up just now)`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Sificon~")}|guess I'll go to bed (we all know that I won't)`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Sificon~")}|oop`);
    }
  },
  skies: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("skies")}|the baddest in the room, so tell em to make room... `);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("skies")}|u thought i was feelin u?`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("skies")}|what did i do? like?`);
    }
  },
  snake: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("snake")}|CAP Concept: Pure Utility Pokemon`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("snake")}|CAP is a community focused project that creates singular Pokemon through structured Smogon based discussion threads. We define a concept to build around and proceed through various stages to determine typing, ability, stats, and movepool to complement that concept. We also run stages to determine a CAP's art, name, Pokedex entry, and sprite, so even if you're not a competitive Pokemon person you can get involved. At the end of each process we implement each CAP here on Pokemon Showdown!, where they are made available with the rest of our creations in the CAP metagame, found under 'S/V Singles'.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("snake")}|CAP does not accept personal creations. This refers to any idea for a Pokemon that already has predefined typing, stats, abilities, movepool, name, art, pokedex entries, weight, height, or even generic themes such as "rabbit" or "angry". These facets of a Pokemon are all decided through community discussion in CAP during the CAP process. If you think you have an idea for a Pokemon that does not define these features, you may have a concept. CAP bases our Pokemon around concepts that look to explore the mechanics behind Pokemon and we take open submissions whenever we start a new project. Examples of past concepts include Perfect Sketch User, Momentum, Trapping mechanics, delayed move user, and weather enabler.`);
    }
  },
  softflex: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Soft Flex")}|*beep beep beep*`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Soft Flex")}|*whrrrr*`);
    }
  },
  solaroslunaris: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Solaros & Lunaris")}|Get a taste of this!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Solaros & Lunaris")}|Too hot to handle!`);
    }
  },
  spiderz: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Spiderz")}|whats good gangy`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Spiderz")}|im moving DIFFERENT`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Spiderz")}|fuck 12`);
    }
  },
  spoo: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("spoo")}|hemogoblin`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("spoo")}|danger`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("spoo")}|dies`);
    }
  },
  steorra: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Steorra")}|BOO`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Steorra")}|Into the shadows I go`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Steorra")}|I'm dead but not really (lol ghost)`);
    }
  },
  struchni: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Struchni")}|~tt newgame`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Struchni")}|~tt endgame`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Struchni")}|**selfveto**`);
    }
  },
  sulo: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Sulo")}|everybody is so damn dramatic. me included.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Sulo")}|afk sorry guys brb`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Sulo")}|Charon, take me home...`);
    }
  },
  swiffix: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Swiffix")}|:uwupip:`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Swiffix")}|brb, gonna get some ketchup for my pizza`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Swiffix")}|Remember: it's pp, not pfp!`);
    },
    innateName: "Skill Link",
    onModifyMove(move, pokemon, target) {
      if (pokemon.illusion) return;
      if (move.multihit && Array.isArray(move.multihit) && move.multihit.length) {
        move.multihit = move.multihit[1];
      }
      if (move.multiaccuracy) {
        delete move.multiaccuracy;
      }
    }
  },
  syrinix: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Syrinix")}|You kept me like a secret but I kept you like an oath`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Syrinix")}|They don't think it be like it is, but it do`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Syrinix")}|Aight Imma head out`);
    }
  },
  teclis: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Teclis")}|Thanks for having me.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Teclis")}|Until next time!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Teclis")}|This was my last dance.`);
    }
  },
  tenshi: {
    noCopy: true,
    onStart(pokemon) {
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "blitz":
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|le fishe`);
          break;
        case "ut":
        case "clouds":
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|birbs cannot save u from SAND`);
          break;
        default:
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|he SLEUTHING`);
      }
    },
    onSwitchOut(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|omg no SAND save him! :(`);
      const replacementIndex = Math.max(
        pokemon.moves.indexOf("pyroball"),
        pokemon.moves.indexOf("aquatail"),
        pokemon.moves.indexOf("tripleaxel"),
        pokemon.moves.indexOf("stoneedge")
      );
      if (replacementIndex < 0) {
        return;
      }
      const replacement = this.dex.moves.get("dynamicpunch");
      const replacementMove = {
        move: replacement.name,
        id: replacement.id,
        pp: replacement.pp,
        maxpp: replacement.pp,
        target: replacement.target,
        disabled: false,
        used: false
      };
      pokemon.moveSlots[replacementIndex] = replacementMove;
      pokemon.baseMoveSlots[replacementIndex] = replacementMove;
    },
    onFaint(pokemon) {
      switch (this.toID((0, import_scripts.enemyStaff)(pokemon))) {
        case "blitz":
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|YOU KILLED YOUR SON`);
          break;
        case "ut":
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|worryrex`);
          break;
        case "clouds":
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|SAND is no longer in the air tonight :(`);
          break;
        default:
          this.add(`c:|${(0, import_scripts.getName)("Tenshi")}|Wait no that's illegal`);
      }
    }
  },
  tico: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Tico")}|oie`);
      if (pokemon.illusion) return;
      this.add("-ability", pokemon, "Mold Breaker");
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Tico")}|t+`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Tico")}|It's been 3,000 years\u2026`);
    },
    onModifyMove(move, pokemon) {
      if (pokemon.illusion) return;
      move.ignoreAbility = true;
    },
    innateName: "Mold Breaker"
  },
  thejesucristoosama: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("TheJesucristoOsAma")}|In the name of the Father, the Son and the Holy Spirit. I bless you, Amen.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("TheJesucristoOsAma")}|Oh well, I think it's time to call my apostles.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("TheJesucristoOsAma")}|And that's how I've died for the third time, I'll go to host a game at eventos.`);
    }
  },
  traceuser: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("trace")}|I'm both the beginning and the end.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("trace")}|Why does the violence never end?`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("trace")}|How disappointingly short a dream lasts.`);
    }
  },
  tuthur: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Tuthur")}|QUEUE !`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Tuthur")}|feur`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Tuthur")}|this wouldn't have gone like this if we'd played kunc`);
    }
  },
  twoofroses: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("Two of Roses")}|I'm here! I'm uhh- Yes! Also hi! Happy to be here.`);
      this.singleEvent("WeatherChange", this.effect, this.effectState, pokemon);
      this.singleEvent("TerrainChange", this.effect, this.effectState, pokemon);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Two of Roses")}|Pfft! I prefer lurking anyway.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Two of Roses")}|It matters not how much we try but only that we try. For if the tides swell the dunes of a timeless existence, and our strength wanes in the coming unlight- And if we are to be as the forsaken namesakes before us, for the yesterday that never came and the tomorrow that is forever promised, know this; We dilly, so they do not dally...`);
    },
    innateName: "Wonderer",
    shortDesc: "This Pokemon's secondary type changes based on the active weather or terrain, monotype if neither.",
    onWeatherChange(target, source, sourceEffect) {
      const currentWeather = this.field.getWeather().id;
      const currentTerrain = this.field.getTerrain().id;
      let type;
      if (!currentWeather && !target.hasType("Dark")) {
        if (currentTerrain) {
          this.singleEvent("TerrainChange", this.effect, this.effectState, target);
          return;
        }
        type = "Dark";
      } else if (currentWeather) {
        if (["raindance", "primordialsea", "stormsurge"].includes(currentWeather) && !target.hasType("Water")) {
          type = "Water";
        } else if (["sunnyday", "desolateland"].includes(currentWeather) && !target.hasType("Fire")) {
          type = "Fire";
        } else if (["sandstorm", "deserteddunes"].includes(currentWeather) && !target.hasType("Rock")) {
          type = "Rock";
        } else if (["hail", "snowscape"].includes(currentWeather) && !target.hasType("Ice")) {
          type = "Ice";
        } else {
        }
      }
      if (type && !target.terastallized) {
        target.addType(type);
        this.add("-start", target, "typeadd", type, "[from] ability: Wonderer");
      }
    },
    onTerrainChange(target, source, sourceEffect) {
      const currentWeather = this.field.getWeather().id;
      const currentTerrain = this.field.getTerrain().id;
      let type;
      if (!currentTerrain && !target.hasType("Dark")) {
        if (currentWeather) {
          this.singleEvent("WeatherChange", this.effect, this.effectState, target);
          return;
        }
        type = "Dark";
      } else if (currentTerrain) {
        if (currentTerrain === "electricterrain") {
          target.setType("Electric");
          type = "";
        } else if (currentTerrain === "psychicterrain" && !target.hasType("Psychic")) {
          type = "Psychic";
        } else if (currentTerrain === "grassyterrain" && !target.hasType("Grass")) {
          type = "Grass";
        } else if (currentTerrain === "mistyterrain" && !target.hasType("Fairy")) {
          type = "Fairy";
        } else if (!target.hasType("Ghost")) {
          type = "Ghost";
        }
      }
      if (type && !target.terastallized) {
        target.addType(type);
        this.add("-start", target, "typeadd", type, "[from] ability: Wonderer");
      }
    }
  },
  ut: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("UT")}|__being this young is art, aquamarine__`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("UT")}|__make sure nobody sees you leave__`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("UT")}|__swaying as the room burnded down__`);
    }
  },
  valerian: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Valerian \u273F \u2661")}|Lucario's shiny should've been red.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Valerian \u273F \u2661")}|As a wise man once said, "I'll be back".`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Valerian \u273F \u2661")}|My name is based on a flower, NOT the movie!`);
    }
  },
  venous: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Venous")}|bro the flute on stal is bonkers`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("2013 hindi room")}|when i said tine wins i didnt mean now`);
      this.add(`c:|${(0, import_scripts.getName)("Venous")}|dw watch this`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Venous")}|teachin bitches how to swim`);
    },
    innateName: "Stored Power",
    shortDesc: "Moves gain 20 additional Base Power per each positive stat boost.",
    onModifyMove(move, pokemon, target) {
      if (move.basePowerCallback) return;
      if (pokemon.species.baseSpecies !== "Mantine") return;
      move.basePowerCallback = function(p, t, m) {
        const bp = m.basePower + 20 * p.positiveBoosts();
        return bp;
      };
    }
  },
  violet: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Vio\u035C\u0361let")}|I'm not hating you just decided to be wrong`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Vio\u035C\u0361let")}|anyway\u2026`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Vio\u035C\u0361let")}|blatantly carried by cheating but you'll still find a way to downplay`);
    },
    innateName: "Do No Evil",
    shortDesc: "When this Pokemon uses an attacking move, it transforms into the Ogerpon form of the corresponding type.",
    onModifyMove(move, attacker, defender) {
      if (attacker.species.baseSpecies !== "Ogerpon" || attacker.transformed) return;
      let targetForme = "Ogerpon";
      switch (move.type) {
        case "Rock":
          targetForme += "-Cornerstone";
          break;
        case "Fire":
          targetForme += "-Hearthflame";
          break;
        case "Water":
          targetForme += "-Wellspring";
          break;
        case "Grass":
          break;
        default:
          return;
      }
      if (attacker.terastallized) targetForme += (targetForme === "Ogerpon" ? "-Teal" : "") + "-Tera";
      if (attacker.species.name !== targetForme) {
        this.add("-activate", attacker, "ability: Do No Evil");
        attacker.formeChange(targetForme);
      }
    }
  },
  vistar: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Vistar")}|Oh hi! (0_0)/`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Vistar")}|I'll go on a break, wait for me!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Vistar")}|So... this is how my career ends...`);
    }
  },
  vmnunes: {
    noCopy: true
  },
  warriorgallade: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("WarriorGallade")}|i wanted to proc berries, but it seems that i was better at proc rastinating instead. nom nom nom.`);
      if (this.toID((0, import_scripts.enemyStaff)(pokemon)) === "aqrator") {
        this.add(`c:|${(0, import_scripts.getName)("WarriorGallade")}|Hi Tori, how goes your conquest?`);
      }
      if (pokemon.illusion) return;
      pokemon.abilityState.gluttony = true;
      this.add("-activate", pokemon, "ability: Nutrient Boost");
      this.boost({ def: 1, spd: 1 }, pokemon);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("WarriorGallade")}|amidst this tactical retreat, you didn't think i forgot about the pokeradar, did you? you can bet that my return with even more questions will be __eventful__ :3`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("WarriorGallade")}|a wig flew, and now i must bid you adieu. farewell my berries accrued, for this is the end of my etude.`);
    },
    onSourceAfterFaint() {
      this.add(`c:|${(0, import_scripts.getName)("WarriorGallade")}|Triumphant through trouncing tough, tenacious threats today, though testing 212 takeovers tarry. Theorizing these techniques tends to torrid, terribly tiresome tabulations, therefore torrential tactics traverse thorough thoughts.`);
    },
    innateName: "Nutrient Boost",
    shortDesc: "Gluttony + Thick Fat + Neuroforce + +1 Def/Sp. Def boost.",
    onDamage(item, pokemon) {
      if (pokemon.illusion) return;
      pokemon.abilityState.gluttony = true;
    },
    onSourceModifyAtkPriority: 6,
    onSourceModifyAtk(atk, attacker, defender, move) {
      if (defender.illusion) return;
      if (move.type === "Ice" || move.type === "Fire") {
        this.debug("Thick Fat weaken");
        return this.chainModify(0.5);
      }
    },
    onSourceModifySpAPriority: 5,
    onSourceModifySpA(atk, attacker, defender, move) {
      if (defender.illusion) return;
      if (move.type === "Ice" || move.type === "Fire") {
        this.debug("Thick Fat weaken");
        return this.chainModify(0.5);
      }
    },
    onModifyDamage(damage, source, target, move) {
      if (source.illusion) return;
      if (move && target.getMoveHitData(move).typeMod > 0) {
        return this.chainModify([5120, 4096]);
      }
    }
  },
  waves: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Waves")}|Nice opinion, one small issue: 252+ SpA Wailord Water Spout (150 BP) vs. 0 HP / 0- SpD Your Argument in Rain: 1202-1416 (413 - 486.5%) -- guaranteed OHKO.`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Waves")}|Ocean man, take me by the hand.`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Waves")}|/me waves goodbye.`);
    }
  },
  wigglytree: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("WigglyTree")}|hi ur qt :3`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("WigglyTree")}|Is that a watering can I see?`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("WigglyTree")}|Keep wiggling!`);
    }
  },
  xprienzo: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("XpRienzo \u2611\u25E1\u2611")}|Would I lie to you?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("XpRienzo \u2611\u25E1\u2611")}|What? You don't trust me? >.>`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("XpRienzo \u2611\u25E1\u2611")}|Bleh, lame.`);
    }
  },
  xy01: {
    noCopy: true
  },
  yeetdabxd: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("yeet dab xd")}|Ah, welcome~! The merchandise you have chosen will cost your soul. Is that acceptable?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("yeet dab xd")}|brb mum's getting the camera`);
    },
    onFaint(pokemon) {
      if (pokemon.m.seedActivated) return;
      this.add(`c:|${(0, import_scripts.getName)("yeet dab xd")}|wait no you didn't join QW yet`);
    }
  },
  yellowpaint: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Yellow Paint")}|cheers`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Yellow Paint")}|luckynbad`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Yellow Paint")}|The canvas is filled with different screams.`);
    },
    onModifyMove(move) {
      if (move.id === "iondeluge") {
        move.onHitField = function() {
          this.add(`c:|${(0, import_scripts.getName)("Yellow Paint")}|Paint it Yellow!`);
        };
      }
    }
  },
  yuki: {
    noCopy: true,
    innateName: "Snow Warning",
    onStart(source) {
      if (source.illusion) return;
      this.field.setWeather("snowscape", source, this.dex.abilities.get("snowwarning"));
    }
  },
  yveltalnl: {
    noCopy: true,
    onStart(pokemon) {
      this.add(`c:|${(0, import_scripts.getName)("YveltalNL")}|It's over ${pokemon.side.foe.name}, I have the high ground!`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("YveltalNL")}|brb playing a draft game rq`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("YveltalNL")}|whatever i'll go watch football`);
    }
  },
  za: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("za")}|Benvenuto`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("za")}|mish`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("za")}|!track Between the Buried and Me - Sun Of Nothing - 2020 Remix / Remaster`);
    }
  },
  zalm: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("Zalm")}|<(:O)00000>`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("Zalm")}|brb gonna check if my lasagne didn't explode e-e`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("Zalm")}|I should have picked an actual fish pok\xE9mon like veluza instead...`);
    }
  },
  zarel: {
    noCopy: true
  },
  zee: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("zee")}|So is this your first VGC tournament?`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("zee")}|Sorry, I've got a plane to catch!`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("zee")}|Hey everyone it's been a great time working with you all in this Super Staff Bros battle but I think it's the right time for me to step down. Thank you all and see you around.`);
    }
  },
  zoro: {
    noCopy: true,
    onStart() {
      this.add(`c:|${(0, import_scripts.getName)("zoro")}|gmeow`);
    },
    onSwitchOut() {
      this.add(`c:|${(0, import_scripts.getName)("zoro")}|brb I want to chase some yarn`);
    },
    onFaint() {
      this.add(`c:|${(0, import_scripts.getName)("zoro")}|time to take a cat nap`);
    }
  },
  // Custom effects
  // Clem
  flipped: {
    name: "Flipped",
    onStart(target) {
      this.add("-start", target, "flipped");
    },
    onEnd(target) {
      this.add("-end", target, "flipped");
    }
  },
  // dhelmise
  hacked: {
    name: "Hacked",
    duration: 4,
    onStart(pokemon, source) {
      this.add("-activate", pokemon, "move: " + this.effectState.sourceEffect, `[of] ${source}`);
      this.add("-start", pokemon, "hacked");
    },
    onEnd(pokemon) {
      this.add("-end", pokemon, this.effectState.sourceEffect, "[partiallytrapped]");
      this.add("-end", pokemon, "hacked");
    },
    onTrapPokemon(pokemon) {
      pokemon.tryTrap();
    },
    onDisableMove(pokemon) {
      let disabledMove = false;
      for (const moveSlot of pokemon.moveSlots) {
        const move = this.dex.getActiveMove(moveSlot.id);
        if (move.selfSwitch) {
          pokemon.disableMove(moveSlot.id);
          disabledMove = true;
        }
      }
      if (!disabledMove) {
        const moveSlot = this.sample(pokemon.moveSlots);
        pokemon.disableMove(moveSlot.id);
      }
    }
  },
  // EasyOnTheHills
  snack: {
    name: "Snack",
    duration: 3,
    onStart(target) {
      this.add("-start", target, "snack");
    },
    onEnd(target) {
      this.add("-end", target, "snack");
    },
    onResidualOrder: 5,
    onResidualSubOrder: 4,
    onResidual(target, source, effect) {
      this.heal(target.baseMaxhp / 3);
    }
  },
  // Elliot
  beefed: {
    name: "Beefed",
    onStart(target) {
      this.add("-start", target, "beefed");
    },
    onEnd(target) {
      this.add("-end", target, "beefed");
    },
    onModifyMovePriority: -1,
    onModifyMove(move, pokemon, target) {
      if (!target || !this.checkMoveMakesContact(move, pokemon, target) || move.category === "Status") return;
      if (!move.secondaries) move.secondaries = [];
      move.secondaries.push({
        chance: 30,
        status: "brn"
      });
    },
    onDamagingHitOrder: 1,
    onDamagingHit(damage, target, source, move) {
      if (this.checkMoveMakesContact(move, source, target, true)) {
        this.damage(source.baseMaxhp / 8, source, target);
      }
      if (this.checkMoveMakesContact(move, source, target) && this.randomChance(3, 10)) {
        source.trySetStatus("brn", target);
      }
    },
    onResidual(target, source, effect) {
      this.heal(target.baseMaxhp / 8);
    },
    onSourceAfterFaint(length, target, source, effect) {
      this.add(`c:|${(0, import_scripts.getName)("Elliot")}|Get Bovriled`);
    }
  },
  boiled: {
    name: "Boiled",
    onStart(target) {
      this.add("-start", target, "boiled");
    },
    onEnd(target) {
      this.add("-end", target, "boiled");
    },
    onModifySpAPriority: 5,
    onModifySpA(relayVar, source, target, move) {
      return this.chainModify(1.5);
    },
    onModifyMovePriority: -1,
    onModifyMove(move, pokemon, target) {
      if (!target) return;
      if (move.category !== "Status") {
        if (!move.secondaries) move.secondaries = [];
        move.secondaries.push({
          chance: 30,
          status: "brn"
        });
      }
    }
  },
  // Elly
  stormsurge: {
    name: "StormSurge",
    effectType: "Weather",
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasItem("damprock")) {
        return 8;
      }
      return 5;
    },
    onEffectivenessPriority: -1,
    onEffectiveness(typeMod, target, type, move) {
      if (move?.effectType === "Move" && move.category !== "Status" && type === "Flying" && typeMod > 0) {
        this.add("-fieldactivate", "Storm Surge");
        return 0;
      }
    },
    onWeatherModifyDamage(damage, attacker, defender, move) {
      if (defender.hasItem("utilityumbrella")) return;
      if (move.flags["wind"]) {
        this.debug("Storm Surge wind boost");
        return this.chainModify(1.1);
      }
      if (move.type === "Water") {
        this.debug("Storm Surge water boost");
        return this.chainModify(1.3);
      }
      if (move.type === "Fire") {
        this.debug("Storm Surge fire suppress");
        return this.chainModify(0.7);
      }
    },
    onAccuracy(accuracy, attacker, defender, move) {
      if (move?.flags["wind"] && !attacker.hasItem("utilityumbrella")) return true;
      return accuracy;
    },
    onFieldStart(battle, source, effect) {
      if (effect?.effectType === "Ability") {
        if (this.gen <= 5) this.effectState.duration = 0;
        this.add("-weather", "StormSurge", "[from] ability: " + effect.name, `[of] ${source}`);
      } else {
        this.add("-weather", "StormSurge");
      }
    },
    onImmunity(type, pokemon) {
      if (pokemon.hasItem("utilityumbrella")) return;
      if (type === "frz") return false;
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "StormSurge", "[upkeep]");
      this.eachEvent("Weather");
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  // kenn
  deserteddunes: {
    name: "DesertedDunes",
    effectType: "Weather",
    duration: 0,
    onEffectivenessPriority: -1,
    onEffectiveness(typeMod, target, type, move) {
      if (move?.effectType === "Move" && move.category !== "Status" && type === "Rock" && typeMod > 0) {
        this.add("-fieldactivate", "Deserted Dunes");
        return 0;
      }
    },
    onModifySpDPriority: 10,
    onModifySpD(spd, pokemon) {
      if (pokemon.hasType("Rock") && this.field.isWeather("deserteddunes")) {
        return this.modify(spd, 1.25);
      }
    },
    onFieldStart(field, source, effect) {
      this.add("-weather", "DesertedDunes", "[from] ability: " + effect.name, `[of] ${source}`);
    },
    onFieldResidualOrder: 1,
    onFieldResidual() {
      this.add("-weather", "DesertedDunes", "[upkeep]");
      this.eachEvent("Weather");
    },
    onWeather(target) {
      this.damage(target.baseMaxhp / 16);
    },
    onFieldEnd() {
      this.add("-weather", "none");
    }
  },
  // Neko
  catstampofapproval: {
    name: "Cat Stamp of Approval",
    noCopy: true,
    onStart(target) {
      this.add("-start", target, "Cat Stamp of Approval");
      this.effectState.bestStat = target.getBestStat(false, true);
    },
    onEnd(target) {
      this.add("-end", target, "Cat Stamp of Approval");
    },
    onModifyAtkPriority: 5,
    onModifyAtk(atk, pokemon) {
      if (this.effectState.bestStat !== "atk" || pokemon.ignoringAbility()) return;
      this.debug("Cat Stamp of Approval atk boost");
      return this.chainModify([5325, 4096]);
    },
    onModifyDefPriority: 6,
    onModifyDef(def, pokemon) {
      if (this.effectState.bestStat !== "def" || pokemon.ignoringAbility()) return;
      this.debug("Cat Stamp of Approval def boost");
      return this.chainModify([5325, 4096]);
    },
    onModifySpAPriority: 5,
    onModifySpA(spa, pokemon) {
      if (this.effectState.bestStat !== "spa" || pokemon.ignoringAbility()) return;
      this.debug("Cat Stamp of Approval spa boost");
      return this.chainModify([5325, 4096]);
    },
    onModifySpDPriority: 6,
    onModifySpD(spd, pokemon) {
      if (this.effectState.bestStat !== "spd" || pokemon.ignoringAbility()) return;
      this.debug("Cat Stamp of Approval spd boost");
      return this.chainModify([5325, 4096]);
    },
    onModifySpe(spe, pokemon) {
      if (this.effectState.bestStat !== "spe" || pokemon.ignoringAbility()) return;
      this.debug("Cat Stamp of Approval spe boost");
      return this.chainModify(1.5);
    }
  },
  // Effects needed to be overriden for things to happen
  attract: {
    onStart(pokemon, source, effect) {
      if (!(pokemon.gender === "M" && source.gender === "F") && !(pokemon.gender === "F" && source.gender === "M")) {
        if (!["The Love Of Christ", ":3"].includes(effect.name)) {
          this.debug("incompatible gender");
          return false;
        }
      }
      if (!this.runEvent("Attract", pokemon, source)) {
        this.debug("Attract event failed");
        return false;
      }
      if (effect.name === "Cute Charm") {
        this.add("-start", pokemon, "Attract", "[from] ability: Cute Charm", `[of] ${source}`);
      } else if (effect.name === "Destiny Knot") {
        this.add("-start", pokemon, "Attract", "[from] item: Destiny Knot", `[of] ${source}`);
      } else {
        this.add("-start", pokemon, "Attract");
      }
    },
    onUpdate(pokemon) {
      if (this.effectState.source && !this.effectState.source.isActive && pokemon.volatiles["attract"]) {
        this.debug(`Removing Attract volatile on ${pokemon}`);
        pokemon.removeVolatile("attract");
      }
    },
    onBeforeMovePriority: 2,
    onBeforeMove(pokemon, target, move) {
      this.add("-activate", pokemon, "move: Attract", "[of] " + this.effectState.source);
      if (this.randomChance(1, 2)) {
        this.add("cant", pokemon, "Attract");
        return false;
      }
    },
    onEnd(pokemon) {
      this.add("-end", pokemon, "Attract", "[silent]");
    }
  },
  gravity: {
    duration: 5,
    durationCallback(source, effect) {
      if (source?.hasAbility("persistent")) {
        this.add("-activate", source, "ability: Persistent", "[move] Gravity");
        return 7;
      }
      return 5;
    },
    onFieldStart(target, source) {
      if (source?.hasAbility("persistent")) {
        this.add("-fieldstart", "move: Gravity", "[persistent]");
      } else {
        this.add("-fieldstart", "move: Gravity");
      }
      for (const pokemon of this.getAllActive()) {
        let applies = false;
        if (pokemon.removeVolatile("bounce") || pokemon.removeVolatile("fly")) {
          applies = true;
          this.queue.cancelMove(pokemon);
          pokemon.removeVolatile("twoturnmove");
        }
        if (pokemon.volatiles["skydrop"]) {
          applies = true;
          this.queue.cancelMove(pokemon);
          if (pokemon.volatiles["skydrop"].source) {
            this.add("-end", pokemon.volatiles["twoturnmove"].source, "Sky Drop", "[interrupt]");
          }
          pokemon.removeVolatile("skydrop");
          pokemon.removeVolatile("twoturnmove");
        }
        if (pokemon.volatiles["magnetrise"]) {
          applies = true;
          delete pokemon.volatiles["magnetrise"];
        }
        if (pokemon.volatiles["telekinesis"]) {
          applies = true;
          delete pokemon.volatiles["telekinesis"];
        }
        if (applies) this.add("-activate", pokemon, "move: Gravity");
      }
    },
    onModifyAccuracy(accuracy) {
      if (typeof accuracy !== "number") return;
      return this.chainModify([6840, 4096]);
    },
    onDisableMove(pokemon) {
      for (const moveSlot of pokemon.moveSlots) {
        if (this.dex.moves.get(moveSlot.id).flags["gravity"]) {
          pokemon.disableMove(moveSlot.id);
        }
      }
    },
    // groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
    onBeforeMovePriority: 6,
    onBeforeMove(pokemon, target, move) {
      if (move.flags["gravity"] && !move.isZ) {
        this.add("cant", pokemon, "move: Gravity", move);
        return false;
      }
    },
    onModifyMove(move, pokemon, target) {
      if (move.flags["gravity"] && !move.isZ) {
        this.add("cant", pokemon, "move: Gravity", move);
        return false;
      }
    },
    onFieldResidualOrder: 27,
    onFieldResidualSubOrder: 2,
    onFieldEnd() {
      this.add("-fieldend", "move: Gravity");
      const activePokemon = this.getAllActive();
      for (const a of activePokemon) {
        if (a.name === "Lunell") {
          this.add(`c:|${(0, import_scripts.getName)("Lunell")}|ope there goes gravity`);
          break;
        }
      }
    }
  },
  raindance: {
    inherit: true,
    onWeatherModifyDamage(damage, attacker, defender, move) {
      if (defender.hasItem("utilityumbrella") || move.id === "geyserblast") return;
      if (move.type === "Water") {
        this.debug("rain water boost");
        return this.chainModify(1.5);
      }
      if (move.type === "Fire") {
        this.debug("rain fire suppress");
        return this.chainModify(0.5);
      }
    }
  },
  sunnyday: {
    inherit: true,
    onWeatherModifyDamage(damage, attacker, defender, move) {
      if (defender.hasItem("utilityumbrella") || move.id === "geyserblast") return;
      if (move.type === "Fire") {
        this.debug("Sunny Day fire boost");
        return this.chainModify(1.5);
      }
      if (move.type === "Water" && move.id !== "hydrosteam") {
        this.debug("Sunny Day water suppress");
        return this.chainModify(0.5);
      }
    }
  },
  confusion: {
    inherit: true,
    onBeforeMove(pokemon) {
      pokemon.volatiles["confusion"].time--;
      if (!pokemon.volatiles["confusion"].time) {
        pokemon.removeVolatile("confusion");
        return;
      }
      this.add("-activate", pokemon, "confusion");
      if (!this.randomChance(33, 100)) {
        return;
      }
      this.activeTarget = pokemon;
      const damage = this.actions.getConfusionDamage(pokemon, 40);
      if (typeof damage !== "number") throw new Error("Confusion damage not dealt");
      const activeMove = { id: this.toID("confused"), effectType: "Move", type: "???" };
      this.damage(damage, pokemon, pokemon, activeMove);
      if (this.effectState.sourceEffect?.id === "cringedadjoke") {
        for (const target of this.getAllActive()) {
          if (target === pokemon) continue;
          if (target.volatiles["cringedadjoke"]) {
            this.boost({ atk: 1, def: 1 }, target);
          }
        }
      }
      return false;
    }
  },
  wish: {
    inherit: true,
    onStart(pokemon, source, effect) {
      this.effectState.hp = source.maxhp / 2;
      if (effect.name === "Anti-Pelau") {
        this.effectState.hp = source.maxhp / 4;
      }
      this.effectState.startingTurn = this.getOverflowedTurnCount();
      if (this.effectState.startingTurn === 255) {
        this.hint(`In Gen 8+, Wish will never resolve when used on the ${this.turn}th turn.`);
      }
    },
    onResidualOrder: 4,
    onResidual(target) {
      if (this.getOverflowedTurnCount() <= this.effectState.startingTurn) return;
      target.side.removeSlotCondition(this.getAtSlot(this.effectState.sourceSlot), "wish");
    },
    onEnd(target) {
      if (target && !target.fainted) {
        const damage = this.heal(this.effectState.hp, target, target);
        if (damage) {
          this.add("-heal", target, target.getHealth, "[from] move: Wish", "[wisher] " + this.effectState.source.name);
        }
      }
    }
  }
};
//# sourceMappingURL=conditions.js.map
