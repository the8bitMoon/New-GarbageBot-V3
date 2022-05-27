const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const Tenor = require('tenorjs').client({
	Key: process.env.tenorKey,
	Filter: 'medium',
	Locale: 'en_US',
	MediaFilter: 'minimal',
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('Give someone a kiss. ❤️')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to kiss.')
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const gif = await Tenor.Search.Random('anime kiss', 1).then((Result) => {
			return Result[0].media[0].tinygif.url;
		});
		console.log(gif);
		const attachment = new MessageAttachment(gif, 'kiss.gif', {
			description: `${interaction.target} got a kiss!`,
		});

		await interaction.deferReply();
		return interaction.editReply({
			content: `${interaction.user} gives ${target} a big kiss. ❤️`,
			files: [attachment],
		});
	},
};
