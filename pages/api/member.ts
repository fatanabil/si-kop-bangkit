import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../middlewares/mongodb";
import verifyToken from "../../middlewares/tokenVerify";
import Instansi from "../../models/agencyModel";
import Anggota from "../../models/memberModel";
import { MemberType } from "../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const {
    query: { nama, instansi, limit },
    headers,
    method,
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
      const { kode_ins } = await Instansi.findOne({ nama_ins: instansi });
      memberData = await Anggota.aggregate([
        {
          $match: {
            kode_ins,
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
      ]);
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

    if (refreshToken) {
      return res.status(200).json({
        data: memberData,
        msg: "Success get data",
        error: false,
        refreshToken,
      });
    }

    return res
      .status(200)
      .json({ data: memberData, msg: "success get data", error: false });
  }

  if (method === "POST") {
    const { no_rek, nama_anggota, nama_instansi } = req.body;
    const { kode_ins } = await Instansi.findOne({ nama_ins: nama_instansi });

    return await Anggota.insertMany({ no_rek, nama_anggota, kode_ins })
      .then((result) =>
        res.status(200).json({ data: [], msg: "Sukses menambah data" })
      )
      .catch((err) =>
        res
          .status(500)
          .json({ data: [], msg: "Gagal menambah data", err: err.message })
      );
  }
}
