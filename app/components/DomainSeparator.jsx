import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

export default function DomainSeparator() {
  const [inputData, setInputData] = useState("");
  const [sortedDomains, setSortedDomains] = useState({});
  const [errorDomains, setErrorDomains] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);

  const handleSort = () => {
    setErrorDomains([]);
    const lines = inputData.split("\n").map(line => line.trim().toLowerCase().replace(/[\/\#]/g, "")).filter(Boolean);
    const sorted = {};
    const invalidDomains = [];
    
    lines.forEach(domain => {
      if (!/^[a-zA-Z0-9.-]+$/.test(domain)) {
        invalidDomains.push(domain);
        return;
      }
      const parts = domain.split(".");
      if (parts.length > 1) {
        const extension = parts.pop();
        const baseDomain = parts.join(".");
        if (!sorted[extension]) sorted[extension] = [];
        sorted[extension].push(baseDomain + "." + extension);
      }
    });

    Object.keys(sorted).forEach(ext => sorted[ext].sort());
    setSortedDomains(sorted);
    setErrorDomains(invalidDomains);
    setCurrentErrorIndex(0);
  };

  const handleDownload = (format) => {
    if (format === "csv") {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += Object.keys(sortedDomains).join(",") + "\n";
      const maxRows = Math.max(...Object.values(sortedDomains).map(arr => arr.length));
      for (let i = 0; i < maxRows; i++) {
        csvContent += Object.keys(sortedDomains).map(ext => sortedDomains[ext][i] || "").join(",") + "\n";
      }
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "sorted_domains.csv");
      document.body.appendChild(link);
      link.click();
    } else {
      const wsData = [];
      const headers = Object.keys(sortedDomains);
      wsData.push(headers);
      const maxRows = Math.max(...headers.map(ext => sortedDomains[ext].length));
      for (let i = 0; i < maxRows; i++) {
        wsData.push(headers.map(ext => sortedDomains[ext][i] || ""));
      }
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Domains");
      XLSX.writeFile(wb, "sorted_domains.xlsx");
    }
  };

  const handleReset = () => {
    setInputData("");
    setSortedDomains({});
    setErrorDomains([]);
    setCurrentErrorIndex(0);
  };

  return (
    <div className="p-6 min-h-screen text-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <h1 className="text-3xl font-bold mb-4 text-orange-400">Domain Separator</h1>
      {errorDomains.length > 0 && (
        <div className="text-red-500 mb-2 flex items-center">
          <Button onClick={() => setCurrentErrorIndex(Math.max(0, currentErrorIndex - 1))}>
            &lt;
          </Button>
          <span className="mx-2">Invalid domain detected: {errorDomains[currentErrorIndex]}</span>
          <Button onClick={() => setCurrentErrorIndex(Math.min(errorDomains.length - 1, currentErrorIndex + 1))}>
            &gt;
          </Button>
        </div>
      )}
      <div className="flex gap-4 w-full max-w-6xl">
        <textarea
          className="w-1/2 h-96 p-2 bg-gray-700 border border-gray-600 rounded-lg resize-none overflow-auto text-gray-100"
          placeholder="Enter raw domains..."
          value={inputData}
          onChange={e => setInputData(e.target.value)}
        />
        <div className="w-1/2 h-96 p-2 bg-gray-700 border border-gray-600 rounded-lg overflow-auto text-gray-100">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-600">
                {Object.keys(sortedDomains).map(ext => (
                  <th key={ext} className="p-2 text-orange-400">.{ext} ({sortedDomains[ext].length})</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(...Object.values(sortedDomains).map(arr => arr.length), 0) }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b border-gray-600">
                  {Object.keys(sortedDomains).map(ext => (
                    <td key={ext} className={errorDomains.includes(sortedDomains[ext][rowIndex]) ? "p-2 bg-orange-500" : "p-2 text-gray-100"}>
                      {sortedDomains[ext][rowIndex] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <Button onClick={handleSort} className="bg-orange-500 hover:bg-orange-600">Sort Domains</Button>
        <Button onClick={() => handleDownload("xlsx")} className="bg-green-500 hover:bg-green-600">Download Excel</Button>
        <Button onClick={() => handleDownload("csv")} className="bg-blue-500 hover:bg-blue-600">Download CSV</Button>
        <Button onClick={handleReset} className="bg-red-500 hover:bg-red-600">Reset</Button>
      </div>
    </div>
  );
}
