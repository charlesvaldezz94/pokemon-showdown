// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts
/*
If you want to add custom formats, create a file in this folder named: "custom-formats.ts"

Paste the following code into the file and add your desired formats and their sections between the brackets:
--------------------------------------------------------------------------------
// Note: This is the list of formats
// The rules that formats use are stored in data/rulesets.ts

export const Formats: FormatList = [
];
--------------------------------------------------------------------------------

If you specify a section that already exists, your format will be added to the bottom of that section.
New sections will be added to the bottom of the specified column.
The column value will be ignored for repeat sections.
*/

export const Formats: import('../sim/dex-formats').FormatList = [

	// #region S/V Singles
	///////////////////////////////////////////////////////////////////

	{
		section: "S/V Singles",
	},
	{
		name: "[Gen 9] Random Battle",
		desc: `Randomized teams of Pok&eacute;mon with sets that are generated to be competitively viable.`,
		mod: 'gen9',
		team: 'random',
		searchShow: false,
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Unrated Random Battle",
		mod: 'gen9',
		team: 'random',
		challengeShow: false,
		searchShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Free-For-All Random Battle",
		mod: 'gen9',
		team: 'random',
		gameType: 'freeforall',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: ['Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod'],
	},
	{
		name: "[Gen 9] Random Battle (Blitz)",
		mod: 'gen9',
		team: 'random',
		searchShow: false,
		ruleset: ['[Gen 9] Random Battle', 'Blitz'],
	},
	{
		name: "[Gen 9] Multi Random Battle",
		mod: 'gen9',
		team: 'random',
		gameType: 'multi',
		searchShow: false,
		tournamentShow: false,
		rated: false,
		ruleset: [
			'Max Team Size = 3',
			'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Sleep Clause Mod', 'Illusion Level Mod',
		],
	},
	{
		name: "[Gen 9] OU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard', 'Sleep Moves Clause', '!Sleep Clause Mod'],
		banlist: ['Uber', 'AG', 'Arena Trap', 'Moody', 'Sand Veil', 'Shadow Tag', 'Snow Cloak', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects', 'Shed Tail'],
	},
	{
		name: "[Gen 9] Ubers",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard'],
		banlist: ['AG', 'Moody', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects'],
	},
	{
		name: "[Gen 9] UU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] OU'],
		banlist: ['OU', 'UUBL'],
	},
	{
		name: "[Gen 9] RU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] UU'],
		banlist: ['UU', 'RUBL', 'Light Clay'],
	},
	{
		name: "[Gen 9] NU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] RU'],
		banlist: ['RU', 'NUBL', 'Drought', 'Quick Claw'],
	},
	{
		name: "[Gen 9] PU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] NU'],
		banlist: ['NU', 'PUBL', 'Damp Rock'],
	},
	{
		name: "[Gen 9] LC",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Little Cup', 'Standard'],
		banlist: [
			'Aipom', 'Basculin-White-Striped', 'Cutiefly', 'Diglett-Base', 'Dunsparce', 'Duraludon', 'Flittle', 'Gastly', 'Girafarig', 'Gligar',
			'Magby', 'Meditite', 'Misdreavus', 'Murkrow', 'Porygon', 'Qwilfish-Hisui', 'Rufflet', 'Scraggy', 'Scyther', 'Sneasel', 'Sneasel-Hisui',
			'Snivy', 'Stantler', 'Voltorb-Hisui', 'Vulpix', 'Vulpix-Alola', 'Yanma', 'Moody', 'Heat Rock', 'Baton Pass', 'Sticky Web',
		],
	},
	{
		name: "[Gen 9] Monotype",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard', 'Evasion Abilities Clause', 'Same Type Clause', 'Terastal Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Baxcalibur', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Blaziken', 'Deoxys-Normal', 'Deoxys-Attack',
			'Dialga', 'Dialga-Origin', 'Espathra', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Iron Bundle', 'Kingambit',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane',
			'Palafin', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Solgaleo', 'Ursaluna-Bloodmoon', 'Urshifu-Single-Strike', 'Zacian',
			'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Booster Energy', 'Damp Rock', 'Focus Band', 'King\'s Rock',
			'Quick Claw', 'Razor Fang', 'Smooth Rock', 'Acupressure', 'Baton Pass', 'Last Respects', 'Shed Tail',
		],
	},
	{
		name: "[Gen 9] CAP",
		desc: "The Create-A-Pok&eacute;mon project is a community dedicated to exploring and understanding the competitive Pok&eacute;mon metagame by designing, creating, and playtesting new Pok&eacute;mon concepts.",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] OU', '+CAP'],
		banlist: ['Crucibellite', 'Rage Fist'],
	},
	{
		name: "[Gen 9] BSS Reg G",
		mod: 'gen9',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Limit One Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] BSS Reg I",
		mod: 'gen9',
		bestOfDefault: true,
		searchShow: false,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "Kybur Singles",
		mod: 'gen9',
		debug: true,
		battle: { trunc: Math.trunc },
		ruleset: ['Team Preview'],
	},
	{
		name: "[Gen 9] Custom Game",
		mod: 'gen9',
		searchShow: false,
		debug: true,
		battle: { trunc: Math.trunc },
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},
	// #endregion
	// #region S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "S/V Doubles",
	},
	{
		name: "Kybur Doubles Standard",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard AG', '!Obtainable'],
	},
	{
		name: "[Gen 9] Random Doubles Battle",
		mod: 'gen9',
		searchShow: false,
		gameType: 'doubles',
		team: 'random',
		ruleset: ['PotD', 'Obtainable', 'Species Clause', 'HP Percentage Mod', 'Cancel Mod', 'Illusion Level Mod', 'Sleep Clause Mod'],
	},
	{
		name: "[Gen 9] Doubles OU",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Evasion Abilities Clause'],
		banlist: ['DUber', 'Shadow Tag'],
	},
	{
		name: "[Gen 9] Doubles Ubers",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles'],
	},
	{
		name: "[Gen 9] Doubles UU",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['[Gen 9] Doubles OU'],
		banlist: ['DOU', 'DBL'],
	},
	{
		name: "[Gen 9] Doubles LC",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Standard Doubles', 'Little Cup', 'Sleep Clause Mod'],
		banlist: ['Basculin-White-Striped', 'Dunsparce', 'Duraludon', 'Girafarig', 'Gligar', 'Murkrow', 'Qwilfish-Hisui', 'Scyther', 'Sneasel', 'Sneasel-Hisui', 'Vulpix', 'Vulpix-Alola', 'Yanma'],
	},
	{
		name: "[Gen 9] VGC 2023 Reg D",
		mod: 'gen9predlc',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets'],
		banlist: ['Walking Wake', 'Iron Leaves'],
	},
	{
		name: "[Gen 9] VGC 2024 Reg G",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets', 'Limit One Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg I",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		bestOfDefault: true,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Open Team Sheets', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] VGC 2025 Reg I (Bo3)",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		ruleset: ['Flat Rules', '!! Adjust Level = 50', 'Min Source Gen = 9', 'VGC Timer', 'Force Open Team Sheets', 'Best of = 3', 'Limit Two Restricted'],
		restricted: ['Restricted Legendary'],
	},
	{
		name: "[Gen 9] Doubles Custom Game",
		mod: 'gen9',
		gameType: 'doubles',
		searchShow: false,
		battle: { trunc: Math.trunc },
		debug: true,
		// no restrictions, for serious (other than team preview)
		ruleset: ['Team Preview', 'Cancel Mod', 'Max Team Size = 24', 'Max Move Count = 24', 'Max Level = 9999', 'Default Level = 100'],
	},

	// S/V Doubles
	///////////////////////////////////////////////////////////////////

	{
		section: "Unofficial Metagames",
	},
	{
		name: "[Gen 9] 1v1",
		desc: `Bring three Pok&eacute;mon to Team Preview and choose one to battle.`,
		mod: 'gen9',
		ruleset: [
			'Picked Team Size = 1', 'Max Team Size = 3',
			'Standard', 'Terastal Clause', 'Sleep Moves Clause', 'Accuracy Moves Clause', '!Sleep Clause Mod',
		],
		banlist: [
			'Arceus', 'Archaludon', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Cinderace', 'Deoxys', 'Deoxys-Attack', 'Deoxys-Defense', 'Deoxys-Speed', 'Dialga',
			'Dialga-Origin', 'Dragonite', 'Eternatus', 'Flutter Mane', 'Gholdengo', 'Giratina', 'Giratina-Origin', 'Gouging Fire', 'Groudon', 'Ho-Oh', 'Jirachi',
			'Koraidon', 'Kyogre', 'Kyurem-Black', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Meloetta', 'Mew', 'Mewtwo', 'Mimikyu', 'Miraidon', 'Necrozma',
			'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Cornerstone', 'Ogerpon-Hearthflame', 'Palkia', 'Palkia-Origin', 'Rayquaza', 'Regidrago', 'Reshiram',
			'Scream Tail', 'Shaymin-Sky', 'Snorlax', 'Solgaleo', 'Terapagos', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned', 'Zekrom', 'Moody',
			'Focus Band', 'Focus Sash', 'King\'s Rock', 'Razor Fang', 'Quick Claw', 'Acupressure', 'Perish Song',
		],
	},
	{
		name: "[Gen 9] 2v2 Doubles",
		desc: `Double battle where you bring four Pok&eacute;mon to Team Preview and choose only two.`,
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: [
			'Picked Team Size = 2', 'Max Team Size = 4',
			'Standard Doubles', 'Accuracy Moves Clause', 'Terastal Clause', 'Sleep Clause Mod', 'Evasion Items Clause',
		],
		banlist: [
			'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin', 'Eternatus', 'Giratina', 'Giratina-Origin', 'Groudon',
			'Ho-Oh', 'Koraidon', 'Kyogre', 'Kyurem-White', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Solgaleo', 'Urshifu', 'Urshifu-Rapid-Strike', 'Zacian', 'Zacian-Crowned', 'Zamazenta', 'Zamazenta-Crowned',
			'Zekrom', 'Commander', 'Moody', 'Focus Sash', 'King\'s Rock', 'Razor Fang', 'Ally Switch', 'Final Gambit', 'Perish Song', 'Swagger',
		],
	},
	{
		name: "[Gen 9] Anything Goes",
		mod: 'gen9',
		ruleset: ['Standard AG'],
	},
	{
		name: "[Gen 9] Ubers UU",
		mod: 'gen9',
		ruleset: ['[Gen 9] Ubers'],
		banlist: [
			// Ubers OU
			'Arceus-Normal', 'Arceus-Fairy', 'Arceus-Ghost', 'Arceus-Ground', 'Arceus-Water', 'Calyrex-Ice', 'Chien-Pao', 'Deoxys-Attack', 'Deoxys-Speed', 'Dondozo',
			'Eternatus', 'Flutter Mane', 'Giratina-Origin', 'Glimmora', 'Gliscor', 'Groudon', 'Hatterene', 'Ho-Oh', 'Kingambit', 'Koraidon', 'Kyogre', 'Kyurem-Black',
			'Landorus-Therian', 'Lunala', 'Miraidon', 'Necrozma-Dusk-Mane', 'Rayquaza', 'Ribombee', 'Skeledirge', 'Ting-Lu', 'Zacian-Crowned',
			// Ubers UUBL + Lunala, Arceus-Ghost, Arceus-Water
			'Arceus-Dragon', 'Arceus-Fire', 'Arceus-Flying', 'Arceus-Steel', 'Necrozma-Dawn-Wings', 'Shaymin-Sky', 'Zacian', 'Zekrom',
		],
	},
	{
		name: "[Gen 9] ZU",
		mod: 'gen9',
		ruleset: ['[Gen 9] PU'],
		banlist: ['PU', 'ZUBL', 'Unburden'],
	},
	{
		name: "[Gen 9] Free-For-All",
		mod: 'gen9',
		gameType: 'freeforall',
		rated: false,
		tournamentShow: false,
		ruleset: ['Standard', 'Sleep Moves Clause', '!Sleep Clause Mod', '!Evasion Items Clause'],
		banlist: [
			'Annihilape', 'Arceus', 'Calyrex-Ice', 'Calyrex-Shadow', 'Chi-Yu', 'Chien-Pao', 'Darkrai', 'Deoxys-Normal', 'Deoxys-Attack', 'Dialga', 'Dialga-Origin',
			'Dondozo', 'Eternatus', 'Flutter Mane', 'Giratina', 'Giratina-Origin', 'Groudon', 'Ho-Oh', 'Hoopa-Unbound', 'Iron Bundle', 'Koraidon', 'Kyogre', 'Kyurem-White',
			'Landorus-Incarnate', 'Lugia', 'Lunala', 'Magearna', 'Mewtwo', 'Miraidon', 'Necrozma-Dawn-Wings', 'Necrozma-Dusk-Mane', 'Ogerpon-Hearthflame', 'Palkia',
			'Palkia-Origin', 'Rayquaza', 'Reshiram', 'Shaymin-Sky', 'Solgaleo', 'Spectrier', 'Terapagos', 'Ursaluna', 'Ursaluna-Bloodmoon', 'Urshifu', 'Urshifu-Rapid-Strike',
			'Zacian', 'Zacian-Crowned', 'Zekrom', 'Moody', 'Shadow Tag', 'Toxic Chain', 'Toxic Debris', 'Acupressure', 'Aromatic Mist', 'Baton Pass', 'Coaching',
			'Court Change', 'Decorate', 'Dragon Cheer', 'Final Gambit', 'Flatter', 'Fling', 'Floral Healing', 'Follow Me', 'Heal Pulse', 'Heart Swap', 'Last Respects',
			'Malignant Chain', 'Poison Fang', 'Rage Powder', 'Skill Swap', 'Spicy Extract', 'Swagger', 'Toxic', 'Toxic Spikes',
		],
	},
	{
		name: "[Gen 9] LC UU",
		mod: 'gen9',
		searchShow: false,
		ruleset: ['[Gen 9] LC'],
		banlist: [
			'Chinchou', 'Diglett-Alola', 'Drifloon', 'Elekid', 'Foongus', 'Glimmet', 'Gothita', 'Grookey', 'Growlithe-Hisui', 'Houndour', 'Impidimp',
			'Larvesta', 'Mareanie', 'Mienfoo', 'Mudbray', 'Pawniard', 'Sandshrew-Alola', 'Shellder', 'Shellos', 'Shroodle', 'Snover', 'Snubbull', 'Stunky',
			'Timburr', 'Tinkatink', 'Toedscool', 'Torchic', 'Vullaby', 'Wingull', 'Zorua-Hisui',
			// LC UUBL
			'Deerling', 'Minccino',
		],
	},
	{
		name: "[Gen 9] NFE",
		desc: `Only Pok&eacute;mon that can evolve are allowed.`,
		mod: 'gen9',
		searchShow: false,
		ruleset: ['Standard OMs', 'Not Fully Evolved', 'Sleep Moves Clause', 'Terastal Clause'],
		banlist: [
			'Basculin-White-Striped', 'Bisharp', 'Chansey', 'Combusken', 'Dipplin', 'Duraludon', 'Electabuzz', 'Gligar', 'Gurdurr',
			'Haunter', 'Magmar', 'Magneton', 'Porygon2', 'Primeape', 'Qwilfish-Hisui', 'Rhydon', 'Scyther', 'Sneasel', 'Sneasel-Hisui',
			'Ursaring', 'Vulpix-Base', 'Arena Trap', 'Magnet Pull', 'Moody', 'Shadow Tag', 'Baton Pass',
		],
	},
]