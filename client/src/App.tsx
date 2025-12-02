import { BrowserRouter as Router } from "react-router-dom";
import ConfirmProvider from "./components/Common/Confirm/confirmProvider";
import { AuthProvider } from "./components/Common/UserAuth/AuthProvider";
import AppContent from "./layout/AppContent";

export default function App() {
  return (
    <AuthProvider>
      <ConfirmProvider>
        <Router>
          <AppContent />
        </Router>
      </ConfirmProvider>
    </AuthProvider>
  );
}
