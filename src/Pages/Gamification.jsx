import React from 'react';
import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


const DUMMY_DATA = {
  rank: 'ACHIEVER', // Changed from 'Apprentice'
  currentXp: 450,
  requiredXp: 600,
  streak: 12,
  perfectDays: 8,
  achievements: [
    { id: '1', iconName: 'fire', label: '7-Day Streak', unlocked: true },
    { id: '2', iconName: 'check-decagram', label: 'First Perfect Day', unlocked: true },
    { id: '3', iconName: 'trophy-award', label: 'Virtuoso Rank', unlocked: false },
    { id: '4', iconName: 'calendar-check', label: '21-Day Master', unlocked: false },
    { id: '5', iconName: 'star-four-points', label: 'Early Bird', unlocked: true },
    { id: '6', iconName: 'shield-moon', label: 'Night Owl', unlocked: false },
  ],
};

// --- HELPER FUNCTION FOR RANK LOGOS ---
// This function returns the correct image for each rank.
const getRankLogo = (rank) => {
  switch (rank.toLowerCase()) {
    case 'initiate':
      return require('../../assets/initiate-logo.png');
    case 'apprentice':
      return require('../../assets/apprentice-logo.png');
    case 'adept':
      return require('../../assets/adept-logo.png');
    case 'master':
      return require('../../assets/master-logo.png');
    // Added new case for the ACHIEVER rank
    case 'achiever':
      // NOTE: Update this path if you have a specific 'achiever-logo.png'
      return require('../../assets/master-logo.png');
    default:
      return require('../../assets/apprentice-logo.png'); // A default image
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
          colors={['#00F0FF', '#5773FF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.progressBar, { width: `${progressPercent}%` }]}
        />
      </View>
    </View>
  );
};

// --- Component: StatCard ---
const StatCard = ({ iconName, value, label, color }) => {
  return (
    <View style={[styles.statCard, { borderColor: color, shadowColor: color }]}>
      <Icon name={iconName} size={40} color={color} />
      <Text style={styles.statValueText}>{value}</Text>
      <Text style={styles.statLabelText}>{label}</Text>
    </View>
  );
};

// --- Component: AchievementBadge ---
const AchievementBadge = ({ iconName, label, unlocked }) => {
  const color = unlocked ? '#FF2D78' : '#5A6877';
  const iconColor = unlocked ? '#FFF' : '#333';
  return (
    <View style={styles.badgeContainer}>
      <View style={[styles.badge, { backgroundColor: color, shadowColor: unlocked ? color : 'transparent' }]}>
        {unlocked ? <Icon name={iconName} size={30} color={iconColor} /> : <Icon name="lock" size={30} color={iconColor} />}
      </View>
      <Text style={[styles.badgeLabelText, { color: unlocked ? '#FFF' : '#5A6877' }]}>{label}</Text>
    </View>
  );
};

// --- Main Screen Component ---
const Gamification = () => {
  const rankLogo = getRankLogo(DUMMY_DATA.rank);

  return (
    <ImageBackground
      source={require('../../assets/background.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.rankDisplayContainer}>
          <Image source={rankLogo} style={styles.rankLogo} />
          <Text style={styles.rankText}>Rank: {DUMMY_DATA.rank}</Text>
        </View>

        <XPProgressBar
          currentXp={DUMMY_DATA.currentXp}
          requiredXp={DUMMY_DATA.requiredXp}
        />

        <View style={styles.statsRowContainer}>
          <StatCard
            iconName="fire"
            value={DUMMY_DATA.streak}
            label="Current Streak"
            color="#00F0FF"
          />
          <StatCard
            iconName="star"
            value={DUMMY_DATA.perfectDays}
            label="Perfect Days"
            color="#15F5BA"
          />
        </View>

        <Text style={styles.sectionTitle}>Achievements</Text>

        <View style={styles.achievementsGridContainer}>
          {DUMMY_DATA.achievements.map((ach) => (
            <AchievementBadge
              key={ach.id}
              iconName={ach.iconName}
              label={ach.label}
              unlocked={ach.unlocked}
            />
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

// --- All Styles In One Place ---
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.5)', // Adds a dark overlay to make text more readable
  },
  rankDisplayContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 10,
  },
  rankLogo: {
    width: 120,
    height: 120,
    marginBottom: 5,
  },
  rankText: {
    color: '#00F0FF',
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 240, 255, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  statsRowContainer: {
    flexDirection: 'row',
    width: '90%',
    marginTop: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    marginTop: 40,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  achievementsGridContainer: {
    width: '95%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  xpContainer: {
    width: '90%',
    alignItems: 'center',
    marginVertical: 10,
  },
  xpText: {
    color: '#FFF',
    fontSize: 14,
    marginBottom: 8,
  },
  barBackground: {
    width: '100%',
    height: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0, 240, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    margin: 8,
    backgroundColor: 'rgba(26, 44, 61, 0.8)', // Slightly transparent
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
    color: '#A0B3C4',
    fontSize: 14,
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
  },
  badgeLabelText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Gamification;