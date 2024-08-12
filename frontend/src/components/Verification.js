import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

function Verification() {
  var code;

  const [message, setMessage] = useState("");

  const doVerification = async (event) => {
    event.preventDefault();

    const string_id = localStorage.getItem("verif_id");
    const json_id = JSON.parse(string_id);

    var obj = {
      verifyEmail: json_id.verifyEmail,
      email: json_id.email,
      code: code.value,
    };
    var js = JSON.stringify(obj);
    try {
      const response = await fetch(buildPath("api/verifyCode"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      if (res.error != "") {
        setMessage(res.error);
      } else {
        if (json_id.verifyEmail) {
          setMessage("Successfully verified user!");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          setMessage("Password Reset Code verified!");
          setTimeout(() => {
            window.location.href = "/password";
          }, 2000);
        }
      }
    } catch (e) {
      setMessage(e.toString());
      return;
    }
  };

  return (
    <div id="verificationDiv">
      <Container>
        <Row>
          <img src="blurb.png"></img>
        </Row>

        <Row>
          <Col></Col>
          <Col xs={6}>
            <h1 id="inner-title">Verification</h1>
            <h3>{message}</h3>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="formBasicVerificationCode"
              >
                <Form.Label>Enter Your Verification Code:</Form.Label>
                <Form.Control
                  type="code"
                  placeholder="12345"
                  ref={(c) => (code = c)}
                />
              </Form.Group>
            </Form>
            <Button onClick={doVerification}>Submit</Button>{" "}
            <Link to="/register" className="btn btn-outline-primary">
              Register
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

export default Verification;
