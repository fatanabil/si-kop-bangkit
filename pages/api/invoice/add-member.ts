import { NextApiRequest, NextApiResponse } from "next";
import Anggota from "../../../models/memberModel";
import { AnggotaDataType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  if (method === "POST") {
    const { memberData } = req.body;

    try {
      memberData.map((data: AnggotaDataType) => {
        Anggota.insertMany({
          no_rek: data.no_rek,
          nama_anggota: data.nama_anggota,
          kode_ins: data.kode_ins,
        });
      });

      return res.status(200).json({
        data: { memberData },
        msg: "Sukses menambah data",
        err: false,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ data: [], msg: "Gagal menambah data", err: true });
    }
  }
}
