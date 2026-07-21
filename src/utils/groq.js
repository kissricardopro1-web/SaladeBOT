const { Groq } = require('groq-sdk');
const { addConversation } = require('./database');

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const conversationContexts = new Map();

async function getGroqResponse(message, userId, guildId) {
  try {
    const contextKey = `${userId}-${guildId}`;
    let context = conversationContexts.get(contextKey) || [];
    
    context.push({
      role: 'user',
      content: message,
    });
    
    if (context.length > 10) {
      context = context.slice(-10);
    }
    
    const response = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `Tu es SaladeBot, un bot Discord français amusant, troll et attachant. Tu réponds de manière naturelle et humoristique. Tu peux faire des blagues, des taquineries, utiliser des emojis, mais reste sympa et serviable. Réponds en français. Limite ta réponse à 2000 caractères. Tu es un véritable membre de la communauté avec une personnalité unique.`,
        },
        ...context,
      ],
      max_tokens: 500,
      temperature: 0.8,
    });
    
    const aiResponse = response.choices[0].message.content;
    
    context.push({
      role: 'assistant',
      content: aiResponse,
    });
    
    conversationContexts.set(contextKey, context);
    addConversation(userId, guildId, message, aiResponse);
    
    return aiResponse;
  } catch (error) {
    console.error('❌ Erreur Groq:', error.message);
    return null;
  }
}

async function getSeriosResponse(message) {
  try {
    const response = await client.chat.completions.create({
      model: 'mixtral-8x7b-32768',
      messages: [
        {
          role: 'system',
          content: `Tu es un assistant Discord sérieux et utile. Tu fournis des réponses claires, précises et bien structurées. Réponds en français. Utilise du markdown pour améliorer la lisibilité. Limite ta réponse à 2000 caractères.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 500,
      temperature: 0.5,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('❌ Erreur Groq:', error.message);
    return null;
  }
}

module.exports = {
  getGroqResponse,
  getSeriosResponse,
};
