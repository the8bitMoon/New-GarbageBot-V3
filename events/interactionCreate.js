module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isContextMenu) return;

		const command = interaction.client.commands.get(interaction.commandName);

		console.log(
			`${interaction.user.tag} in #${interaction.channel.name} triggered an ${command} command.`,
		);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true,
			});
		}
	},
};
