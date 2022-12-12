import mongoose, { mongo, Schema } from "mongoose";

const MutasiSchema = new Schema({
  no_rek: {
    type: String,
    required: true,
  },
  dari: {
    type: String,
    required: true,
  },
  ke: {
    type: String,
    required: true,
  },
  bulan: {
    type: Date,
    required: true,
  },
});

const Mutasi =
  mongoose.models.mutasi || mongoose.model("mutasi", MutasiSchema, "mutasi");

export default Mutasi;
