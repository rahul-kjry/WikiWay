import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

var globalPages = { start_title: "", end_title: "", current_title: "" };

class GameDiv extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      modal: false,
    };
  }

  async componentDidMount() {
    // Get Start page title
    fetch("https://en.wikipedia.org/api/rest_v1/page/random/title")
      .then((response) => response.json())
      .then((findresponse) => {
        const temp = findresponse.items[0].title;
        return temp;
      })
      .then(function (value) {
        localStorage.setItem("start_page", value);
        localStorage.setItem("current_page", value);
      });

    //Get end game title
    fetch("https://en.wikipedia.org/api/rest_v1/page/random/title")
      .then((response) => response.json())
      .then((findresponse) => {
        const temp = findresponse.items[0].title;
        return temp;
      })
      .then(function (value) {
        localStorage.setItem("end_page", value);
      });

    var startobj = {
      email: JSON.parse(localStorage.getItem("user_data")).email,
      startPage: localStorage.getItem("start_page"),
      endPage: localStorage.getItem("end_page"),
    };
    var startjs = JSON.stringify(startobj);
    try {
      const startresponse = await fetch(buildPath("api/startGame"), {
        method: "POST",
        body: startjs,
        headers: { "Content-Type": "application/json" },
      });
      var startres = JSON.parse(await startresponse.text());
      if (startres.success == false) {
        console.log(startres.error);
      }
    } catch (e) {
      console.log(e);
    }

    var page = {
      start_title: localStorage.getItem("start_page"),
      end_title: localStorage.getItem("end_page"),
      current_title: localStorage.getItem("start_page"),
    };

    globalPages = page;

    document.getElementById("startDiv").innerHTML =
      "<p><b>StartPage: </b> " +
      globalPages.start_title.replaceAll("_", " ") +
      "</p>";
    document.getElementById("endDiv").innerHTML =
      "<p><b>EndPage: </b> " +
      globalPages.end_title.replaceAll("_", " ") +
      "</p>";
    this.UserAction(globalPages.start_title);

    //The previous code may seem unecessary BUT IT IS NECESSARY. Please do not change, the pages were being set to different values once UserAction is called every game.
  }

  UserAction = async (pageTitle) => {
    globalPages.current_title = pageTitle;

    if (localStorage.getItem("running_game")) {
      localStorage.removeItem("running_game");
      localStorage.setItem("running_game", globalPages);
    } else {
      localStorage.setItem("running_game", globalPages);
    }

    //Complete Game
    if (
      encodeURIComponent(pageTitle) == encodeURIComponent(globalPages.end_title)
    ) {
      //Finish by contacting API with end game call
      var winobj = {
        email: JSON.parse(localStorage.getItem("user_data")).email,
      };
      var winjs = JSON.stringify(winobj);
      try {
        const winresponse = await fetch(buildPath("api/addPlayedGame"), {
          method: "POST",
          body: winjs,
          headers: { "Content-Type": "application/json" },
        });
        var winres = JSON.parse(await winresponse.text());
        if (winres.success == false) {
          console.log(winres.error);
        } else {
          this.setState({ modal: true });
        }
      } catch (e) {
        console.log(e);
      }
    }

    let xhttp = new XMLHttpRequest();
    xhttp.open(
      "GET",
      "https://en.wikipedia.org/w/api.php?action=parse&page=" +
        pageTitle +
        "&prop=text&formatversion=2&format=json&origin=*",
      true
    );
    xhttp.send();
    xhttp.onload = () => {
      if (xhttp.status == 200) {
        this.gotData(JSON.parse(xhttp.response));
      } else {
        console.log("error " + xhttp.status + ": " + xhttp.statusText);
      }
    };

    window.scrollTo(0, 0);
  };

  WhichLinkWasClicked = async (evt) => {
    // Dont follow the link
    evt.preventDefault();

    // Get the link's target wiki page
    var str = evt.target;
    str = typeof str !== "string" ? str.toString() : str;
    var afterLastSlash = str.split("/").pop();

    var updateobj = {
      email: JSON.parse(localStorage.getItem("user_data")).email,
      currentPage: afterLastSlash,
    };
    var updatejs = JSON.stringify(updateobj);
    try {
      const updateresponse = await fetch(buildPath("api/updateCurrentGame"), {
        method: "POST",
        body: updatejs,
        headers: { "Content-Type": "application/json" },
      });
      var updateres = JSON.parse(await updateresponse.text());
      if (updateres.success == false) {
        console.log(updateres.error);
      }
    } catch (e) {
      console.log(e);
    }

    // Increment count
    //this.upper();
    this.setState({ count: this.state.count + 1 });

    // Start the process over, at the new page
    this.UserAction(afterLastSlash);
  };

  gotData = (data) => {
    // Log data for testing purposes
    //console.log(data);

    // Get the HTML of the Wiki page from JSON
    var text = data.parse.text;
    // Get the title of the Wiki page from JSON
    var title = data.parse.title;

    var gameDoc = document.getElementById("gameDiv");

    // Set the gameDiv to blank to clear any previous Wiki page data
    gameDoc.innerHTML = "";

    // Add both the title and the body of the Wiki page
    gameDoc.innerHTML = "<h1 class='mw-headline'>" + title + "</h1>" + text;

    // Remove problematic elements (images, table of contents, refrences, edit buttons, etc.)
    const classesToRemove = [
      ".thumb",
      ".sistersitebox",
      ".mw-editsection",
      ".toc",
      ".reflist",
      ".reference",
      ".infobox",
      ".image",
      ".dmbox",
      ".box-Multiple_issues",
      ".sidebar-navbar",
      ".mbox-small",
    ];
    for (var i = 0; i < classesToRemove.length; i++) {
      gameDoc.querySelectorAll(classesToRemove[i]).forEach((e) => e.remove());
    }

    // remove refrence section. this section is not targetable by class like the rest, so we have to use it's ID
    var refElement = document.getElementById("References");
    // If it isn't "undefined" and it isn't "null", then it exists.
    if (typeof refElement != "undefined" && refElement != null) {
      document.getElementById("References").remove();
    }

    // Add event listener to all links
    var links = gameDoc.querySelectorAll("a");
    for (var c = 0; c < links.length; c++) {
      links[c].addEventListener("click", this.WhichLinkWasClicked);
    }
  };

  quitGame = async () => {
    var quitobj = {
      email: JSON.parse(localStorage.getItem("user_data")).email,
    };
    var quitjs = JSON.stringify(quitobj);
    try {
      const quitresponse = await fetch(buildPath("api/quitGame"), {
        method: "POST",
        body: quitjs,
        headers: { "Content-Type": "application/json" },
      });
      var quitres = JSON.parse(await quitresponse.text());
      if (quitres.success == true) {
        window.location.href = "/main";
      } else {
        console.log(quitres.error);
      }
    } catch (e) {
      console.log(e);
    }
  };

  quit = () => {
    this.state.modal = false;
    window.location.href = "/main";
  };
  leaderboard = () => {
    this.state.modal = false;
    window.location.href = "/leaderboard";
  };

  render() {
    return (
      <>
        <Modal
          show={this.state.modal}
          backdrop="static"
          keyboard={false}
          centered
          size="md"
        >
          <Modal.Header>
            <Modal.Title>
              <b>Congratulations!</b>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            You won! It took you <b>{this.state.count}</b> clicks.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="warning" onClick={this.leaderboard}>
              Go to Leaderboard
            </Button>
            <Button variant="outline-danger" onClick={this.quit}>
              Quit
            </Button>
          </Modal.Footer>
        </Modal>

        <Row id="newRow3">
          <Col>
            <p class="score" id="score">
              Number of Links Clicked: {this.state.count}
            </p>
          </Col>
          <Col>
            <Button onClick={this.quitGame} id="quitBtn">
              Quit
            </Button>
          </Col>
        </Row>
        <Row>
          <div id="gameDiv" class="gameDiv" />
        </Row>
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

export default GameDiv;
