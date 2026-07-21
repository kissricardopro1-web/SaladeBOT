# SaladeBot 🥗

Un bot Discord complet avec **IA (Groq)**, **économie**, **jeux**, et **intégration Habbo Hotel**.

## 🚀 Installation

```bash
npm install
```

## ⚙️ Configuration

Créez un fichier `.env`:

```env
DISCORD_TOKEN=votre_token_discord
GROQ_API_KEY=votre_clé_groq
PREFIX=!
DATABASE_PATH=./data/database.db
```

## 🎮 Commandes

### 📋 De base
- `!help` - Liste des commandes
- `!ping` - Ping du bot
- `!profil [@user]` - Profil utilisateur
- `!leaderboard` - Classement

### 🤖 IA
- `!ask <question>` - Question à l'IA
- `!chat <message>` - Chat avec le bot
- `!serious <question>` - Question sérieuse

### 💰 Économie
- `!salades [@user]` - Voir les salades
- `!daily` - Récompense quotidienne (+100 🥗)
- `!inventaire` - Voir son inventaire

### 🎮 Jeux
- `!blackjack <mise>` - Blackjack
- `!roulette <mise> <pari>` - Roulette
- `!morpion` - Morpion
- `!quiz` - Quiz Habbo

### 🏨 Habbo Hotel
- `!habbo <nom>` - Profil Habbo
- `!comparer <nom1> <nom2>` - Comparer profils

### 🛡️ Modération
- `!warn @user [raison]` - Avertir
- `!warnings [@user]` - Voir avertissements

## 🚀 Lancer le bot

```bash
npm start
```

Ou en développement:
```bash
npm run dev
```

## 📚 Technos

- **Discord.js** - Interaction Discord
- **Groq SDK** - IA (Mixtral 8x7b)
- **better-sqlite3** - Base de données
- **Axios** - Requêtes HTTP (Habbo API)

## 📝 Licence

MIT

---

**Développé par kissricardopro1-web** 🥗
