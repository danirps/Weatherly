import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface WeatherCardProps {
  weather: any;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const temp = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const weatherMain = weather.weather[0].main;
  const description = weather.weather[0].description;
  const icon = weather.weather[0].icon;

  const getGradientColors = () => {
    if (temp >= 30) return ['#FF6B6B', '#FF8E53'] as const;
    if (temp >= 20) return ['#4A90E2', '#50C9CE'] as const;
    if (temp >= 10) return ['#36D1DC', '#5B86E5'] as const;
    return ['#5B86E5', '#36D1DC'] as const;
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.tempContainer}>
          <Text style={styles.temp}>{temp}°</Text>
          <Text style={styles.feelsLike}>Sensação: {feelsLike}°C</Text>
        </View>
        
        <View style={styles.weatherInfo}>
          <Text style={styles.weatherMain}>{weatherMain}</Text>
          <Text style={styles.description}>{description}</Text>
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="thermometer" size={20} color="white" />
              <Text style={styles.statText}>Máx: {Math.round(weather.main.temp_max)}°</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="thermometer" size={20} color="white" />
              <Text style={styles.statText}>Mín: {Math.round(weather.main.temp_min)}°</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: `https://openweathermap.org/img/wn/${icon}@4x.png` }}
            style={styles.weatherIcon}
            resizeMode="contain"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tempContainer: {
    flex: 1,
  },
  temp: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  feelsLike: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  weatherInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weatherMain: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  weatherIcon: {
    width: 120,
    height: 120,
  },
});

export default WeatherCard;