import React, { useState, useEffect, useRef } from 'react';
import WeightBalancer from './WeightBalancer';
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
  const [steeringWeight, setSteeringWeight] = useState(15);
  const seatingChartRef = useRef(null);
  const [availableCharts, setAvailableCharts] = useState([]);
  const [selectedChart, setSelectedChart] = useState('');
  const [showExportInput, setShowExportInput] = useState(false);
  const [customFileName, setCustomFileName] = useState(() => {
    const today = new Date();
    // MM-DD-YY
    const formatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${String(today.getFullYear()).slice(2)}`;
    return `${formatted}.csv`;
  });

  const emptyChart = Array.from({ length: 20 }, () => ({
    name: 'Empty',
    weight: 0,
    side: 'either',
  }));

  const isChartEmpty = (seatingChart) => seatingChart.every(seat => seat.name === 'Empty') && !drummer && !stern;
  const isBoatFull = (seatingChart) => seatingChart.every(seat => seat.name !== 'Empty');

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
    fetch('/charts/index.json')
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
    if (isBoatFull(seatingChart)) { return setSelectionError('All seats filled.'); }

    const emptyIndex = seatingChart.findIndex(seat => seat.name === 'Empty');
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
    handlePaddlerClick(newPaddler);
    setNewPaddlerName("");
    setNewPaddlerWeight("");
    setShowAddForm(false);
  };

  const exportSeatingChartToCSV = (fileName) => {
    const csvRows = [['name', 'seat']];
    if (drummer && drummer?.name !== 'Empty') csvRows.push([drummer.name, 'drummer']);
    seatingChart.forEach((p, i) => {
      if (p.name !== 'Empty') {
        const row = Math.floor(i / 2) + 1;
        const side = i % 2 === 0 ? 'L' : 'R';
        csvRows.push([p.name, `${row}${side}`]);
      }
    });
    if (stern && stern?.name !== 'Empty') csvRows.push([stern.name, 'stern']);

    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || `seating-chart.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-6">
      <div className="w-full lg:w-1/2">
        <section>
          <h2>1. Load an existing chart</h2>

          {/* Load from seating chart */}
          <div className="mb-6">
            <fieldset>
              <label>Select a saved chart</label>
              <select
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
            </fieldset>
          </div>
        </section>

        {/* Paddler selection section*/}
        <section>
          <h2>2. Build out the crew</h2>
          <fieldset>
            <label>Select up to 20 paddlers</label>

            {/* Display error message if too many paddlers are selected */}
            {selectionError && <p className="text-rose-700">{selectionError}</p>}

            {/* Render paddler names as selectable containers */}
            <div className="flex flex-wrap gap-2 pt-1 mb-5">
              {allPaddlers.map((p) => {
                const isInChart = seatingChart.some(seat => seat.name === p.name);
                const noEmptySeats = !seatingChart.some(seat => seat.name === 'Empty');
                const isDisabled = (!isInChart && (stern && stern.name === p.name)) || (!isInChart && (drummer && drummer.name === p.name)) || (!isInChart && noEmptySeats);

                return (
                  <div
                    key={p.name}
                    onClick={() => !isDisabled && handlePaddlerClick(p)}
                    className={`paddler
                   ${isInChart ? 'bg-sky-200' : 'bg-white'}
                  ${isDisabled ? 'opacity-50 cursor-default hover:bg-white hover:border-slate-300' : 'cursor-pointer'}`}
                  >
                    {p.name}
                  </div>
                );
              })}
            </div>

            {/* Add additional paddlers */}
            <div className="mb-6">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                >
                  {showAddForm ? '- Hide add paddler' : '+ Add paddler'}
                </button>
              ) :
                (
                  <div className="toggle-form">
                    <div>
                      <label for="new_paddler_name">Name</label>
                      <input
                        type="text"
                        id="new_paddler_name"
                        value={newPaddlerName}
                        onChange={(e) => setNewPaddlerName(e.target.value)}
                        className="w-28"
                      />
                    </div>
                    <div>
                      <label for="new_paddler_weight">Weight</label>
                      <input
                        type="number"
                        id="new_paddler_weight"
                        value={newPaddlerWeight}
                        onChange={(e) => setNewPaddlerWeight(e.target.value)}
                        className="w-16"
                      />
                    </div>
                    <button
                      onClick={handleAddNewPaddler}
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="button-alt"
                    >
                      Cancel
                    </button>
                  </div>
                )}
            </div>

            {/* Stern & drummer selection dropdowns */}
            <div className="flex gap-4 mb-4">
              <div>
                <label>Select drummer</label>
                <select
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
                <label>Select stern</label>
                <select
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
          </fieldset>
        </section>

        {/* Inputs for additional front and back weight */}
        <section>
          <h2>3. Add extra boat weight</h2>
          <fieldset>
            <div className="flex gap-4">
              <div>
                <label for="extra_front_weight">Front</label>
                <input
                  type="number"
                  id="extra_front_weight"
                  className="w-16"
                  value={extraFrontWeight}
                  onChange={(e) => setExtraFrontWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label for="extra_back_weight">Back</label>
                <input
                  type="number"
                  id="extra_back_weight"
                  className="w-16"
                  value={extraBackWeight}
                  onChange={(e) => setExtraBackWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <label for="steering_weight">Steering mechanism</label>
                <input
                  type="number"
                  id="steering_weight"
                  className="w-16"
                  value={steeringWeight}
                  onChange={(e) => setSteeringWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </fieldset>
        </section>
      </div>

      {/* Show seating chart once generated */}
      <div className="w-full lg:w-1/2">
        <section>
          {seatingChart.length > 0 && (
            <div ref={seatingChartRef}>
              <h2>4. Balance the boat</h2>

              <p> Press down, then drag & drop to change positions.</p>
              <WeightBalancer
                seatingChart={seatingChart}
                updateSeatingChart={updateSeatingChart}
                stern={stern}
                drummer={drummer}
                extraFrontWeight={extraFrontWeight}
                extraBackWeight={extraBackWeight}
                steeringWeight={steeringWeight}
              />

              <p>
                <button
                  className={`mr-3 ${isChartEmpty(seatingChart) ? 'button-inactive' : ''}`}
                  onClick={isChartEmpty(seatingChart) ? undefined : clearChart}
                  disabled={isChartEmpty(seatingChart)}
                >
                  {'Clear chart'}
                </button>

                {!showExportInput && (
                  <button onClick={() => setShowExportInput(true)}>
                    Export chart
                  </button>
                )}
              </p>

              {showExportInput && (
                <div className="mt-4 space-y-2 toggle-form">
                  <div>
                    <label htmlFor="csv_filename">Choose file name</label>
                    <input
                      id="csv_filename"
                      type="text"
                      className="w-36"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => exportSeatingChartToCSV(customFileName)}
                    >
                      Download
                    </button>
                    <button
                      onClick={() => setShowExportInput(false)}
                      className="button-alt"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}


            </div>
          )}
          <p>Any changes you make to your seating chart will be stored in your browser's cookies, so you can have your most recent chart changes available.</p>
        </section>
      </div>
    </div >
  );
}

export default SeatingChart;
