import React from "react";
import './index.css';
import { AuthProvider } from "./context/AuthContext";
import Login from './components/Login';
import ConfirmLogin from './components/ConfirmLogin'
import Home from './components/Home';
import Register from './components/Register';
import Reservation from "./components/Reservation";
// import NFCReader from "./components/NFCReader";
// import TableMaps from './components/TableMaps';
// import TImer from './components/Timer'

function App() {
  let component;
  switch(window.location.pathname)
  {
    case "/": 
      component = <Home />
      break;
    case "/login":
      component = <Login />
      break;
    case "/confirmlogin":
      component = <ConfirmLogin />
      break;
    case "/register":
      component = <Register />
      break;
    // case "/NFCReader":
    //   component = <NFCReader />
    //   break;
    // case "/maps":
    //   component = <TableMaps />
    //   break; 
    case "/reservation":
      component = <Reservation />
      break;
    // case "/timer":
    //   component = <TImer />
    //   break;
  };
  return (
    <div className="App">
      <AuthProvider>
        {component} 
      </AuthProvider>
    </div>
  );
}

export default App;

