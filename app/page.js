"use client";

import { useSelector } from "react-redux";
import { selectTheme } from "../features/photosSlice";
import Gallery from "./components/Gallery";
import SearchInput from "./components/SearchInput";

export default function Home() {
  const theme = useSelector(selectTheme);

  return (
    <main
      className={`min-h-screen p-8 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome!</h1>
        <SearchInput />
        <Gallery />
      </div>
    </main>
  );
}
