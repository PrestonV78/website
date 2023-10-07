import { ArrowRightIcon } from "@heroicons/react/solid";
import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
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
          <NavLink to="/about" className="ml-3 text-xl">
            Preston Verling
          </NavLink>
        </nav>
        <nav className="md:mr-auto md:ml-4 md:py-1 md:pl-4 md:border-l md:border-gray-700	flex flex-wrap items-center text-base justify-center">
          <NavLink to="/projects" className="mr-5 hover:text-white">
            Past Projects
          </NavLink>
          <NavLink to="/experience" className="mr-5 hover:text-white">
            Past Experience
          </NavLink>
          <NavLink to="/skills" className="mr-5 hover:text-white">
            Skills
          </NavLink>
        </nav>
        <nav>
          <NavLink
            to="/contact"
            className="inline-flex items-center bg-purple-800 border-0 py-1 px-3 focus:outline-none hover:bg-purple-800 rounded text-base mt-4 md:mt-0 hover:text-white"
          >
            Contact Me
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
