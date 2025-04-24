
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary/30 p-4">
      <div className="text-center space-y-6 max-w-md animate-fade-in">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-semibold">Страница не найдена</h2>
        <p className="text-muted-foreground">
          Извините, запрашиваемая страница не существует или была перемещена.
        </p>
        <Link to="/">
          <Button className="mt-4">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
