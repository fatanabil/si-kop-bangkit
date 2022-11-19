import InstansiType from "./instansiType";

interface MemberType {
  _id: string;
  no_rek: string;
  nama_anggota: string;
  kode_ins: string;
  detail_ins: InstansiType;
}

export default MemberType;
