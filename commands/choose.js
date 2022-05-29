const {
	SlashCommandBuilder,
	bold,
	underscore,
	strikethrough,
} = require('@discordjs/builders');

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
		const choiceId = Math.floor(Math.random() * list.length);
		const msg = list
			.map((e, i) => {
				return i === choiceId ? underscore(bold(e)) : strikethrough(e);
			})
			.join(', ');
		return interaction.reply({ content: `I choose ${msg}!` });
	},
};
