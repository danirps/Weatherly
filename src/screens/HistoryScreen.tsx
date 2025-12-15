import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../contexts/WeatherContext';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { colors } from '../theme/colors';

export default function HistoryScreen() {
  const { history, fetchWeather } = useWeather();

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
    <LinearGradient
      colors={[colors.background, '#1a2c4d']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico</Text>
          <Text style={styles.subtitle}>Suas últimas consultas</Text>
        </View>

        {history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="time-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Nenhum histórico disponível</Text>
            <Text style={styles.emptySubtext}>
              Suas consultas de previsão do tempo aparecerão aqui
            </Text>
          </View>
        ) : (
          history.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyCard}
              onPress={() => fetchWeather(item.location.split(',')[0])}
            >
              <View style={styles.historyHeader}>
                <View>
                  <Text style={styles.historyLocation}>{item.location}</Text>
                  <Text style={styles.historyDate}>
                    {format(parseISO(item.timestamp), "dd/MM/yyyy 'às' HH:mm", {
                      locale: ptBR,
                    })}
                  </Text>
                </View>
                <Ionicons
                  name={getWeatherIcon(item.weather?.[0]?.main || 'clear')}
                  size={32}
                  color={colors.primary}
                />
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyTemp}>
                  {Math.round(item.main?.temp || 0)}°C
                </Text>
                <Text style={styles.historyWeather}>
                  {item.weather?.[0]?.description || 'N/A'}
                </Text>
                <View style={styles.historyStats}>
                  <View style={styles.stat}>
                    <Ionicons name="water" size={16} color={colors.textSecondary} />
                    <Text style={styles.statText}>{item.main?.humidity || 0}%</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="flag" size={16} color={colors.textSecondary} />
                    <Text style={styles.statText}>{item.wind?.speed || 0} m/s</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 48,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  historyCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyLocation: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  historyDate: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  historyDetails: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  historyTemp: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  historyWeather: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  historyStats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
});