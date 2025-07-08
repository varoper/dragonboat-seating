// Instructions.jsx
import React from 'react';

function Instructions() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">How to Use the Seating Chart</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>Import paddlers from the CSV automatically on load.</li>
        <li>Select up to 20 paddlers to place in the boat.</li>
        <li>Choose a stern and drummer from the dropdowns.</li>
        <li>Drag and drop paddlers to rearrange seating.</li>
        <li>Use the dropdown to load a saved seating chart from a CSV file.</li>
        <li>Click "Clear Chart" to reset all selections.</li>
        <li>Use the "Export Seating Chart" button to download the current layout.</li>
      </ul>
    </div>
  );
}

export default Instructions;
