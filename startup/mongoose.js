import mongoose from "mongoose";

export default () => {
  mongoose.connect("mongodb://localhost:27017/amigos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const db = mongoose.connection;
  db.once("open", () => {
    console.log("logged succssesfuly to mongoDB");
  });
};
