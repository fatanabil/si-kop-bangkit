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

export interface ResponseJSONType {
  data: any[];
  msg: string;
  err: Object | string | boolean;
}

export interface MutationType {
  no_rek: MemberType;
  dari: AgencyType;
  ke: AgencyType;
  bulan: string;
}

export interface MutationDataType {
  nama: string;
  dari: string;
  ke: string;
  bulan: string;
}

export interface AnggotaDataType {
  no_rek: string;
  nama_anggota: string;
}

export interface MutationDataErrType {
  nama: string;
  dari: string;
  empty: boolean;
  dup: boolean;
}
