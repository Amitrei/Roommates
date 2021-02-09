import superagent from "superagent";
import mongoose from "mongoose";
import { Room } from "../../models/room.js";
import authCreateSession from "./authCreateSession.js";
import expressServer from "../../index.js";
// Using agent to store auth session 
const agent = superagent.agent();

const API_URL = "http://localhost:3002/api/rooms";

let server;

describe("/api/rooms", () => {
  beforeEach(() => {
    server = expressServer;
  });
  afterEach(async () => {
    await Room.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("POST /", () => {
    it("Should return 401 if user aint logged in", async () => {
      const room = {
        name: "My Room",
      };
      await superagent
        .post(API_URL)
        .send(room)
        .end((err, res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should create a room if user is logged in and response with 200 status", async () => {
      // Creating a mocked user session
      await authCreateSession(agent);
      await agent
        .post(API_URL)
        .send({ name: "myRoom" })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("myRoom");
        });
    });
  });

  describe("DELETE /:id", () => {
    const createRoom = async (adminId) => {
      return await new Room({
        name: "newRoom",
        admin: adminId,
      }).save();
    };

    it("Should return 401 if user aint logged in", async () => {
      const room = await createRoom("60134d59bd81d4148296d3d3");

      await superagent
        .delete(`${API_URL}/${room._id}`)
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return 401 if user is not the admin of the room", async () => {
      // Not the current session mocked user id
      const room = await createRoom("60134d59bd81d4148296d3d5");

      // Creating session
      await authCreateSession(agent);

      await agent
        .delete(`${API_URL}/${room._id}`)
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return the deleted room name with response status 202", async () => {
      await authCreateSession(agent);
      await agent.get("http://localhost:3002/api/auth/show").then((res) => console.log(res.req));
      // Creating room
      // await agent.delete(`${API_URL}/${room._id}`);
    });
  });
});
