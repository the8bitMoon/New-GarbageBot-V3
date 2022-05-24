const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls some dice.')
		.addStringOption((option) =>
			option
				.setName('expression')
				.setDescription(
					'A dice expression in the `<x>d<y>`. Otherwise a single number to roll one die.',
				)
				.setRequired(true),
		),
	async execute(interaction) {
		const raw = interaction.options.getString('expression');
		const regexp = /\d+(?:\s*d\s*\d+)?/;
		if (regexp.test(raw)) {
			console.log('Valid expression/');
			const dice = raw.split(/\s*d\s*/);
			if (dice.length == 1) {
				// roll one die
				const result = Math.ceil(Math.random() * dice[0]);
				return interaction.reply(`You rolled a ${result}.`);
			} else {
				const rolls = [];
				console.log(dice[0]);
				// roll the specified die the specified number of times
				for (let i = 0; i < dice[0]; i++) {
					rolls.push(Math.ceil(Math.random() * dice[1]));
				}
				const total = rolls.reduce((acc, curr) => acc + curr);
				return interaction.reply(`Rolls: ${rolls.join(', ')}\nTotal: ${total}`);
			}
		} else {
			return interaction.reply('Please provide a valid dice expression.');
		}
		// return interaction.reply(message);
	},
};
