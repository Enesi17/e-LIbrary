import React from "react"
import { Button, Container } from "react-bootstrap";

const Home = () => {

    const handleRegister = (e) => {
        e.preventDefault();
        window.location.pathname = "/register";
    };

    const handleLogin = (e) => {
        e.preventDefault();
        window.location.pathname = "/login";
    };
  return (
    <div>
        <br />
        <h1 style={{color:'black',textAlign:'center',margin:'20px'}}>LIBRARY MANAGMENT SYSTEM</h1>
        <br />
    <div className="home">
        <br />
        <br />
        <br />
        <br />
        <br />
      <Container className="home-container">
        <div className="group-2">
          <div className="group-099">
            <br />
            <h3>Library Managment System.</h3>
            <br />
            <p className="welcom-to-library-manag">
               We hope this app will make it
              easy to be as comfortable as possible while working in your
              favorite places reading your favorite books and creating the best
              projects. ENJOY!
            </p>
            <br />
          </div>
        </div>
        <div className="group-2510">
          <div className="group-4">
            <p className="your-are-new">Your are new?</p>
            <div className="group-3">
              <Button className="register" onClick={handleRegister}>Register</Button>
            </div>
          </div>
          <div className="group-5">
            <p className="you-have-account">You have account?</p>
            <div className="group-31">
              <Button className="loginbutton" onClick={handleLogin}>Login</Button>
            </div>
          </div>
        </div>
      </Container>
      <br /><br />
      <br />
      <br />
      <br />
      <br />
    </div>
    </div>
  );
}

export default Home;
