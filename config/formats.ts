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
		name: "Kybur Singles",
		mod: 'gen9',
		ruleset: ['Team Preview', '!Obtainable'],
	},
	{
		name: "[Gen 9] Ubers",
		mod: 'gen9',
		ruleset: ['Standard'],
		banlist: ['AG', 'Moody', 'King\'s Rock', 'Razor Fang', 'Baton Pass', 'Last Respects'],
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
		name: "Kybur Battles",
		mod: 'gen9',
		gameType: 'doubles',
		ruleset: ['Standard AG', '!Obtainable'],
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