const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, Collection } = require('discord.js');

function toMatrix(arr, width) {
	return arr.reduce(function (rows, key, index) {
		return (
			(index % width == 0
				? rows.push([key])
				: rows[rows.length - 1].push(key)) && rows
		);
	}, []);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription(
			'Let your friends help you pick something from up to 25 options.',
		)
		.addStringOption((option) =>
			option
				.setName('question')
				.setDescription('The poll topic.')
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('list')
				.setDescription('Enter a list of options separated by `|`.')
				.setRequired(true),
		),

	async execute(interaction) {
		// split the list into an array of unique elements
		const list = [
			...new Set(
				interaction.options
					.getString('list')
					.split(/\s*\|\s*/)
					.filter((n) => n),
			),
		];
		// truncate the list to 25 if necessary
		list.length = Math.min(list.length, 25);
		// console.log(`List length: ${list.length}\nList contents: ${list}`);
		const textList = [];
		// arrange it into rows of 5
		const matrix = toMatrix(list, 5);

		// generate the action rows
		const rows = [];
		let id = 0;
		for (const arr of matrix) {
			const btns = [];
			for (const i of arr) {
				const btn = new MessageButton()
					.setCustomId(`${id}`)
					.setLabel(i)
					.setStyle('SECONDARY');
				btns.push(btn);
				textList.push({
					id: btn.customId,
					name: btn.label,
					votes: 0,
				});
				id++;
				// console.log(btn);
			}
			// console.log(btns);
			const row = new MessageActionRow().addComponents(btns);
			// console.log(row);
			rows.push(row);
		}
		console.log(textList);

		// format the results table
		function generateTable() {
			const labelLength = textList.reduce((longest, current) =>
				longest.name.length > current.name.length ? longest : current,
			).name.length;
			console.log(labelLength);
			let table = '```';
			for (const i of textList) {
				table +=
					i.name +
					' ' +
					'.'.repeat(labelLength - i.name.length + 1) +
					' : ' +
					`(${i.votes.toString().padStart(2, 0)}) ` +
					'✅'.repeat(i.votes) +
					'\n';
			}
			table += '```';
			return table;
		}

		// Generate the message content
		let content =
			interaction.options.getString('question') + '\n' + generateTable();

		// console.log(rows);
		return interaction
			.reply({ content: content, components: rows, fetchReply: true })
			.then((message) => {
				const collector = message.createMessageComponentCollector({
					componentType: 'BUTTON',
					time: interaction.client.helpers.minutes(15),
					max: 99,
				});

				collector.on('collect', async (i) => {
					console.log(i);
					textList[i.customId].votes++;
					content =
						interaction.options.getString('question') + '\n' + generateTable();
					await i.update({
						content: content,
						components: rows,
					});
				});

				collector.on('end', () => {
					interaction.editReply({
						content: `${content}\n(Poll has concluded.)`,
						components: [],
					});
				});
			});
	},
};
