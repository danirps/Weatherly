import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface DailyForecastProps {
  data: any[];
}

const DailyForecast: React.FC<DailyForecastProps> = ({ data }) => {
  const getDayName = (timestamp: number, index: number) => {
    if (index === 0) return 'Hoje';
    if (index === 1) return 'Amanhã';
    
    const date = new Date(timestamp * 1000);
    return format(date, 'EEEE', { locale: ptBR });
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'clear':
        return 'sunny';
      case 'clouds':
        return 'cloudy';
      case 'rain':
        return 'rainy';
      case 'snow':
        return 'snow';
      case 'thunderstorm':
        return 'thunderstorm';
      default:
        return 'partly-sunny';
    }
  };

  return (
    <View style={styles.container}>
      {data.slice(0, 7).map((day, index) => {
        const dayName = getDayName(day.dt, index);
        const maxTemp = Math.round(day.temp.max);
        const minTemp = Math.round(day.temp.min);
        const weather = day.weather[0].main;
        const pop = Math.round(day.pop * 100);

        return (
          <View key={index} style={styles.dayRow}>
            <Text style={styles.dayName}>{dayName}</Text>
            
            <View style={styles.weatherIconContainer}>
              <Ionicons
                name={getWeatherIcon(weather)}
                size={24}
                color={colors.primary}
              />
              {pop > 0 && (
                <View style={styles.popBadge}>
                  <Text style={styles.popText}>{pop}%</Text>
                </View>
              )}
            </View>
            
            <View style={styles.tempContainer}>
              <Text style={styles.maxTemp}>{maxTemp}°</Text>
              <Text style={styles.minTemp}>{minTemp}°</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  dayName: {
    fontSize: 16,
    color: colors.text,
    width: 80,
    textTransform: 'capitalize',
  },
  weatherIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  popText: {
    color: colors.text,
    fontSize: 10,
    fontWeight: '600',
  },
  tempContainer: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  maxTemp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  minTemp: {
    fontSize: 18,
    color: colors.textSecondary,
  },
});

export default DailyForecast;