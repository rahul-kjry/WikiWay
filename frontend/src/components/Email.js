import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

function Email() {
  var email;

  const [message, setMessage] = useState("");

  const doEmail = async (event) => {
    event.preventDefault();

    var obj = { email: email.value };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/sendPasswordResetEmail"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.error != "") {
        setMessage(res.error);
      } else {
        var verif_id = { verifyEmail: false, email: email.value };
        localStorage.setItem("verif_id", JSON.stringify(verif_id));
        setMessage("Password Reset email sent!");
        setTimeout(() => {
          window.location.href = "/verification";
        }, 2000);
      }
    } catch (e) {
      setMessage(e.toString());
      return;
    }
  };

  return (
    <div id="emailDiv">
      <Container>
        <Row>
          <img src="blurb.png"></img>
        </Row>

        <Row>
          <Col></Col>
          <Col xs={6}>
            <h1 id="inner-title">Password Reset</h1>
            <h3>{message}</h3>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="formBasicVerificationEmail"
              >
                <Form.Label>Enter Your Email:</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="johnsmith@gmail.com"
                  ref={(c) => (email = c)}
                />
              </Form.Group>
            </Form>
            <Button onClick={doEmail}>Send Password Reset Email</Button>{" "}
            <Link to="/" className="btn btn-outline-primary">
              Login
            </Link>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

const app_name = "wikiway-cop4331";
function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://" + app_name + ".herokuapp.com/" + route;
  } else {
    return "http://localhost:5001/" + route;
  }
}

export default Email;
