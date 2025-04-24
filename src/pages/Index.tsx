
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import WeatherDisplay from "@/components/WeatherDisplay";
import Clock from "@/components/Clock";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        {isAuthenticated ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Привет, {user?.username}!</h1>
              <p className="text-muted-foreground">Добро пожаловать в ваш персональный погодный сервис</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <WeatherDisplay />
              <Clock />
            </div>
          </>
        ) : (
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Погода и время в одном месте</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Зарегистрируйтесь, чтобы получить доступ к актуальной информации о погоде и точному времени
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <WeatherDisplay />
              <Clock />
            </div>
          </div>
        )}
      </main>
      
      <footer className="py-4 bg-primary text-primary-foreground text-center">
        <p className="text-sm">© 2023 ПогодаВремя | Все права защищены</p>
      </footer>
    </div>
  );
};

export default Index;
