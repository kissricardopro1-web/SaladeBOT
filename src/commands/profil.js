const { EmbedBuilder } = require('discord.js');
const { upsertUser } = require('../utils/database');

module.exports = {
  name: 'profil',
  description: 'Affiche le profil d\'un utilisateur',
  cooldown: 3,
  
  async execute(message, args, client) {
    let user = message.mentions.users.first() || message.author;
    
    let dbUser = upsertUser(user.id, user.username);
    
    const embed = new EmbedBuilder()
      .setColor('#e74c3c')
      .setTitle(`🥗 Profil de ${user.username}`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '👤 ID', value: user.id, inline: true },
        { name: '💰 Salades', value: `**${dbUser.salades}** 🥗`, inline: true },
        { name: '📊 Niveau', value: `**${dbUser.level}**`, inline: true },
        { name: '⭐ XP', value: `**${dbUser.xp}** / 100`, inline: true },
        { name: '📅 Membre depuis', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
      )
      .setFooter({
        text: 'SaladeBot',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    
    await message.reply({
      embeds: [embed],
    });
  },
};
