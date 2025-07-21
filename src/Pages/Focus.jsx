import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import Ionicons from 'react-native-vector-icons/Ionicons';


const DURATION = {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60,
};

const Focus = () => {
    const [mode, setMode] = useState('pomodoro'); // pomodoro | short | long
    const [seconds, setSeconds] = useState(DURATION.pomodoro);
    const [active, setActive] = useState(false);
    const timerRef = useRef(null);

    // Format MM:SS
    const formatTime = s => {
        const mm = String(Math.floor(s / 60)).padStart(2, '0');
        const ss = String(s % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    };

    // Start/stop timer
    const toggle = () => {
        if (active) {
            clearInterval(timerRef.current);
            setActive(false);
        } else {
            setActive(true);
            timerRef.current = setInterval(() => {
                setSeconds(prev =>
                    prev > 0 ? prev - 1 : (clearInterval(timerRef.current), setActive(false), prev)
                );
            }, 1000);
        }
    };

    // Reset timer
    const reset = () => {
        clearInterval(timerRef.current);
        setSeconds(DURATION[mode]);
        setActive(false);
    };

    // Change mode
    const changeMode = m => {
        reset();
        setMode(m);
        setSeconds(DURATION[m]);
    };

    return (
        <View style={styles.container}>
            <Video
                source={require('../../assets/vids/rain.mp4')} // Make sure this path is correct
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                repeat
                muted
                ignoreSilentSwitch="obey"
            />

            <View style={styles.modeSwitch}>
                <TouchableOpacity
                    style={[styles.modeBtn, mode === 'pomodoro' && styles.selected]}
                    onPress={() => changeMode('pomodoro')}
                >
                    {/* FIX: Add paddingHorizontal to modeText */}
                    <Text style={[styles.modeText, { paddingHorizontal: 1 }]}>pomodoro</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeBtn, mode === 'short' && styles.selected]}
                    onPress={() => changeMode('short')}
                >
                    {/* FIX: Add paddingHorizontal to modeText */}
                    <Text style={[styles.modeText, { paddingHorizontal: 1 }]}>short break</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeBtn, mode === 'long' && styles.selected]}
                    onPress={() => changeMode('long')}
                >
                    <Text style={[styles.modeText, { paddingHorizontal: 1 }]}>long break</Text>
                </TouchableOpacity>
            </View>

            <Text style={[styles.time, { paddingHorizontal: 2 }]}>{formatTime(seconds)}</Text>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.startBtn} onPress={toggle}>
                    <Text style={[styles.startText, { paddingHorizontal: 1 }]}>{active ? 'pause' : 'start'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn} onPress={reset}>
                    <MaterialCommunityIcons name="reload" color="#fff" size={29} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconBtn}>
                    <AntDesign name="setting" color="white" size={24} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.incTime}>
                <Ionicons name="add-circle" color="#000" size={24} />
                <Text style={styles.addmintext}>5 Min</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.decTime}>
                <Ionicons name="remove-circle" color="#000" size={24} />
                <Text style={styles.addmintext}>5 Mins</Text>
            </TouchableOpacity>


        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24, // Main container padding
    },
    modeSwitch: {
        flexDirection: 'row',
        marginBottom: 34,
        marginTop: 20,
    },
    modeBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#343857',
        marginHorizontal: 5,
        borderWidth: 2
    },
    incTime: {
        flexDirection: 'row', // Arrange icon and text in a row
        alignItems: 'center', // Vertically center icon and text
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginTop: 40,

        backgroundColor: 'white',
        borderRadius: 18,
        borderColor: '#343857',
        borderWidth: 2,
        position: 'absolute',
        left: 59,
        top: '70%',
    },
    decTime: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 18,
        paddingVertical: 8,
        backgroundColor: 'white',
        borderRadius: 18,
        borderColor: '#343857',
        borderWidth: 2,
        position: 'absolute',
        right: 49,
        top: '74.7%',
    },
    addmintext: {
        fontWeight: 'bold',
        fontSize: 19,
        marginLeft: 8,
    },

    selected: {
        backgroundColor: '#90f9ff',
        borderColor: 'black',
        borderWidth: 2
    },
    modeText: {
        color: 'black',
        fontSize: 13,
        textTransform: 'capitalize',
        letterSpacing: 1,
        fontWeight: 'bold',
    },
    time: {
        fontSize: 87,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 4,
        marginBottom: 35,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 22,
    },
    startBtn: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 10,
        paddingHorizontal: 40,
        marginHorizontal: 9,
    },
    startText: {
        color: '#18182e',
        fontSize: 20,
        fontWeight: '700',
        textTransform: 'capitalize',
        letterSpacing: 1,
    },
    iconBtn: {
        backgroundColor: 'transparent',
        marginHorizontal: 7,
        padding: 11,
        borderRadius: 10,
    },
    icon: {
        color: '#fff',
        fontSize: 28,
    },
});

export default Focus;