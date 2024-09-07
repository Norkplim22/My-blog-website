import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import DataContextProvider from "./context/DataContext.jsx";
import UsersContextProvider from "./context/UsersContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DataContextProvider>
      <UsersContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UsersContextProvider>
    </DataContextProvider>
  </React.StrictMode>
);
