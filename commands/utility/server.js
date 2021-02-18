// Welcome to the Primordial Command
module.exports = {
	name: 'serverinfo',
	description: 'Command that displays server info. This command was used for testing purposes in the development of Castor Bot. As the first of all commands, it connects all Subjects of Castor together.',
	args: true,
	cooldown: 60,
	aliases: ['serverinfo', 'servinfo'],
	// this is default
	dmAble: false,
	permissions: 'MANAGE_GUILD',
	usage: '<arg1> <arg2> ... <arg10> ...',
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreated at: ${message.guild.createdAt}`);
		message.channel.send(`Args: ${args}\nArg 1: ${args[0]}\nLast arg: ${args[args.length - 1]}`);
	},
};