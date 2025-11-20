import { BrowserRouter as Router} from "react-router-dom";
import ConfirmProvider from "./components/Common/Confirm/confirmProvider";
// import { useEffect } from "react";
import AppContent from "./layout/AppContent";

export default function App() {
  // useEffect(() => {
  //   const handler = () => {
  //     navigator.sendBeacon("http://localhost:8000/api/auth/logout");
  //   };
  //   window.addEventListener("unload", handler);
  //   return () => window.removeEventListener("unload", handler);
  // }, []);

  return (
    <ConfirmProvider>
      <Router>
        <AppContent />
      </Router>
    </ConfirmProvider>
  );
}
