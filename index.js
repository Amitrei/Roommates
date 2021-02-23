import express from "express";
import mongoConnection from "./startup/mongoose.js";
import routes from "./startup/routes.js";
import "express-async-errors";
import { Server } from "socket.io";
// Connect to mongo with mongoose
mongoConnection();

//express
const app = express();
const port = process.env.PORT || 3002;

const appListen = app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
export default appListen;

//routes and middlewares
routes(app);

// socket
export const io = new Server(appListen, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket io is connected");
});
console.log(process.env.NODE_ENV);
