import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useWeather } from '../contexts/WeatherContext';
import WeatherCard from '../components/WeatherCard';
import HourlyForecast from '../components/HourlyForecast';
import { colors } from '../theme/colors';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function HomeScreen() {
  const { weatherData, loading, location, fetchWeather } = useWeather();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchWeather();
    setRefreshing(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
      setSearchQuery('');
    }
  };

  if (loading && !weatherData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando dados do tempo...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={[colors.background, '#1a2c4d']}
      style={styles.container}
    >
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar cidade..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.locationButton} onPress={() => fetchWeather()}>
            <Ionicons name="locate" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Location and Date */}
        <View style={styles.header}>
          <Text style={styles.location}>{location}</Text>
          <Text style={styles.date}>
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </Text>
        </View>

        {/* Current Weather */}
        {weatherData && (
          <WeatherCard weather={weatherData.current} />
        )}

        {/* Hourly Forecast */}
        {weatherData?.hourly && (
          <HourlyForecast data={weatherData.hourly} />
        )}

        {/* Weather Details */}
        {weatherData && (
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="water" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Umidade</Text>
                <Text style={styles.detailValue}>
                  {weatherData.current.main.humidity}%
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="speedometer" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Pressão</Text>
                <Text style={styles.detailValue}>
                  {weatherData.current.main.pressure} hPa
                </Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Ionicons name="flag" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Vento</Text>
                <Text style={styles.detailValue}>
                  {weatherData.current.wind.speed} m/s
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="eye" size={24} color={colors.primary} />
                <Text style={styles.detailLabel}>Visibilidade</Text>
                <Text style={styles.detailValue}>
                  {weatherData.current.visibility / 1000} km
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text,
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  locationButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  location: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  date: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  detailsContainer: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  detailValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
});