const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('choose')
		.setDescription('Choose something from a list.')
		.addStringOption((option) =>
			option
				.setName('list')
				.setDescription('Enter a list of options separated by `|`.')
				.setRequired(true),
		),
	async execute(interaction) {
		const list = interaction.options.getString('list').split(/\s*\|\s*/);
		const choice = list[Math.floor(Math.random() * list.length)];
		return interaction.reply({ content: `I choose ${choice}!` });
	},
};
