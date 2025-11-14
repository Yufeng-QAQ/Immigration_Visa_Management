import { BrowserRouter as Router} from "react-router-dom";
import { useEffect } from "react";
import AppContent from "./layout/AppContent";

export default function App() {
  useEffect(() => {
    const handler = () => {
      navigator.sendBeacon("http://localhost:8000/api/auth/logout");
    };
    window.addEventListener("unload", handler);
    return () => window.removeEventListener("unload", handler);
  }, []);

  return (
    <Router>
      <AppContent />
    </Router>
  );
}
