import mongoose, { Schema } from "mongoose";

const AnggotaSchema = new Schema({
  no_rek: {
    type: String,
    required: true,
  },
  nama_anggota: {
    type: String,
    required: true,
  },
  kode_ins: {
    type: String,
    required: true,
  },
});

const Anggota =
  mongoose.models.anggota ||
  mongoose.model("anggota", AnggotaSchema, "anggota");

export default Anggota;
