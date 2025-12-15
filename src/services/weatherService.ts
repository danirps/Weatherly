import axios from 'axios';

// Obtenha em: https://openweathermap.org/api
const API_KEY = 'SUA_CHAVE_API_AQUI'; // <----- Adicione sua chave aqui :v)
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const weatherService = {
  async getWeatherByCity(city: string) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
          lang: 'pt_br',
        },
      });

      const forecast = await this.getForecast(response.data.coord.lat, response.data.coord.lon);
      
      return {
        current: response.data,
        hourly: forecast.hourly || [],
        daily: forecast.daily || [],
        location: `${response.data.name}, ${response.data.sys.country}`,
      };
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      throw error;
    }
  },

  async getWeatherByCoords(lat: number, lon: number) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'pt_br',
        },
      });

      const forecast = await this.getForecast(lat, lon);
      
      return {
        current: response.data,
        hourly: forecast.hourly || [],
        daily: forecast.daily || [],
        location: `${response.data.name}, ${response.data.sys.country}`,
      };
    } catch (error) {
      console.error('Error fetching weather by coords:', error);
      throw error;
    }
  },

  async getCurrentWeather() {
    // Fallback para São Paulo
    return this.getWeatherByCity('São Paulo');
  },

  async getForecast(lat: number, lon: number) {
    try {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: 'metric',
          lang: 'pt_br',
          cnt: 40, 
        },
      });

      return this.transformForecastData(response.data);
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return { hourly: [], daily: [] };
    }
  },

  transformForecastData(data: any) {
    const hourly = data.list.slice(0, 8).map((item: any) => ({
      dt: item.dt,
      temp: item.main.temp,
      weather: item.weather,
      pop: item.pop || 0,
    }));

    const dailyMap = new Map();
    data.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          dt: item.dt,
          temp: {
            min: item.main.temp_min,
            max: item.main.temp_max,
          },
          weather: item.weather,
          pop: item.pop || 0,
        });
      } else {
        const existing = dailyMap.get(date);
        if (item.main.temp_min < existing.temp.min) existing.temp.min = item.main.temp_min;
        if (item.main.temp_max > existing.temp.max) existing.temp.max = item.main.temp_max;
      }
    });

    const daily = Array.from(dailyMap.values()).slice(0, 7);

    return { hourly, daily };
  },

  getWeatherIcon(iconCode: string) {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
  },
};