import React, { useState, useEffect, useRef } from 'react';
import DragonBoatSeatingChart from './DragonBoatSeatingChart';
import Papa from 'papaparse';
import './App.css';

function App() {
  // Set of all paddlers from CSV
  const [allPaddlers, setAllPaddlers] = useState([]);
  const [allSterns, setAllSterns] = useState([]);
  // Paddlers selected by user (up to 20)
  const [selectedPaddlers, setSelectedPaddlers] = useState([]);
  // Initial seating chart, after loading from csv and accounting for empty seats
  const [seatingChart, setSeatingChart] = useState([]);
  // Stores weight distribution stats
  // Stern;
  const [stern, setStern] = useState(null);
  // Error for selecting too many paddlers
  const [selectionError, setSelectionError] = useState("");
  const [extraFrontWeight, setExtraFrontWeight] = useState(0);
  const [extraBackWeight, setExtraBackWeight] = useState(0);
  const seatingChartRef = useRef(null);

  // Load paddler data from CSV on first render
  useEffect(() => {
    fetch('/paddlers.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const parsed = results.data.map(p => ({
              name: p.name,
              weight: parseInt(p.weight, 10),
              side: p.side.toLowerCase(),
              role: p.role.toLowerCase() || '',
            }));
            setAllPaddlers(parsed.filter(p => p.side !== 'none'));
            setAllSterns(parsed.filter(p => p.role === 'stern'));
          }
        });
      });
  }, []);

  // Initialize seating chart with 20 empty seats
  useEffect(() => {
    const initialEmpties = Array.from({ length: 20 }, () => ({
      name: 'Empty',
      weight: 0,
      side: 'either',
    }));
    setSeatingChart(initialEmpties);
  }, []);

  // If a stern is selected, ensure they are removed from seatingChart
  useEffect(() => {
    if (stern) {
      setSeatingChart(prev => prev.map(seat => seat.name === stern.name ? { name: 'Empty', weight: 0, side: 'either' } : seat));
    }
  }, [stern]);

  // Handle selecting a paddler
  const handlePaddlerClick = (paddler) => {
    const indexInChart = seatingChart.findIndex(seat => seat.name === paddler.name);

    // If paddler is already in seating chart, remove them
    if (indexInChart !== -1) {
      const newChart = [...seatingChart];
      newChart[indexInChart] = { name: 'Empty', weight: 0, side: 'either' };
      setSeatingChart(newChart);
      setSelectionError("");
      return;
    }

    // Otherwise, try to add paddler to the first empty seat
    const emptyIndex = seatingChart.findIndex(seat => seat.name === 'Empty');
    if (emptyIndex === -1) {
      setSelectionError("All seats are filled. Remove a paddler before adding a new one.");
      return;
    }

    // Assign paddler to the empty seat
    const newChart = [...seatingChart];
    newChart[emptyIndex] = paddler;
    setSeatingChart(newChart);
    setSelectionError("");
  };

  // Updates the seating chart from drag & drop
  const updateSeatingChart = (seats) => {
    setSeatingChart(seats);
  };

  return (
    <div className="App">
      <h1 className="font-bold text-xl text-gray-900 mb-2 p-3">Nichi Seating Chart</h1>
      <div className="paddler-selection">
        <p className="mb-4 font-semibold">Select up to 20 paddlers.</p>

        {/* Display error message if too many paddlers selected */}
        {selectionError && <p style={{ color: 'red' }}>{selectionError}</p>}

        {/* Render paddler names as selectable containers */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allPaddlers.map((p) => {
            const isInChart = seatingChart.some(seat => seat.name === p.name);
            const noEmptySeats = !seatingChart.some(seat => seat.name === 'Empty');
            const isDisabled = (!isInChart && (stern && stern.name === p.name)) || (!isInChart && noEmptySeats);

            return (
              <div
                key={p.name}
                onClick={() => !isDisabled && handlePaddlerClick(p)}
                className={`cursor-pointer px-3 py-2 rounded-lg border transition-colors duration-200 
                   ${isInChart ? 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700' : 'bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-200'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {p.name}
              </div>
            );
          })}
        </div>

        {/* Stern selection dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select stern</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={stern ? stern.name : ''}
            onChange={(e) => {
              const selected = allSterns.find(p => p.name === e.target.value);
              setStern(selected || null);
            }}
          >
            <option value="">- Select -</option>
            {allSterns.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Inputs for additional front and back weight */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extra front weight</label>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-24"
              value={extraFrontWeight}
              onChange={(e) => setExtraFrontWeight(e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Extra back weight</label>
            <input
              type="number"
              className="border border-gray-300 rounded px-2 py-1 w-24"
              value={extraBackWeight}
              onChange={(e) => setExtraBackWeight(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
        <p>Steering mechanism + paddle, estimated at 15lbs, has already been accounted for.</p>
      </div>

      {/* Show seating chart once generated */}

      {seatingChart.length > 0 && (
        <div ref={seatingChartRef} className="seating-display">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Boat Seating</h2>
          <p className="mb-3"> Press down, then drag & drop to change positions. Right side can be slightly heavier due to steering mechanism on left.</p>
          <DragonBoatSeatingChart
            seatingChart={seatingChart}
            updateSeatingChart={updateSeatingChart}
            stern={stern}
            extraFrontWeight={extraFrontWeight}
            extraBackWeight={extraBackWeight}
          />
        </div>
      )}
    </div>
  );
}

export default App;
