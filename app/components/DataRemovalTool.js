"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ClipboardEdit, ClipboardCheck, X, Check, Loader2, RotateCcw, RotateCw, ListChecks } from "lucide-react";
import { toast } from "sonner";
import DataRemovalToolGuide from "./DataRemovalToolGuide";

// Polyfill for requestIdleCallback
if (typeof window !== "undefined" && typeof window.requestIdleCallback !== "function") {
  window.requestIdleCallback = (cb) => setTimeout(cb, 1);
}

const countLines = (text) => {
  if (!text || typeof text !== "string") return 0;
  return text.split("\n").filter(line => line.trim() !== "").length;
};

const DataRemovalTool = () => {
  const [oldData, setOldData] = useState("");
  const [newData, setNewData] = useState("");
  const resultRef = useRef("");
  const [renderTrigger, setRenderTrigger] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const workerRef = useRef(null);
  const [caseSensitive, setCaseSensitive] = useState(false);

  // Undo/Redo stacks
  const oldHistory = useRef([""]);
  const oldIndex = useRef(0);
  const newHistory = useRef([""]);
  const newIndex = useRef(0);

  useEffect(() => {
    try {
      workerRef.current = new Worker(new URL("../workers/dataWorker.js", import.meta.url));
      workerRef.current.onmessage = (e) => {
        const { type, payload } = e.data;

        if (type === "done") {
          resultRef.current = payload.join("\n");
          setRenderTrigger(prev => prev + 1);
          setIsProcessing(false);
          toast.success(`Found ${payload.length} unique items`);
        }
      };

      workerRef.current.onerror = (error) => {
        console.error("Worker error:", error);
        setIsProcessing(false);
        toast.error("Processing failed. Please try again.");
      };
    } catch (error) {
      console.error("Failed to initialize worker:", error);
      toast.error("Failed to initialize processing engine");
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [caseSensitive]);

  const handleInputChange = useCallback((setter, value, isReference = false) => {
    if (isReference) {
      setOldData(value);
      oldHistory.current = [...oldHistory.current.slice(0, oldIndex.current + 1), value];
      oldIndex.current++;
    } else {
      setNewData(value);
      newHistory.current = [...newHistory.current.slice(0, newIndex.current + 1), value];
      newIndex.current++;
    }
  }, []);

  const undo = useCallback((isReference = false) => {
    if (isReference) {
      if (oldIndex.current > 0) {
        oldIndex.current--;
        setOldData(oldHistory.current[oldIndex.current]);
      }
    } else {
      if (newIndex.current > 0) {
        newIndex.current--;
        setNewData(newHistory.current[newIndex.current]);
      }
    }
  }, []);

  const redo = useCallback((isReference = false) => {
    if (isReference) {
      if (oldIndex.current < oldHistory.current.length - 1) {
        oldIndex.current++;
        setOldData(oldHistory.current[oldIndex.current]);
      }
    } else {
      if (newIndex.current < newHistory.current.length - 1) {
        newIndex.current++;
        setNewData(newHistory.current[newIndex.current]);
      }
    }
  }, []);

  const processData = useCallback(() => {
    if (!newData.trim()) {
      toast.warning("New data is empty");
      return;
    }

    if (!workerRef.current) {
      toast.error("Processing engine not available");
      return;
    }

    setIsProcessing(true);
    workerRef.current.postMessage({
      oldData,
      newData,
      options: { caseSensitive, trimWhitespace: true, ignoreEmptyLines: true, sortResults: false },
    });
  }, [oldData, newData, caseSensitive]);

  const handleClear = useCallback(() => {
    setOldData("");
    setNewData("");
    resultRef.current = "";
    setRenderTrigger(prev => prev + 1);
    setCopied(false);
    setCopiedField("");
    oldHistory.current = [""];
    oldIndex.current = 0;
    newHistory.current = [""];
    newIndex.current = 0;
    toast.info("Cleared all data");
  }, []);

  const handleCopy = useCallback((text, field = "") => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setCopiedField(field);
      toast.success("Copied to clipboard");
      setTimeout(() => {
        setCopied(false);
        setCopiedField("");
      }, 2000);
    }).catch(() => {
      toast.error("Failed to copy");
    });
  }, []);

  const removeReferenceDuplicates = useCallback(() => {
    const lines = oldData.split("\n").map(l => l.trim()).filter(l => l !== "");
    const seen = new Set();
    const unique = [];
    lines.forEach(line => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(line);
      }
    });
    setOldData(unique.join("\n"));
    toast.success("Removed duplicates from Reference Data");
  }, [oldData, caseSensitive]);

  return (
    <>
    <div className=" text-gray-100 flex flex-col items-center p-3 md:p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold mb-4 text-orange-400 text-center">
          Data Deduplication Tool
        </h1>

        {/* Case Sensitive Checkbox */}
        <div className="flex items-center gap-2 mb-4">
          <input id="caseSensitive" type="checkbox" checked={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} />
          <label htmlFor="caseSensitive" className="text-sm text-gray-300">Case Sensitive (applies to Reference + New Data)</label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Reference Data */}
          <div className="bg-gray-800 rounded-lg shadow p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold text-orange-300">Reference Data</h2>
              <div className="flex gap-1">
                <button onClick={removeReferenceDuplicates} disabled={!oldData} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Remove duplicates">
                  <ListChecks size={14}/>
                </button>
                <button onClick={() => handleCopy(oldData, "ref")} disabled={!oldData} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Copy reference data">
                  {copied && copiedField === "ref" ? <ClipboardCheck size={14}/> : <ClipboardEdit size={14}/>} 
                </button>
                <button onClick={() => undo(true)} disabled={oldIndex.current === 0} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Undo">
                  <RotateCcw size={14}/>
                </button>
                <button onClick={() => redo(true)} disabled={oldIndex.current === oldHistory.current.length - 1} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Redo">
                  <RotateCw size={14}/>
                </button>
              </div>
            </div>
            <textarea
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 h-60 resize-y"
              placeholder="Paste your reference data here..."
              value={oldData}
              onChange={(e) => handleInputChange(setOldData, e.target.value, true)}
              disabled={isProcessing}
            />
            <div className="text-xs text-gray-400 mt-1">Lines: {countLines(oldData)}</div>
          </div>

          {/* Data to Filter */}
          <div className="bg-gray-800 rounded-lg shadow p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold text-orange-300">Data to Filter</h2>
              <div className="flex gap-1">
                <button onClick={() => handleCopy(newData, "new")} disabled={!newData} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Copy new data">
                  {copied && copiedField === "new" ? <ClipboardCheck size={14}/> : <ClipboardEdit size={14}/>} 
                </button>
                <button onClick={() => undo(false)} disabled={newIndex.current === 0} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Undo">
                  <RotateCcw size={14}/>
                </button>
                <button onClick={() => redo(false)} disabled={newIndex.current === newHistory.current.length - 1} className="p-1 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50" title="Redo">
                  <RotateCw size={14}/>
                </button>
              </div>
            </div>
            <textarea
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 h-60 resize-y"
              placeholder="Paste your new data here..."
              value={newData}
              onChange={(e) => handleInputChange(setNewData, e.target.value, false)}
              disabled={isProcessing}
            />
            <div className="text-xs text-gray-400 mt-1">Lines: {countLines(newData)}</div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-gray-800 rounded-lg shadow p-3 mb-4">
          <div className="flex flex-wrap justify-between gap-3">
            <div className="flex gap-2">
              <button onClick={processData} disabled={isProcessing || !newData.trim()} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded font-medium shadow flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? (<><Loader2 size={14} className="animate-spin"/> Processing...</>) : (<><Check size={14}/> Process</>)}
              </button>
              <button onClick={handleClear} disabled={isProcessing} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded font-medium shadow flex items-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <X size={14}/> Clear
              </button>
            </div>
            
            <div className="text-xs text-gray-300">
              {oldData && newData && (
                <span>Processing {countLines(newData)} lines vs {countLines(oldData)} refs</span>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {resultRef.current && (
          <div className="bg-gray-800 rounded-lg shadow p-3">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-base font-semibold text-orange-400">Results: {countLines(resultRef.current)} unique</h2>
              <button onClick={() => handleCopy(resultRef.current, "res")} className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded flex items-center gap-1">
                {copied && copiedField === "res" ? <ClipboardCheck size={14}/> : <ClipboardEdit size={14}/>}
                {copied && copiedField === "res" ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 h-60 resize-y" value={resultRef.current} readOnly />
            <div className="text-xs text-gray-400 mt-1">Lines: {countLines(resultRef.current)}</div>
          </div>
        )}
      </div>
    </div>

    <div>
      <DataRemovalToolGuide />
    </div>
    </>
  );
};

export default DataRemovalTool;
