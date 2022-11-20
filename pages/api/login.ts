import { NextApiRequest, NextApiResponse } from "next";
import Users from "../../models/userModel";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  if (method === "POST") {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(401)
        .json({ data: [], msg: "Password Salah", err: true });
    }

    return res
      .status(200)
      .json({ data: [], msg: "Terautentikasi", err: false });
  }
}
