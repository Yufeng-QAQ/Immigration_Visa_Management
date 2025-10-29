import { BrowserRouter as Router} from "react-router-dom";
import AppContent from "./layout/AppContent";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
