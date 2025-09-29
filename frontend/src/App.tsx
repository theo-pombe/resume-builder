import { Route, Routes } from "react-router";
import "./App.css";
import "./i18n";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Unauthorized from "./pages/Unauthorized";
import GuestGuard from "./contexts/GuestGuard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      {UserRoutes()}
      {AdminRoutes()}

      <Route
        path="/auth/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />
      <Route
        path="/auth/register"
        element={
          <GuestGuard>
            <Register />
          </GuestGuard>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
