import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store.ts";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

// debug only: test initial state
//Rest();

ReactDOM.createRoot(document.getElementById("root")!).render(
  // strict mode will trigger render on dev mode twice, disable it as we are not currently in production now
  // <React.StrictMode>
  // </React.StrictMode>
  <Provider store={store}>
    {/* todo: loading view */}
    {/* todo: reset persistor */}
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </Router>
    </PersistGate>
  </Provider>
);
