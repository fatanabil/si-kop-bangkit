import { NextApiRequest, NextApiResponse } from "next";
import { connect } from "../../middlewares/mongodb";
import verifyToken from "../../middlewares/tokenVerify";
import Instansi from "../../models/agencyModel";
import Anggota from "../../models/memberModel";
import Mutasi from "../../models/mutationModel";
import { AnggotaDataType, MutationDataType } from "../../types";
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
  } else if (method === "PATCH") {
    const { mutationData } = req.body;

    if (mutationData.length > 0) {
      const checkName = mutationData.map(async (data: MutationDataType) => {
        const findName: AnggotaDataType[] = await Anggota.find({
          nama_anggota: {
            $regex: ".*" + data.nama + ".*",
          },
          kode_ins: data.dari,
        }).select({ _id: 0, kode_ins: 0 });
        const agencyName = await Instansi.findOne({ kode_ins: data.dari });
        if (findName.length < 1) {
          return {
            nama: data.nama,
            dari: agencyName.nama_ins,
            empty: true,
            dup: false,
          };
        } else if (findName.length > 1) {
          return {
            nama: data.nama,
            dari: agencyName.nama_ins,
            empty: false,
            dup: true,
          };
        }
        return {
          no_rek: findName[0].no_rek,
          dari: data.dari,
          ke: data.ke,
          bulan: data.bulan,
        };
      });

      return Promise.all(checkName)
        .then((result) => {
          const errData = result.filter((data) => data.empty || data.dup);
          if (errData.length > 0) {
            res.status(400).json({
              data: { err: errData },
              msg: "Kesalahan input data",
              err: true,
            });
          } else {
            try {
              const addMut = result.map(async (data) => {
                await Mutasi.insertMany({
                  no_rek: data.no_rek,
                  dari: data.dari,
                  ke: data.ke,
                  bulan: new Date(data.bulan),
                });

                await Anggota.updateMany(
                  { no_rek: data.no_rek },
                  {
                    $set: {
                      kode_ins: data.ke,
                    },
                  }
                );
              });

              Promise.all(addMut).then(() => {
                res
                  .status(201)
                  .json({ data: [], msg: "Sukses menambah data", err: false });
              });
            } catch (err) {
              res
                .status(500)
                .json({ data: { err }, msg: "Gagal menambah data", err: true });
            }
          }
        })
        .catch((err) => console.log(err));
    }

    return res.status(500).json({ data: [], msg: "Data kosong", err: true });
  }
}
