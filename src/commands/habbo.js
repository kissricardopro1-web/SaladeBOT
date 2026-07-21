const { EmbedBuilder } = require('discord.js');
const { getHabboProfile, getHabboAvatar } = require('../utils/habbo');

module.exports = {
  name: 'habbo',
  description: 'Affiche le profil Habbo d\'un utilisateur',
  cooldown: 3,
  
  async execute(message, args, client) {
    if (args.length === 0) {
      return message.reply({
        content: '❌ Veuillez fournir un nom Habbo. Usage: `!habbo <nom>`',
        ephemeral: true,
      });
    }
    
    const username = args.join(' ');
    const loading = await message.reply('🔍 Recherche du profil...');
    
    try {
      const profile = await getHabboProfile(username);
      
      if (!profile) {
        return loading.edit({
          content: `❌ Profil \`${username}\` non trouvé sur Habbo Hotel.`,
        });
      }
      
      const avatar = await getHabboAvatar(profile.username);
      
      const embed = new EmbedBuilder()
        .setColor('#9b59b6')
        .setTitle(`🏨 Profil Habbo de ${profile.username}`)
        .setThumbnail(avatar)
        .addFields(
          { name: '💬 Devise', value: profile.motto, inline: false },
          { name: '📅 Membre depuis', value: profile.memberSince || 'N/A', inline: true },
          { name: '⏰ Dernière connexion', value: profile.lastOnline || 'N/A', inline: true },
          { name: '📊 Niveau', value: `${profile.level}`, inline: true },
        )
        .setFooter({
          text: 'Habbo Hotel',
        })
        .setTimestamp();
      
      await loading.edit({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Erreur:', error);
      await loading.edit({
        content: '❌ Une erreur est survenue lors de la récupération du profil.',
      });
    }
  },
};
