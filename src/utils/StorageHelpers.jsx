// storageHelpers.js
// Include helper functions for storage here
import useStore from '../store/useStore';
import STORAGE_KEYS from './StorageKeys';
import StorageManager from './StorageManager';

/** 
 * Store elements in state & localStorage
 */
export const storeSeatingChart = (chart) => {
  const setSeatingChart = useStore.getState().setSeatingChart;
  setSeatingChart(chart);
  StorageManager.set(STORAGE_KEYS.SEATING, chart);
};

export const storeStern = (stern) => {
  const setStern = useStore.getState().setStern;
  setStern(stern);
  StorageManager.set(STORAGE_KEYS.STERN, stern);
};

export const storeDrummer = (drummer) => {
  const setDrummer = useStore.getState().setDrummer;
  setDrummer(drummer);
  StorageManager.set(STORAGE_KEYS.DRUMMER, drummer);
};

export const storeFlagcatcher = (flagcatcher) => {
  const setFlagcatcher = useStore.getState().setFlagcatcher;
  setFlagcatcher(flagcatcher);
  StorageManager.set(STORAGE_KEYS.FLAGCATCHER, flagcatcher);
};

export const storeExtraFrontWeight = (extraFrontWeight) => {
  const setExtraFrontWeight = useStore.getState().setExtraFrontWeight;
  setExtraFrontWeight(extraFrontWeight);
  StorageManager.set(STORAGE_KEYS.EXTRA_FRONT_WEIGHT, extraFrontWeight);
};

export const storeExtraBackWeight = (extraBackWeight) => {
  const setExtraBackWeight = useStore.getState().setExtraBackWeight;
  setExtraBackWeight(extraBackWeight);
  StorageManager.set(STORAGE_KEYS.EXTRA_BACK_WEIGHT, extraBackWeight);
};

export const storeSteeringWeight = (steeringWeight) => {
  const setSteeringWeight = useStore.getState().setSteeringWeight;
  setSteeringWeight(steeringWeight);
  StorageManager.set(STORAGE_KEYS.STEERING_WEIGHT, steeringWeight);
};

/**
 * Additional helpers
 */

// Creates an empty chart
export const emptyChart = Array.from({ length: 20 }, () => ({
  name: 'Empty',
  weight: 0,
  side: 'either',
}));

// CLears all stored values and resets state
export const clearStorage = () => {
  const setSeatingChart = useStore.getState().setSeatingChart;
  const setSelectedChart = useStore.getState().setSelectedChart;
  const setDrummer = useStore.getState().setDrummer;
  const setFlagcatcher = useStore.getState().setFlagcatcher;
  const setStern = useStore.getState().setStern;
  const setExtraFrontWeight = useStore.getState().setExtraFrontWeight;
  const setExtraBackWeight = useStore.getState().setExtraBackWeight;
  const setSteeringWeight = useStore.getState().setSteeringWeight;

  StorageManager.remove(STORAGE_KEYS.SEATING);
  StorageManager.remove(STORAGE_KEYS.EXTRA_PADDLERS);
  StorageManager.remove(STORAGE_KEYS.DRUMMER);
  StorageManager.remove(STORAGE_KEYS.FLAGCATCHER);
  StorageManager.remove(STORAGE_KEYS.STERN);
  StorageManager.remove(STORAGE_KEYS.EXTRA_FRONT_WEIGHT);
  StorageManager.remove(STORAGE_KEYS.EXTRA_BACK_WEIGHT);
  StorageManager.remove(STORAGE_KEYS.STEERING_WEIGHT);

  setSeatingChart(emptyChart);
  setDrummer(null);
  setFlagcatcher(null);
  setStern(null);
  setSelectedChart('');
  setExtraFrontWeight(0);
  setExtraBackWeight(0);
  setSteeringWeight(10);
};

// Put the roster data wherever it needs to go
export const handleRosterResults = (results) => {

  const { data, meta, errors } = results;
  const setAllPaddlers = useStore.getState().setAllPaddlers;
  const setAllSterns = useStore.getState().setAllSterns;
  const setAllDrummers = useStore.getState().setAllDrummers;
  const setAllFlagcatchers = useStore.getState().setAllFlagcatchers;

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
  const validRoles = ['', 'drummer', 'stern', 'flagcatcher'];

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
  setAllFlagcatchers(parsed.filter(p => p.role === 'flagcatcher'));

  const extra = StorageManager.get(STORAGE_KEYS.EXTRA_PADDLERS);
  if (extra) {
    fullPaddlers = [...fullPaddlers, ...JSON.parse(extra)];
  }
  setAllPaddlers(fullPaddlers);
}

// Handles when user clicks on a paddler's name
export const handlePaddlerClick = (p) => {

  const seatingChart = useStore.getState().seatingChart;

  const index = seatingChart.findIndex(seat => seat.name === p.name);
  if (index !== -1) {
    const updated = [...seatingChart];
    updated[index] = { name: 'Empty', weight: 0, side: 'either' };
    return storeSeatingChart(updated);
  }

  const emptyIndex = seatingChart.findIndex(seat => seat.name === 'Empty');
  const updated = [...seatingChart];
  updated[emptyIndex] = p;
  storeSeatingChart(updated);
};