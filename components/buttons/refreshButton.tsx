import React, { MouseEventHandler } from "react";
import {} from "react-icons/fa";

interface RefreshButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: string | React.ReactNode;
  loading: boolean;
  doRefresh: MouseEventHandler<HTMLButtonElement>;
}

export default function RefreshButton(props: RefreshButtonProps) {
  return (
    <button
      {...props}
      className="p-2 bg-slate-600 text-white rounded-md hover:bg-slate-500 transition-all"
      onClick={props.doRefresh}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${props.loading && "animate-spin-cc"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </button>
  );
}
