import { Routes } from "react-router";
import "./App.css";
import "./i18n";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <Routes>
      {UserRoutes()}
      {AdminRoutes()}
    </Routes>
  );
}

export default App;
