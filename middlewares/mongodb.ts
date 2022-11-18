import mongoose, { Mongoose } from "mongoose";

const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const connect = async () => {
  //   const mongodburi = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.yesqe.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
  const mongodburi =
    "mongodb://localhost:27017/kop-bangkit?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

  const conn = await mongoose
    .connect(mongodburi as string)
    .then((res) => console.log("Connection established"))
    .catch((err) => console.log(err));

  return { conn };
};
