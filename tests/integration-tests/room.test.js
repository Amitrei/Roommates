import superagent from "superagent";
import mongoose from "mongoose";
import { Room } from "../../models/room.js";
import { User } from "../../models/user.js";
import { roomService } from "../../services/servicesManager.js";
import authCreateSession from "./authCreateSession.js";
import expressServer from "../../index.js";

// Using agent to store auth session
const agent = superagent.agent();
const API_URL = "http://localhost:3002/api/rooms";
const fakeObjectId = "60134d59bd81d4148246d2d5";

let server;
let currentUser;

const createRoom = async (adminId) => {
  return await new Room({
    name: "newRoom",
    admin: adminId,
  }).save();
};

describe("/api/rooms", () => {
  beforeAll(async () => {
    await authCreateSession(agent).login();
    const { body } = await authCreateSession(agent).getUser();
    currentUser = body;
  });

  beforeEach(() => {
    server = expressServer;
  });
  afterEach(async () => {
    await Room.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("POST / - adding new room", () => {
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
      await agent
        .post(API_URL)
        .send({ name: "myRoom" })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("myRoom");
        });
    });
  });

  describe("DELETE /:id - deleting a room", () => {
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

      await agent
        .delete(`${API_URL}/${room._id}`)
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return the deleted room name with response status 202", async () => {
      // creating room in order to check the delete route
      const room = await createRoom(currentUser._id);

      await agent.delete(`${API_URL}/${room._id}`).then((res) => {
        expect(res.status).toBe(202);
        expect(res.body.name).toBe(room.name);
      });
    });
  });

  describe("POST /:id/members/:memberId - adding a member", () => {
    const CurrentApiURL = (roomId, memberId) => `${API_URL}/${roomId}/members/${memberId}`;

    it("Should return 401 if user aint logged in", async () => {
      // Creating a room and a user
      const room = await createRoom(currentUser._id);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();
      await superagent
        .post(CurrentApiURL(room._id, user._id))
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should return 401 if user aint the admin of the room", async () => {
      const room = await createRoom(fakeObjectId);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();

      await agent
        .post(CurrentApiURL(room._id, user._id))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should add a new member if current user session is the admin", async () => {
      const room = await createRoom(currentUser._id);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();

      await agent.post(CurrentApiURL(room._id, user._id)).then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.members[0].toString()).toBe(user._id.toString());
      });
    });
  });

  describe("DELETE /:id/members/:memberId - deleteing a member", () => {
    const CurrentApiURL = (roomId, memberId) => `${API_URL}/${roomId}/members/${memberId}`;

    it("Should return 401 if user aint logged in", async () => {
      // Creating a room and a user
      const room = await createRoom(currentUser._id);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();
      await superagent
        .delete(CurrentApiURL(room._id, user._id))
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should return 401 if user aint the admin of the room", async () => {
      const room = await createRoom(fakeObjectId);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();

      await agent
        .delete(CurrentApiURL(room._id, user._id))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should remove the member from the room and responsed with status 200", async () => {
      const room = await createRoom(currentUser._id);
      const user = await new User({ email: "mockedUser", googleId: 111 }).save();
      const memberAdded = await roomService.addMember(room._id, user._id);

      if (memberAdded) {
        await agent.delete(CurrentApiURL(room._id, user._id)).then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.members.length).toBe(0);
        });
      }
    });
  });

  describe("PUT /:id - updating room name", () => {
    const CurrentApiURL = (roomId) => `${API_URL}/${roomId}`;

    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .put(CurrentApiURL("1111"))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return 401 if user aint the admin of the room", async () => {
      const room = await createRoom(fakeObjectId);

      await agent
        .put(CurrentApiURL(room._id))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should update the room id if the user is logged in and admin", async () => {
      const room = await createRoom(currentUser._id);
      await agent
        .put(CurrentApiURL(room._id))
        .send({ name: "updatedName" })
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.name).toBe("updatedName");
        });
    });
  });
});
