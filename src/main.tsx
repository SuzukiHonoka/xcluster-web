import ReactDOM from "react-dom/client";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {store, persistor} from "./app/store.ts";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import React from "react";

// debug only: test initial state
//Rest();

ReactDOM.createRoot(document.getElementById("root")!).render(
    // React.StrictMode will trigger render twice on dev mode
    <React.StrictMode>
        <Provider store={store}>
            {/* todo: loading view */}
            {/* todo: reset persistor */}
            <PersistGate loading={null} persistor={persistor}>
                <Router>
                    <Routes>
                        <Route path="/*" element={<App/>}/>
                    </Routes>
                </Router>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);
