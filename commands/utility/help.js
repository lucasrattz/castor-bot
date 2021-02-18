const { prefix } = require('../../config.json');

module.exports = {
	name: 'help',
	description: 'Mostra a lista de comandos do Castor ou fornece ajuda para um comando específico.',
	aliases: ['ajuda, ?'],
	usage: 'para mostrar a lista de comandos; !cast help <comando> para mostrar ajuda de um comando específico.',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Comandos disponíveis:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nDigite \`${prefix}help [comando]\` para obter ajuda de um comando específico.`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					message.reply('A lista de comandos foi enviada para você!');
				})
				.catch(error => {
					console.error(`Erro ao enviar lista de comandos ${message.author.tag}.\n`, error);
					message.reply('parece que não consigo lhe enviar mensagens. Talvez você tenha desabilitado as mensagens privadas.');
				});
		}
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('comando inválido!');
		}

		data.push(`**Nome:** \`${command.name}\``);

		if (command.aliases) data.push(`**Alternativas:** \`${command.aliases.join(', ')}\``);
		if (command.description) data.push(`**Descrição:** \`${command.description}\``);
		if (command.usage) data.push(`**Uso:** \`${prefix}${command.name} ${command.usage}\``);

		data.push(`**Cooldown:** \`${command.cooldown || 3} segundo(s)\``);

		message.channel.send(data, { split: true });

	},
};