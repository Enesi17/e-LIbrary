import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext.js"
import { Form, Card, Button, Alert } from 'react-bootstrap'

const Login = () => {

    const { currentUser } = useAuth(false);
    const { login, logout } = useAuth();
    
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [loginFail, setLoginFail] = useState(false);
    const [Error, setError] = useState("error");
    
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                setError("");
                await login(emailRef.current.value, passwordRef.current.value);
                setLoginSuccess(true);
                setLoginFail(false);
            } catch (error) {
                setError("Login Failed");
                setLoginFail(true);
                console.log(Error);
            }
    }

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            await logout();
        } catch (error) {
            setError("Failed to logout.");
            console.log(Error);
        }
    }

    return(
    <div className="login" >
        { !currentUser && <Card className="login-container">
            <Card.Header>
                <h2>Login</h2>
            </Card.Header>
            <Card.Body>
                {loginFail && <Alert className="info" variant="danger">Login failed</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="input-container">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' ref={passwordRef} required placeholder='Enter password'/>
                    </Form.Group>
                    <Form.Group>
                        <Button type="submit" className="button">Login</Button>
                    </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer>
                <p>For tech support <a href="">contact us</a></p>
            </Card.Footer>
        </Card>}
        { loginSuccess && <Alert className="info" variant="success">Login succsessfully</Alert> }
        { loginSuccess && setTimeout(function () {window.location.pathname = '/options';}, 100) }
        { currentUser && <Button type="submit" onClick={handleLogout}>Logout</Button>}
    </div>
    );
}

export default Login;