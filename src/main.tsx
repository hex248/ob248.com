import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PaperTextureOverlay } from "@/components/paper-texture-overlay";
import { ThemeProvider } from "@/components/theme-provider";
import "./index.css";
import App from "./App.tsx";

const root = document.getElementById("root");
const isTextureEnabled = import.meta.env.VITE_TEXTURE !== "0";
if (!root) throw new Error("Failed to find the root element");
createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      {isTextureEnabled ? <PaperTextureOverlay /> : null}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
