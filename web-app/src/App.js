import React from "react";
import './index.css';
import { AuthProvider} from "./context/AuthContext";
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register";
import Reservation from "./components/Reservation";
import ManageReservation from "./components/ManageReservation";
import Timer from "./components/Timer";
import TableMapView from "./components/TableMapView";
import Options from "./components/Options";

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
    case "/register":
      component = <Register />
      break;
    case "/reservation":
      component = <Reservation />
      break;
    case "/manageReservation":
      component = <ManageReservation />
      break;
    case "/timer":
      component = <Timer />
      break;
    case "/maps":
      component = <TableMapView />
      break;
    case "/options":
      component = <Options />
      break;
  }
  
  return (
    <div className="App">
      <AuthProvider>
        {component} 
      </AuthProvider>
    </div>
  );
}

export default App;