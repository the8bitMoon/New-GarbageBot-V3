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
		.setName('kick')
		.setDescription('Kick someone!')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to kick.')
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const gif = await Tenor.Search.Random('anime kick', 1).then((Result) => {
			return Result[0].media[0].tinygif.url;
		});
		console.log(gif);
		const attachment = new MessageAttachment(gif, 'kick.gif', {
			description: `${interaction.target} got kicked!`,
		});

		await interaction.deferReply();
		return interaction.editReply({
			content: `${interaction.user} kicks ${target}!`,
			files: [attachment],
		});
	},
};
