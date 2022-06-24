const fs = require('node:fs');
const path = require('node:path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');

dotenv.config();
// const { clientId, testGuilds, token } = require('./config.json');

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

const rest = new REST({ version: '9' }).setToken(process.env.mainToken);

rest
	.put(Routes.applicationCommands(process.env.mainClientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
