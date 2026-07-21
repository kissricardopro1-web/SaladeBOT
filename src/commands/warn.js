const { EmbedBuilder } = require('discord.js');
const { addWarning, getWarnings } = require('../utils/database');

module.exports = {
  name: 'warn',
  description: 'Avertir un utilisateur',
  cooldown: 3,
  
  async execute(message, args, client) {
    if (!message.member.permissions.has('MODERATE_MEMBERS')) {
      return message.reply({
        content: '❌ Vous n\'avez pas la permission d\'utiliser cette commande.',
        ephemeral: true,
      });
    }
    
    const targetUser = message.mentions.users.first();
    if (!targetUser) {
      return message.reply({
        content: '❌ Veuillez mentionner un utilisateur. Usage: `!warn @utilisateur [raison]`',
        ephemeral: true,
      });
    }
    
    const reason = args.slice(1).join(' ') || 'Aucune raison fournie';
    
    try {
      addWarning(targetUser.id, message.guildId, reason, message.author.id);
      const warnings = getWarnings(targetUser.id, message.guildId);
      
      const embed = new EmbedBuilder()
        .setColor('#f39c12')
        .setTitle('⚠️ Avertissement')
        .addFields(
          { name: 'Utilisateur', value: targetUser.toString(), inline: true },
          { name: 'Modérateur', value: message.author.toString(), inline: true },
          { name: 'Raison', value: reason, inline: false },
          { name: 'Avertissements totaux', value: `${warnings.length}`, inline: true },
        )
        .setTimestamp();
      
      await message.reply({ embeds: [embed] });
      
      try {
        await targetUser.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#e74c3c')
              .setTitle('⚠️ Vous avez reçu un avertissement')
              .setDescription(`**Raison:** ${reason}\n\n**Avertissements totaux:** ${warnings.length}`)
              .setTimestamp(),
          ],
        });
      } catch (e) {
        // DM désactivés
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      message.reply({
        content: '❌ Une erreur est survenue.',
        ephemeral: true,
      });
    }
  },
};
