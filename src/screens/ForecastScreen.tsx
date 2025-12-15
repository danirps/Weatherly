import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useWeather } from '../contexts/WeatherContext';
import DailyForecast from '../components/DailyForecast';
import WeatherChart from '../components/WeatherChart';
import { colors } from '../theme/colors';

export default function ForecastScreen() {
  const { weatherData } = useWeather();

  return (
    <LinearGradient
      colors={[colors.background, '#1a2c4d']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Previsão de 7 Dias</Text>
          <Text style={styles.subtitle}>Detalhada por hora e dia</Text>
        </View>

        {weatherData?.daily && (
          <DailyForecast data={weatherData.daily} />
        )}

        {weatherData?.hourly && (
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Variação de Temperatura (24h)</Text>
            <WeatherChart data={weatherData.hourly} />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Índices Climáticos</Text>
          <View style={styles.indicesGrid}>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>UV Index</Text>
              <Text style={styles.indexValue}>8</Text>
              <Text style={styles.indexDescription}>Alto</Text>
            </View>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>Qualidade do Ar</Text>
              <Text style={styles.indexValue}>42</Text>
              <Text style={styles.indexDescription}>Boa</Text>
            </View>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>Índice de Calor</Text>
              <Text style={styles.indexValue}>
                {weatherData?.current?.main?.feels_like || 0}°C
              </Text>
              <Text style={styles.indexDescription}>Real</Text>
            </View>
            <View style={styles.indexCard}>
              <Text style={styles.indexLabel}>Nascer do Sol</Text>
              <Text style={styles.indexValue}>06:15</Text>
              <Text style={styles.indexDescription}>Amanhã</Text>
            </View>
          </View>
        </View>
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
  chartContainer: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  infoContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  indicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indexCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  indexLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  indexValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  indexDescription: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
});