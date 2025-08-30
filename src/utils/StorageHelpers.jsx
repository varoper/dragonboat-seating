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

export const emptyChart = Array.from({ length: 20 }, () => ({
  name: 'Empty',
  weight: 0,
  side: 'either',
}));

export const clearStorage = () => {
  const setSeatingChart = useStore.getState().setSeatingChart;
  const setSelectedChart = useStore.getState().setSelectedChart;
  const setDrummer = useStore.getState().setDrummer;
  const setStern = useStore.getState().setStern;
  const setExtraFrontWeight = useStore.getState().setExtraFrontWeight;
  const setExtraBackWeight = useStore.getState().setExtraBackWeight;
  const setSteeringWeight = useStore.getState().setSteeringWeight;

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

