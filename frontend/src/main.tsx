import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root") as HTMLElement;

createRoot(root).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
