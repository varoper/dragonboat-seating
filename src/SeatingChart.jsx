import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import useStore from './store/useStore';
import STORAGE_KEYS from "./utils/StorageKeys";
import StorageManager from './utils/StorageManager';
import { storeSeatingChart, emptyChart, clearStorage, handleRosterResults } from './utils/StorageHelpers';
import BoatChart from './components/BoatChart';
import ExtraBoatWeight from './components/ExtraBoatWeight';
import LoadStoredSeatingChart from './components/LoadStoredSeatingChart';
import UploadRoster from './components/UploadRoster';
import SelectPaddlers from './components/SelectPaddlers';
import SelectDrummer from './components/SelectDrummer';
import SelectStern from './components/SelectStern';
import AddPaddler from './components/AddPaddler';
import ExportChart from './components/ExportChart';

const SeatingChart = () => {
  // Items from store
  const seatingChart = useStore((state) => state.seatingChart);
  const availableCharts = useStore((state) => state.availableCharts);
  const drummer = useStore((state) => state.drummer);
  const stern = useStore((state) => state.stern);
  const showExportChart = useStore((state) => state.showExportChart);

  // Actions from store
  const setSeatingChart = useStore((state) => state.setSeatingChart);
  const setAvailableCharts = useStore((state) => state.setAvailableCharts);
  const setDrummer = useStore((state) => state.setDrummer);
  const setStern = useStore((state) => state.setStern);
  const setExtraFrontWeight = useStore((state) => state.setExtraFrontWeight);
  const setExtraBackWeight = useStore((state) => state.setExtraBackWeight);
  const setSteeringWeight = useStore((state) => state.setSteeringWeight);
  const toggleShowExportChart = useStore((state) => state.toggleShowExportChart);

  // Is there a roster uploaded server-side?
  const [serverRoster, setServerRoster] = useState(null);

  // Is there at least one seating chart uploaded server-side?
  const [serverChart, setServerChart] = useState(false);

  const isChartEmpty = (seatingChart) => seatingChart.every(seat => seat.name === 'Empty') && !drummer?.name && !stern?.name;

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
          <SelectPaddlers />

          {/* Add additional paddlers */}
          <AddPaddler />

          {/* Stern & drummer selection dropdowns */}
          <div className="flex gap-4 mb-4">
            <SelectDrummer />
            <SelectStern />
          </div>
        </section>
        <ExtraBoatWeight />
      </div>

      {/* Show seating chart once generated */}
      < div className="w-full lg:w-1/2" >
        <section>
          {seatingChart.length > 0 && (
            <div>
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

                {!showExportChart && (
                  <button onClick={() => toggleShowExportChart()}>
                    Export chart
                  </button>
                )}
              </p>

              {showExportChart && (
                <ExportChart />
              )}

            </div>
          )}
        </section>
      </div >
    </div >
  );
}

export default SeatingChart;
