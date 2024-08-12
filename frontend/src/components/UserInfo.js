import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserTable from "../components/UserTable";

var user = {};
var firstName;
var lastName;
var login;

export default class UserInfo extends Component {
  constructor() {
    super();
    this.state = {
      //user: {}
    };
    this.getUsr();
  }

  getUsr = () => {
    var obj = localStorage.getItem("user_data");
    user = JSON.parse(obj);
    firstName = user.firstName;
    lastName = user.lastName;
    login = user.login;
  };

  firstNameChange(event) {
    firstName = event.target.value;
  }

  lastNameChange = async (event) => {
    lastName = event.target.value;
  };

  loginChange = async (event) => {
    login = event.target.value;
  };

  doUpdate = async (event) => {
    event.preventDefault();
    console.log("updating...");
    var newInfo = {
      login: login,
      firstName: firstName,
      lastName: lastName,
      email: user.email,
    };

    // Reset localStorage
    var tempObj = {
      firstName: newInfo.firstName,
      lastName: newInfo.lastName,
      id: user.id,
      email: user.email,
      login: newInfo.login,
    };
    localStorage.removeItem("user_data");
    localStorage.setItem("user_data", JSON.stringify(tempObj));
    //End reset localStorage

    console.log(newInfo);
    var js = JSON.stringify(newInfo);
    console.log(js);

    try {
      const response = await fetch(buildPath("api/updateUser"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
    } catch (e) {
      document.getElementById("errUser").innerHTML = e.toString();
      return;
    }

    document.getElementById("errUser").innerHTML =
      "<span style='color: green;'>Success</span>";
  };

  render() {
    return (
      <div className="d-flex flex-row">
        <Col id="userinfocol" xs={4}>
          <Row xs={0} id="titleSecondary">
            Update Info
          </Row>
          <Form>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                value={user.email}
                disabled
                id="userinfotext"
              />
            </Form.Group>
            <Form.Label id="userLabel">First Name</Form.Label>
            <Form.Group className="mb-3">
              <Form.Control
                type="name"
                defaultValue={firstName}
                id="userinfotext"
                onChange={this.firstNameChange}
              />
            </Form.Group>
            <Form.Label id="userLabel">Last Name</Form.Label>
            <Form.Group className="mb-3">
              <Form.Control
                type="name"
                defaultValue={lastName}
                id="userinfotext"
                onChange={this.lastNameChange}
              />
            </Form.Group>
            <Form.Label id="userLabel">Username</Form.Label>
            <Form.Group className="mb-3">
              <Form.Control
                type="username"
                defaultValue={login}
                id="userinfotext"
                onChange={this.loginChange}
              />
            </Form.Group>
          </Form>
          <Button id="userinfobutton" onClick={this.doUpdate}>
            Update
          </Button>{" "}
          <div id="errUser"></div>
        </Col>
        <Col id="userinfocol2">
          <Row xs={0} id="titleSecondary2">
            User Top 10
          </Row>
          <Row>
            <UserTable />
          </Row>
        </Col>
      </div>
    );
  }
}

const app_name = "wikiway-cop4331";
function buildPath(route) {
  if (process.env.NODE_ENV === "production") {
    return "https://" + app_name + ".herokuapp.com/" + route;
  } else {
    return "http://localhost:5001/" + route;
  }
}
