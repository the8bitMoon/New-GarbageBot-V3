const {
	SlashCommandBuilder,
	ContextMenuCommandBuilder,
} = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kiss')
		.setDescription('kiss someone!')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to kiss.')
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		return await run(interaction, target);
	},
};

module.exports = {
	data: new ContextMenuCommandBuilder().setName('kiss').setType(2),
	async execute(interaction) {
		const target = interaction.targetUser;
		return await run(interaction, target);
	},
};

const run = async (interaction, target) => {
	const gif = await interaction.client.helpers.animeGif('kiss');
	console.log(gif);
	const attachment = new MessageAttachment(gif, 'kiss.gif', {
		description: `${interaction.target} got kissed!`,
	});

	await interaction.deferReply();
	return interaction.editReply({
		content: `${interaction.user} gives ${target} a kiss! ❤️`,
		files: [attachment],
	});
};
