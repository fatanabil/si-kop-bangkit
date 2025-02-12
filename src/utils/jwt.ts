import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const createToken = (payload: object) => {
  return jwt.sign(payload, SECRET_KEY!, { expiresIn: "15m" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY!);
  } catch (error) {
    return null;
  }
};
