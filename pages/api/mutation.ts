import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../middlewares/mongodb";
import verifyToken from "../../middlewares/tokenVerify";
import Mutasi from "../../models/mutationModel";
import months from "../../utils/bulan";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const {
    query: { bulan },
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

  if (method === "GET") {
    let mutData = [];

    mutData = await Mutasi.aggregate([
      {
        $match: {
          bulan: new Date(bulan as string),
        },
      },
      {
        $lookup: {
          from: "anggota",
          localField: "no_rek",
          foreignField: "no_rek",
          as: "no_rek",
        },
      },
      {
        $lookup: {
          from: "instansi",
          localField: "dari",
          foreignField: "kode_ins",
          as: "dari",
        },
      },
      {
        $lookup: {
          from: "instansi",
          localField: "ke",
          foreignField: "kode_ins",
          as: "ke",
        },
      },
      {
        $unwind: "$no_rek",
      },
      {
        $unwind: "$dari",
      },
      {
        $unwind: "$ke",
      },
    ]);

    mutData = mutData.map((item) => {
      let month = months[new Date(item.bulan).getMonth()];
      let year = new Date(item.bulan).getFullYear();
      return { ...item, bulan: `${month} ${year}` };
    });

    return res
      .status(200)
      .json({ data: mutData, msg: "Success get data", err: false });
  }
}
