import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { weatherService } from '../services/weatherService';
import { Alert } from 'react-native';

interface WeatherData {
  current: any;
  hourly: any[];
  daily: any[];
  location: string;
}

interface WeatherAlert {
  id: string;
  type: 'temp' | 'rain' | 'wind' | 'storm';
  condition: string;
  value: number;
  isActive: boolean;
  createdAt: Date;
}

interface WeatherContextType {
  weatherData: WeatherData | null;
  loading: boolean;
  location: string;
  alerts: WeatherAlert[];
  history: any[];
  fetchWeather: (city?: string) => Promise<void>;
  addAlert: (alert: Omit<WeatherAlert, 'id' | 'createdAt' | 'isActive'>) => void;
  removeAlert: (id: string) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Carregando...');
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (weatherData) {
      checkAlerts();
    }
  }, [weatherData]);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Erro ao obter permissão:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      await fetchWeatherByCoords(latitude, longitude);
    } catch (error) {
      console.error('Erro ao obter localização:', error);
      await fetchWeather('São Paulo'); // Fallback
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const data = await weatherService.getWeatherByCoords(lat, lon);
      setWeatherData(data);
      setLocation(data.location);
      addToHistory(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do tempo');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (city?: string) => {
    try {
      setLoading(true);
      const data = city 
        ? await weatherService.getWeatherByCity(city)
        : await weatherService.getCurrentWeather();
      
      setWeatherData(data);
      setLocation(data.location);
      addToHistory(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível obter os dados do tempo');
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = async (data: WeatherData) => {
    const historyItem = {
      ...data.current,
      location: data.location,
      timestamp: new Date().toISOString(),
    };
    
    const updatedHistory = [historyItem, ...history.slice(0, 9)];
    setHistory(updatedHistory);
    await AsyncStorage.setItem('weather_history', JSON.stringify(updatedHistory));
  };

  const loadData = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem('weather_history');
      const savedAlerts = await AsyncStorage.getItem('weather_alerts');
      
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const addAlert = async (alert: Omit<WeatherAlert, 'id' | 'createdAt' | 'isActive'>) => {
    const newAlert: WeatherAlert = {
      ...alert,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: true,
    };
    
    const updatedAlerts = [...alerts, newAlert];
    setAlerts(updatedAlerts);
    await AsyncStorage.setItem('weather_alerts', JSON.stringify(updatedAlerts));
  };

  const removeAlert = async (id: string) => {
    const updatedAlerts = alerts.filter(alert => alert.id !== id);
    setAlerts(updatedAlerts);
    await AsyncStorage.setItem('weather_alerts', JSON.stringify(updatedAlerts));
  };

  const checkAlerts = () => {
    if (!weatherData) return;
    
    const updatedAlerts = alerts.map(alert => {
      const currentTemp = weatherData.current.main.temp;
      const condition = weatherData.current.weather[0].main.toLowerCase();
      
      let isActive = false;
      
      switch (alert.type) {
        case 'temp':
          if (alert.condition === 'above' && currentTemp > alert.value) isActive = true;
          if (alert.condition === 'below' && currentTemp < alert.value) isActive = true;
          break;
        case 'rain':
          if (condition.includes('rain') && alert.condition === 'starts') isActive = true;
          break;
        case 'storm':
          if (condition.includes('storm') || condition.includes('thunder')) isActive = true;
          break;
      }
      
      return { ...alert, isActive };
    });
    
    setAlerts(updatedAlerts);
  };

  return (
    <WeatherContext.Provider
      value={{
        weatherData,
        loading,
        location,
        alerts,
        history,
        fetchWeather,
        addAlert,
        removeAlert,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
};