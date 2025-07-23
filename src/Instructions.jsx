// Instructions.jsx
import React from 'react';

function Instructions() {
  return (
    <div>
      <h2 className="font-bold text-lg text-slate-900 mb-4">How to Use the Seating Chart</h2>
      <ul className="list-disc list-inside space-y-2 text-slate-700">
        <li>Import paddlers from the CSV automatically on load.</li>
        <li>Select up to 20 paddlers to place in the boat.</li>
        <li>Choose a stern and drummer from the dropdowns.</li>
        <li>Drag and drop paddlers to rearrange seating.</li>
        <li>Use the dropdown to load a saved seating chart from a CSV file.</li>
        <li>Click "Clear Chart" to reset all selections.</li>
        <li>Use the "Export Seating Chart" button to download the current layout.</li>
      </ul>
      <h2>
        Balancing strategies
      </h2>
      <p>Slightly left-heavy is better than slightly right-heavy as the stern can more easily balance out a left-heavy boat by standing on the right.</p>
      <p>Some teams like having the boat a bit front-heavy for race day. ADD MORE DETAILS</p>
    </div>
  );
}

export default Instructions;
