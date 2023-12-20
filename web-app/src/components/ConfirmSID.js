import React, { useState, useEffect } from "react";
import { firestore, auth } from "../firebase";
import { Form, Card, Alert, Button } from "react-bootstrap";

const ConfirmSID = () => {
  const [studentID, setStudentID] = useState(null);
  const [enteredStudentID, setEnteredStudentID] = useState("");
  const [wrongID, setWrongID] = useState(false);
  const [confirmationSuccess, setConfirmationSuccess] = useState(false);

  useEffect(() => {
    const fetchStudentID = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setStudentID(userData.studentID);
          } else {
            console.log("User document not found in Firestore");
          }
        } else {
          console.log("User not authenticated");
        }
      } catch (error) {
        console.error("Error fetching student ID:", error.message);
      }
    };

    fetchStudentID();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (enteredStudentID.toLowerCase() === studentID.toLowerCase()) {
      setConfirmationSuccess(true);
      setWrongID(false);
    } else {
        setWrongID(true);
      setConfirmationSuccess(false);
    }
  };

  return (
    <div>
      <Card className="login-container">
        <Card.Header>
          <h2>Student ID confirmation</h2>
        </Card.Header>
        <Card.Body>
          {wrongID && <Alert variant="danger">Wrong student ID. Ex. b201210590 or B201210590</Alert>}
          {confirmationSuccess && <Alert variant="success">Student ID confirmed successfully!</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className='input-container'>
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type='text'
                value={enteredStudentID}
                onChange={(e) => setEnteredStudentID(e.target.value)}
                required
                placeholder='Enter Student ID'
              />
            </Form.Group>
            <Form.Group>
              <Button type='submit' className='button'>Confirm</Button>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer>
          <p>
            For any problems while trying to register, contact tech support.
          </p>
        </Card.Footer>
      </Card>
      {confirmationSuccess &&  setTimeout(function () {window.location.pathname = '/timer';}, 100)}
    </div>
  );
};

export default ConfirmSID;
