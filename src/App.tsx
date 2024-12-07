import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "Components/Home";

import { useState } from "react";

import { OktoProvider, BuildType } from 'okto-sdk-react';
import Dashboard from "Components/Dashboard";
import CreateSubscription from "Components/CreateSubscription";
import Subscriptions from "Components/Subscriptions";
import CreateGroup from "Components/CreateGroup";
import CreateExpenses from "Components/CreateExpenses";
const OKTO_CLIENT_API_KEY = "ac9502db-13f0-4074-8ae0-6dc10ad2d0c5";

function App() {
  const [authToken, setAuthToken] = useState(null);

  const handleLogout = () => {
    console.log("setting auth token to null");
    setAuthToken(null); // Clear the authToken
    localStorage.removeItem("auth")

  };
  return (
    <div className="App">

<OktoProvider apiKey={OKTO_CLIENT_API_KEY} buildType={BuildType.SANDBOX}>

      <Router>
        <Routes>
          <Route path="/" element={<Home setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
          <Route path="/Dashboard" element={<Dashboard setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
          <Route path="/CreateSubscription" element={<CreateSubscription setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
          <Route path="/Subscriptions" element={<Subscriptions  setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
          <Route path="/CreateGroup" element={<CreateGroup setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />
          <Route path="/CreateExpenses" element={<CreateExpenses setAuthToken={setAuthToken} authToken={authToken} handleLogout={handleLogout} />} />

        
        </Routes>
      </Router>
      <ToastContainer />

      </OktoProvider>
    </div>
  );
}

export default App;
