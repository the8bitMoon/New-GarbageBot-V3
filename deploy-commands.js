const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();
// const { clientId, testGuilds, token } = require('./config.json');

const testGuilds = process.env.testGuilds.split(',');

const commands = [];
const commandDirs = [
	path.join(__dirname, 'commands', 'slash commands'),
	path.join(__dirname, 'commands', 'context commands'),
];
for (const commandsPath of commandDirs) {
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}
}

const rest = new REST({ version: '9' }).setToken(process.env.testToken);

console.log(`Testing guild IDs: ${testGuilds}`);
for (const guildId of testGuilds) {
	console.log(`Deploying to ${guildId}...`);
	rest
		.put(Routes.applicationGuildCommands(process.env.testClientId, guildId), {
			body: commands,
		})
		.then(() =>
			console.log(`Successfully registered application commands in ${guildId}`),
		)
		.catch(console.error);
}
