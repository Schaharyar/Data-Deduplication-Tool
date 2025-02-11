"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaDatabase, FaGlobe } from "react-icons/fa";
import DataRemovalTool from "./components/DataRemovalTool";
import DomainSeparator from "./components/DomainSeparator";

const tools = [
  { name: "Deduplication", key: "deduplication", description: "Remove duplicate data instantly.", component: <DataRemovalTool />, icon: <FaDatabase className="text-orange-300 text-4xl" /> },
  { name: "Domain Separator", key: "domain", description: "Sort and categorize domains efficiently.", component: <DomainSeparator />, icon: <FaGlobe className="text-orange-300 text-4xl" /> }
];

const Page = () => {
  const [activeTool, setActiveTool] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-orange-200 text-gray-800 flex flex-col items-center justify-center px-6">
      
      {/* App Introduction */}
      <div className="max-w-3xl text-center mb-6">
        <h1 className="text-4xl font-bold text-gray-700 mb-2">Welcome to DataForge</h1>
        <p className="text-gray-600">
          DataForge is your all-in-one toolkit for handling and processing data efficiently.
          Whether you need to remove duplicates or organize domain lists, our tools help you save time and boost productivity.
        </p>
      </div>

      {/* Tool Selection or Active Tool */}
      {!activeTool ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 w-full max-w-5xl justify-center">
          {tools.map(({ name, key, icon, description }) => (
            <button 
              key={key} 
              onClick={() => setActiveTool(key)} 
              className="relative flex flex-col items-center justify-center p-4 rounded-xl shadow-lg w-44 h-52 border border-gray-400 transition-all overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-orange-100 hover:border-orange-400 hover:scale-105"
              title={description}
            >
              <div className="mb-2 relative z-10">{icon}</div>
              <span className="text-orange-400 text-sm font-semibold text-center relative z-10">{name}</span>
            </button>
          ))}
        </div>
      ) : (
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl bg-gradient-to-br from-gray-100 via-gray-200 to-orange-100 p-6 rounded-xl shadow-lg border border-gray-400"
        >
          <button 
            className="mb-4 px-4 py-2 bg-orange-400 hover:bg-orange-500 rounded-md text-gray-800"
            onClick={() => setActiveTool(null)}
          >
            ← Back to Tools
          </button>
          {tools.find(tool => tool.key === activeTool)?.component}
        </motion.div>
      )}

      {/* FAQ Section */}
      <div className="max-w-3xl mt-12 text-gray-700">
        <h2 className="text-3xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="p-4 bg-gray-100 border rounded-lg">
            <summary className="font-semibold cursor-pointer">What is DataForge?</summary>
            <p className="mt-2 text-gray-600">DataForge is a suite of tools designed to help users clean, process, and organize their data efficiently.</p>
          </details>
          <details className="p-4 bg-gray-100 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Is DataForge free to use?</summary>
            <p className="mt-2 text-gray-600">Yes! DataForge provides powerful data processing tools that are completely free to use.</p>
          </details>
          <details className="p-4 bg-gray-100 border rounded-lg">
            <summary className="font-semibold cursor-pointer">How can I use the Deduplication tool?</summary>
            <p className="mt-2 text-gray-600">Simply enter your data into the tool, and it will automatically remove duplicate entries for you.</p>
          </details>
          <details className="p-4 bg-gray-100 border rounded-lg">
            <summary className="font-semibold cursor-pointer">Can I suggest a new feature?</summary>
            <p className="mt-2 text-gray-600">Absolutely! We love user feedback. Feel free to reach out with your suggestions.</p>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Page;
