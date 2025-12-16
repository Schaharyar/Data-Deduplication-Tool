"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaGlobe, FaRocket } from "react-icons/fa";
import DataRemovalTool from "./components/DataRemovalTool";
import DomainSeparator from "./components/DomainSeparator";



const tools = [
  { 
    name: "Deduplication", 
    key: "deduplication", 
    description: "Remove duplicate data instantly.", 
    component: <DataRemovalTool />, 
    icon: <FaDatabase className="text-orange-500 text-5xl" /> 
  },
  { 
    name: "Domain Separator", 
    key: "domain", 
    description: "Sort and categorize domains efficiently.", 
    component: <DomainSeparator />, 
    icon: <FaGlobe className="text-orange-500 text-5xl" /> 
  }
];

const Page = () => {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 text-gray-800">

      {/* NAVBAR */}
<nav className="w-full bg-white border-b border-gray-300 shadow-sm px-6 py-4 flex items-center justify-between">
  
  {/* Logo + Text + Slogan */}
  <div className="flex items-center gap-3">
    {/* Bee Image */}
    <img 
      src="/bee.png" 
      alt="Bee Logo" 
      className="w-10 h-10 md:w-12 md:h-12"
    />

    {/* Text + Slogan in Column */}
    <div className="flex flex-col">
      {/* DumbFly */}
      <span className="text-3xl md:text-4xl font-extrabold text-gray-800">
        Dumb
        <span className="text-orange-500">Fly</span>
      </span>
      {/* Slogan */}
      <span className="text-gray-600 text-sm mt-0">
        Fly beyond expectations.
      </span>
    </div>
  </div>

  {/* Get Started Button */}
  {!activeTool && (
    <a
      href="#tools"
      className="inline-flex items-center gap-2 px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
    >
      <FaRocket /> Get Started
    </a>
  )}

</nav>


      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col items-center">
        {!activeTool ? (
          <section id="tools" className="py-12 px-6 w-full max-w-6xl">
            <h2 className="text-2xl font-bold text-gray-700 text-center mb-8">
              Available Tools
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-center">
              {tools.map(({ name, key, icon, description }) => (
                <motion.button
                  key={key}
                  onClick={() => setActiveTool(key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center p-6 rounded-xl shadow-lg border border-gray-300 bg-white hover:border-orange-400 transition-all"
                >
                  <div className="mb-3">{icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    {description}
                  </p>
                </motion.button>
              ))}
            </div>
          </section>
        ) : (
          <motion.section
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg border border-gray-300 my-12"
          >
            <button 
              className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-md text-white font-medium"
              onClick={() => setActiveTool(null)}
            >
              ← Back to Tools
            </button>

            {tools.find(tool => tool.key === activeTool)?.component}
          </motion.section>
        )}
      </main>

      {/* FOOTER */}
      {!activeTool && (
        <footer className="w-full py-6 bg-white text-center text-sm text-gray-600 border-t border-gray-300 mt-auto">
          © {new Date().getFullYear()} {/* DumbFly with only "Fly" in orange */}
  <span className="text-gray-800">
    Dumb
    <span className="text-orange-500">Fly</span>
  </span> - is a partner brand of TeqnoWebs — Built for productivity 🚀
        </footer>
      )}
    </div>
  );
};

export default Page;
