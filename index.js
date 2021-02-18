console.log('Starting...');

require('dotenv').config();
const readline = require('readline');
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, discord_server } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

const cooldowns = new Discord.Collection();

client.login(process.env.TOKEN);

const terminalInput = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: '🍃Castor>',
});

terminalInput.prompt();

terminalInput.on('line', (line) => {
	switch (line.trim()) {
	case 'help':
		console.log('Comandos disponíveis: reload, exit, servers');
		break;
	case 'reload':
		console.log('Not yet implemented');
		break;
	case 'servers':
		console.log(`Atualmente em ${client.guilds.cache.size} servidores.`);
		break;
	case 'exit':
		console.log('Castor is going to sleep now...');
		process.exit(0);
		break;
	default:
		console.log(`'${line.trim()}' não é um comando válido. Digite 'help' para ver a lista de comandos`);
		break;
	}
	terminalInput.prompt();
}).on('close', () => {
	console.log('\nCastor is going to sleep now...');
	process.exit(0);
});

// Command Handle
client.on('message', message => {

	// Filter messages
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// Convert command to lowercase and stores the arguments in an array
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	// Checks if the typed command exists as a command or alias
	const command = client.commands.get(commandName)
			|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	// Filter DM commands
	if (!command.dmAble && message.channel.type === 'dm') {
		return message.reply(`Olá ${message.author}. Você precisa estar em um servidor para usar esta funcionalidade.
		\nE falando em servidor, acho que você gostaria de entrar no meu: ${discord_server}`);
	}

	// Permissions
	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('você não tem permissão para fazer isto.');
		}
	}

	// Check if command arguments are given if required
	if (command.args && !args.length) {
		let reply = `Você precisa especificar opções para este comando, ${message.author}.`;
		if (command.usage) {
			reply += `\nUso correto: \`${prefix} ${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
	}

	// Parse cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`aguarde ${timeLeft.toFixed(1)} segundo(s) antes de usar o comando \`${command.name}\` novamente.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	// Executes command
	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('houve um erro ao tentar executar o comando.');
	}

});
