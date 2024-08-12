import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

function Password() {
  var password;

  const [message, setMessage] = useState("");

  const doPassword = async (event) => {
    event.preventDefault();

    const string_id = localStorage.getItem("verif_id");
    const json_id = JSON.parse(string_id);

    var obj = { email: json_id.email, password: password.value };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/changePassword"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.error != "") {
        setMessage(res.error);
      } else {
        setMessage("Password successfully updated!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (e) {
      setMessage(e.toString());
      return;
    }
  };

  return (
    <div id="passwordDiv">
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
                controlId="formBasicVerificationPassword"
              >
                <Form.Label>Enter New Password:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="password"
                  ref={(c) => (password = c)}
                />
              </Form.Group>
            </Form>
            <Button onClick={doPassword}>Reset Password</Button>{" "}
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

export default Password;
