const { ContextMenuCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new ContextMenuCommandBuilder().setName('download-messages').setType(3),
	async execute(interaction) {
		return interaction.channel.send('Boop!');
	},
};
