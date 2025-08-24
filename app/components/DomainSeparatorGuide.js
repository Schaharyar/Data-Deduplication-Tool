import React from "react";

const DomainSeparatorGuide = () => {
  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">
        How to Use the Domain Separator Tool
      </h2>
      <p className="text-gray-600 mb-6">
        The <span className="font-medium">Domain Separator Tool</span> helps you
        organize, validate, and sort domain lists by their{" "}
        <span className="font-medium">extensions (TLDs)</span>. It also detects
        invalid domains and highlights errors for quick review. Perfect for
        cleaning large domain datasets before analysis, exporting, or campaign
        use.
      </p>

      <h3 className="text-xl font-semibold mb-2">📌 Input Fields</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>
          <span className="font-medium">Input Domains:</span> Paste your raw
          domain list (one domain per line).
          <ul className="list-disc list-inside ml-5 text-gray-600">
            <li>Automatically trims spaces and normalizes input to lowercase.</li>
            <li>Filters out special characters like <code>/</code> and{" "}
              <code>#</code>.
            </li>
            <li>Counts the total number of domains entered.</li>
          </ul>
        </li>
        <li>
          <span className="font-medium">Sorted Results:</span> Displays valid
          domains grouped by their <code>.extension</code>.
          <ul className="list-disc list-inside ml-5 text-gray-600">
            <li>
              Each column represents one TLD (e.g., <code>.com</code>,{" "}
              <code>.net</code>, <code>.org</code>).
            </li>
            <li>
              Invalid domains are excluded and flagged separately for review.
            </li>
          </ul>
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">⚙️ Features</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>
          <span className="font-medium">Domain Validation:</span> Ensures each
          entry matches a valid domain format (<code>letters, numbers, hyphens</code>).
        </li>
        <li>
          <span className="font-medium">Error Navigation:</span> Use arrow
          controls to cycle through invalid domains one by one.
        </li>
        <li>
          <span className="font-medium">Live Stats:</span> Tracks{" "}
          <span className="font-medium">Total Domains, Valid, Invalid,</span>{" "}
          and <span className="font-medium">Extensions</span>.
        </li>
        <li>
          <span className="font-medium">Sorting:</span> Groups domains under
          their respective TLDs and sorts alphabetically.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">🚀 Processing</h3>
      <p className="text-gray-600 mb-6">
        Clicking <span className="font-medium">Sort Domains</span> processes
        your dataset instantly. Invalid domains are shown in a red alert box
        with navigation buttons to move between errors. Valid domains are neatly
        displayed in a scrollable results table.
      </p>

      <h3 className="text-xl font-semibold mb-2">📋 Export & Copy Options</h3>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
        <li>
          <span className="font-medium">Copy Results:</span> Instantly copies
          all cleaned domains to your clipboard in plain text.
        </li>
        <li>
          <span className="font-medium">Export to Excel (.xlsx):</span> Domains
          are structured into separate columns by extension.
        </li>
        <li>
          <span className="font-medium">Export to CSV (.csv):</span> Same
          format as Excel but lightweight for scripts and quick imports.
        </li>
        <li>
          <span className="font-medium">Reset:</span> Clears all data and stats
          to start fresh.
        </li>
      </ul>

      <h3 className="text-xl font-semibold mb-2">✅ Example Workflow</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Paste a domain list into <span className="font-medium">Input Domains</span>.</li>
        <li>Click <span className="font-medium">Sort Domains</span> to process and validate.</li>
        <li>Review flagged <span className="font-medium">Invalid Domains</span> (if any).</li>
        <li>Check the <span className="font-medium">Sorted Results</span> grouped by extensions.</li>
        <li>Copy or export the cleaned data using your preferred format (CSV/Excel).</li>
      </ol>
    </div>
  );
};

export default DomainSeparatorGuide;
