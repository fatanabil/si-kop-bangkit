import jwt from "jsonwebtoken";

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
    );
    const jwtSignOptions = Object.assign({}, this.options, {
      jwtid: refreshOptions.jwtid,
    });
    return jwt.sign(payload, this.secretOrPrivateKey, jwtSignOptions);
  }
}
