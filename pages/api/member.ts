import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../middlewares/mongodb";
import Anggota from "../../models/memberModel";
import MemberType from "../../types/memberType";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const {
    query: { nama, instansi, limit },
    method,
  } = req;

  if (method === "GET") {
    let memberData: MemberType[] = [];

    if (nama) {
      memberData = await Anggota.aggregate([
        {
          $match: {
            nama_anggota: {
              $regex: ".*" + nama + ".*",
              $options: "i",
            },
          },
        },
        {
          $lookup: {
            from: "instansi",
            localField: "kode_ins",
            foreignField: "kode_ins",
            as: "detail_ins",
          },
        },
        {
          $unwind: "$detail_ins",
        },
      ])
        .sort({ kode_ins: 1 })
        .limit(parseInt(limit as string));
    } else if (instansi) {
    } else {
      memberData = await Anggota.aggregate([
        {
          $lookup: {
            from: "instansi",
            localField: "kode_ins",
            foreignField: "kode_ins",
            as: "detail_ins",
          },
        },
        {
          $unwind: "$detail_ins",
        },
      ])
        .sort({ kode_ins: 1 })
        .limit(parseInt(limit as string));
    }

    res
      .status(200)
      .json({ data: memberData, msg: "success get data", error: false });
  }
}
