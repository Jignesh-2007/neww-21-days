import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// The ranks are now in an array, making it easier to level up.
const RANKS = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Master', 'Champion','Legend','Mega Legend'];

// Initial data for the user, updated to match the new rank system.
const INITIAL_USER_DATA = {
  rank: 'Bronze',
  currentXp: 50,
  requiredXp: 100,
  streak: 12,
  perfectDays: 8,
  achievements: [
    { id: '1', iconName: 'fire', label: '7-Day Streak', unlocked: true },
    { id: '2', iconName: 'check-decagram', label: 'First Perfect Day', unlocked: true },
    { id: '3', iconName: 'trophy-award', label: 'Champion Rank', unlocked: false },
    { id: '4', iconName: 'calendar-check', label: '21-Day Master', unlocked: false },
    { id: '5', iconName: 'star-four-points', label: 'Early Bird', unlocked: true },
    { id: '6', iconName: 'shield-moon', label: 'Night Owl', unlocked: false },
  ],
};

// --- HELPER FUNCTION FOR RANK LOGOS ---
// This function returns the correct image for each rank.
const getRankLogo = (rank) => {
  switch (rank.toLowerCase()) {
    case 'bronze':
      return require('../../assets/bronze.png');
    case 'silver':
      return require('../../assets/silver.png');
    case 'gold':
      return require('../../assets/gold.png');
    case 'platinum':
      return require('../../assets/plat.png');
    case 'master':
      return require('../../assets/master.png');
    case 'champion':
      return require('../../assets/Champion.png');
    case 'legend':
      return require('../../assets/Legend.png');
    case 'mega legend':
      return require('../../assets/Mega_Legend.png');
    default:
      return require('../../assets/bronze.png'); // A default image
  }
};

// --- Component: XPProgressBar ---
const XPProgressBar = ({ currentXp, requiredXp }) => {
  const progressPercent = (currentXp / requiredXp) * 100;
  return (
    <View style={styles.xpContainer}>
      <Text style={styles.xpText}>{`${currentXp} / ${requiredXp} XP`}</Text>
      <View style={styles.barBackground}>
        <LinearGradient
          colors={['#33ffff', '#ff33ff']} // Neon Blue to Neon Pink gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${progressPercent}% `}]}
        />
      </View>
    </View>
  );
};

// --- Component: StatCard ---
const StatCard = ({ iconName, value, label, color, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.statCard, { borderColor: color, shadowColor: color }]}>
      <Icon name={iconName} size={40} color={color} style={styles.iconShadow} />
      <Text style={styles.statValueText}>{value}</Text>
      <Text style={styles.statLabelText}>{label}</Text>
    </TouchableOpacity>
  );
};

// --- Component: AchievementBadge ---
const AchievementBadge = ({ iconName, label, unlocked, onPress }) => {
  const color = unlocked ? NEON_PINK : '#222';
  const iconColor = unlocked ? '#FFF' : '#555';
  const borderColor = unlocked ? NEON_PINK : '#444';

  return (
    <TouchableOpacity onPress={onPress} disabled={!unlocked} style={styles.badgeContainer}>
      <View style={[styles.badge, { backgroundColor: color, shadowColor: unlocked ? color : 'transparent', borderColor }]}>
        {unlocked ? <Icon name={iconName} size={30} color={iconColor} /> : <Icon name="lock" size={30} color={iconColor} />}
      </View>
      <Text style={[styles.badgeLabelText, { color: unlocked ? '#FFF' : '#555' }]}>{label}</Text>
    </TouchableOpacity>
  );
};

// --- Component: RankUpModal ---
const RankUpModal = ({ visible, onClose, newRank, newRankLogo }) => (
    <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalBackground}>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>RANK UP!</Text>
                <Image source={newRankLogo} style={styles.modalRankLogo} />
                <Text style={styles.modalText}>Congratulations! You've been promoted to</Text>
                <Text style={styles.modalRankText}>{newRank}</Text>
                <TouchableOpacity style={styles.modalButton} onPress={onClose}>
                    <Text style={styles.modalButtonText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);


// --- Main Screen Component ---
const Gamification = () => {
  const [playerData, setPlayerData] = useState(INITIAL_USER_DATA);
  const [isRankUpModalVisible, setRankUpModalVisible] = useState(false);
  const [newRankInfo, setNewRankInfo] = useState({ rank: '', logo: null });

  useEffect(() => {
    if (playerData.currentXp >= playerData.requiredXp) {
      const currentRankIndex = RANKS.findIndex(r => r.toLowerCase() === playerData.rank.toLowerCase());
      const nextRankIndex = currentRankIndex + 1;

      if (nextRankIndex < RANKS.length) {
        const nextRank = RANKS[nextRankIndex];
        
        // Set info for the modal and make it visible
        setNewRankInfo({ rank: nextRank, logo: getRankLogo(nextRank) });
        setRankUpModalVisible(true);

        // Update player data for the new rank
        setPlayerData(prevData => ({
          ...prevData,
          rank: nextRank,
          currentXp: prevData.currentXp - prevData.requiredXp,
          requiredXp: prevData.requiredXp + 200,
        }));
      }
    }
  }, [playerData.currentXp]);

  const handleStatPress = (label) => alert(`You tapped on ${label}.`);
  const handleAchievementPress = (achievement) => {
    const message = achievement.unlocked
      ? `You unlocked "${achievement.label}"!`
      : `Keep playing to unlock "${achievement.label}"!`;
    alert(message);
  };

  const addExperiencePoints = (amount) => {
    setPlayerData(prevData => ({
      ...prevData,
      currentXp: prevData.currentXp + amount,
    }));
  };

  const rankLogo = getRankLogo(playerData.rank);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/neon.jpg')}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.1 }}
        resizeMode="cover">
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.rankDisplayContainer}>
            <Image source={rankLogo} style={styles.rankLogo} />
            <Text style={styles.rankText}>Rank: {playerData.rank}</Text>
          </View>

          <XPProgressBar
            currentXp={playerData.currentXp}
            requiredXp={playerData.requiredXp}
          />

          <View style={styles.statsRowContainer}>
            <StatCard
              iconName="fire"
              value={playerData.streak}
              label="Current Streak"
              color={NEON_BLUE}
              onPress={() => handleStatPress('Current Streak')}
            />
            <StatCard
              iconName="star"
              value={playerData.perfectDays}
              label="Perfect Days"
              color={NEON_GREEN}
              onPress={() => handleStatPress('Perfect Days')}
            />
          </View>

          <Text style={styles.sectionTitle}>Achievements</Text>

          <View style={styles.achievementsGridContainer}>
            {playerData.achievements.map((ach) => (
              <AchievementBadge
                key={ach.id}
                iconName={ach.iconName}
                label={ach.label}
                unlocked={ach.unlocked}
                onPress={() => handleAchievementPress(ach)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.demoButton} onPress={() => addExperiencePoints(50)}>
            <Text style={styles.demoButtonText}>Add 50 XP (Demo)</Text>
          </TouchableOpacity>

        </ScrollView>
      </ImageBackground>
      <RankUpModal 
        visible={isRankUpModalVisible}
        onClose={() => setRankUpModalVisible(false)}
        newRank={newRankInfo.rank}
        newRankLogo={newRankInfo.logo}
      />
    </SafeAreaView>
  );
};

// --- All Styles In One Place ---
const NEON_BLUE = '#33ffff';
const NEON_PINK = '#ff33ff';
const NEON_GREEN = '#39ff14';
const DARK_BG = '#0d1117';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  backgroundImage: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(13, 17, 23, 0.7)',
  },
  rankDisplayContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  rankLogo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  rankText: {
    color: NEON_BLUE,
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  xpContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 20,
  },
  xpText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  barBackground: {
    width: '100%',
    height: 12,
    backgroundColor: '#161b22',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: NEON_BLUE,
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  statsRowContainer: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 8,
    backgroundColor: '#161b22',
    borderRadius: 15,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
  },
  statValueText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statLabelText: {
    color: '#a9a9a9',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 15,
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  achievementsGridContainer: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  badgeContainer: {
    alignItems: 'center',
    width: '33%',
    marginBottom: 20,
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
  },
  badgeLabelText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  demoButton: {
    marginTop: 30,
    width: '60%',
    backgroundColor: NEON_PINK,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: NEON_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 15,
  },
  demoButtonText: {
    color: DARK_BG,
    fontWeight: 'bold',
    fontSize: 16,
  },
  iconShadow: {
    textShadowColor: 'currentColor',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  // --- MODAL STYLES ---
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(13, 17, 23, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: '85%',
    backgroundColor: '#161b22',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderColor: NEON_BLUE,
    borderWidth: 2,
    shadowColor: NEON_BLUE,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: NEON_BLUE,
    textShadowColor: NEON_BLUE,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    marginBottom: 15,
  },
  modalRankLogo: {
    width: 100,
    height: 100,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  modalRankText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: NEON_GREEN,
    textShadowColor: NEON_GREEN,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: NEON_BLUE,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  modalButtonText: {
    color: DARK_BG,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Gamification;
