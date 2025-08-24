import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Copy, Loader2, ChevronLeft, ChevronRight, Download, X, Check } from "lucide-react";
import { toast } from "sonner";
import DomainSeparatorGuide from "./DomainSeparatorGuide";

export default function DomainSeparator() {
  const [inputData, setInputData] = useState("");
  const [sortedDomains, setSortedDomains] = useState({});
  const [errorDomains, setErrorDomains] = useState([]);
  const [currentErrorIndex, setCurrentErrorIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const domainStats = useMemo(() => {
    const stats = {
      total: 0,
      valid: 0,
      invalid: 0,
      extensions: 0
    };
    
    stats.total = inputData.split("\n").filter(Boolean).length;
    stats.valid = Object.values(sortedDomains).reduce((sum, arr) => sum + arr.length, 0);
    stats.invalid = errorDomains.length;
    stats.extensions = Object.keys(sortedDomains).length;
    
    return stats;
  }, [inputData, sortedDomains, errorDomains]);

  const handleSort = () => {
    setIsProcessing(true);
    setTimeout(() => { // Simulate processing delay
      try {
        setErrorDomains([]);
        const lines = inputData.split("\n")
          .map(line => line.trim().toLowerCase().replace(/[\/\#]/g, ""))
          .filter(Boolean);
        
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
        
        toast.success(`Processed ${lines.length} domains`);
      } catch (error) {
        toast.error("Error processing domains");
        console.error(error);
      } finally {
        setIsProcessing(false);
      }
    }, 300);
  };

  const handleDownload = (format) => {
    if (Object.keys(sortedDomains).length === 0) {
      toast.warning("No data to export");
      return;
    }

    try {
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
        toast.success("CSV downloaded");
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
        toast.success("Excel file downloaded");
      }
    } catch (error) {
      toast.error("Failed to export data");
      console.error(error);
    }
  };

  const handleCopy = () => {
    if (Object.keys(sortedDomains).length === 0) {
      toast.warning("No data to copy");
      return;
    }

    try {
      let textContent = "";
      const maxRows = Math.max(...Object.values(sortedDomains).map(arr => arr.length));
      for (let i = 0; i < maxRows; i++) {
        textContent += Object.keys(sortedDomains)
          .map(ext => sortedDomains[ext][i] || "")
          .filter(Boolean)
          .join("\n") + "\n";
      }
      
      navigator.clipboard.writeText(textContent.trim()).then(() => {
        setCopied(true);
        toast.success("Copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (error) {
      toast.error("Failed to copy data");
      console.error(error);
    }
  };

  const handleReset = () => {
    setInputData("");
    setSortedDomains({});
    setErrorDomains([]);
    setCurrentErrorIndex(0);
    toast.info("Reset all data");
  };

  return (
    <>
    <div className="p-6 text-gray-100 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900">
      <h1 className="text-3xl font-bold mb-4 text-orange-400">Domain Separator</h1>
      
      {/* Stats Bar */}
      <div className="w-full max-w-6xl bg-gray-800 rounded-lg p-3 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-orange-400 font-bold">{domainStats.total}</div>
          <div className="text-sm">Total Domains</div>
        </div>
        <div className="text-center">
          <div className="text-green-400 font-bold">{domainStats.valid}</div>
          <div className="text-sm">Valid Domains</div>
        </div>
        <div className="text-center">
          <div className="text-red-400 font-bold">{domainStats.invalid}</div>
          <div className="text-sm">Invalid Domains</div>
        </div>
        <div className="text-center">
          <div className="text-blue-400 font-bold">{domainStats.extensions}</div>
          <div className="text-sm">Extensions</div>
        </div>
      </div>

      {/* Error Display */}
      {errorDomains.length > 0 && (
        <div className="w-full max-w-6xl bg-red-900/50 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentErrorIndex(Math.max(0, currentErrorIndex - 1))}
              disabled={currentErrorIndex === 0}
            >
              <ChevronLeft size={18} />
            </Button>
            <div className="mx-4">
              <span className="font-medium">Invalid domain ({currentErrorIndex + 1}/{errorDomains.length}):</span>
              <span className="ml-2 font-mono">{errorDomains[currentErrorIndex]}</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setCurrentErrorIndex(Math.min(errorDomains.length - 1, currentErrorIndex + 1))}
              disabled={currentErrorIndex === errorDomains.length - 1}
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-6xl">
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 rounded-lg p-3 mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-orange-300">Input Domains</h2>
            <div className="text-sm text-gray-400">
              {inputData.split("\n").filter(Boolean).length} domains
            </div>
          </div>
          <textarea
            className="w-full h-96 p-3 bg-gray-700 border border-gray-600 rounded-lg resize-none overflow-auto text-gray-100 font-mono text-sm"
            placeholder="Enter domains (one per line)..."
            value={inputData}
            onChange={e => setInputData(e.target.value)}
          />
        </div>

        <div className="w-full md:w-1/2">
          <div className="bg-gray-800 rounded-lg p-3 mb-2 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-orange-300">Sorted Results</h2>
            <div className="text-sm text-gray-400">
              {Object.keys(sortedDomains).length} extensions
            </div>
          </div>
          <div className="w-full h-96 bg-gray-700 border border-gray-600 rounded-lg overflow-auto">
            {Object.keys(sortedDomains).length > 0 ? (
              <table className="w-full border-collapse">
                <thead className="sticky top-0">
                  <tr className="bg-gray-600">
                    {Object.keys(sortedDomains).map(ext => (
                      <th key={ext} className="p-2 text-orange-400 text-left">
                        .{ext} <span className="text-gray-300">({sortedDomains[ext].length})</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.max(...Object.values(sortedDomains).map(arr => arr.length), 0) }).map((_, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-gray-600 hover:bg-gray-650">
                      {Object.keys(sortedDomains).map(ext => (
                        <td 
                          key={ext} 
                          className={`p-2 font-mono text-sm ${errorDomains.includes(sortedDomains[ext][rowIndex]) ? "text-red-400" : "text-gray-300"}`}
                        >
                          {sortedDomains[ext][rowIndex] || ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  "Processed results will appear here"
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Button 
          onClick={handleSort} 
          disabled={isProcessing || !inputData.trim()}
          className="bg-orange-500 hover:bg-orange-600 flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Processing...
            </>
          ) : (
            <>
              <Check size={18} />
              Sort Domains
            </>
          )}
        </Button>
        
        <Button 
          onClick={handleCopy} 
          disabled={Object.keys(sortedDomains).length === 0}
          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-2"
        >
          <Copy size={18} />
          {copied ? "Copied!" : "Copy Results"}
        </Button>
        
        <Button 
          onClick={() => handleDownload("xlsx")} 
          disabled={Object.keys(sortedDomains).length === 0}
          className="bg-green-500 hover:bg-green-600 flex items-center gap-2"
        >
          <Download size={18} />
          Excel
        </Button>
        
        <Button 
          onClick={() => handleDownload("csv")} 
          disabled={Object.keys(sortedDomains).length === 0}
          className="bg-purple-500 hover:bg-purple-600 flex items-center gap-2"
        >
          <Download size={18} />
          CSV
        </Button>
        
        <Button 
          onClick={handleReset} 
          className="bg-gray-600 hover:bg-gray-500 flex items-center gap-2"
        >
          <X size={18} />
          Reset
        </Button>
      </div>
    </div>

    <div>
      <DomainSeparatorGuide />
    </div>
    </>
  );
}