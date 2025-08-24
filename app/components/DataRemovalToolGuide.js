import React from "react";

const DataRemovalToolGuide = () => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">How to Use the Deduplication Tool</h2>
      <p className="text-gray-600 mb-6">
        The <span className="font-medium">Deduplication Tool</span> is designed to clean and filter 
        large datasets efficiently. It works with <span className="font-medium">domains, URLs, email addresses, numbers, or any line-based data</span>. 
        The tool compares two datasets — a <span className="font-medium">Reference Data</span> list and a 
        <span className="font-medium"> Compare Data</span> list — and removes duplicates and overlaps in seconds.
      </p>

      <h3 className="text-xl font-semibold mb-2">📌 Input Fields</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>
          <span className="font-medium">Reference Data:</span> The dataset you want to compare against.
          <ul className="list-disc list-inside ml-5 text-gray-600">
            <li>Duplicates inside this field are automatically removed.</li>
            <li>If any line from Compare Data exists here, it will be excluded from the final results.</li>
            <li>Example: A blacklist of emails, previously processed records, or blocked domains.</li>
          </ul>
        </li>
        <li>
          <span className="font-medium">Compare Data:</span> The dataset you want to clean and filter.
          <ul className="list-disc list-inside ml-5 text-gray-600">
            <li>Duplicates inside this field are also removed during processing.</li>
            <li>Entries that appear in Reference Data will be filtered out.</li>
            <li>Example: A fresh email list, new domain collection, or imported dataset.</li>
          </ul>
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">⚙️ Options</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li><span className="font-medium">Case Sensitive:</span> Decide if <code>Example.com</code> and <code>example.com</code> should be treated as the same or different values.</li>
        <li><span className="font-medium">Trim Whitespace:</span> Removes unnecessary spaces at the beginning or end of each line.</li>
        <li><span className="font-medium">Ignore Empty Lines:</span> Skips over blank lines automatically, keeping your dataset clean.</li>
        <li><span className="font-medium">Undo / Redo:</span> Both input fields support undo and redo so you can safely revert or reapply edits.</li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">🚀 Processing</h3>
      <p className="text-gray-600 mb-6">
        Clicking <span className="font-medium">Process</span> triggers a <span className="font-medium">Web Worker</span> 
        that runs in the background. This allows the tool to handle very large datasets without freezing your browser. 
        It can handle millions of lines depending on your system memory, though pasting extremely large files 
        (1M+ lines at once) may still feel slow in the input fields.
      </p>

      <h3 className="text-xl font-semibold mb-2">📋 Copying Results</h3>
      <p className="text-gray-600 mb-6">
        Every field has a <span className="font-medium">Copy</span> button so you can instantly copy 
        reference data, compare data, or cleaned results. This makes it easy to export your processed dataset 
        into spreadsheets, automation scripts, or other tools.
      </p>

      <h3 className="text-xl font-semibold mb-2">✅ Example Workflow</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Paste your <span className="font-medium">new dataset</span> (e.g., domains, emails, or numbers) into <span className="font-medium">Compare Data</span>.</li>
        <li>Paste your <span className="font-medium">Reference Data</span> (e.g., blacklist, master list, or old records) into the reference field.</li>
        <li>Enable <span className="font-medium">Trim Whitespace</span> and <span className="font-medium">Ignore Empty Lines</span> for cleaner processing.</li>
        <li>Click <span className="font-medium">Process</span> to remove duplicates and overlaps.</li>
        <li>Copy the <span className="font-medium">cleaned results</span> and use them in your workflow.</li>
      </ol>
    </div>
  );
};

export default DataRemovalToolGuide;
