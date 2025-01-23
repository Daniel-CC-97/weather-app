import { IoSunny } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import SearchBar from "./SearchBar";

type Props = {};

export default function Navbar({}: Props) {
  return (
    <nav className="bg-black-900 text-black-300 shadow-sm sticky top-0 left-0 z-50">
      <div className="p-6 w-full flex justify-between items-center max-w-7xl mx-auto">
        <p className="flex items-center justify-center gap-2">
          <h2 className="text-3xl text-black-300">Weather</h2>
          <IoSunny className="text-3xl text-yellow-600 mt-1" />
        </p>
        <section className="flex gap-2 items-center">
          <MdMyLocation className="text-2xl cursor-pointer hover:opacity-80" />
          <FaLocationDot className="text-2xl cursor-pointer hover:opacity-80" />
          <p className="text-black-300 text-sm">United Kingdom</p>
          <SearchBar></SearchBar>
        </section>
      </div>
    </nav>
  );
}
