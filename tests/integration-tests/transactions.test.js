import superagent from "superagent";
import mongoose from "mongoose";
import expressServer from "../../index.js";
import authCreateSession from "./authCreateSession.js";
import { createRoom, fakeObjectId } from "./testsUtils.js";
import { Transaction } from "../../models/transaction.js";
import { User } from "../../models/user.js";
import { Room } from "../../models/room.js";
import { roomService } from "../../services/servicesManager.js";
import { transactionService } from "../../services/servicesManager.js";

// Using agent to store auth session
const agent = superagent.agent();
const API_URL = "http://localhost:3002/api/transactions";

let server;
let currentUser;
describe("api/transactions route", () => {
  beforeEach(async () => {
    server = expressServer;
    await authCreateSession(agent).login();
    const { body } = await authCreateSession(agent).getUser();
    currentUser = body;
  });

  afterEach(async () => {
    await Transaction.deleteMany({});
    await User.deleteMany({});
    await Room.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
    await mongoose.connection.close();
  });

  describe("POST /:roomId - adding new transaction", () => {
    const currentApiURL = (roomId) => `${API_URL}/${roomId}`;

    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .post(currentApiURL(fakeObjectId))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return 401 is user logged in but not a member of the specific room", async () => {
      const room = await createRoom(fakeObjectId);
      await agent
        .post(currentApiURL(room._id))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should create and return the new transaction and response status of 200 if user is logged and a member", async () => {
      const room = await roomService.createRoom({ name: "roomName", admin: currentUser._id });

      // updating session user to include the new roomId
      await authCreateSession(agent).login();
      currentUser = (await authCreateSession(agent).getUser()).body;

      const transactionObj = { amount: 100, category: 1 };
      await agent
        .post(currentApiURL(room._id))
        .send(transactionObj)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body).toMatchObject(transactionObj);
        });
    });
  });

  describe("DELETE /:roomId/:transId - deleting transactions", () => {
    const currentApiURL = (roomId, transId) => `${API_URL}/${roomId}/${transId}`;

    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .delete(currentApiURL(11, 11))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return 401 if user logged in but not the owner of the transaction", async () => {
      const room = await createRoom(fakeObjectId);
      const transaction = await new Transaction({
        amount: 100,
        category: 1,
        madeBy: fakeObjectId,
        roomId: room._id,
      }).save();

      await agent
        .delete(currentApiURL(room._id, transaction._id))
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should delete transaction if user logged and he is the owner of the transaction", async () => {
      const room = await roomService.createRoom({ name: "newRoom", admin: currentUser._id });

      // updating the local user session
      await authCreateSession(agent).login();
      currentUser = (await authCreateSession(agent).getUser()).body;

      const transaction = await transactionService.createTransaction({
        amount: 100,
        category: 1,
        madeBy: currentUser._id,
        roomId: room._id.toString(),
      });

      await agent.delete(currentApiURL(room._id, transaction._id)).then((res) => {
        const { body } = res;
        expect(body.amount).toBe(100);
        expect(body._id.toString()).toBe(transaction._id.toString());
        expect(body.madeBy.toString()).toBe(currentUser._id.toString());
        expect(res.status).toBe(202);
      });
    });
  });

  describe("PATCH /:transId - updating transaction", () => {
    const currentApiURL = (transId) => `${API_URL}/${transId}`;

    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .patch(currentApiURL(11))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    it("Should return 401 if user logged in but not the owner of the transaction", async () => {
      const room = await createRoom(fakeObjectId);
      const transaction = await new Transaction({
        amount: 100,
        category: 1,
        madeBy: fakeObjectId,
        roomId: room._id,
      }).save();

      await agent
        .patch(currentApiURL(transaction._id))
        .ok((res) => res.status === 401)
        .then((res) => expect(res.status).toBe(401));
    });

    it("Should update the transaction if user logged and he is the owner of the transaction", async () => {
      const room = await roomService.createRoom({ name: "newRoom", admin: currentUser._id });

      // updating the local user session
      await authCreateSession(agent).login();
      currentUser = (await authCreateSession(agent).getUser()).body;

      const transaction = await transactionService.createTransaction({
        amount: 100,
        category: 1,
        madeBy: currentUser._id,
        roomId: room._id.toString(),
      });

      const updatedTransaction = { amount: 150, category: 99 };

      await agent
        .patch(currentApiURL(transaction._id))
        .send(updatedTransaction)
        .then((res) => {
          const { body } = res;
          expect(body.amount).toBe(updatedTransaction.amount);
          expect(body.category).toBe(updatedTransaction.category);
          expect(res.status).toBe(200);
        });
    });
  });

  describe("GET /user/:userId - get user transactions", () => {
    const currentApiURL = (userId) => `${API_URL}/user/${userId}`;

    it("Should return 401 if user aint logged in", async () => {
      await superagent
        .get(currentApiURL(fakeObjectId))
        .ok((res) => res.status === 401)
        .then((res) => {
          expect(res.status).toBe(401);
        });
    });

    // *TODO STOPED HERE
    it("Should get all the giving user transactions", async () => {});
  });
});
