
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle, LogOut, Settings } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="w-full bg-primary py-3 px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-primary-foreground text-2xl font-bold">
          ПогодаВремя
        </Link>
        
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {user?.username}
              </span>
              
              <Link to="/settings">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 flex items-center gap-1"
                >
                  <Settings className="h-4 w-4" />
                  Настройки
                </Button>
              </Link>
              
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={logout}
                className="flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Выйти
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <Button variant="secondary" size="sm">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="bg-primary-foreground">
                  Регистрация
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
