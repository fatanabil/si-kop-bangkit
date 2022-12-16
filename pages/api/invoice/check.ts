import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../../middlewares/mongodb";
import Anggota from "../../../models/memberModel";
import { InvoiceDataType } from "../../../types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const { headers, method } = req;

  if (method === "POST") {
    const { invoiceData } = req.body;
    const listNOREK: string[] = invoiceData.map(
      (dt: InvoiceDataType) => dt.no_rek
    );
    const result = await Anggota.aggregate([
      {
        $match: {
          no_rek: {
            $in: listNOREK,
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
      {
        $project: {
          _id: 0,
          detail_ins: {
            _id: 0,
          },
        },
      },
    ]).sort({ "detail_ins.nama_ins": 1 });
    const listedREK = result.map((dt) => dt.no_rek);
    const notListedREK = listNOREK.filter((dt) => !listedREK.includes(dt));

    const listedData = result.map((dt) => {
      for (const nr of invoiceData) {
        if (dt.no_rek === nr.no_rek) {
          return {
            ...dt,
            jumlah: nr.jumlah,
          };
        }
      }
    });

    const notListedData = notListedREK.map((rek) => {
      for (const nr of invoiceData) {
        if (rek === nr.no_rek) {
          return nr;
        }
      }
    });

    return res.status(200).json({
      data: { listedData, notListedData },
      msg: "MASUKKK",
      err: false,
      invoiceData,
    });
  }
}
