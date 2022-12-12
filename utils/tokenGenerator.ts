import jwt, { JwtPayload } from "jsonwebtoken";

export default class TokenGenerator {
  private secretOrPrivateKey: string;
  private secretOrPublicKey: string;
  private options: any;

  constructor(
    secretOrPrivateKey: string,
    secretOrPublicKey: string,
    options: any
  ) {
    this.secretOrPrivateKey = secretOrPrivateKey;
    this.secretOrPublicKey = secretOrPublicKey;
    this.options = options;
  }

  sign(payload: any, signOptions: any) {
    const jwtSignOptions = Object.assign({}, signOptions, this.options);
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }

  refresh(token: string, refreshOptions: any) {
    const payload = jwt.verify(
      token,
      this.secretOrPublicKey,
      refreshOptions.verify
    ) as JwtPayload;
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({}, this.options, {
      jwtid: refreshOptions.jwtid,
    });
    const refreshToken = jwt.sign(
      payload,
      this.secretOrPrivateKey,
      jwtSignOptions
    );
    return refreshToken;
  }
}
