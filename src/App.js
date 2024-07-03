import React from "react";
import {  BrowserRouter as Router,  Routes,  Route} from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import End from "./components/End";

export default function App() {
  return (
    <main className="bg-black text-gray-400 body-font">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
        <End />
      </Router>
    </main>
  );
}