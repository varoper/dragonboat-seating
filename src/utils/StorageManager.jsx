// storageManager.js
// Simplify putting things in localStorage
const StorageManager = {
  set: (key, value) => {
    try {
      const stringified = JSON.stringify(value);
      localStorage.setItem(key, stringified);
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage`, error);
    }
  },

  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? item : null;
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
      return null;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage`, error);
    }
  },

  has: (key) => {
    return localStorage.getItem(key) !== null;
  },
};

export default StorageManager;