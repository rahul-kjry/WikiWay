const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5001;
app.set("port", process.env.PORT || 5001);
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectID } = require("bson");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const emailValidator = require("email-validator");
app.use(cors());
app.use(bodyParser.json());
const req = require("express/lib/request");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { start } = require("repl");
const { isNull } = require("util");
require("dotenv").config();
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  if (err) {
    console.log("Error connecting with database:\n" + err);
    client.close();
  }
});

let hasDeleteLeaderboardBeenQueued = false;

app.post("/api/login", async (req, res, next) => {
  var error = "";
  const login = req.body.login;
  const password = req.body.password;
  const db = client.db("largeProject");
  const results = await db
    .collection("users")
    .find({ login: login, password: password })
    .toArray();
  var id = "-1";
  var fn = "";
  var ln = "";
  var em = "";
  var success = false;

  if (results.length > 0) {
    success = true;
    id = results[0]._id;
    fn = results[0].firstName;
    ln = results[0].lastName;
    em = results[0].email;
  }
  var ret = {
    success: success,
    id: id,
    firstName: fn,
    lastName: ln,
    email: em,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/updateUser", async (req, res, next) => {
  var error = "";
  const login = req.body.login;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const db = client.db("largeProject");
  const results = await db
    .collection("users")
    .updateOne(
      { email: email },
      { $set: { firstName: firstName, lastName: lastName, login: login } }
    );

  var modifiedCount = 0;
  var matchedCount = "";
  var success = false;

  if (results != null) {
    matchedCount = results.matchedCount;
    modifiedCount = results.modifiedCount;
  }
  if (modifiedCount == 1) success = true;
  var ret = {
    success: success,
    modifiedCount: modifiedCount,
    matchedCount: matchedCount,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/register", async (req, res, next) => {
  const login = req.body.login;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const db = client.db("largeProject");

  const emailCheck = await db
    .collection("users")
    .find({ email: email })
    .toArray();
  if (emailCheck.length > 0) {
    var ret = {
      success: false,
      email: "",
      error: "Someone has already registered with this email.",
    };
    return res.status(200).json(ret);
  }
  const usernameCheck = await db
    .collection("users")
    .find({ login: login })
    .toArray();
  if (usernameCheck.length > 0) {
    var ret = {
      success: false,
      email: "",
      error: "Someone has already registered with this username.",
    };
    return res.status(200).json(ret);
  }

  const insert = await db.collection("users").insertOne({
    login: login,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
    verifiedEmail: false,
    playedGames: [],
    currentGame: {
      currentClicks: 0,
      currentPage: null,
      startPage: null,
      endPage: null,
      inGame: false,
      startTime: null,
    },
  });

  result = false;
  if (insert != null) {
    result = insert.acknowledged;
  }
  var ret = { success: result, email: email, error: "" };
  res.status(200).json(ret);
});

app.post("/api/sendVerificationEmail", async (req, res, next) => {
  var email = req.body.email;

  const db = client.db("largeProject");
  const results = await db.collection("users").find({ email: email }).toArray();

  if (results.length == 0) {
    var ret = {
      success: false,
      code: 0,
      error: "Email not associated with an account.",
    };
    return res.status(200).json(ret);
  }

  if (email && emailValidator.validate(email)) {
    var code = Math.floor(Math.random() * 90000) + 10000;
    console.log("Your Password is ");
    console.log(code);

    nodeoutlook.sendEmail({
      auth: {
        user: "rahul.test033@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      from: '"Rahul" <rahul.test033@gmail.com>',
      to: email,
      subject: "Email Verification Code",
      text: "Your verification code is " + code.toString() + ".",
    });

    const addCodeToDB = await db
      .collection("users")
      .updateOne({ email: email }, { $set: { emailVerificationCode: code } });

    var ret = { success: true, code: code, error: "" };
    res.status(200).json(ret);
  } else {
    if (email) {
      var ret = { success: false, code: 0, error: "email is invalid" };
      res.status(200).json(ret);
    } else {
      var ret = { success: false, code: 0, error: "email is null" };
      res.status(200).json(ret);
    }
  }
});

app.post("/api/sendPasswordResetEmail", async (req, res, next) => {
  var email = req.body.email;

  const db = client.db("largeProject");
  const results = await db.collection("users").find({ email: email }).toArray();

  if (results.length == 0) {
    var ret = {
      success: false,
      code: 0,
      error: "Email not associated with an account.",
    };
    return res.status(200).json(ret);
  }

  if (email && emailValidator.validate(email)) {
    var code = Math.floor(Math.random() * 90000) + 10000;
    console.log("Your Password is ");
    console.log(code);
    nodeoutlook.sendEmail({
      auth: {
        user: "rahul.test033@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
      },
      from: '"Rahul" <rahul.test033@gmail.com>',
      to: email,
      subject: "Password Reset Code",
      text: "Your password reset code is " + code.toString() + ".",
    });

    const addCodeToDB = await db
      .collection("users")
      .updateOne({ email: email }, { $set: { passwordResetCode: code } });

    var ret = { success: true, code: code, error: "" };
    res.status(200).json(ret);
  } else {
    if (email) {
      var ret = { success: false, code: 0, error: "email is invalid" };
      res.status(200).json(ret);
    } else {
      var ret = { success: false, code: 0, error: "email is null" };
      res.status(200).json(ret);
    }
  }
});

app.post("/api/verifyCode", async (req, res, next) => {
  const verifyEmail = req.body.verifyEmail;
  const email = req.body.email;
  const code = req.body.code;

  const db = client.db("largeProject");
  const results = await db.collection("users").find({ email: email }).toArray();

  if (results.length > 0) {
    if (verifyEmail && results[0].emailVerificationCode == code) {
      const removeCodeFromDB = await db
        .collection("users")
        .updateOne({ email: email }, { $unset: { emailVerificationCode: 0 } });
      const addVerifiedBool = await db
        .collection("users")
        .updateOne({ email: email }, { $set: { verifiedEmail: true } });
      var ret = { verified: true, error: "" };
      res.status(200).json(ret);
    } else if (!verifyEmail && results[0].passwordResetCode == code) {
      const removeCodeFromDB = await db
        .collection("users")
        .updateOne({ email: email }, { $unset: { passwordResetCode: 0 } });
      var ret = { verified: true, error: "" };
      res.status(200).json(ret);
    } else {
      var ret = { verified: false, error: "Code is incorrect." };
      res.status(200).json(ret);
    }
  } else {
    var ret = {
      verified: false,
      error: "Unable to find an account with that email.",
    };
    res.status(200).json(ret);
  }
});

app.post("/api/changePassword", async (req, res, next) => {
  const email = req.body.email;
  const newPassword = req.body.password;
  const db = client.db("largeProject");
  const results = await db
    .collection("users")
    .updateOne({ email: email }, { $set: { password: newPassword } });

  var ret = { success: true, error: "" };
  res.status(200).json(ret);
});

app.post("/api/getPlayedGames", async (req, res, next) => {
  var error = "";
  const email = req.body.email;
  const db = client.db("largeProject");
  const results = await db.collection("users").find({ email: email }).toArray();

  playedGames = [];
  if (results.length > 0) {
    playedGames = results[0].playedGames;

    playedGames.sort(function (a, b) {
      if (a.clicks - b.clicks == 0) return a.time - b.time;
      else return a.clicks - b.clicks;
    });
  } else {
    var ret = {
      playedGames: playedGames,
      email: email,
      error: "No accounts found with this email.",
    };
    return res.status(200).json(ret);
  }

  var ret = { playedGames: playedGames, email: email, error: "" };
  res.status(200).json(ret);
});

app.post("/api/updateCurrentGame", async (req, res, next) => {
  var error = "";
  const email = req.body.email;
  const currentPage = req.body.currentPage;

  const db = client.db("largeProject");
  const results = await db.collection("users").updateOne(
    { email: email },
    {
      $set: { "currentGame.currentPage": currentPage },
      $inc: { "currentGame.currentClicks": 1 },
    }
  );

  var modifiedCount = 0;
  var matchedCount = 0;
  var success = false;

  if (results != null) {
    matchedCount = results.matchedCount;
    modifiedCount = results.modifiedCount;
  }
  if (modifiedCount == 1) success = true;
  var ret = {
    success: success,
    modifiedCount: modifiedCount,
    matchedCount: matchedCount,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/resumeCurrentGame", async (req, res, next) => {
  var error = "";
  const email = req.body.email;

  const db = client.db("largeProject");
  const results = await db.collection("users").find({ email: email }).toArray();

  startPage = "";
  endPage = "";
  currentPage = "";
  clicks = "";
  inGame = false;

  if (results != null) {
    currentPage = results[0].currentGame.currentPage;
    startPage = results[0].currentGame.startPage;
    endPage = results[0].currentGame.endPage;
    clicks = results[0].currentGame.currentClicks;
    inGame = results[0].currentGame.inGame;
  }

  if (!inGame) {
    var ret = {
      inGame: inGame,
      currentPage: currentPage,
      startPage: startPage,
      endPage: endPage,
      clicks: clicks,
      error: "No information on current game.",
    };
  } else {
    var ret = {
      inGame: inGame,
      currentPage: currentPage,
      startPage: startPage,
      endPage: endPage,
      clicks: clicks,
      error: "",
    };
  }
  res.status(200).json(ret);
});

app.post("/api/startGame", async (req, res, next) => {
  var error = "";
  const email = req.body.email;
  const startPage = req.body.startPage;
  const endPage = req.body.endPage;

  var current = new Date();

  const db = client.db("largeProject");
  const results = await db.collection("users").updateOne(
    { email: email },
    {
      $set: {
        "currentGame.startPage": startPage,
        "currentGame.endPage": endPage,
        "currentGame.currentClicks": 0,
        "currentGame.inGame": true,
        "currentGame.startTime": current,
        "currentGame.currentPage": startPage,
      },
    }
  );

  var modifiedCount = 0;
  var matchedCount = 0;
  var success = false;

  if (results != null) {
    matchedCount = results.matchedCount;
    modifiedCount = results.modifiedCount;
  }
  if (modifiedCount == 1) success = true;
  var ret = {
    success: success,
    modifiedCount: modifiedCount,
    matchedCount: matchedCount,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/addPlayedGame", async (req, res, next) => {
  var error = "";
  const email = req.body.email;

  var current = new Date();

  const db = client.db("largeProject");

  const results = await db.collection("users").find({ email: email }).toArray();

  startPage = "";
  startTime = "";
  endPage = "";
  clicks = "";
  inGame = false;

  if (results != null) {
    startTime = results[0].currentGame.startTime;
    startPage = results[0].currentGame.startPage;
    endPage = results[0].currentGame.endPage;
    clicks = results[0].currentGame.currentClicks;
    inGame = results[0].currentGame.inGame;
  }

  if (!inGame) {
    var ret = {
      success: false,
      matchCount: -1,
      modified: -1,
      email: "",
      error: "No information on current game.",
    };
    res.status(200).json(ret);
    return;
  }

  totalTime = (current.getTime() - startTime.getTime()) / 1000;

  const postResult = await db.collection("users").updateOne(
    { email: email },
    {
      $push: {
        playedGames: {
          startPage: startPage,
          endPage: endPage,
          time: totalTime,
          clicks: clicks,
        },
      },
    }
  );

  db.collection("users").updateOne(
    { email: email },
    {
      $set: {
        "currentGame.startPage": null,
        "currentGame.endPage": null,
        "currentGame.currentPage": null,
        "currentGame.startTime": null,
        "currentGame.currentClicks": 0,
        "currentGame.inGame": false,
      },
    }
  );

  if (!hasDeleteLeaderboardBeenQueued) {
    hasDeleteLeaderboardBeenQueued = true;

    const leaderboardDB = client
      .db("largeProject")
      .collection("dailyLeaderboard");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const deleteLeaderboard = setTimeout(function () {
      leaderboardDB.deleteMany({});
      console.log("Daily leaderboard has been cleared.");
      hasDeleteLeaderboardBeenQueued = false;
    }, tomorrow.getTime() - Date.now());
  }

  const player = await db.collection("users").find({ email: email }).toArray();
  if (player.length == 0) {
    var ret = {
      success: false,
      matchCount: -1,
      modified: -1,
      email: "",
      error: "Could not find a player with that email.",
    };
    res.status(200).json(ret);
  }
  var username = player[0].login;
  if (email != "rickL@gmail.com") {
    const addGameToLeaderboard = await db
      .collection("dailyLeaderboard")
      .insertOne({
        login: username,
        startPage: startPage,
        endPage: endPage,
        time: totalTime,
        clicks: clicks,
      });
  }
  acknowledged = false;
  matchCount = 0;
  modified = 0;
  if (postResult != null) {
    acknowledged = postResult.acknowledged;
    matchCount = postResult.matchedCount;
    modified = postResult.modifiedCount;
  }
  var ret = {
    success: acknowledged,
    matchCount: matchCount,
    modified: modified,
    email: email,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/quitGame", async (req, res, next) => {
  var error = "";
  const email = req.body.email;

  var current = new Date();

  const db = client.db("largeProject");

  const postResult = await db.collection("users").updateOne(
    { email: email },
    {
      $set: {
        "currentGame.startPage": null,
        "currentGame.endPage": null,
        "currentGame.currentPage": null,
        "currentGame.startTime": null,
        "currentGame.currentClicks": 0,
        "currentGame.inGame": false,
      },
    }
  );

  acknowledged = false;
  matchCount = 0;
  modified = 0;
  if (postResult != null) {
    acknowledged = postResult.acknowledged;
    matchCount = postResult.matchedCount;
    modified = postResult.modifiedCount;
  }

  var ret = {
    success: acknowledged,
    matchCount: matchCount,
    modified: modified,
    email: email,
    error: "",
  };
  res.status(200).json(ret);
});

app.post("/api/getDailyLeaderboard", async (req, res, next) => {
  const numGames = parseInt(req.body.numGames);

  const db = client.db("largeProject");
  const sortLeaderboard = await db
    .collection("dailyLeaderboard")
    .find({})
    .sort({ clicks: 1, time: 1 })
    .limit(numGames)
    .toArray();

  var ret = { success: true, leaderboard: sortLeaderboard };
  res.status(200).json(ret);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});
