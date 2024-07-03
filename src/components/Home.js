import React from "react";

import About from "./About";
import Contact from "./Contact";
import Projects from "./Projects";
import Skills from "./Skills";
import Space from "./Space";
import Experience from "./Experience";

export default function Home() {
  return (
    <div>
      <About id='about'/>
      <Projects id='projects'/>
      <Space />
      <Experience id='experience'/>
      <Skills id='skills'/>
      <Contact id='contact'/>
    </div>
  );
}