import mongoose, { Schema } from "mongoose";

const instansiSchema = new Schema({
  nama_ins: {
    type: String,
    required: true,
  },
  kode_ins: {
    type: String,
    required: true,
  },
});

const Instansi =
  mongoose.models.instansi ||
  mongoose.model("instansi", instansiSchema, "instansi");

export default Instansi;
