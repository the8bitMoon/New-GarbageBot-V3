const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
// const { clientId, testGuilds, token } = require('./config.json');

const testGuilds = process.env.testGuilds.split(',');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

console.log(`Testing guild IDs: ${testGuilds}`);
for (const guildId of testGuilds) {
	console.log(`Deploying to ${guildId}...`);
	rest
		.put(Routes.applicationGuildCommands(process.env.clientId, guildId), {
			body: commands,
		})
		.then(() =>
			console.log(`Successfully registered application commands in ${guildId}`),
		)
		.catch(console.error);
}
