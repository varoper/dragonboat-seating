import React, { useState, useEffect, useRef } from 'react';
import DragonBoatSeatingChart from './DragonBoatSeatingChart';
import Cookies from 'js-cookie';
import Papa from 'papaparse';

function SeatingChart() {
  const SEATING_COOKIE_KEY = 'seatingChart';
  const EXTRA_PADDLERS_COOKIE_KEY = 'extraPaddlers';
  const DRUMMER_COOKIE_KEY = 'drummer';
  const STERN_COOKIE_KEY = 'stern';

  const [allPaddlers, setAllPaddlers] = useState([]);
  const [allSterns, setAllSterns] = useState([]);
  const [allDrummers, setAllDrummers] = useState([]);
  const [seatingChart, setSeatingChart] = useState([]);
  const [stern, setStern] = useState(null);
  const [drummer, setDrummer] = useState(null);
  const [selectionError, setSelectionError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPaddlerName, setNewPaddlerName] = useState("");
  const [newPaddlerWeight, setNewPaddlerWeight] = useState("");
  const [extraFrontWeight, setExtraFrontWeight] = useState(0);
  const [extraBackWeight, setExtraBackWeight] = useState(0);
  const seatingChartRef = useRef(null);
  const [availableCharts, setAvailableCharts] = useState([]);
  const [selectedChart, setSelectedChart] = useState('');

  const emptyChart = Array.from({ length: 20 }, () => ({
    name: 'Empty',
    weight: 0,
    side: 'either',
  }));

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
    fetch('http://localhost:5174/api/charts')
      .then(res => res.json())
      .then(files => setAvailableCharts(files))
      .catch(err => console.error('Failed to fetch chart list:', err));
  }, []);

  useEffect(() => {
    const savedChart = Cookies.get(SEATING_COOKIE_KEY);
    const savedDrummer = Cookies.get(DRUMMER_COOKIE_KEY);
    const savedStern = Cookies.get(STERN_COOKIE_KEY);

    if (savedDrummer) {
      try { setDrummer(JSON.parse(savedDrummer)); } catch (e) { console.error(e); }
    }
    if (savedStern) {
      try { setStern(JSON.parse(savedStern)); } catch (e) { console.error(e); }
    }
    if (savedChart) {
      try { setSeatingChart(JSON.parse(savedChart)); } catch (e) { console.error(e); setSeatingChart(emptyChart); }
    } else {
      setSeatingChart(emptyChart);
    }
  }, []);

  useEffect(() => {
    if (stern) {
      const cleaned = seatingChart.map(seat => seat.name === stern.name ? { name: 'Empty', weight: 0, side: 'either' } : seat);
      storeSeatingChart(cleaned);
    }
  }, [stern]);

  useEffect(() => {
    if (drummer) {
      const cleaned = seatingChart.map(seat => seat.name === drummer.name ? { name: 'Empty', weight: 0, side: 'either' } : seat);
      storeSeatingChart(cleaned);
    }
  }, [drummer]);

  const storeSeatingChart = (chart) => {
    setSeatingChart(chart);
    Cookies.set(SEATING_COOKIE_KEY, JSON.stringify(chart), { expires: 365 });
  };

  const storeStern = (s) => {
    setStern(s);
    Cookies.set(STERN_COOKIE_KEY, JSON.stringify(s), { expires: 365 });
  };

  const storeDrummer = (d) => {
    setDrummer(d);
    Cookies.set(DRUMMER_COOKIE_KEY, JSON.stringify(d), { expires: 365 });
  };

  const clearChart = () => {
    Cookies.remove(SEATING_COOKIE_KEY);
    Cookies.remove(EXTRA_PADDLERS_COOKIE_KEY);
    Cookies.remove(DRUMMER_COOKIE_KEY);
    Cookies.remove(STERN_COOKIE_KEY);
    setSeatingChart(emptyChart);
    setDrummer(null);
    setStern(null);
    setSelectedChart('');
  };

  const loadSeatingChartFromCSV = async (fileName) => {
    try {
      const response = await fetch(`/charts/${fileName}`);
      const csvText = await response.text();
      const { data, errors } = Papa.parse(csvText.trim(), { header: true, skipEmptyLines: true });
      if (errors.length > 0) return console.error('CSV parsing errors:', errors);
      const newChart = [...emptyChart];
      data.forEach(({ name, seat }) => {
        let paddler = allPaddlers.find(p => p.name === name) || allSterns.find(p => p.name === name) || allDrummers.find(p => p.name === name);
        if (!paddler) return;
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
    } catch (err) {
      console.error('Failed to load CSV:', err);
    }
  };

  const updateSeatingChart = (newChart) => storeSeatingChart(newChart);

  const handlePaddlerClick = (p) => {
    const index = seatingChart.findIndex(seat => seat.name === p.name);
    if (index !== -1) {
      const updated = [...seatingChart];
      updated[index] = { name: 'Empty', weight: 0, side: 'either' };
      return storeSeatingChart(updated);
    }
    const emptyIndex = seatingChart.findIndex(seat => seat.name === 'Empty');
    if (emptyIndex === -1) return setSelectionError('All seats filled.');
    const updated = [...seatingChart];
    updated[emptyIndex] = p;
    storeSeatingChart(updated);
    setSelectionError('');
  };

  const handleAddNewPaddler = () => {
    if (!newPaddlerName || isNaN(parseInt(newPaddlerWeight))) return;
    const newPaddler = { name: newPaddlerName, weight: parseInt(newPaddlerWeight), side: 'either', role: '' };
    setAllPaddlers(prev => {
      const updated = [...prev, newPaddler];
      const existing = Cookies.get(EXTRA_PADDLERS_COOKIE_KEY);
      let currentExtras = [];
      if (existing) {
        try { currentExtras = JSON.parse(existing); } catch (e) { console.error('Invalid extra paddlers:', e); }
      }
      Cookies.set(EXTRA_PADDLERS_COOKIE_KEY, JSON.stringify([...currentExtras, newPaddler]), { expires: 365 });
      return updated;
    });
    setNewPaddlerName("");
    setNewPaddlerWeight("");
    setShowAddForm(false);
  };

  const exportSeatingChartToCSV = () => {
    const csvRows = [['name', 'seat']];
    if (drummer?.name !== 'Empty') csvRows.push([drummer.name, 'drummer']);
    seatingChart.forEach((p, i) => {
      if (p.name !== 'Empty') {
        const row = Math.floor(i / 2) + 1;
        const side = i % 2 === 0 ? 'L' : 'R';
        csvRows.push([p.name, `${row}${side}`]);
      }
    });
    if (stern?.name !== 'Empty') csvRows.push([stern.name, 'stern']);
    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chart_${Math.random().toString(36).substring(2, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2">
        <h2 className="font-bold text-lg text-gray-900 mb-2">1. Fill out the options below</h2>

        {/* Load from seating chart */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Load saved chart</label>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={selectedChart}
            onChange={(e) => {
              const file = e.target.value;
              if (file) {
                clearChart(); // clear state and cookies
                setSelectedChart(file); // set selected chart AFTER clearing
                setTimeout(() => {
                  loadSeatingChartFromCSV(file); // delay to allow state to reset
                }, 0);
              } else {
                setSelectedChart('');
              }
            }}
          >
            <option value="">- Select chart -</option>
            {availableCharts.map(file => (
              <option key={file} value={file}>{file}</option>
            ))}
          </select>
          <button
            className="px-2 py-1 ml-3 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
            onClick={clearChart}
          >
            {'Clear chart'}
          </button>
        </div>

        {/* Paddler selection section*/}
        <div class="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select up to 20 paddlers</label>

          {/* Display error message if too many paddlers are selected */}
          {selectionError && <p style={{ color: 'red' }}>{selectionError}</p>}

          {/* Render paddler names as selectable containers */}
          <div className="flex flex-wrap gap-2 mb-3">
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

          {/* Add additional paddlers */}
          <div className="mb-4">
            <button
              className="px-3 py-2 bg-purple-500 rounded-lg text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
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
      <div className="w-full lg:w-1/2">
        {seatingChart.length > 0 && (
          <div ref={seatingChartRef}>
            <h2 className="font-bold text-lg text-gray-900 mb-4">2. Balance the boat</h2>

            <p className="mb-3"> Press down, then drag & drop to change positions. Right side can be slightly heavier due to steering mechanism on left.</p>
            <DragonBoatSeatingChart
              seatingChart={seatingChart}
              updateSeatingChart={updateSeatingChart}
              stern={stern}
              drummer={drummer}
              extraFrontWeight={extraFrontWeight}
              extraBackWeight={extraBackWeight}
            />

            <p className="my-2"><button
              className="px-2 py-1 bg-purple-500 text-white border-purple-600 hover:bg-purple-600 hover:border-purple-700 rounded"
              onClick={exportSeatingChartToCSV}
            >
              Export Seating Chart
            </button></p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatingChart;
