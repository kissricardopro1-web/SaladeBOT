const { EmbedBuilder } = require('discord.js');
const { playBlackjack } = require('../utils/games');
const { getUser, addSalades } = require('../utils/database');

module.exports = {
  name: 'blackjack',
  description: 'Joue au Blackjack',
  cooldown: 3,
  
  async execute(message, args, client) {
    if (args.length === 0) {
      return message.reply({
        content: '❌ Veuillez fournir une mise. Usage: `!blackjack <mise>`',
        ephemeral: true,
      });
    }
    
    const mise = parseInt(args[0]);
    
    if (isNaN(mise) || mise <= 0) {
      return message.reply({
        content: '❌ La mise doit être un nombre positif.',
        ephemeral: true,
      });
    }
    
    const user = getUser(message.author.id);
    
    if (!user || user.salades < mise) {
      return message.reply({
        content: `❌ Vous n'avez pas assez de salades. Vous en avez: ${user?.salades || 0}`,
        ephemeral: true,
      });
    }
    
    try {
      const result = playBlackjack(mise);
      
      if (result.result === 'win') {
        addSalades(message.author.id, result.winnings);
        
        const embed = new EmbedBuilder()
          .setColor('#2ecc71')
          .setTitle('🎰 Blackjack - Victoire!')
          .addFields(
            { name: 'Vos cartes', value: result.playerCards.join(', '), inline: true },
            { name: 'Valeur', value: `${result.playerValue}`, inline: true },
            { name: 'Cartes du dealer', value: result.dealerCards.join(', '), inline: true },
            { name: 'Valeur du dealer', value: `${result.dealerValue}`, inline: true },
            { name: 'Gain', value: `+${result.winnings} 🥗`, inline: true },
          )
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      } else if (result.result === 'bust') {
        addSalades(message.author.id, result.winnings);
        
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('🎰 Blackjack - Bust!')
          .addFields(
            { name: 'Vos cartes', value: result.playerCards.join(', '), inline: true },
            { name: 'Valeur', value: `${result.playerValue}`, inline: true },
            { name: 'Perte', value: `-${mise} 🥗`, inline: true },
          )
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      } else if (result.result === 'lose') {
        addSalades(message.author.id, result.winnings);
        
        const embed = new EmbedBuilder()
          .setColor('#e74c3c')
          .setTitle('🎰 Blackjack - Défaite!')
          .addFields(
            { name: 'Vos cartes', value: result.playerCards.join(', '), inline: true },
            { name: 'Valeur', value: `${result.playerValue}`, inline: true },
            { name: 'Cartes du dealer', value: result.dealerCards.join(', '), inline: true },
            { name: 'Valeur du dealer', value: `${result.dealerValue}`, inline: true },
            { name: 'Perte', value: `-${mise} 🥗`, inline: true },
          )
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#3498db')
          .setTitle('🎰 Blackjack - Égalité!')
          .addFields(
            { name: 'Vos cartes', value: result.playerCards.join(', '), inline: true },
            { name: 'Valeur', value: `${result.playerValue}`, inline: true },
            { name: 'Cartes du dealer', value: result.dealerCards.join(', '), inline: true },
            { name: 'Valeur du dealer', value: `${result.dealerValue}`, inline: true },
          )
          .setTimestamp();
        
        return message.reply({ embeds: [embed] });
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
