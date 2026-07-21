const { EmbedBuilder } = require('discord.js');
const { upsertUser, addSalades } = require('../utils/database');

const DAILY_AMOUNT = 100;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;
const userCooldowns = new Map();

module.exports = {
  name: 'daily',
  description: 'Reçois ta récompense quotidienne',
  cooldown: 3,
  
  async execute(message, args, client) {
    const userId = message.author.id;
    const now = Date.now();
    const lastDaily = userCooldowns.get(userId);
    
    if (lastDaily && now - lastDaily < DAILY_COOLDOWN) {
      const timeLeft = Math.ceil((DAILY_COOLDOWN - (now - lastDaily)) / 1000 / 60 / 60);
      
      const embed = new EmbedBuilder()
        .setColor('#e74c3c')
        .setTitle('⏰ Trop tôt!')
        .setDescription(`Réessayez dans **${timeLeft}h**`)
        .setTimestamp();
      
      return message.reply({ embeds: [embed] });
    }
    
    try {
      upsertUser(userId, message.author.username);
      const updatedUser = addSalades(userId, DAILY_AMOUNT);
      userCooldowns.set(userId, now);
      
      const embed = new EmbedBuilder()
        .setColor('#2ecc71')
        .setTitle('✅ Récompense quotidienne!')
        .setDescription(`Tu as reçu **+${DAILY_AMOUNT} salades** 🥗\n\n**Total:** ${updatedUser.salades} salades`)
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
