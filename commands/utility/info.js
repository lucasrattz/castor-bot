module.exports = {
	name: 'info',
	description: 'Mostra informações do Castor Bot.',
	args: false,
	cooldown: 3,
	aliases: ['castorinfo', 'castor', 'informacoes'],
	dmAble: true,
	usage: '',
	execute(message) {
		const Discord = require('discord.js');
		const embed = new Discord.MessageEmbed()
			.setTitle('https://youtu.be/IYl3T5e9s_8')
			.setDescription('Descricao')
			.setTimestamp()
			.setFooter('Rodape')
			.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.gg')
			.addFields(
				{ name: 'Regular field title', value: 'Some value here' },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
				{ name: 'Inline field title', value: 'Some value here', inline: true },
			)
			.addField('Inline field title', 'Some value here', true)
			.setImage('https://cdn.pixabay.com/photo/2017/09/19/13/54/animal-2765318_960_720.png')
			.setColor('#FFFF')
			.setThumbnail(message.author.avatarURL());
		message.channel.send(embed);
	},
};