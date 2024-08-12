import React from "react";
import Sidebar from "../components/Sidebar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LongBriskCormorant from "../components/LongBriskCormorant.mp4";

const MainPage = () => {
  var hello = localStorage.getItem("user_data");

  return (
    <>
      <Container id="cont1">
        <Col xs={2}>
          <Sidebar />
        </Col>
        <Col>
          <Row xs={0} id="title">
            Welcome (Welcome back {JSON.parse(hello).firstName})
          </Row>
          <Row id="bodytext">
            <p>
              The <b>Welcome</b> page of WikiWay. This page provides users with
              information regarding their previous games, such as the starting
              point, ending point, amount of links used, and total time (in the
              case of a tie). Players are encouraged to explore the rest of
              WikiWay from this location, with special emphasis being directed
              to the Play section. Players on this page are also thanked for
              joining the WikiWay community.
            </p>
          </Row>
          <Row>
            <Col>
              <video
                width="640"
                height="420"
                autoPlay="yes"
                muted="yes"
                loop="yes"
              >
                <source src={LongBriskCormorant} type="video/mp4"></source>
              </video>
            </Col>
          </Row>
        </Col>
      </Container>
    </>
  );
};
export default MainPage;
