import React, { useRef, useState, useEffect } from "react";
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from "../context/AuthContext";
import { firestore } from "../firebase";

const Register = () => {

    let emailRef = useRef();
    let passwordRef = useRef();
    let confirmPasswordRef = useRef();
    let studentIDRef = useRef();

    const studentIDPattern = /^[bB]\d{9}$/;
    
    const { currentUser } = useAuth(false);
    const { logout } = useAuth();
    const [confirmError, setConfirmError] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(null);
    const [signupFail, setSignupFail] = useState(false);
    const { signup } = useAuth();
    const [Error, setError] = useState("");
    const [wrongID, setWrongID] = useState(false);
    const [isValidStudentID, setIsValidStudentID] = useState(true);

    const handleStudentIDChange = () => {
        const value = studentIDRef.current.value;
        const isValid = studentIDPattern.test(value);
        setIsValidStudentID(isValid);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
            setConfirmError(true);
            return console.log("Passwords do not match");
        } else {
            setConfirmError(false);
        }
    
        if (!isValidStudentID) {
            setWrongID(true);
            console.log("Invalid student number");
            return;
        }
    
        try {
            setError("");
            const { user } = await signup(emailRef.current.value, passwordRef.current.value);
    
            // Use the user's UID as the document ID
            await firestore.collection('users').doc(user.uid).set({
                email: emailRef.current.value,
                studentID: studentIDRef.current.value,
            });
    
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
                {signupFail && <Alert className="info" variant="danger">Couldn't register, Check mail</Alert>}
                {confirmError && <Alert className="info" variant="danger">Passwords do not match</Alert>}
                { wrongID && <Alert variant="danger"> wrong student ID. Ex. b201210590 or B201210590</Alert>}
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
                        <Form.Control type='text' ref={studentIDRef} required placeholder='Student ID' onChange={handleStudentIDChange}/>
                    </Form.Group>
                    <Form.Group>
                    <Button type='submit' className='button'>Sign Up</Button>
                </Form.Group>
                </Form>
            </Card.Body>
            <Card.Footer>
                    <p>For tech support <a href="/contactUs">contact us</a></p>
                    <p>Already have an account? <a href="/login">Login</a></p>
            </Card.Footer>
        </Card>}
        {signupSuccess && setTimeout(function () {window.location.pathname = '/options';}, 100)}
        { currentUser && <Button type="button" onClick={handleLogout}>Log out</Button>}
        </div>
    );

}

export default Register;