import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎵</div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          This page seems to have wandered off into the ambient void. Let's get
          you back to creating beautiful soundscapes.
        </p>
        <Button
          onClick={() => (window.location.href = "/")}
          className="bg-ambient-600 hover:bg-ambient-700 text-white shadow-lg shadow-ambient-500/25"
        >
          <Home className="h-4 w-4 mr-2" />
          Return to Sound Mixer
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
