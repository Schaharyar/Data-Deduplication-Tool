"use client";

import React, { useState, useRef, useEffect } from "react";
import { ClipboardEdit, ClipboardCheck, X, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";

const DataRemovalTool = () => {
  const [oldData, setOldData] = useState("");
  const [newData, setNewData] = useState("");
  const [result, setResult] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(true);
  const [sortResults, setSortResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultTextareaRef = useRef(null);

  const processData = () => {
    if (!newData.trim()) {
      toast.warning("New data is empty");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const processItem = (item) => {
          let processed = trimWhitespace ? item.trim() : item;
          if (!caseSensitive) processed = processed.toLowerCase();
          return processed;
        };

        const oldDataSet = new Set(
          oldData
            .split("\n")
            .filter(line => !ignoreEmptyLines || line.trim())
            .map(processItem)
        );

        let filteredNewData = newData
          .split("\n")
          .filter(line => !ignoreEmptyLines || line.trim())
          .map(item => trimWhitespace ? item.trim() : item)
          .filter(item => !oldDataSet.has(processItem(item)));

        if (sortResults) {
          filteredNewData = filteredNewData.sort((a, b) => a.localeCompare(b));
        }

        if (filteredNewData.length === 0) {
          toast.info("No unique data found after processing");
        } else {
          toast.success(`Found ${filteredNewData.length} unique items`);
        }

        setResult(filteredNewData.join("\n"));
      } catch (error) {
        toast.error("An error occurred during processing");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }, 100);
  };

  const handleClear = () => {
    setOldData("");
    setNewData("");
    setResult("");
    setCopied(false);
    toast.info("Cleared all data");
  };

  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  };

  const countLines = (text) => {
    const lines = text.split("\n");
    return ignoreEmptyLines ? lines.filter(line => line.trim()).length : lines.length;
  };

  const countChars = (text) => {
    return text.length;
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-4 md:p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-orange-400 text-center">
          Data Deduplication Tool
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Old Data Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-orange-300 mb-2">Reference Data</h2>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm md:text-base text-gray-100 h-64"
              placeholder="Paste your reference data here (one item per line)..."
              value={oldData}
              onChange={(e) => setOldData(e.target.value)}
            />
            <div className="text-xs text-gray-400 mt-1">
              Lines: {countLines(oldData)} | Characters: {countChars(oldData)}
            </div>
          </div>

          {/* New Data Section */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-semibold text-orange-300 mb-2">Data to Filter</h2>
            <textarea
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm md:text-base text-gray-100 h-64"
              placeholder="Paste your new data here (one item per line)..."
              value={newData}
              onChange={(e) => setNewData(e.target.value)}
            />
            <div className="text-xs text-gray-400 mt-1">
              Lines: {countLines(newData)} | Characters: {countChars(newData)}
            </div>
          </div>
        </div>

        {/* Options Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={() => setCaseSensitive(!caseSensitive)}
                className="accent-orange-500"
              />
              Case Sensitive
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={trimWhitespace}
                onChange={() => setTrimWhitespace(!trimWhitespace)}
                className="accent-orange-500"
              />
              Trim Whitespace
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ignoreEmptyLines}
                onChange={() => setIgnoreEmptyLines(!ignoreEmptyLines)}
                className="accent-orange-500"
              />
              Ignore Empty Lines
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sortResults}
                onChange={() => setSortResults(!sortResults)}
                className="accent-orange-500"
              />
              Sort Results
            </label>
          </div>

          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={processData}
                disabled={isProcessing}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Process Data
                  </>
                )}
              </button>
              <button
                onClick={handleClear}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium shadow-md flex items-center gap-2"
              >
                <X size={18} />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 relative">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-orange-400">
                Results: {countLines(result)} unique items
              </h2>
              <button
                onClick={handleCopy}
                className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-md flex items-center gap-1"
              >
                {copied ? <ClipboardCheck size={16} /> : <ClipboardEdit size={16} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              ref={resultTextareaRef}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-sm md:text-base text-gray-100 h-64"
              value={result}
              readOnly
            />
            <div className="text-xs text-gray-400 mt-1">
              Lines: {countLines(result)} | Characters: {countChars(result)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataRemovalTool;