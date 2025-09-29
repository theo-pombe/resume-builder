import { Route, Routes } from "react-router";
import "./App.css";
import "./i18n";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

function App() {
  return (
    <Routes>
      {UserRoutes()}
      {AdminRoutes()}

      <Route path="auth">
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
