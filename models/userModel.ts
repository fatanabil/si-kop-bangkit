import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Users =
  mongoose.models.users || mongoose.model("users", usersSchema, "users");

export default Users;
