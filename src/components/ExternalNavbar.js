import React from "react";
import { NavLink } from "react-router-dom";

export default function ExternalNavbar() {
  return (
    <header className="bg-purple-800 md:sticky top-0 z-10">
      <div className="container mx-auto flex flex-wrap p-1 flex-col md:flex-row items-center">
        <div className="w-20 h-20 ml-1">
          <img
            className="object-cover object-center rounded"
            alt="badge"
            src="../Logo.svg"
          />
        </div>
        <nav className="title-font font-medium text-white mb-4 md:mb-0">
          <NavLink to=
            "/" className="ml-3 text-xl">
            Preston Verling
          </NavLink>
        </nav>
      </div>
    </header>
  );
}