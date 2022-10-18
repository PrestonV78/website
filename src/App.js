import React from "react";
import About from "./components/About";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Space from "./components/Space";
import Experience from "./components/Experience";
import End from "./components/End";

export default function App() {
  return (
    <main className="bg-gray-900 text-gray-400 body-font">
      <Navbar />
      <About />
      <Space />
      <Projects />
      <Space />
      <Experience />
      <Space />
      <Skills />
      <Space />
      <Contact />
      <End />
    </main>
  );
}
