module.exports = {
	name: 'bicho',
	description: 'Comando principal do módulo Jogo do Bicho',
	args: true,
	cooldown: 3,
	aliases: ['jogodobicho'],
	usage: '...',
	execute(message, args) {
		const subCommandName = args.shift().toLowerCase();

		const subCommand = message.client.commands.get(subCommandName)
        || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(subCommandName));

		try {
			subCommand.execute(message, args);
		}
		catch (error) {
			console.error(error);
			message.reply('houve um erro ao tentar executar o comando.');
		}
	},
};