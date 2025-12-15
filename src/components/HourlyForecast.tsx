import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HourlyForecastProps {
  data: any[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ data }) => {
  const getWeatherIcon = (weather: string, hour: number) => {
    const isNight = hour >= 18 || hour <= 6;
    
    switch (weather.toLowerCase()) {
      case 'clear':
        return isNight ? 'moon' : 'sunny';
      case 'clouds':
        return isNight ? 'cloudy-night' : 'cloudy';
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

  const formatHour = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return format(date, 'HH:mm', { locale: ptBR });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Previsão por Hora</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {data.slice(0, 12).map((hour, index) => {
          const time = formatHour(hour.dt);
          const temp = Math.round(hour.temp);
          const weather = hour.weather[0].main;
          const pop = Math.round(hour.pop * 100);

          return (
            <View key={index} style={styles.hourCard}>
              <Text style={styles.time}>{index === 0 ? 'Agora' : time}</Text>
              <Ionicons
                name={getWeatherIcon(weather, parseInt(time.split(':')[0]))}
                size={32}
                color={colors.primary}
              />
              <Text style={styles.temp}>{temp}°</Text>
              {pop > 0 && (
                <View style={styles.popContainer}>
                  <Ionicons name="water" size={12} color={colors.primary} />
                  <Text style={styles.pop}>{pop}%</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  hourCard: {
    alignItems: 'center',
    marginRight: 20,
    minWidth: 60,
  },
  time: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginVertical: 8,
  },
  popContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  pop: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 2,
  },
});

export default HourlyForecast;