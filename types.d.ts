export interface MemberType {
  _id: string;
  no_rek: string;
  nama_anggota: string;
  kode_ins: string;
  detail_ins: AgencyType;
}

export interface AgencyType {
  _id: string;
  nama_ins: string;
  kode_ins: string;
}

export interface AuthContextType {
  authData: AuthDataType;
  changeAuthData: Function;
}

export interface AuthDataType {
  username: string;
  token: string;
  isAuthenticated: boolean;
}
