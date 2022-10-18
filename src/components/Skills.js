import { BadgeCheckIcon, ChipIcon, BookOpenIcon } from "@heroicons/react/solid";
import React from "react";
import { skills } from "../data";
import { courses } from "../data";

export default function Skills() {
  return (
    <section id="skills">
      <div className="container px-5 py-10 mx-auto">
        <div className="text-center mb-20">
          <ChipIcon className="w-10 inline-block mb-4" />
          <h1 className="sm:text-7xl text-3xl font-HelloZone title-font text-white mb-4">
            Skills &amp;  Technologies
          </h1>
        </div>
        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
          {skills.map((skill) => (
            <div key={skill} className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                <BadgeCheckIcon className="text-purple-400 w-6 h-6 flex-shrink-0 mr-4" />
                <span className="title-font font-medium text-white">
                  {skill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="container px-5 py-10 mx-auto">
        <div className="text-center mb-20">
          <BookOpenIcon className="w-10 inline-block mb-4" />
          <h1 className="sm:text-7xl text-3xl font-HelloZone title-font text-white mb-4">
            Relevant  Courses
          </h1>
        </div>
        <div className="flex flex-wrap lg:w-4/5 sm:mx-auto sm:mb-2 -mx-2">
          {courses.map((course) => (
            <div key={course} className="p-2 sm:w-1/2 w-full">
              <div className="bg-gray-800 rounded flex p-4 h-full items-center">
                <BadgeCheckIcon className="text-purple-400 w-6 h-6 flex-shrink-0 mr-4" />
                <span className="title-font font-medium text-white">
                  {course}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
