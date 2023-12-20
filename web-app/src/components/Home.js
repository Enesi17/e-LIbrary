import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

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
      <Container className="home">
         <Row>
            <Col md={{ span: 6, offset: 3 }}>
              <h2>Welcome to Our Library Management System</h2>
              <br />
              <h5>If you are new, click this button</h5>
              <Button onClick={handleRegister}>
                Register
              </Button>
              <br />
              <br />
              <h5>If you already have an account, click</h5>
              <Button onClick={handleLogin}>
                Login
              </Button>
            </Col>
          </Row>
    </Container>
  );
};

export default Home;
