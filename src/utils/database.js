const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './data/database.db';

const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db;

function initDatabase() {
  db = new Database(dbPath);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      salades INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      xp INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS guilds (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      prefix TEXT DEFAULT '!',
      ai_enabled BOOLEAN DEFAULT 1,
      moderation_enabled BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      guild_id TEXT NOT NULL,
      reason TEXT,
      moderator_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      rarity TEXT DEFAULT 'common',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      guild_id TEXT NOT NULL,
      message TEXT,
      response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function getUser(userId) {
  if (!db) initDatabase();
  return db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
}

function upsertUser(userId, username) {
  if (!db) initDatabase();
  const existing = getUser(userId);
  
  if (existing) {
    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(username, userId);
  } else {
    db.prepare('INSERT INTO users (id, username) VALUES (?, ?)').run(userId, username);
  }
  
  return getUser(userId);
}

function addSalades(userId, amount) {
  if (!db) initDatabase();
  const user = getUser(userId);
  
  if (!user) return null;
  
  const newAmount = Math.max(0, user.salades + amount);
  db.prepare('UPDATE users SET salades = ? WHERE id = ?').run(newAmount, userId);
  
  return getUser(userId);
}

function addXP(userId, amount) {
  if (!db) initDatabase();
  const user = getUser(userId);
  
  if (!user) return null;
  
  const XP_PER_LEVEL = 100;
  let newXP = user.xp + amount;
  let newLevel = user.level;
  
  while (newXP >= XP_PER_LEVEL) {
    newXP -= XP_PER_LEVEL;
    newLevel += 1;
  }
  
  db.prepare('UPDATE users SET xp = ?, level = ? WHERE id = ?').run(newXP, newLevel, userId);
  
  return getUser(userId);
}

function getGuild(guildId) {
  if (!db) initDatabase();
  return db.prepare('SELECT * FROM guilds WHERE id = ?').get(guildId);
}

function upsertGuild(guildId, name) {
  if (!db) initDatabase();
  const existing = getGuild(guildId);
  
  if (existing) {
    db.prepare('UPDATE guilds SET name = ? WHERE id = ?').run(name, guildId);
  } else {
    db.prepare('INSERT INTO guilds (id, name) VALUES (?, ?)').run(guildId, name);
  }
  
  return getGuild(guildId);
}

function addWarning(userId, guildId, reason, moderatorId) {
  if (!db) initDatabase();
  db.prepare(`INSERT INTO warnings (user_id, guild_id, reason, moderator_id) VALUES (?, ?, ?, ?)`).run(userId, guildId, reason, moderatorId);
}

function getWarnings(userId, guildId) {
  if (!db) initDatabase();
  return db.prepare(`SELECT * FROM warnings WHERE user_id = ? AND guild_id = ?`).all(userId, guildId);
}

function addItem(userId, itemName, quantity = 1, rarity = 'common') {
  if (!db) initDatabase();
  const existing = db.prepare(`SELECT * FROM items WHERE user_id = ? AND item_name = ?`).get(userId, itemName);
  
  if (existing) {
    db.prepare(`UPDATE items SET quantity = quantity + ? WHERE user_id = ? AND item_name = ?`).run(quantity, userId, itemName);
  } else {
    db.prepare(`INSERT INTO items (user_id, item_name, quantity, rarity) VALUES (?, ?, ?, ?)`).run(userId, itemName, quantity, rarity);
  }
}

function getInventory(userId) {
  if (!db) initDatabase();
  return db.prepare(`SELECT * FROM items WHERE user_id = ? ORDER BY rarity DESC`).all(userId);
}

function getLeaderboard(limit = 10) {
  if (!db) initDatabase();
  return db.prepare(`SELECT * FROM users ORDER BY level DESC, xp DESC LIMIT ?`).all(limit);
}

function addConversation(userId, guildId, message, response) {
  if (!db) initDatabase();
  db.prepare(`INSERT INTO conversations (user_id, guild_id, message, response) VALUES (?, ?, ?, ?)`).run(userId, guildId, message, response);
}

function closeDatabase() {
  if (db) {
    db.close();
  }
}

module.exports = {
  initDatabase,
  getUser,
  upsertUser,
  addSalades,
  addXP,
  getGuild,
  upsertGuild,
  addWarning,
  getWarnings,
  addItem,
  getInventory,
  getLeaderboard,
  addConversation,
  closeDatabase,
};
