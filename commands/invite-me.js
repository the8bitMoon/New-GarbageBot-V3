const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite-me')
		.setDescription('Posts my invite link so you can add me to your server.'),
	async execute(interaction) {
		return interaction.reply(
			'You can grab my invite link right [here](https://discord.com/api/oauth2/authorize?client_id=978344257242923059&permissions=544991398977&scope=bot%20applications.commands)!',
		);
	},
};
