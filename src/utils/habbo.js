const axios = require('axios');

const HABBO_API_URL = 'https://habbo.com/api/public';

async function getHabboProfile(username) {
  try {
    const response = await axios.get(`${HABBO_API_URL}/users?name=${username}`);
    const user = response.data.profile;
    
    if (!user) {
      return null;
    }
    
    return {
      username: user.name,
      motto: user.motto || 'Pas de devise',
      memberSince: user.joinDate,
      lastOnline: user.lastOnline,
      level: user.level || 'N/A',
      id: user.id,
    };
  } catch (error) {
    console.error('❌ Erreur Habbo API:', error.message);
    return null;
  }
}

async function getHabboAvatar(username) {
  try {
    return `https://habbo.com/habbo-imaging/avatar/${encodeURIComponent(username)}/figure.png`;
  } catch (error) {
    console.error('❌ Erreur avatar:', error.message);
    return null;
  }
}

async function compareProfiles(username1, username2) {
  try {
    const profile1 = await getHabboProfile(username1);
    const profile2 = await getHabboProfile(username2);
    
    if (!profile1 || !profile2) {
      return null;
    }
    
    return {
      profile1,
      profile2,
    };
  } catch (error) {
    console.error('❌ Erreur comparaison:', error.message);
    return null;
  }
}

module.exports = {
  getHabboProfile,
  getHabboAvatar,
  compareProfiles,
};
