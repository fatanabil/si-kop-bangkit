import jwt, { JwtPayload } from "jsonwebtoken";
import TokenGenerator from "../utils/tokenGenerator";

interface VerifyTokenProps {
  token: string;
}

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

export default function verifyToken({ token }: VerifyTokenProps): any {
  let response: any = {};
  if (!token) {
    return { data: [], msg: "No Toked Provided", err: true };
  }

  jwt.verify(token, process.env.SECRET_KEY as string, (err, decode) => {
    const dec = decode as JwtPayload;
    if (err) {
      if (err.message === "jwt expired") {
        response = { data: [], msg: "Token Expired", err: true };
      }
      response = { data: [], msg: "Unauthorized", err: true };
    }
    try {
      const now = new Date().getTime();
      const exp = (dec.exp as number) * 1000;
      const diff = Math.floor(Math.abs(now - exp) / (1000 * 60));
      if (diff <= 2) {
        const refreshToken = tknGen.refresh(token, {
          verify: { audience: "userAud", issuer: "notAtAll" },
          jwtid: "2",
        });
        response = {
          data: { refreshToken, msg: "Refresh token successfull", err: false },
        };
      }
    } catch (err) {}
  });

  return response;
}
