
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Простая валидация
    if (!email || !password) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password);
      
      if (success) {
        navigate("/");
      } else {
        setError("Неверный email или пароль");
      }
    } catch (err) {
      setError("Произошла ошибка при входе");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Вход</CardTitle>
          <CardDescription className="text-center">
            Введите ваши данные для входа в аккаунт
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Пароль</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Загрузка..." : "Войти"}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm">
            Ещё нет аккаунта?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Зарегистрироваться
            </Link>
          </div>
          
          <Link to="/" className="text-center text-sm text-muted-foreground hover:underline">
            Вернуться на главную
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
