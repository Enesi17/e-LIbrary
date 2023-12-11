import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import "../index.css"

const Register = () => {

    let emailRef = useRef();
    let passwordRef = useRef();
    let confirmPasswordRef = useRef();
    let studentIDRef = useRef();

    const { currentUser, logout } = useAuth();
    const [confirmError, setConfirmError] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(null);
    const [signupFail, setSignupFail] = useState(false);
    const { signup } = useAuth();
    const [Error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(passwordRef.current.value !== confirmPasswordRef.current.value)
        {
            setConfirmError(true);
            return console.log("Passwords do not match");
        }else{
            setConfirmError(false);
        }

        try {
            setError("");
            await signup(emailRef.current.value, passwordRef.current.value);
            setSignupSuccess(true);
            setSignupFail(false);
        } catch (error) {
            setError("Failed to create an account");
            console.log(Error);
            setSignupFail(true);
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
        <div className="login">
           {!currentUser && 
            <Card className="login-container">
            <Card.Header>
                <h2>Registration Form</h2>
            </Card.Header>
            <Card.Body>
                {signupSuccess && <Alert className="info" variant="success">Signed up successfully</Alert>}
                {signupSuccess && setTimeout(function () {window.location.pathname = '/reservation';}, 100)}
                {signupFail && <Alert className="info" variant="danger">Couldn't register, Check mail</Alert>}
                {confirmError && <Alert className="info" variant="danger">Passwords do not match</Alert>}
                <Form onSubmit={handleSubmit}> 
                    <Form.Group className='input-container'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control type='email' ref={emailRef} required placeholder='Enter email'/>
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' ref={passwordRef} required placeholder='Enter password'/>
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type='password' ref={confirmPasswordRef} required placeholder='Confirm Passowrd'/>
                    </Form.Group>
                    <Form.Group className='input-container'>
                        <Form.Label>Student ID</Form.Label>
                        <Form.Control type='text' ref={studentIDRef} required placeholder='Student ID'/>
                    </Form.Group>
                    <Form.Group>
                    <Button type='submit' className='button'>Sign Up</Button>
                </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer>
                <p>
                    For any problems while trying to register contact the tech support
                </p>
            </Card.Footer>
        </Card>}
        { currentUser && <Button type="button" onClick={handleLogout}>Log out</Button>}
        </div>
    );

}

export default Register;