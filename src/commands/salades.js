const { EmbedBuilder } = require('discord.js');
const { upsertUser } = require('../utils/database');

module.exports = {
  name: 'salades',
  description: 'Affiche le nombre de salades',
  cooldown: 3,
  
  async execute(message, args, client) {
    let user = message.mentions.users.first() || message.author;
    let dbUser = upsertUser(user.id, user.username);
    
    const embed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle(`🥗 Salades de ${user.username}`)
      .setDescription(`**${dbUser.salades}** salades 🥗`)
      .setThumbnail('https://img.icons8.com/color/256/000000/salad.png')
      .setFooter({
        text: 'Utilisez !daily pour gagner des salades chaque jour!',
      })
      .setTimestamp();
    
    await message.reply({
      embeds: [embed],
    });
  },
};
