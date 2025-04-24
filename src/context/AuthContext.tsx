
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  username: string;
  email: string;
  telegramId?: string;
  twoFactorEnabled: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  pendingTwoFactor: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  verifyTwoFactor: (code: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, telegramId?: string) => Promise<boolean>;
  logout: () => void;
  enableTwoFactor: (enable: boolean) => Promise<boolean>;
  updateTelegramId: (telegramId: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for user storage
const USERS_STORAGE_KEY = "weather_app_users";
const AUTH_TOKEN_KEY = "weather_app_auth_token";
const PENDING_2FA_KEY = "weather_app_pending_2fa";

// Имитация отправки уведомления в Telegram
const sendTelegramNotification = async (telegramId: string, message: string, code?: string): Promise<boolean> => {
  console.log(`[Telegram Notification to ${telegramId}]: ${message}`, code ? `Code: ${code}` : "");
  
  // В реальном приложении здесь был бы API-запрос к серверу для отправки сообщения
  // Например:
  // const response = await fetch('https://your-backend.com/api/telegram/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ telegramId, message, code })
  // });
  // return response.ok;
  
  // Имитируем успешную отправку
  return new Promise(resolve => setTimeout(() => resolve(true), 500));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingTwoFactor, setPendingTwoFactor] = useState(false);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [twoFactorCode, setTwoFactorCode] = useState<string | null>(null);

  // Load users from local storage or initialize empty array
  const getUsers = (): { 
    id: string; 
    username: string; 
    email: string; 
    password: string;
    telegramId?: string;
    twoFactorEnabled: boolean;
  }[] => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  };

  // Save users to local storage
  const saveUsers = (users: any[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      try {
        const userData = JSON.parse(token);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse auth token", error);
        localStorage.removeItem(AUTH_TOKEN_KEY);
      }
    }

    // Check if there's a pending 2FA verification
    const pendingData = localStorage.getItem(PENDING_2FA_KEY);
    if (pendingData) {
      try {
        const data = JSON.parse(pendingData);
        setPendingUser(data.user);
        setPendingTwoFactor(true);
      } catch (error) {
        console.error("Failed to parse pending 2FA data", error);
        localStorage.removeItem(PENDING_2FA_KEY);
      }
    }
  }, []);

  // Generate a random 6-digit code
  const generateTwoFactorCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // If 2FA is enabled, don't log in immediately
      if (foundUser.twoFactorEnabled) {
        const code = generateTwoFactorCode();
        setTwoFactorCode(code);
        setPendingUser(userWithoutPassword);
        setPendingTwoFactor(true);
        
        // Store pending 2FA state
        localStorage.setItem(PENDING_2FA_KEY, JSON.stringify({
          user: userWithoutPassword,
          timestamp: Date.now()
        }));
        
        // Send code via Telegram
        if (foundUser.telegramId) {
          await sendTelegramNotification(
            foundUser.telegramId,
            `Попытка входа в аккаунт ${foundUser.email} обнаружена. Используйте код для подтверждения:`,
            code
          );
        }
        
        return true;
      }
      
      // Log in immediately if 2FA is not enabled
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userWithoutPassword));
      
      return true;
    }
    
    return false;
  };

  const verifyTwoFactor = async (code: string): Promise<boolean> => {
    // In a real app, you would validate the code against a stored value or via API
    if (code === twoFactorCode && pendingUser) {
      setUser(pendingUser);
      setIsAuthenticated(true);
      setPendingTwoFactor(false);
      setPendingUser(null);
      setTwoFactorCode(null);
      
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(pendingUser));
      localStorage.removeItem(PENDING_2FA_KEY);
      
      return true;
    }
    
    return false;
  };

  const register = async (
    username: string, 
    email: string, 
    password: string, 
    telegramId?: string
  ): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password,
      telegramId,
      twoFactorEnabled: false
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Log user in after registration
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const enableTwoFactor = async (enable: boolean): Promise<boolean> => {
    if (!user) return false;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return false;
    
    // Update user
    users[userIndex].twoFactorEnabled = enable;
    saveUsers(users);
    
    // Update current user
    const updatedUser = { ...user, twoFactorEnabled: enable };
    setUser(updatedUser);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(updatedUser));
    
    return true;
  };

  const updateTelegramId = async (telegramId: string): Promise<boolean> => {
    if (!user) return false;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) return false;
    
    // Update user
    users[userIndex].telegramId = telegramId;
    saveUsers(users);
    
    // Update current user
    const updatedUser = { ...user, telegramId };
    setUser(updatedUser);
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(updatedUser));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPendingTwoFactor(false);
    setPendingUser(null);
    setTwoFactorCode(null);
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(PENDING_2FA_KEY);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      pendingTwoFactor,
      login, 
      verifyTwoFactor,
      register, 
      logout,
      enableTwoFactor,
      updateTelegramId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
