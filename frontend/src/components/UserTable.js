import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

export default class UserInfo extends Component {
  constructor() {
    //add userid as parameter, so that we can populate data from constructor??
    super();
    this.state = {
      user: {},
      games: [],
    };
  }

  componentDidMount() {
    //var user = localStorage.getItem('user_data');
    //this.setState(this.user, JSON.parse(user));
    this.getData();
  }

  getData = async () => {
    try {
      var obj = { email: JSON.parse(localStorage.getItem("user_data")).email };
      var js = JSON.stringify(obj);
      var response = await fetch(buildPath("api/getPlayedGames"), {
        method: "POST",
        body: js,
        headers: { "Content-Type": "application/json" },
      });
      var res = JSON.parse(await response.text());
      //console.log(res);

      var tempGames = "";

      //Only display top 10 if there is more than 10
      var length = res.playedGames.length > 10 ? 10 : res.playedGames.length;

      const suffix = [' id="tableRow1"', ' id="tableRow2"'];

      for (let i = 0; i < length; i++) {
        tempGames +=
          " <tr " +
          suffix[i % 2] +
          "> <td>" +
          (i + 1) +
          "</td>" +
          " <td>" +
          res.playedGames[i].clicks +
          "</td>" +
          " <td>" +
          res.playedGames[i].time +
          "</td>" +
          " <td>" +
          res.playedGames[i].startPage +
          "</td>" +
          " <td>" +
          res.playedGames[i].endPage +
          "</td> </tr>";
      }

      this.setState({ games: tempGames });
    } catch (e) {
      alert(e.toString());
    }
  };

  render() {
    return (
      <>
        <Table striped bordered hover id="userTable">
          <thead>
            <tr id="head">
              <th>Personal Rank</th>
              <th>Clicks</th>
              <th>Time</th>
              <th>Start-Page</th>
              <th>End-Page</th>
            </tr>
          </thead>
          <tbody dangerouslySetInnerHTML={{ __html: this.state.games }}></tbody>
        </Table>
      </>
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
