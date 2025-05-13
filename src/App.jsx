import React, { useState, useEffect, useRef } from 'react';
import DragonBoatSeatingChart from './DragonBoatSeatingChart';
import Papa from 'papaparse';
import './App.css';

function App() {
  // Set of all paddlers from CSV
  const [allPaddlers, setAllPaddlers] = useState([]);
  // Paddlers selected by user (up to 20)
  const [selectedPaddlers, setSelectedPaddlers] = useState([]);
  // Initial seating chart, after loading from csv and accounting for empty seats
  const [seatingChart, setSeatingChart] = useState([]);
  // Stores weight distribution stats
  const [weightStats, setWeightStats] = useState({ frontWeight: 0, backWeight: 0, leftWeight: 0, rightWeight: 0 });
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
              side: p.side.toLowerCase()
            }));
            setAllPaddlers(parsed);
          }
        });
      });
  }, []);

  // Toggle paddler selection for inclusion in boat
  const togglePaddler = (paddler) => {
    const isSelected = selectedPaddlers.some(sp => sp.name === paddler.name);
    if (isSelected) {
      setSelectedPaddlers(selectedPaddlers.filter(p => p.name !== paddler.name));
      setSelectionError("");
    } else if (selectedPaddlers.length < 20) {
      setSelectedPaddlers([...selectedPaddlers, paddler]);
      setSelectionError("");
    } else {
      setSelectionError("You can only select up to 20 paddlers.");
    }
  };

  // Check if paddler can sit on a particular side
  const canSit = (paddler, side) => paddler.side === 'either' || paddler.side === side;

  // Create initial semi-balanced seating chart
  const createSeatingChart = () => {
    let paddlers = [...selectedPaddlers];

    // Fill remaining seats with empty paddlers
    const emptiesNeeded = 20 - paddlers.length;
    const empties = Array.from({ length: emptiesNeeded }, () => ({ name: 'Empty', weight: 0, side: 'either' }));
    paddlers = [...paddlers, ...empties];

    // Sort paddlers by weight (descending)
    paddlers.sort((a, b) => b.weight - a.weight);

    const leftSide = [];
    const rightSide = [];

    // Greedy placement of paddlers to balance sides
    for (const paddler of paddlers) {
      const leftWeight = leftSide.reduce((sum, p) => sum + p.weight, 0);
      const rightWeight = rightSide.reduce((sum, p) => sum + p.weight, 0);

      if (canSit(paddler, 'left') && (leftWeight <= rightWeight || !canSit(paddler, 'right'))) {
        leftSide.push(paddler);
      } else {
        rightSide.push(paddler);
      }
    }

    // Fill remaining seats on either side
    while (leftSide.length < 10) leftSide.push({ name: 'Empty', weight: 0, side: 'either' });
    while (rightSide.length < 10) rightSide.push({ name: 'Empty', weight: 0, side: 'either' });

    // Construct seating chart rows
    const rows = Array.from({ length: 10 }, (_, i) => ({
      left: leftSide[i],
      right: rightSide[i]
    }));

    // Calculate weight stats
    const frontWeight = rows.slice(0, 5).reduce((sum, row) => sum + row.left.weight + row.right.weight, 0) + parseInt(extraFrontWeight || 0, 10);
    const backWeight = rows.slice(5).reduce((sum, row) => sum + row.left.weight + row.right.weight, 0) + parseInt(extraBackWeight || 0, 10);
    const leftWeight = rows.reduce((sum, row) => sum + row.left.weight, 0);
    const rightWeight = rows.reduce((sum, row) => sum + row.right.weight, 0);

    // Save results
    setSeatingChart(rows.flatMap(row => [row.left, row.right]));
    setWeightStats({ frontWeight, backWeight, leftWeight, rightWeight });
    setTimeout(() => {
      seatingChartRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100); // slight delay to ensure DOM has updated
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
            const isSelected = selectedPaddlers.some(sp => sp.name === p.name);
            const isDisabled = !isSelected && selectedPaddlers.length >= 20;
            return (
              <div
                key={p.name}
                onClick={() => !isDisabled && togglePaddler(p)}
                className={`cursor-pointer px-3 py-2 rounded-lg border transition-colors duration-200 
                  ${isSelected ? 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700' : 'bg-white border-gray-300 hover:bg-purple-50 hover:border-purple-200'}
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {p.name}
              </div>
            );
          })}
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

        {/* Button to create seating chart */}
        <div className="flex items-start gap-8 mt-8">
          <button
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            onClick={createSeatingChart}
            disabled={selectedPaddlers.length === 0}
          >
            Create Chart
          </button>
        </div>
      </div>

      {/* Show seating chart once generated */}

      {seatingChart.length > 0 && (
        <div ref={seatingChartRef} className="seating-display">
          <h2 className="font-bold text-lg text-gray-900 mb-4">Boat Seating</h2>
          <p className="mb-3"> Press down, then drag & drop to change positions. Note that right side can be slightly heavier due to steering mechanism on left.</p>
          <DragonBoatSeatingChart
            // seatingChart={seatingChart.flatMap(row => [row.left, row.right])}
            seatingChart={seatingChart}
            updateSeatingChart={updateSeatingChart}
            extraFrontWeight={extraFrontWeight}
            extraBackWeight={extraBackWeight}
          />
        </div>
      )}
    </div>
  );
}

export default App;
