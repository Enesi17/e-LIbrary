import React, { useState } from 'react';
import axios from 'axios';
import { Card, Form, Button } from 'react-bootstrap'

const ContactUs = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendEmail = async () => {
    try {
      // Validate email and message
      if (!email || !message) {
        setError('Please enter both email and message.');
        return;
      }

      // Send email using a server-side endpoint
      const response = await axios.post('/api/send-email', {
        email,
        message,
      });

      if (response.status === 200) {
        setSuccess('Email sent successfully!');
      } else {
        setError('Failed to send email. Please try again later.');
      }
    } catch (error) {
      setError('Failed to send email. Please try again later.');
    }
  };

  return (
    <div className="login">
      <h2>Contact Us</h2>
      <p>
        We wish to give you the best service. 
        <br />
        For any suggestions, anything that is not working or 
        <br />
        anything you want to change in out library or 
        <br />application, pleas let us know... 
        <br />
        <br />

        Thank you for using our application...
      </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <Card className="login-container">
        <Card.Body>
            <Form>
                <Form.Label>Your Email:</Form.Label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <Form.Label>Message:</Form.Label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <br />
                <Button onClick={handleSendEmail}>Send Email</Button>
            </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ContactUs;