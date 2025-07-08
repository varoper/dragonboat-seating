import React, { useState, useEffect, useRef } from 'react';
import DragonBoatSeatingChart from './DragonBoatSeatingChart';
import Cookies from 'js-cookie';
import Papa from 'papaparse';
import './App.css';

const SEATING_COOKIE_KEY = 'seatingChart';
const EXTRA_PADDLERS_COOKIE_KEY = 'extraPaddlers';
const DRUMMER_COOKIE_KEY = 'drummer';
const STERN_COOKIE_KEY = 'stern';

function App() {
  // Set of all paddlers from CSV
  const [allPaddlers, setAllPaddlers] = useState([]);
  const [allSterns, setAllSterns] = useState([]);
  const [allDrummers, setAllDrummers] = useState([]);
  // Initial seating chart, after loading from csv and accounting for empty seats
  const [seatingChart, setSeatingChart] = useState([]);
  // Stores weight distribution stats
  // Stern;
  const [stern, setStern] = useState(null);
  // Drummer;
  const [drummer, setDrummer] = useState(null);
  // Error for selecting too many paddlers
  const [selectionError, setSelectionError] = useState("");
  // Adding new paddler
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaddlerName, setNewPaddlerName] = useState("");
  const [newPaddlerWeight, setNewPaddlerWeight] = useState("");
  // Extra weights
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
            // setAllPaddlers(parsed.filter(p => p.side !== 'none'));
            let fullPaddlers = parsed.filter(p => p.side !== 'none');
            setAllSterns(parsed.filter(p => p.role === 'stern'));
            setAllDrummers(parsed.filter(p => p.role === 'drummer'));

            const extra = Cookies.get(EXTRA_PADDLERS_COOKIE_KEY);
            if (extra) {
              try {
                const extraParsed = JSON.parse(extra);
                fullPaddlers = [...fullPaddlers, ...extraParsed];
              } catch (e) {
                console.error('Invalid extra paddlers cookie:', e);
              }
            }
            setAllPaddlers(fullPaddlers);
          }
        });
      });
  }, []);

  useEffect(() => {
    const savedChart = Cookies.get(SEATING_COOKIE_KEY);
    const savedDrummer = Cookies.get(DRUMMER_COOKIE_KEY);
    const savedStern = Cookies.get(STERN_COOKIE_KEY);

    if (savedDrummer) {
      try {
        const parsedDrummer = JSON.parse(savedDrummer);
        setDrummer(parsedDrummer);
      } catch (e) {
        console.error('Invalid cookie data for drummer:', e);
      }
    }

    if (savedStern) {
      try {
        const parsedStern = JSON.parse(savedStern);
        setStern(parsedStern);
      } catch (e) {
        console.error('Invalid cookie data for stern:', e);
      }
    }

    if (savedChart) {
      try {
        console.log('there is a saved chart!:', JSON.parse(savedChart));
        const parsedChart = JSON.parse(savedChart);
        setSeatingChart(parsedChart);
      } catch (e) {
        console.error('Invalid cookie data for seating chart:', e);
        initializeEmpties(); // fallback
      }
    } else {
      initializeEmpties();
      console.log('initializing empties');
    }

  }, []);

  // Sets seatingChart state & stores as cookie
  const storeSeatingChart = (newChart) => {
    setSeatingChart(newChart);
    Cookies.set(SEATING_COOKIE_KEY, JSON.stringify(newChart), { expires: 365 });
  };

  // Sets Stern state & stores as cookie
  const storeStern = (stern) => {
    setStern(stern);
    Cookies.set(STERN_COOKIE_KEY, JSON.stringify(stern), { expires: 365 });
  };

  // Sets Drummer state & stores as cookie
  const storeDrummer = (drummer) => {
    setDrummer(drummer);
    Cookies.set(DRUMMER_COOKIE_KEY, JSON.stringify(drummer), { expires: 365 });
  };

  // If a stern is selected, ensure they are removed from seatingChart
  useEffect(() => {
    if (stern) {
      const cleanedChart = seatingChart.map(seat =>
        seat.name === stern.name ? { name: 'Empty', weight: 0, side: 'either' } : seat
      );
      storeSeatingChart(cleanedChart);
    }
  }, [stern]);

  // If a drummer is selected, ensure they are removed from seatingChart
  useEffect(() => {
    if (drummer) {
      const cleanedChart = seatingChart.map(seat =>
        seat.name === drummer.name ? { name: 'Empty', weight: 0, side: 'either' } : seat
      );
      storeSeatingChart(cleanedChart);
    }
  }, [drummer]);

  // Initializes empty seating chart.
  const initializeEmpties = () => {
    const initialEmpties = Array.from({ length: 20 }, () => ({
      name: 'Empty',
      weight: 0,
      side: 'either',
    }));
    storeSeatingChart(initialEmpties);
  }

  const clearCookies = () => {
    Cookies.remove(SEATING_COOKIE_KEY);
    Cookies.remove(EXTRA_PADDLERS_COOKIE_KEY);
    Cookies.remove(DRUMMER_COOKIE_KEY);
    Cookies.remove(STERN_COOKIE_KEY);
    initializeEmpties();
    setDrummer(null);
    setStern(null);
  };

  const loadSeatingChartFromCSV = async (fileName) => {
    try {
      const response = await fetch(`/charts/${fileName}`);
      const csvText = await response.text();

      // Parse CSV into JSON
      const { data, errors } = Papa.parse(csvText.trim(), {
        header: true,
        skipEmptyLines: true,
      });

      if (errors.length > 0) {
        console.error('CSV parsing errors:', errors);
        return;
      }

      initializeEmpties(); // Returns an array with 20 empty paddlers + drummer/stern slots
      const newChart = [...seatingChart];

      data.forEach(({ name, seat }) => {
        let paddler =
          allPaddlers.find((p) => p.name === name) ||
          allSterns.find((p) => p.name === name) ||
          allDrummers.find((p) => p.name === name);

        if (!paddler) {
          console.warn(`Paddler not found: ${name}`);
          return;
        }

        let seatIndex = null;

        if (seat === 'drummer') {
          storeDrummer(paddler);
        } else if (seat === 'stern') {
          storeStern(paddler);
        } else {
          const match = seat.match(/^(\d{1,2})([LR])$/i);
          if (match) {
            const row = parseInt(match[1], 10);
            const side = match[2].toUpperCase();
            if (row >= 1 && row <= 10 && (side === 'L' || side === 'R')) {
              seatIndex = (row - 1) * 2 + (side === 'L' ? 0 : 1);
            }
          }
        }

        if (seatIndex !== null && seatIndex >= 0 && seatIndex < newChart.length) {
          newChart[seatIndex] = paddler;
        } else {
          console.warn(`Invalid seat for ${name}: ${seat}`);
        }
      });

      storeSeatingChart(newChart);
    } catch (err) {
      console.error('Failed to load CSV seating chart:', err);
    }
  };

  const exportSeatingChartToCSV = () => {
    const csvRows = [['name', 'seat']];

    // Add drummer
    if (drummer && drummer.name !== 'Empty') {
      csvRows.push([drummer.name, 'drummer']);
    }

    // Add seating chart (20 seats)
    seatingChart.forEach((paddler, index) => {
      if (paddler && paddler.name !== 'Empty') {
        const row = Math.floor(index / 2) + 1;
        const side = index % 2 === 0 ? 'L' : 'R';
        csvRows.push([paddler.name, `${row}${side}`]);
      }
    });

    // Add stern
    if (stern && stern.name !== 'Empty') {
      csvRows.push([stern.name, 'stern']);
    }

    // Convert to CSV string
    const csvString = csvRows.map(row => row.join(',')).join('\n');

    // Generate random filename
    const randomString = Math.random().toString(36).substring(2, 10);
    const filename = `chart_${randomString}.csv`;

    // Trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle selecting a paddler
  const handlePaddlerClick = (paddler) => {
    const indexInChart = seatingChart.findIndex(seat => seat.name === paddler.name);

    // If paddler is already in seating chart, remove them
    if (indexInChart !== -1) {
      const newChart = [...seatingChart];
      newChart[indexInChart] = { name: 'Empty', weight: 0, side: 'either' };
      storeSeatingChart(newChart);
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
    storeSeatingChart(newChart);
    setSelectionError("");
  };

  // Updates the seating chart from drag & drop
  const updateSeatingChart = (seats) => {
    storeSeatingChart(seats);
  };

  // Handle adding new paddler to allPaddlers
  const handleAddNewPaddler = () => {
    if (!newPaddlerName || isNaN(parseInt(newPaddlerWeight))) return;

    const newPaddler = {
      name: newPaddlerName,
      weight: parseInt(newPaddlerWeight),
      side: 'either',
      role: ''
    };

    // setAllPaddlers(prev => [...prev, newPaddler]);
    setAllPaddlers(prev => {
      const updated = [...prev, newPaddler];

      // --- Update extraPaddlers cookie ---
      let currentExtras = [];
      const existing = Cookies.get(EXTRA_PADDLERS_COOKIE_KEY);
      if (existing) {
        try {
          currentExtras = JSON.parse(existing);
        } catch (e) {
          console.error('Failed to parse existing extra paddlers:', e);
        }
      }

      const updatedExtras = [...currentExtras, newPaddler];
      Cookies.set(EXTRA_PADDLERS_COOKIE_KEY, JSON.stringify(updatedExtras), { expires: 365 });

      return updated;
    });
    setNewPaddlerName("");
    setNewPaddlerWeight("");
    setShowAddForm(false);
  };

  return (
    <div className="App">
      <h1 className="font-bold text-xl text-gray-900 mb-2 p-3">Nichi Seating Chart</h1>
      <div className="paddler-selection">
        <p className="mb-4 font-semibold">Select up to 20 paddlers.</p>

        {/* Display error message if too many paddlers are selected */}
        {selectionError && <p style={{ color: 'red' }}>{selectionError}</p>}

        {/* Render paddler names as selectable containers */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allPaddlers.map((p) => {
            const isInChart = seatingChart.some(seat => seat.name === p.name);
            const noEmptySeats = !seatingChart.some(seat => seat.name === 'Empty');
            const isDisabled = (!isInChart && (stern && stern.name === p.name)) || (!isInChart && (drummer && drummer.name === p.name)) || (!isInChart && noEmptySeats);

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

        {/* Load from seating chart */}
        <div className="mb-4">
          <button
            className="px-2 py-1 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
            onClick={() => loadSeatingChartFromCSV('current.csv')}
          >
            {'Load from saved chart'}
          </button>
          <button
            className="px-2 py-1 ml-3 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
            onClick={clearCookies}
          >
            {'Clear chart'}
          </button>
        </div>

        {/* Stern & drummer selection dropdowns */}
        <div className="flex gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select drummer</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={drummer ? drummer.name : ''}
              onChange={(e) => {
                const selected = allDrummers.find(p => p.name === e.target.value);
                storeDrummer(selected || null);
              }}
            >
              <option value="">- Select -</option>
              {allDrummers.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select stern</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={stern ? stern.name : ''}
              onChange={(e) => {
                const selected = allSterns.find(p => p.name === e.target.value);
                storeStern(selected || null);
              }}
            >
              <option value="">- Select -</option>
              {allSterns.map(p => (
                <option key={p.name} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Add additional paddlers */}
        <div className="mb-4">
          <button
            className="px-2 py-1 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
            onClick={() => setShowAddForm(prev => !prev)}
          >
            {showAddForm ? '- Hide add paddler' : '+ Add paddler'}
          </button>
        </div>

        {showAddForm && (
          <div className="my-2 p-2 bg-gray-100 border rounded border-gray-200 flex gap-2 items-end max-w-fit">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={newPaddlerName}
                onChange={(e) => setNewPaddlerName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-28"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input
                type="number"
                value={newPaddlerWeight}
                onChange={(e) => setNewPaddlerWeight(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-16"
              />
            </div>
            <button
              className="px-2 py-1 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
              onClick={handleAddNewPaddler}
            >
              Add
            </button>
          </div>
        )}

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
            drummer={drummer}
            extraFrontWeight={extraFrontWeight}
            extraBackWeight={extraBackWeight}
          />
        </div>
      )}
      <p className="mb-3 ml-3"><button
        className="px-2 py-1 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
        onClick={exportSeatingChartToCSV}
      >
        Export Seating Chart
      </button></p>

    </div>
  );
}

export default App;
