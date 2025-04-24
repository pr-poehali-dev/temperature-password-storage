
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const { user, enableTwoFactor, updateTelegramId } = useAuth();
  const [telegramId, setTelegramId] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Перенес редирект в useEffect
    if (!user) {
      navigate("/login");
    } else {
      // Инициализация состояния после того, как получили пользователя
      setTelegramId(user.telegramId || "");
      setTwoFactorEnabled(user.twoFactorEnabled || false);
    }
  }, [user, navigate]);

  // Если нет пользователя, не рендерим содержимое
  if (!user) {
    return null;
  }

  const handleSaveSettings = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      // Проверка на заполненный Telegram ID при включении 2FA
      if (twoFactorEnabled && !telegramId) {
        setError("Для включения двухфакторной аутентификации необходимо указать Telegram ID");
        setIsLoading(false);
        return;
      }
      
      // Сохраняем Telegram ID
      if (telegramId !== user.telegramId) {
        await updateTelegramId(telegramId);
      }
      
      // Включаем/отключаем 2FA
      if (twoFactorEnabled !== user.twoFactorEnabled) {
        await enableTwoFactor(twoFactorEnabled);
      }
      
      setSuccess("Настройки успешно сохранены");
    } catch (err) {
      setError("Не удалось сохранить настройки");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Настройки профиля</h1>
        
        <Card className="mb-6 shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle>Личная информация</CardTitle>
            <CardDescription>
              Основная информация о вашем аккаунте
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Имя пользователя</Label>
                <Input 
                  id="username" 
                  value={user.username} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email} 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6 shadow-md animate-fade-in">
          <CardHeader>
            <CardTitle>Безопасность</CardTitle>
            <CardDescription>
              Настройки двухфакторной аутентификации и Telegram-уведомлений
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="telegram-id">Telegram ID</Label>
                <Input 
                  id="telegram-id" 
                  placeholder="Например: 123456789"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Для получения Telegram ID напишите боту @userinfobot
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor" className="text-base">Двухфакторная аутентификация</Label>
                  <p className="text-sm text-muted-foreground">
                    При входе в аккаунт вам будет отправлен код подтверждения в Telegram
                  </p>
                </div>
                <Switch 
                  id="two-factor"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleSaveSettings}
              disabled={isLoading}
            >
              {isLoading ? "Сохранение..." : "Сохранить настройки"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
