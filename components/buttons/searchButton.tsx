import React from "react";
import { FaSearch } from "react-icons/fa";
import Loader from "../loader";

interface SearchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function SearchButton(props: SearchButtonProps) {
  return (
    <button
      className="px-4 py-3 rounded-md text-white bg-teal-600 flex items-center gap-3 font-semibold hover:bg-teal-700 transition-all"
      {...props}
    >
      {props.loading ? <Loader /> : <FaSearch />}
      <span>Cari Data</span>
    </button>
  );
}
