// UploadRoster.js
// Handles uploading a roster .csv file if no roster exists on server
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { handleRosterResults } from '../utils/StorageHelpers';

const UploadRoster = () => {

  // User upload of roster
  const handleRosterUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csv = event.target.result;
      Papa.parse(csv, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          handleRosterResults(results);
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <section>
      <h2>Upload your team's roster</h2>
      <div className="space-y-2">
        <input
          className="file:button-alt"
          type="file"
          accept=".csv"
          onChange={handleRosterUpload}
        />
        <p className="text-sm text-slate-600">
          Expected columns: <code>name</code>, <code>weight</code>, <code>side</code>, <code>role</code>
        </p>
        <p className="text-sm">
          <a href="/example-paddlers.csv" download>
            Download CSV template
          </a>. Read the instructions!
        </p>
      </div>
    </section>
  );

};

export default UploadRoster;