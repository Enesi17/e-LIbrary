import React from "react";
import { Button } from "react-bootstrap";

const Home = () => {
    
    async function handleRegister(e) {
        e.preventDefault();
        window.location.pathname = "/register"
    }

    async function handleLogin(e){
        e.preventDefault();
        window.location.pathname = "/login"
    }

    return ( 
        <div className="home">
            <h2>Welcom to Our Library Menagment System</h2>
        <br></br>
        <br></br>
        <br></br>
            <h5>If you are new click this button</h5>
                <br />
             <Button onClick={handleRegister}>Register</Button>
             <br />
             <br />
            <h5>If you already have an account click</h5>
            <br />
            <Button onClick={handleLogin}>Login</Button>
        </div>
     );
}
 
export default Home;