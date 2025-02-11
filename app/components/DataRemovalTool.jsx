"use client";

import React, { useState } from "react";
import { ClipboardEdit, ClipboardCheck } from "lucide-react";

const DataRemovalTool = () => {
  const [oldData, setOldData] = useState("");
  const [newData, setNewData] = useState("");
  const [result, setResult] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    const oldDataSet = new Set(
      oldData.split("\n").map((item) => (caseSensitive ? item.trim() : item.trim().toLowerCase()))
    );
    
    const filteredNewData = newData
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => (caseSensitive ? !oldDataSet.has(item) : !oldDataSet.has(item.toLowerCase())));

    if (filteredNewData.length === 0) {
      window.alert("No data to remove.");
    }

    setResult(filteredNewData.join("\n"));
  };

  const handleClear = () => {
    setOldData("");
    setNewData("");
    setResult("");
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <h1 className="text-3xl font-bold mb-6 text-orange-400">Data Deduplication Tool</h1>
      
      <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg mb-6">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-100"
              rows={6}
              placeholder="Paste old data here..."
              value={oldData}
              onChange={(e) => setOldData(e.target.value)}
            ></textarea>
          </div>
          <div className="relative flex-1">
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-100"
              rows={6}
              placeholder="Paste new data here..."
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} />
            Case Sensitive
          </label>
          <p className="text-sm">Old: {oldData.split("\n").filter(Boolean).length} | New: {newData.split("\n").filter(Boolean).length}</p>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={handleProcess}
            className="bg-orange-500 hover:bg-orange-600 text-gray-100 px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Remove Duplicates
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-600 hover:bg-gray-500 text-gray-100 px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg relative">
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">Processed Data:</h2>
          <div className="relative">
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-100 mb-4 pr-10"
              rows={6}
              value={result}
              readOnly
            ></textarea>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 text-orange-400 hover:text-orange-500 transition-transform transform active:scale-90"
            >
              {copied ? <ClipboardCheck size={24} /> : <ClipboardEdit size={24} />}
              {copied && (
                <span className="absolute top-[-20px] right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-md opacity-90 transition-opacity duration-300">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataRemovalTool;
