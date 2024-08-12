import React from "react";
import Sidebar from "../components/Sidebar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Link from "react-bootstrap/Button";

const PlayPage = () => {
  const begin = async (event) => {
    window.location.href = "/game";
  };

  return (
    <>
      <Container id="cont1">
        <Col xs={2}>
          <Sidebar />
        </Col>
        <Col>
          <Row xs={0} id="title">
            Play
          </Row>
          <Row id="bodytext">
            <p>
              What many would consider to be staple of the WikiWay site, the{" "}
              <b>Play</b> section bridges the gap between the menu and the true
              experience of WikiWay. Users who find themselves wanting to test
              their skills with a chance to gain recognition on the leaderboard
              all pass through here. (See "WikiWay game for more information.)
            </p>
          </Row>
          <Row id="table">
            <Button onClick={begin}>Play</Button>
          </Row>
        </Col>
      </Container>
    </>
  );
};
export default PlayPage;
