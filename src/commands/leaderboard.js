const { EmbedBuilder } = require('discord.js');
const { getLeaderboard } = require('../utils/database');

module.exports = {
  name: 'leaderboard',
  description: 'Affiche le classement global',
  cooldown: 5,
  
  async execute(message, args, client) {
    try {
      const leaderboard = getLeaderboard(10);
      
      if (leaderboard.length === 0) {
        return message.reply({
          content: '❌ Aucun utilisateur dans le classement.',
          ephemeral: true,
        });
      }
      
      let leaderboardText = '';
      for (let i = 0; i < leaderboard.length; i++) {
        const user = leaderboard[i];
        const medal = ['🥇', '🥈', '🥉'][i] || `#${i + 1}`;
        leaderboardText += `${medal} **${user.username}** - Niveau ${user.level} | ${user.salades} 🥗\n`;
      }
      
      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle('📊 Classement Global')
        .setDescription(leaderboardText)
        .setFooter({
          text: 'Gagnez de l\'expérience et des salades pour monter!',
        })
        .setTimestamp();
      
      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error('❌ Erreur:', error);
      message.reply({
        content: '❌ Une erreur est survenue.',
        ephemeral: true,
      });
    }
  },
};
