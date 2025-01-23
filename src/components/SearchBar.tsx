import { cn } from "@/utils/cn";
import React from "react";
import { FaSearch } from "react-icons/fa";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBar(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "flex relative items-center justify-center",
        props.className
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search Location..."
        className="p-2 rounded-l text-black-900 bg-black-300 focus:outline-none focus:border-bg-black-900"
      ></input>
      <button className="rounded-r bg-black-300 p-2">
        <FaSearch className="text-2xl text-black-600 cursor-pointer hover:opacity-80" />
      </button>
    </form>
  );
}
