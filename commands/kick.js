const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

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
		console.log(interaction.client.helpers.animeGif('kick'));
		const target = interaction.options.getUser('target');
		const gif = await interaction.client.helpers.animeGif('kick');
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
