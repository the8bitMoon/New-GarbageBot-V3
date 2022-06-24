const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('kick').setType(2),
	async execute(interaction) {
		const target = interaction.targetUser;
		return await run(interaction, target);
	},
};

const run = async (interaction, target) => {
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
};
