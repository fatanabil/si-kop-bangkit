import { NextApiRequest, NextApiResponse } from "next";
import Instansi from "../../models/agencyModels";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { nama_ins },
    method,
  } = req;

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

    return res
      .status(200)
      .json({ data: agencyData, msg: "Success get data", error: false });
  }
}
