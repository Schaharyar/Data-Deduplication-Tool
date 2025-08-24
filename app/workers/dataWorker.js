self.onmessage = (e) => {
  const { oldData, newData, options } = e.data;

  const { caseSensitive, trimWhitespace, ignoreEmptyLines, sortResults } = options;

  const processItem = (item) => {
    let processed = trimWhitespace ? item.trim() : item;
    if (!caseSensitive) processed = processed.toLowerCase();
    return processed;
  };

  const oldDataSet = new Set(
    oldData.split("\n")
      .filter(line => !ignoreEmptyLines || line.trim())
      .map(processItem)
  );

  const newLines = newData.split("\n").filter(line => !ignoreEmptyLines || line.trim());

  let filtered = [];
  const chunkSize = 10000;

  for (let i = 0; i < newLines.length; i++) {
    let item = trimWhitespace ? newLines[i].trim() : newLines[i];
    if (!oldDataSet.has(processItem(item))) {
      filtered.push(item);
    }

    if (i % chunkSize === 0) {
      const progress = Math.round((i / newLines.length) * 100);
      postMessage({ type: "progress", payload: progress });
    }
  }

  if (sortResults) {
    filtered = filtered.sort((a, b) => a.localeCompare(b));
  }

  postMessage({ type: "done", payload: filtered });
};
