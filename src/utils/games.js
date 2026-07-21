const GAMES = {
  blackjack: { name: 'Blackjack', description: 'Jeu de cartes classique' },
  roulette: { name: 'Roulette', description: 'Pariez sur votre chance' },
  morpion: { name: 'Morpion (Tic Tac Toe)', description: 'Jeu de grille 3x3' },
  puissance4: { name: 'Puissance 4', description: 'Alignez 4 jetons' },
  devinettes: { name: 'Devinettes', description: 'Répondez à des devinettes' },
  quiz: { name: 'Quiz Habbo', description: 'Quiz sur Habbo Hotel' },
  canard: { name: 'Chasse au canard', description: 'Trouvez et tirez sur les canards' },
  legume: { name: 'Combat de légumes', description: 'Combattez avec des légumes' },
  casino: { name: 'Casino', description: 'Divers jeux de hasard' },
};

function playBlackjack(playerBet) {
  const deck = [];
  for (let i = 0; i < 4; i++) {
    deck.push(...['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']);
  }
  
  function getCardValue(card) {
    if (card === 'A') return 11;
    if (['J', 'Q', 'K'].includes(card)) return 10;
    return parseInt(card);
  }
  
  function drawCards(count) {
    const cards = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * deck.length);
      cards.push(deck.splice(randomIndex, 1)[0]);
    }
    return cards;
  }
  
  const playerCards = drawCards(2);
  const dealerCards = drawCards(2);
  
  const playerValue = playerCards.reduce((sum, card) => sum + getCardValue(card), 0);
  const dealerValue = dealerCards.reduce((sum, card) => sum + getCardValue(card), 0);
  
  let result = 'draw';
  let winnings = 0;
  
  if (playerValue > 21) {
    result = 'bust';
    winnings = -playerBet;
  } else if (dealerValue > 21) {
    result = 'win';
    winnings = playerBet * 2;
  } else if (playerValue > dealerValue) {
    result = 'win';
    winnings = playerBet * 2;
  } else if (dealerValue > playerValue) {
    result = 'lose';
    winnings = -playerBet;
  }
  
  return { playerCards, dealerCards, playerValue, dealerValue, result, winnings };
}

function playRoulette(playerBet, bet) {
  const number = Math.floor(Math.random() * 37);
  const isRed = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(number);
  const isBlack = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35].includes(number);
  
  let win = false;
  let winnings = 0;
  
  if (bet === 'rouge' && isRed) {
    win = true;
    winnings = playerBet * 2;
  } else if (bet === 'noir' && isBlack) {
    win = true;
    winnings = playerBet * 2;
  } else if (!isNaN(bet) && parseInt(bet) === number) {
    win = true;
    winnings = playerBet * 36;
  }
  
  if (!win) {
    winnings = -playerBet;
  }
  
  return { number, color: number === 0 ? 'vert' : (isRed ? 'rouge' : 'noir'), win, winnings };
}

class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
  }
  
  makeMove(position, player) {
    if (this.board[position] !== null) return false;
    this.board[position] = player;
    return true;
  }
  
  checkWinner() {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    
    return this.board.every(cell => cell !== null) ? 'draw' : null;
  }
  
  getBoard() {
    const emojis = { 'X': '❌', 'O': '⭕', null: '⬜' };
    let board = '';
    for (let i = 0; i < 9; i += 3) {
      board += `${emojis[this.board[i]]} ${emojis[this.board[i + 1]]} ${emojis[this.board[i + 2]]}\\n`;
    }
    return board;
  }
}

const QUIZ_QUESTIONS = [
  { question: 'En quelle année Habbo Hotel a-t-il été créé?', answer: '2000', options: ['1998', '2000', '2002', '2005'] },
  { question: 'Quel est le nom de la monnaie virtuelle de Habbo?', answer: 'Crédits', options: ['Crédits', 'Salades', 'Pièces', 'Points'] },
  { question: 'Combien de serveurs Habbo existe-t-il environ?', answer: 'Plus de 100', options: ['5', '50', 'Plus de 100', '200'] },
];

const RIDDLES = [
  { riddle: 'Je suis toujours venant, mais je n\'arrive jamais. Qui suis-je?', answer: 'demain' },
  { riddle: 'Je suis un trou, mais je ne suis pas vide. Qui suis-je?', answer: 'beignet' },
  { riddle: 'Plus je sèche, plus je suis humide. Qui suis-je?', answer: 'serviette' },
];

module.exports = { GAMES, playBlackjack, playRoulette, TicTacToe, QUIZ_QUESTIONS, RIDDLES };
