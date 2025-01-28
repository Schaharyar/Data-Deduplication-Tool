'use client';

import React, { useState } from 'react';

const DataRemovalTool = () => {
  const [oldData, setOldData] = useState('');
  const [newData, setNewData] = useState('');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    const oldDataSet = new Set(oldData.split('\n').map((item) => item.trim()));
    const filteredNewData = newData
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => !oldDataSet.has(item));

    if (filteredNewData.length === 0) {
      window.alert('No data to remove.');
    }

    setResult(filteredNewData.join('\n'));
  };

  const handleClear = () => {
    setOldData('');
    setNewData('');
    setResult('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => {
      window.alert('Processed data copied to clipboard!');
    });
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-orange-500 mb-6">Data Deduplication Tool</h1>
      <div className="w-full max-w-3xl p-6 bg-gray-700 rounded-lg shadow-lg mb-6">
        <textarea
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-base text-white mb-4"
          rows={6}
          placeholder="Paste old data here..."
          value={oldData}
          onChange={(e) => setOldData(e.target.value)}
        ></textarea>
        <textarea
          className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-base text-white mb-4"
          rows={6}
          placeholder="Paste new data here..."
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
        ></textarea>
        <div className="flex justify-between">
          <button
            onClick={handleProcess}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Remove Duplicates
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="w-full max-w-3xl p-6 bg-gray-700 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">Processed Data:</h2>
          <textarea
            className="w-full p-3 bg-gray-600 border border-gray-500 rounded-md text-base text-white mb-4"
            rows={6}
            value={result}
            readOnly
          ></textarea>
          <button
            onClick={handleCopy}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium shadow-md"
          >
            Copy All
          </button>
        </div>
      )}
    </div>
  );
};

export default DataRemovalTool;
