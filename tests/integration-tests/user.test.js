import authCreateSession from "./authCreateSession.js";
import superagent from "superagent";
import expressServer from "../../index.js";
import { User } from "../../models/user.js";
import { userEntity } from "../../services/servicesManager.js";

// Using agent to store auth session
const agent = superagent.agent();
const API_URL = "http://localhost:3002/api/users";

let server;
let currentUser;
describe("API /users route", () => {
  beforeEach(async () => {
    server = expressServer;
    await authCreateSession(agent).login();
    const { body } = await authCreateSession(agent).getUser();
    currentUser = body;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("POST / - creating a user", async () => {
    it("Should create a user and return user and a status 200", async () => {
      const userObj = { email: "randomEmail@gmail.com", googleId: 1 };

      await superagent
        .post(API_URL)
        .send(userObj)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.email).toBe(userObj.email);
        });
    });
  });

  describe("GET / - getting current user in session details", () => {
    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .get(API_URL)
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should return current user in session details with status 200", async () => {
      await agent.get(API_URL).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(currentUser);
      });
    });
  });

  describe("PATCH / - updating current user in session details", () => {
    it("Should return 401 if user aint logged in ", async () => {
      await superagent
        .patch(API_URL)
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should update the user and return the updated object with status 200", async () => {
      const updateRequest = { email: "updatedEmail@gmail.com" };
      await agent
        .patch(API_URL)
        .send(updateRequest)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.email).toBe(updateRequest.email);
        });
    });
  });

  describe("DELETE / - deleting the current user from DB", () => {
    it("Should return 401 if user aint logged in ", async () => {
      await superagent
        .delete(API_URL)
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should delete the user from DB and response with status 202", async () => {
      await agent.delete(API_URL).then((res) => {
        expect(res.status).toBe(202);
        expect(res.body).toMatchObject(currentUser);
      });
    });
  });
});
