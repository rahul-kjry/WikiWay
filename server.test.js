const { Int32 } = require("mongodb");
const request = require("supertest");
const server = 'http://localhost:5001';

describe("POST /api/login", function() {
    it('responds with 200', async function() {
        const response = await request(server).post("/api/login").send({
            login: "a",
            password: "b"
        })
        expect(response.statusCode).toBe(200)
    });
  });

describe("POST /api/login", function() {
    it("Verify unregisted account is not logged in", async function() {
        const response = await request(server).post("/api/login").send({
            login: "fshlfjasjdkl",
            password: "dsdbaj,msadd"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toEqual("-1")
    });
});

describe("POST /api/register", function() {
    it("Verify register user works for only new emails", async function() {
        const response = await request(server).post("/api/register").send({
            login: "rickL",
            password: "rickL",
            firstName: "Rick",
            lastName: "L",
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(false)
    });
});

verificationCode = ''

describe("POST /api/sendVerificationEmail", function() {
    it("Test if verification code is generated", async function() {
        const response = await request(server).post("/api/sendVerificationEmail").send({
            email: "rickL@gmail.com",
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        verificationCode = response.body.code
    });
});

describe("POST /api/verifyCode", function() {
    it("Test if the code generated matches the players", async function() {
        const response = await request(server).post("/api/verifyCode").send({
            verifyEmail: true,
            email: "rickL@gmail.com",
            code: verificationCode
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.verified).toBe(true)
    });
});

describe("POST /api/verifyCode", function() {
    it("Test to make sure false code generated does not verify players", async function() {
        const response = await request(server).post("/api/verifyCode").send({
            verifyEmail: true,
            email: "rickL@gmail.com",
            code: 1
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.verified).toBe(false)
    });
});

describe("POST /api/changePassword", function() {
    it("Change players password", async function() {
        const response = await request(server).post("/api/changePassword").send({
            email: "rickL@gmail.com",
            password: "123"
        })
        expect(response.statusCode).toBe(200)
    });
});


describe("POST /api/login", function() {
    it('Login after changing password', async function() {
        const response = await request(server).post("/api/login").send({
            login: "rickL",
            password: "123"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
    });
});

describe("POST /api/updateUser", function() {
    it('Update user info', async function() {
        const response = await request(server).post("/api/updateUser").send({
            login: "ricky123",
            firstName: "Ricky",
            lastName : "Lin",
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
    });
});

describe("POST /api/login", function() {
    it('Login after changing username', async function() {
        const response = await request(server).post("/api/login").send({
            login: "ricky123",
            password: "123"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
    });
});

request(server).post("/api/updateUser").send({
    login: "rickL",
    firstName: "Rick",
    lastName: "L",
    email: "rickL@gmail.com"
})


describe("POST /api/startGame", function() {
    it('Making sure start game finds player', async function() {
        const response = await request(server).post("/api/startGame").send({
            email: "rickL@gmail.com",
            startPage : "start page",
            endPage : "end page"

        })
        expect(response.statusCode).toBe(200)
        expect(response.body.modifiedCount).toBe(1)
    });
});

describe("POST /api/startGame", function() {
    it('Making sure start game returns error for non existing email', async function() {
        const response = await request(server).post("/api/startGame").send({
            email: "sddsasdajljksd",
            startPage : "start page",
            endPage : "end page"

        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(false)
    });
});

describe("POST /api/updateCurrentGame", function() {
    it('Making sure the update current game', async function() {
        const response = await request(server).post("/api/updateCurrentGame").send({
            email: "rickL@gmail.com",
            currentPage : "current page"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.modifiedCount).toBe(1)

    });
});

describe("POST /api/updateCurrentGame", function() {
    it('Making sure the update current game does not work for non existing email', async function() {
        const response = await request(server).post("/api/updateCurrentGame").send({
            email: "dhsaklhudwqwq",
            currentPage : "current page"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(false)

    });
});

describe("POST /api/resumeCurrentGame", function() {
    it('Making sure the daily leaderboard is being returned', async function() {
        const response = await request(server).post("/api/resumeCurrentGame").send({
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.currentPage).toBe("current page")
        expect(response.body.startPage).toBe("start page")
        expect(response.body.endPage).toBe("end page")
        expect(response.body.clicks).toBe(1)

    });
});

describe("POST /api/addPlayedGame", function() {
    it("Verify games may be added to players profiles", async function() {
        const response = await request(server).post("/api/addPlayedGame").send({
            email: "rickL@gmail.com",
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
        expect(response.body.modified).toBe(1)
    });
});

describe("POST /api/getPlayedGames", function() {
    it("Verify games may be retreived from player profiles", async function() {
        const response = await request(server).post("/api/getPlayedGames").send({
            email: "rickL@gmail.com",
        })
        leng = response.body.playedGames.length - 1
        expect(response.statusCode).toBe(200)
        expect(response.body.playedGames[leng].clicks).toBe(1)
    });
});


describe("POST /api/getPlayedGames", function() {
    it("Verify games will not be retreived from player profile if email does not exist", async function() {
        const response = await request(server).post("/api/getPlayedGames").send({
            email: "dssadsafgeracasf",
        })
        leng = response.body.playedGames.length - 1
        expect(response.statusCode).toBe(200)
        expect(response.body.error).toBe("No accounts found with this email.")
    });
});


describe("POST /api/resumeCurrentGame", function() {
    it('Making sure resume game does not work if there is no current game', async function() {
        const response = await request(server).post("/api/resumeCurrentGame").send({
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.currentPage).toBe(null)
    });
});

request(server).post("/api/startGame").send({
    email: "rickL@gmail.com",
    startPage : "start page",
    endPage : "end page"
})

describe("POST /api/quitGame", function() {
    it('Testing quit game', async function() {
        const response = await request(server).post("/api/startGame").send({
            email: "rickL@gmail.com",
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
    });
});

describe("POST /api/resumeCurrentGame", function() {
    it('Making sure resume game does not work after quiting', async function() {
        const response = await request(server).post("/api/resumeCurrentGame").send({
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.currentPage).toBe(null)
    });
});


describe("POST /api/getDailyLeaderboard", function() {
    it('Making sure the daily leaderboard is being returned', async function() {
        const response = await request(server).post("/api/getDailyLeaderboard").send({
            numGames: 10
        })
        expect(response.statusCode).toBe(200)
    });
});

describe("POST /api/updateUser", function() {
    it('Revert user info back', async function() {
        const response = await request(server).post("/api/updateUser").send({
            login: "rickL",
            firstName: "Rick",
            lastName: "L",
            email: "rickL@gmail.com"
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.success).toBe(true)
    });
});
describe("POST /api/changePassword", function() {
    it("Revert players password", async function() {
        const response = await request(server).post("/api/changePassword").send({
            email: "rickL@gmail.com",
            password: "Password"
        })
        expect(response.statusCode).toBe(200)
    });
});
