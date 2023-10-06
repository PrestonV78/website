import React from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Space from "./components/Space";
import Experience from "./components/Experience";

export default function Home() {
  return (
    <div>
      <About />
      <Projects />
      <Space />
      <Experience />
      <Skills />
      <Contact />
    </div>
  );
}
