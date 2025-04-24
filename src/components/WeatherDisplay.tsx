
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, MapPin, Droplets, Wind } from "lucide-react";

interface WeatherData {
  temperature: number;
  location: string;
  humidity: number;
  windSpeed: number;
  description: string;
}

// Функция для получения случайных данных о погоде
const getRandomWeatherData = (): WeatherData => {
  const locations = ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург", "Казань"];
  const descriptions = ["Солнечно", "Облачно", "Дождливо", "Пасмурно", "Ясно"];
  
  return {
    temperature: Math.floor(Math.random() * 30) - 10, // от -10 до 20
    location: locations[Math.floor(Math.random() * locations.length)],
    humidity: Math.floor(Math.random() * 60) + 30, // от 30% до 90%
    windSpeed: Math.floor(Math.random() * 20) + 1, // от 1 до 20 м/с
    description: descriptions[Math.floor(Math.random() * descriptions.length)]
  };
};

const WeatherDisplay = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Имитация API запроса
    const fetchWeather = async () => {
      setLoading(true);
      // Задержка для имитации запроса к API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWeather(getRandomWeatherData());
      setLoading(false);
    };

    fetchWeather();
    
    // Обновление данных каждые 10 минут
    const intervalId = setInterval(fetchWeather, 600000);
    
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <Card className="min-w-[300px] animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between">
            <div className="h-6 bg-muted rounded w-24"></div>
            <div className="h-6 bg-muted rounded w-16"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="h-8 bg-muted rounded w-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-6 bg-muted rounded"></div>
              <div className="h-6 bg-muted rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <Card className="min-w-[300px] animate-fade-in bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          <span className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-weather" />
            {weather.location}
          </span>
          <span>{weather.description}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <Thermometer className="h-8 w-8 text-weather mr-2" />
            <span className="text-4xl font-bold">{weather.temperature}°C</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex items-center">
              <Droplets className="h-5 w-5 text-weather mr-2" />
              <span>Влажность: {weather.humidity}%</span>
            </div>
            <div className="flex items-center">
              <Wind className="h-5 w-5 text-weather mr-2" />
              <span>Ветер: {weather.windSpeed} м/с</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherDisplay;
