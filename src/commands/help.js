const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche l\'aide des commandes',
  cooldown: 3,
  
  async execute(message, args, client) {
    const prefix = process.env.PREFIX || '!';
    
    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle('🥗 SaladeBot - Aide Complète')
      .setDescription('Voici la liste de toutes les commandes disponibles')
      .addFields(
        {
          name: '📋 Commandes de base',
          value: `\`${prefix}help\` - Aide\n\`${prefix}ping\` - Ping du bot\n\`${prefix}profil [@user]\` - Profil\n\`${prefix}leaderboard\` - Classement`,
          inline: false,
        },
        {
          name: '🤖 IA et Chat',
          value: `\`${prefix}ask <question>\` - Question à l'IA\n\`${prefix}chat <message>\` - Chat avec le bot\n\`${prefix}serious <question>\` - Question sérieuse`,
          inline: false,
        },
        {
          name: '💰 Économie',
          value: `\`${prefix}salades [@user]\` - Voir les salades\n\`${prefix}daily\` - Récompense quotidienne\n\`${prefix}inventaire\` - Inventaire`,
          inline: false,
        },
        {
          name: '🎮 Jeux',
          value: `\`${prefix}blackjack <mise>\` - Blackjack\n\`${prefix}roulette <mise> <pari>\` - Roulette\n\`${prefix}morpion\` - Morpion\n\`${prefix}quiz\` - Quiz Habbo`,
          inline: false,
        },
        {
          name: '🏨 Habbo Hotel',
          value: `\`${prefix}habbo <nom>\` - Profil Habbo\n\`${prefix}comparer <nom1> <nom2>\` - Comparer profils`,
          inline: false,
        },
        {
          name: '🛡️ Modération',
          value: `\`${prefix}warn <@user> [raison]\` - Avertir\n\`${prefix}warnings [@user]\` - Voir avertissements`,
          inline: false,
        },
      )
      .setFooter({
        text: 'SaladeBot • Tapez une commande pour plus d\'infos',
      })
      .setTimestamp();
    
    await message.reply({
      embeds: [embed],
    });
  },
};
