module.exports = {
  name: 'ping',
  description: 'Affiche le ping du bot',
  cooldown: 1,
  
  async execute(message, args, client) {
    const sent = await message.reply({ content: '🏓 Pong!' });
    
    const latency = sent.createdTimestamp - message.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);
    
    sent.edit({
      content: `🏓 Pong!\n**Latence:** ${latency}ms\n**API:** ${apiLatency}ms`,
    });
  },
};
