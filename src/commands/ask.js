const { getGroqResponse } = require('../utils/groq');
const { addXP } = require('../utils/database');

module.exports = {
  name: 'ask',
  description: 'Pose une question à l\'IA',
  cooldown: 3,
  
  async execute(message, args, client) {
    if (args.length === 0) {
      return message.reply({
        content: '❌ Veuillez fournir une question. Usage: `!ask <question>`',
        ephemeral: true,
      });
    }
    
    const question = args.join(' ');
    
    const loadingMsg = await message.reply({
      content: '🤔 Je réfléchis...',
    });
    
    try {
      const response = await getGroqResponse(question, message.author.id, message.guildId);
      
      if (!response) {
        return loadingMsg.edit({
          content: '❌ Une erreur est survenue avec l\'IA.',
        });
      }
      
      const truncatedResponse = response.length > 2000 
        ? response.substring(0, 1997) + '...' 
        : response;
      
      addXP(message.author.id, 5);
      
      await loadingMsg.edit({
        content: `🤖 **Question:** ${question}\n\n**Réponse:**\n${truncatedResponse}`,
      });
    } catch (error) {
      console.error('❌ Erreur:', error);
      await loadingMsg.edit({
        content: '❌ Une erreur est survenue.',
      });
    }
  },
};
