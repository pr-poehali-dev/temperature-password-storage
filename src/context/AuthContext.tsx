
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for user storage
const USERS_STORAGE_KEY = "weather_app_users";
const AUTH_TOKEN_KEY = "weather_app_auth_token";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load users from local storage or initialize empty array
  const getUsers = (): { id: string; username: string; email: string; password: string }[] => {
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
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
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
      password
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

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
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
