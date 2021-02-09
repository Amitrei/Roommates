import mongoose from "mongoose";

export default () => {
  const env = process.env.NODE_ENV;
  const dbUrl = env === "TEST" ? process.env.TEST_DB_URL : process.env.DB_URL;

  mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  const db = mongoose.connection;
  db.once("open", () => {
    console.log("logged succssesfuly to mongoDB");
    console.log(dbUrl);
  });
};
