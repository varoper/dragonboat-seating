// LoadStoredSeatingChart.js
// Handles loading and rendering of seating chart .csv files stored in /charts/ on the server
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { storeSeatingChart, storeFlagcatcher, storeDrummer, storeStern, clearStorage, emptyChart } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

// Inputs for additional front and back weight 
const LoadStoredSeatingChart = () => {

  const availableCharts = useStore((state) => state.availableCharts);
  const selectedChart = useStore((state) => state.selectedChart);
  const setSelectedChart = useStore((state) => state.setSelectedChart);
  const allPaddlers = useStore((state) => state.allPaddlers);
  const allSterns = useStore((state) => state.allSterns);
  const allDrummers = useStore((state) => state.allDrummers);
  const allFlagcatchers = useStore((state) => state.allFlagcatchers);
  const setMissingPaddlers = useStore((state) => state.setMissingPaddlers);

  // Import a seating chart stored on the server, if exists
  const loadSeatingChartFromCSV = async (fileName) => {
    try {
      const response = await fetch(`./charts/${fileName}`);
      const csvText = await response.text();
      const { data, errors } = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true });
      if (errors.length > 0) return console.error('CSV parsing errors:', errors);

      const newChart = [...emptyChart()];
      const missing = []; // track names not found in roster

      data.forEach(({ name, seat }) => {
        let paddler =
          allPaddlers.find(p => p.name === name) ||
          allSterns.find(p => p.name === name) ||
          allFlagcatchers.find(p => p.name === name) ||
          allDrummers.find(p => p.name === name);

        if (!paddler) {
          missing.push({ name, seat });
          paddler = { name: 'Empty', weight: 0, side: 'either' };
        }

        if (seat === 'flagcatcher') storeFlagcatcher(paddler);
        if (seat === 'drummer') storeDrummer(paddler);
        else if (seat === 'stern') storeStern(paddler);
        else {
          const match = seat.match(/^([1-9]|10)([LR])$/i);
          if (match) {
            const row = parseInt(match[1], 10);
            const side = match[2].toUpperCase();
            const index = (row - 1) * 2 + (side === 'L' ? 0 : 1);
            if (index < newChart.length) newChart[index] = paddler;
          }
        }
      });
      storeSeatingChart(newChart);
      setMissingPaddlers(missing);
    } catch (err) {
      console.error('Failed to load CSV:', err);
    }
  };

  return (
    <section>
      <h2>Load a stored seating chart</h2>
      <div className="mb-6">
        <fieldset>
          <label>Choose a chart</label>
          <select
            value={selectedChart}
            onChange={(e) => {
              const file = e.target.value;
              if (file) {
                clearStorage(); // clear state and stored values
                setSelectedChart(file); // set selected chart AFTER clearing
                setTimeout(() => {
                  loadSeatingChartFromCSV(file); // delay to allow state to reset
                }, 0);
              } else {
                setSelectedChart('');
              }
            }}
          >
            <option value="">-- Select --</option>
            {availableCharts.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
        </fieldset>
      </div>
    </section>
  );

};

export default LoadStoredSeatingChart;