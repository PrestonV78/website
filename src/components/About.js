import React from "react";

export default function About() {
  return (
    <section id="about">
      <div className="container mx-auto flex px-10 py-10 md:flex-row flex-col items-center">
      </div>
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center">
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="title-font sm:text-7xl text-3xl mb-4 font-HelloZone text-white">
            Hi, my name is Preston.
            <br></br> I build creative solutions.
          </h1>
          <p className="mb-8 text-gray-400 leading-relaxed">
            I am a current Senior at Virginia Tech studying Computer Science.<br></br>
            I am set to graduate in May 2023 with my Bachelor's.<br></br>
            I am currently working at Lockheed Martin as a Software Engineer Asc.<br></br>
          </p>
          <div className="flex justify-center">
            <a
              href="#contact"
              className="inline-flex text-white bg-purple-500 border-0 py-2 px-6 focus:outline-none hover:bg-purple-600 rounded text-lg">
              Work With Me
            </a>
            <a
              href="#projects"
              className="ml-4 inline-flex text-white-400 bg-gray-900 border-0 py-2 px-6 focus:outline-none hover:bg-black-700 hover:text-white rounded text-lg">
              See My Past Work
            </a>
          </div>
        </div>
        <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
          <img
            className="object-cover object-center rounded"
            alt="badge"
            src="../Logo.svg"
          />
        </div>
      </div>
    </section>
  );
}
