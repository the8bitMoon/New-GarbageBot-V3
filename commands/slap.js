const {
	SlashCommandBuilder,
	ContextMenuCommandBuilder,
} = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slap')
		.setDescription('slap someone!')
		.addUserOption((option) =>
			option
				.setName('target')
				.setDescription('The member to slap.')
				.setRequired(true),
		),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		return await run(interaction, target);
	},
};

module.exports = {
	data: new ContextMenuCommandBuilder().setName('slap').setType(2),
	async execute(interaction) {
		const target = interaction.targetUser;
		return await run(interaction, target);
	},
};

const run = async (interaction, target) => {
	const gif = await interaction.client.helpers.animeGif('slap');
	console.log(gif);
	const attachment = new MessageAttachment(gif, 'slap.gif', {
		description: `${interaction.target} got slapped!`,
	});

	await interaction.deferReply();
	return interaction.editReply({
		content: `${interaction.user} slaps ${target}!`,
		files: [attachment],
	});
};
