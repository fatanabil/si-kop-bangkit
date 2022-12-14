import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../middlewares/mongodb";
import verifyToken from "../../middlewares/tokenVerify";
import Instansi from "../../models/agencyModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const {
    query: { nama_ins },
    method,
    headers,
  } = req;

  const token = headers.authorization as string;
  let refreshToken: string = "";

  const result = verifyToken({ token });

  if (result?.data?.refreshToken) {
    refreshToken = result.data.refreshToken;
  }

  if (result?.err) {
    if (result.msg === "Unauthorized") {
      return res.status(401).json({ data: [], msg: "Unauthorized", err: true });
    }
    return res.status(500).json({ data: [], msg: "Token expired", err: true });
  }

  // Request handler
  if (method === "GET") {
    let agencyData;

    if (nama_ins) {
      agencyData = await Instansi.find({
        nama_ins: {
          $regex: `.*${nama_ins.toString().toUpperCase()}.*`,
          $options: "i",
        },
      }).sort({ nama_ins: 1 });

      return res
        .status(200)
        .json({ data: agencyData, msg: "Success get data", error: false });
    }

    agencyData = await Instansi.find();

    if (refreshToken) {
      return res.status(200).json({
        data: agencyData,
        msg: "Success get data",
        error: false,
        refreshToken,
      });
    }

    return res
      .status(200)
      .json({ data: agencyData, msg: "Success get data", error: false });
  } else if (method === "POST") {
    const { kode_ins, nama_ins } = req.body;

    if (!nama_ins)
      return res
        .status(500)
        .json({ data: [], msg: "Nama instansi kosong", err: true });

    const isDup = await Instansi.findOne({ nama_ins });
    if (isDup)
      return res
        .status(500)
        .json({ data: [], msg: "Nama instansi sudah terdaftar", err: true });

    const addIns = await Instansi.insertMany({ kode_ins, nama_ins });

    if (!addIns)
      return res
        .status(500)
        .json({ data: [], msg: "Gagal menambah data", err: true });

    return res
      .status(201)
      .json({ data: [], msg: "Sukses menambah data", err: false });
  }
}
