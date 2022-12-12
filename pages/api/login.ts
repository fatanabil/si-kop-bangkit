import { NextApiRequest, NextApiResponse } from "next";
import Users from "../../models/userModel";
import bcrypt from "bcryptjs";
import TokenGenerator from "../../utils/tokenGenerator";
import { connect } from "../../middlewares/mongodb";

const tknGen = new TokenGenerator(
  process.env.SECRET_KEY as string,
  process.env.SECRET_KEY as string,
  {
    keyid: "1",
    noTimestamp: false,
    expiresIn: process.env.EXPIRED_IN,
    notBefore: "0s",
  }
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connect();

  const { method } = req;

  if (method === "POST") {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });

    if (!user)
      return res
        .status(500)
        .json({ data: [], msg: "Username tidak ditemukan", err: true });

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ data: [], msg: "Password Salah", err: true });
    }

    const token = tknGen.sign(
      { id: user.username },
      { audience: "userAud", issuer: "notAtAll", jwtid: "1", subject: "user" }
    );

    return res
      .status(200)
      .json({ data: { token, username }, msg: "Terautentikasi", err: false });
  }
}
