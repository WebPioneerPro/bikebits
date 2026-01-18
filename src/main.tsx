import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";

import { ToastProvider } from "./context/ToastContext.tsx";
import { ToastContainer } from "./components/common/ToastContainer.tsx";
import { DataProvider } from "./context/DataContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <DataProvider>
          <AppWrapper>
            <App />
            <ToastContainer />
          </AppWrapper>
        </DataProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
