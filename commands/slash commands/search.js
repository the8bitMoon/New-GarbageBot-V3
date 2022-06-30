const { SlashCommandBuilder } = require('@discordjs/builders');
const { PaginatedMessage } = require('@sapphire/discord.js-utilities');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('search')
		.setDescription('Search a website and post the result in chat.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('wikipedia')
				.setDescription('Find a Wikipedia article.')
				.addStringOption((option) =>
					option
						.setName('search')
						.setDescription('keyword or phrase')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('urban-dictionary')
				.setDescription('Search Urban Dictionary.')
				.addStringOption((option) =>
					option
						.setName('search')
						.setDescription('keyword or phrase')
						.setRequired(true),
				),
		),
	async execute(interaction) {
		const keyword = encodeURIComponent(interaction.options.getString('search'));
		switch (interaction.options.getSubcommand()) {
			// WIKIPEDIA
			case 'wikipedia': {
				const query = await fetch(
					`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${keyword}&utf8=&format=json`,
				)
					.then((r) => r.json())
					.then((r) => r.query.search.map((t) => t.title));

				const results = await fetch(
					`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=10&explaintext&exintro&titles=${query.join(
						'|',
					)}&redirects=`,
				)
					.then((r) => r.json())
					.then((r) =>
						Object.values(r.query.pages).map((t) => {
							return new MessageEmbed()
								.setTitle(t.title)
								.setURL(`http://en.wikipedia.org/?curid=${t.pageid}`)
								.setDescription(t.extract)
								.setColor('#CCCCCC')
								.setFooter({ text: '- Wikipedia, the free encyclopedia.' });
						}),
					);

				const pages = new PaginatedMessage();
				results.forEach((element) => {
					pages.addPageEmbed(element);
				});
				return pages.run(interaction);
			}

			// URBAN DICTIONARY
			case 'urban-dictionary': {
				const results = await fetch(
					`https://api.urbandictionary.com/v0/define?term=${keyword}`,
				)
					.then((r) => r.json())
					.then((r) =>
						r.list.map((t) => {
							return new MessageEmbed()
								.setDescription(t.definition)
								.setURL(t.permalink)
								.setFooter({
									text: `👍${t.thumbs_up} 👎${t.thumbs_down} - ${t.author}`,
								});
						}),
					);

				const pages = new PaginatedMessage({
					template: new MessageEmbed()
						.setColor('GOLD')
						.setTitle(decodeURIComponent(keyword))
						.setFooter({ text: '- definition from Urban Dictionary.' }),
				});
				results.forEach((element) => {
					pages.addPageEmbed(element);
				});
				return pages.run(interaction);
			}
		}
	},
};
