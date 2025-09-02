import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import useStore from './store/useStore';
import STORAGE_KEYS from "./utils/StorageKeys";
import StorageManager from './utils/StorageManager';
import { storeSeatingChart, storeStern, storeDrummer, emptyChart, clearStorage, handleRosterResults } from './utils/StorageHelpers';
import BoatChart from './components/BoatChart';
import ExtraBoatWeight from './components/ExtraBoatWeight';
import LoadStoredSeatingChart from './components/LoadStoredSeatingChart';
import UploadRoster from './components/UploadRoster';
import SelectDrummer from './components/SelectDrummer';
import SelectStern from './components/SelectStern';

const SeatingChart = () => {
  // Items from store
  const seatingChart = useStore((state) => state.seatingChart);
  const availableCharts = useStore((state) => state.availableCharts);
  const drummer = useStore((state) => state.drummer);
  const stern = useStore((state) => state.stern);
  const allPaddlers = useStore((state) => state.allPaddlers);
  const showAddPaddler = useStore((state) => state.showAddPaddler);
  const newPaddlerName = useStore((state) => state.newPaddlerName);
  const newPaddlerWeight = useStore((state) => state.newPaddlerWeight);

  // Actions from store
  const setSeatingChart = useStore((state) => state.setSeatingChart);
  const setAvailableCharts = useStore((state) => state.setAvailableCharts);
  const setDrummer = useStore((state) => state.setDrummer);
  const setStern = useStore((state) => state.setStern);
  const setAllPaddlers = useStore((state) => state.setAllPaddlers);
  const toggleShowAddPaddler = useStore((state) => state.toggleShowAddPaddler);
  const setNewPaddlerName = useStore((state) => state.setNewPaddlerName);
  const setNewPaddlerWeight = useStore((state) => state.setNewPaddlerWeight);
  const setExtraFrontWeight = useStore((state) => state.setExtraFrontWeight);
  const setExtraBackWeight = useStore((state) => state.setExtraBackWeight);
  const setSteeringWeight = useStore((state) => state.setSteeringWeight);

  // Is there a roster uploaded server-side?
  const [serverRoster, setServerRoster] = useState(null);

  // Is there at least one seating chart uploaded server-side?
  const [serverChart, setServerChart] = useState(false);

  const [selectionError, setSelectionError] = useState("");
  const seatingChartRef = useRef(null);

  const [showExportInput, setShowExportInput] = useState(false);
  const [customFileName, setCustomFileName] = useState(() => {
    const today = new Date();
    // MM-DD-YY
    const formatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}-${String(today.getFullYear()).slice(2)}`;
    return `${formatted}.csv`;
  });

  const isChartEmpty = (seatingChart) => seatingChart.every(seat => seat.name === 'Empty') && !drummer?.name && !stern?.name;
  const isBoatFull = (seatingChart) => seatingChart.every(seat => seat.name !== 'Empty');

  // Fetching the roster on the server
  useEffect(() => {
    fetch('/rosters/paddlers.csv')
      .then(response => {
        if (!response.ok) {
          setServerRoster(false);
          return null;
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
      })
      .catch(() => setServerRoster(false));
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
    setShowAddPaddler(false);
  };

  // Handles exporting a seating chart as a .csv file
  const exportSeatingChartToCSV = (fileName) => {
    const csvRows = [['name', 'seat']];
    if (drummer?.name && drummer.name !== 'Empty') csvRows.push([drummer.name, 'drummer']);
    seatingChart.forEach((p, i) => {
      if (p.name !== 'Empty') {
        const row = Math.floor(i / 2) + 1;
        const side = i % 2 === 0 ? 'L' : 'R';
        csvRows.push([p.name, `${row}${side}`]);
      }
    });
    if (stern?.name && stern.name !== 'Empty') csvRows.push([stern.name, 'stern']);

    const blob = new Blob([csvRows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ?? `seating-chart.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:gap-6">
      <div className="w-full lg:w-1/2">

        {/* Upload roster if none exists on server */}
        {serverRoster === false && <UploadRoster />}

        {/* Load from seating chart if seating charts exist on server */}
        {availableCharts?.length > 0 && <LoadStoredSeatingChart />}

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
                const isDisabled =
                  (!isInChart && (stern?.name === p.name)) ||
                  (!isInChart && (drummer?.name === p.name)) ||
                  (!isInChart && noEmptySeats);

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
              {!showAddPaddler ? (
                <button
                  onClick={toggleShowAddPaddler}
                >
                  {showAddPaddler ? '- Hide add paddler' : '+ Add paddler'}
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
                      onClick={toggleShowAddPaddler}
                      className="button-alt"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              <p class="mt-3">Use this to add one-off paddler that is not in your roster.</p>
            </div>

            {/* Stern & drummer selection dropdowns */}
            <div className="flex gap-4 mb-4">
              <SelectDrummer />
              <SelectStern />
            </div>
          </fieldset>
        </section>
        <ExtraBoatWeight />
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
              <BoatChart />
              <p>
                <button
                  className={`mr-3 ${isChartEmpty(seatingChart) ? 'button-inactive' : ''}`}
                  onClick={isChartEmpty(seatingChart) ? undefined : clearStorage}
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
