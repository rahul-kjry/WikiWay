import React from "react";
import Sidebar from "../components/Sidebar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Leaderboard from "../components/Leaderboard";

const LeaderboardPage = () => {
  return (
    <>
      <Container id="cont1">
        <Col xs={2}>
          <Sidebar />
        </Col>
        <Col>
          <Row xs={0} id="title">
            Leaderboard
          </Row>
          <Row id="bodytext">
            <p>
              This section of the WikiWay application is dedicated to the
              tracking of outstanding player scores. The <b> Leaderboard</b> is
              a list of all of the highest performing users scores within the
              latest 24-hour period. A user's performance is primarily based how
              many links were clicked to get from the starting page to the
              ending page and secondarily based on time in the event of a tie.
              As previously stated, the Leaderboard is completely reset every 24
              hours.
            </p>
          </Row>
          <Row id="table">
            <Leaderboard />
          </Row>
        </Col>
      </Container>
    </>
  );
};
export default LeaderboardPage;
