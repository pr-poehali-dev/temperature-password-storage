
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock as ClockIcon } from "lucide-react";

const Clock = () => {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Форматирование времени
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  
  // Форматирование даты
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const dateString = time.toLocaleDateString('ru-RU', options);
  
  return (
    <Card className="animate-fade-in bg-white dark:bg-gray-800 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-center mb-4">
          <ClockIcon className="h-6 w-6 text-weather mr-2" />
          <h2 className="text-xl font-semibold">Текущее время</h2>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="font-digital text-5xl md:text-6xl text-weather-accent tracking-wider mb-3">
            {hours}:{minutes}:{seconds}
          </div>
          
          <div className="text-sm md:text-base text-muted-foreground capitalize">
            {dateString}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Clock;
