import { BriefcaseIcon } from "@heroicons/react/solid";
import React from "react";
import { experiences } from "../data";

export default function Experiences() {
  return (
    <section id="experience" className="text-gray-400 bg-gray-900 body-font">
      <div className="container mx-auto flex px-10 py-10 md:flex-row flex-col items-center">
      </div>
      <div className="container px-5 py-10 mx-auto text-center lg:px-40">
        <div className="flex flex-col w-full mb-20">
          <BriefcaseIcon className="text-purple-400 mx-auto inline-block w-10 mb-4" />
          <h1 className="sm:text-7xl text-3xl font-HelloZone title-font mb-4 text-white">
            What  I Have Done
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-white text-base">
            Here is my showcase of past experience I have in the areas of education, design teams, and professional.
          </p>
        </div>
        <div className="flex flex-wrap -m-4">
          {experiences.map((experience) => (
            <a
              href={experience.link}
              key={experience.image}
              className="sm:w-1/2 w-100 p-4">
              <div className="flex relative">
                <img
                  alt="gallery"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  src={experience.image}
                />
                <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-800 bg-gray-900 opacity-0 hover:opacity-100">
                  <h2 className="tracking-widest text-sm title-font font-medium text-purple-400 mb-1">
                    {experience.subtitle}
                  </h2>
                  <h1 className="title-font text-lg font-medium text-white mb-3">
                    {experience.title}
                  </h1>
                  <p className="leading-relaxed">{experience.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
