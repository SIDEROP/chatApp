import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Store } from "./app/store";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { SocketContextProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <BrowserRouter>
      <SocketContextProvider>
        <App />
      </SocketContextProvider>
    </BrowserRouter>
  </Provider>
);
