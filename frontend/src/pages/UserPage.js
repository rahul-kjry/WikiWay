import React from "react";
import Sidebar from "../components/Sidebar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import UserInfo from "../components/UserInfo";

const UserPage = () => {
  return (
    <>
      <Container id="cont1">
        <Col xs={2}>
          <Sidebar />
        </Col>
        <Col>
          <Row xs={0} id="title">
            User
          </Row>
          <Row id="bodytext">
            <p>
              As is common with many applications, the user's <b>User</b>{" "}
              section is a way for them to access and change their personal
              information. This includes but is not limited to username,
              password, and email. The User section also gives users the
              opportunity to sign out of the WikiWay application if needed. In
              addition, a user's Profile can be used to view their personal
              leaderboard performance.
            </p>
          </Row>
          <Row>
            <UserInfo />
          </Row>
        </Col>
      </Container>
    </>
  );
};
export default UserPage;
