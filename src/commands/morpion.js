const { TicTacToe } = require('../utils/games');

const activeGames = new Map();

module.exports = {
  name: 'morpion',
  description: 'Jeu du Morpion',
  cooldown: 3,
  
  async execute(message, args, client) {
    if (activeGames.has(message.author.id)) {
      return message.reply({
        content: '❌ Vous avez déjà une partie en cours!',
        ephemeral: true,
      });
    }
    
    const game = new TicTacToe();
    activeGames.set(message.author.id, game);
    
    let gameMsg = await message.reply(game.getBoard());
    
    const filter = (m) => m.author.id === message.author.id && /^[1-9]$/.test(m.content);
    const collector = message.channel.createMessageCollector({ filter, time: 60000 });
    
    let turn = 0;
    
    collector.on('collect', (m) => {
      const position = parseInt(m.content) - 1;
      
      if (game.board[position] !== null) {
        message.channel.send('❌ Case occupée!');
        return;
      }
      
      game.makeMove(position, 'X');
      turn++;
      
      if (turn % 2 === 1) {
        const aiMoves = game.board.map((cell, i) => cell === null ? i : null).filter(i => i !== null);
        if (aiMoves.length > 0) {
          const aiMove = aiMoves[Math.floor(Math.random() * aiMoves.length)];
          game.makeMove(aiMove, 'O');
        }
      }
      
      const winner = game.checkWinner();
      
      gameMsg.edit(game.getBoard());
      
      if (winner) {
        if (winner === 'X') {
          message.channel.send('🎉 Vous avez gagné!');
        } else if (winner === 'O') {
          message.channel.send('❌ L\'IA a gagné!');
        } else {
          message.channel.send('🤝 Égalité!');
        }
        
        activeGames.delete(message.author.id);
        collector.stop();
      }
    });
    
    collector.on('end', () => {
      activeGames.delete(message.author.id);
    });
  },
};
