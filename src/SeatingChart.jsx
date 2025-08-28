import React, { useState, useEffect, useRef } from 'react';
import StorageManager from './utils/StorageManager';
import Papa from 'papaparse';
import useStore from './store/useStore';
import BoatChart from './components/BoatChart';
import ExtraBoatWeight from './components/ExtraBoatWeight';
import STORAGE_KEYS from "./consts/StorageKeys";

const SeatingChart = () => {
  // Items from store
  const seatingChart = useStore((state) => state.seatingChart);
  const drummer = useStore((state) => state.drummer);
  const stern = useStore((state) => state.stern);
  const allPaddlers = useStore((state) => state.allPaddlers);
  const allSterns = useStore((state) => state.allSterns);
  const allDrummers = useStore((state) => state.allDrummers);
  const showAddForm = useStore((state) => state.showAddForm);
  const newPaddlerName = useStore((state) => state.newPaddlerName);
  const newPaddlerWeight = useStore((state) => state.newPaddlerWeight);
  const selectedChart = useStore((state) => state.selectedChart);

  // const [selectedChart, setSelectedChart] = useState('');


  // Actions from store
  const setSeatingChart = useStore((state) => state.setSeatingChart);
  const setDrummer = useStore((state) => state.setDrummer);
  const setStern = useStore((state) => state.setStern);
  const setAllPaddlers = useStore((state) => state.setAllPaddlers);
  const setAllSterns = useStore((state) => state.setAllSterns);
  const setAllDrummers = useStore((state) => state.setAllDrummers);
  const toggleShowAddForm = useStore((state) => state.toggleShowAddForm);
  const setNewPaddlerName = useStore((state) => state.setNewPaddlerName);
  const setNewPaddlerWeight = useStore((state) => state.setNewPaddlerWeight);
  const setExtraFrontWeight = useStore((state) => state.setExtraFrontWeight);
  const setExtraBackWeight = useStore((state) => state.setExtraBackWeight);
  const setSteeringWeight = useStore((state) => state.setSteeringWeight);
  const setSelectedChart = useStore((state) => state.setSelectedChart);

  // Is there a roster uploaded server-side?
  const [serverRoster, setServerRoster] = useState(false);
  // Is there at least one seating chart uploaded server-side?
  const [serverChart, setServerChart] = useState(false);
  const [selectionError, setSelectionError] = useState("");
  const seatingChartRef = useRef(null);
  const [availableCharts, setAvailableCharts] = useState([]);
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

  // Fetching the roster on the server
  useEffect(() => {
    fetch('/rosters/paddlers.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('CSV file not found');
        }
        return response.text();
      })
      .then(csv => {
        // TODO Add more validation here
        if (!csv.includes('name,weight,side')) {
          throw new Error('Unexpected CSV format');
        }
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            handleRosterResults(results);
            setServerRoster(true);
          }
        });
      });
  }, []);

  // Loading in saved seating charts
  useEffect(() => {
    fetch('/charts/index.json')
      .then(res => res.json())
      .then(files => setAvailableCharts(files))
      .catch(err => console.error('Failed to fetch chart list:', err));
  }, []);

  // Grabbing any stored values
  useEffect(() => {
    const savedChart = StorageManager.get(STORAGE_KEYS.SEATING);
    const savedDrummer = StorageManager.get(STORAGE_KEYS.DRUMMER);
    const savedStern = StorageManager.get(STORAGE_KEYS.STERN);
    const savedExtraFrontWeight = StorageManager.get(STORAGE_KEYS.EXTRA_FRONT_WEIGHT);
    const savedExtraBackWeight = StorageManager.get(STORAGE_KEYS.EXTRA_BACK_WEIGHT);
    const savedSteeringWeight = StorageManager.get(STORAGE_KEYS.STEERING_WEIGHT);

    if (savedDrummer) {
      setDrummer(JSON.parse(savedDrummer));
    }
    if (savedStern) {
      setStern(JSON.parse(savedStern));
    }
    if (savedChart && JSON.parse(savedChart).length > 0) {
      setSeatingChart(JSON.parse(savedChart));
    } else {
      setSeatingChart(emptyChart);
    }
    if (savedExtraFrontWeight) {
      setExtraFrontWeight(JSON.parse(savedExtraFrontWeight));
    }
    if (savedExtraBackWeight) {
      setExtraBackWeight(JSON.parse(savedExtraBackWeight));
    }
    if (savedSteeringWeight) {
      setSteeringWeight(JSON.parse(savedSteeringWeight));
    }
  }, []);

  // Make sure selected stern is not in seating chart
  useEffect(() => {
    if (stern) {
      const cleaned = seatingChart.map(seat => seat.name === stern.name ? { name: 'Empty', weight: 0, side: 'either' } : seat);
      storeSeatingChart(cleaned);
    }
  }, [stern]);

  // Make sure drummer is not in seating chart
  useEffect(() => {
    if (drummer) {
      const cleaned = seatingChart.map(seat => seat.name === drummer.name ? { name: 'Empty', weight: 0, side: 'either' } : seat);
      storeSeatingChart(cleaned);
    }
  }, [drummer]);

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

  // Put the roster data wherever it needs to go
  const handleRosterResults = (results) => {

    const { data, meta, errors } = results;

    // Validate headers
    const expectedHeaders = ['name', 'weight', 'side', 'role'];
    const actualHeaders = meta.fields;
    const headerMismatch = !expectedHeaders.every(h => actualHeaders.includes(h));

    if (headerMismatch) {
      console.error("CSV header mismatch. Expected:", expectedHeaders, "Got:", actualHeaders);
      throw new Error('Invalid CSV headers');
    }

    // Validate row data
    const validSides = ['either', 'left', 'right', 'none'];
    const validRoles = ['', 'drummer', 'stern'];

    for (const [i, row] of data.entries()) {
      const rowNum = i + 2; // Header is row 1
      const { name, weight, side, role } = row;

      if (!name || isNaN(parseInt(weight))) {
        throw new Error(`Row ${rowNum}: Missing or invalid name/weight`);
      }

      if (!validSides.includes(side)) {
        throw new Error(`Row ${rowNum}: Invalid side '${side}'`);
      }

      if (!validRoles.includes(role?.trim() || '')) {
        throw new Error(`Row ${rowNum}: Invalid role '${role}'`);
      }
    }

    const parsed = results.data.map(p => ({
      name: p.name,
      weight: parseInt(p.weight, 10),
      side: p.side?.toLowerCase?.() || 'either',
      role: p.role?.toLowerCase?.() || '',
    }));

    let fullPaddlers = parsed.filter(p => p.side !== 'none');
    setAllSterns(parsed.filter(p => p.role === 'stern'));
    setAllDrummers(parsed.filter(p => p.role === 'drummer'));

    const extra = StorageManager.get(STORAGE_KEYS.EXTRA_PADDLERS);
    if (extra) {
      fullPaddlers = [...fullPaddlers, ...JSON.parse(extra)];
    }
    setAllPaddlers(fullPaddlers);
  }

  const storeSeatingChart = (chart) => {
    setSeatingChart(chart);
    StorageManager.set(STORAGE_KEYS.SEATING, chart);
  };

  const storeStern = (stern) => {
    setStern(stern);
    StorageManager.set(STORAGE_KEYS.STERN, stern);
  };

  const storeDrummer = (drummer) => {
    setDrummer(drummer);
    StorageManager.set(STORAGE_KEYS.DRUMMER, drummer);
  };

  // Gets rid of anything stored for a fresh chart
  const clearChart = () => {
    StorageManager.remove(STORAGE_KEYS.SEATING);
    StorageManager.remove(STORAGE_KEYS.EXTRA_PADDLERS);
    StorageManager.remove(STORAGE_KEYS.DRUMMER);
    StorageManager.remove(STORAGE_KEYS.STERN);
    StorageManager.remove(STORAGE_KEYS.EXTRA_FRONT_WEIGHT);
    StorageManager.remove(STORAGE_KEYS.EXTRA_BACK_WEIGHT);
    StorageManager.remove(STORAGE_KEYS.STEERING_WEIGHT);
    setSeatingChart(emptyChart);
    setDrummer(null);
    setStern(null);
    setSelectedChart('');
    setExtraFrontWeight(0);
    setExtraBackWeight(0);
    setSteeringWeight(10);
  };

  // Import a seating chart stored on the server, if exists
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

  // Handles when user clicks on a paddler's name
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

  // Handles the addition of a new paddler
  const handleAddNewPaddler = () => {
    if (!newPaddlerName || isNaN(parseInt(newPaddlerWeight))) return;
    const newPaddler = { name: newPaddlerName, weight: parseInt(newPaddlerWeight), side: 'either', role: '' };
    setAllPaddlers(prev => {
      const updated = [...prev, newPaddler];
      const existing = StorageManager.get(STORAGE_KEYS.EXTRA_PADDLERS);
      let currentExtras = [];
      if (existing) {
        currentExtras = JSON.parse(existing);
      }
      StorageManager.set(STORAGE_KEYS.EXTRA_PADDLERS, [...currentExtras, newPaddler]);
      return updated;
    });
    handlePaddlerClick(newPaddler);
    setNewPaddlerName("");
    setNewPaddlerWeight("");
    setShowAddForm(false);
  };

  // Handles exporting a seating chart as a .csv file
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

        {!serverRoster &&
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
        }

        {/* Load from seating chart */}
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
                    clearChart(); // clear state and stored values
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

        {/* Paddler selection section*/}
        <section>
          <h2>Build out the crew</h2>
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
                  onClick={toggleShowAddForm}
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
                      onClick={toggleShowAddForm}
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

        {ExtraBoatWeight()}
        <div>
          <h2>Notes</h2>
          <p>Karl prefers right but can paddle left if needed</p>
        </div>
      </div>

      {/* Show seating chart once generated */}
      < div className="w-full lg:w-1/2" >
        <section>
          {seatingChart.length > 0 && (
            <div ref={seatingChartRef}>
              <h2>Balance the boat</h2>

              <p> Press down, then drag & drop to change positions.</p>
              <BoatChart
                updateSeatingChart={updateSeatingChart}
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
        </section>
      </div >
    </div >
  );
}

export default SeatingChart;
