const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('hug').setType(2),
	async execute(interaction) {
		const target = interaction.targetUser;
		return await run(interaction, target);
	},
};

const run = async (interaction, target) => {
	const gif = await interaction.client.helpers.animeGif('hug');
	console.log(gif);
	const attachment = new MessageAttachment(gif, 'hug.gif', {
		description: `${interaction.target} got hugged!`,
	});

	await interaction.deferReply();
	return interaction.editReply({
		content: `${interaction.user} gives ${target} a hug! ❤️`,
		files: [attachment],
	});
};
