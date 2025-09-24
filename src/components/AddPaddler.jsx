// AddPaddler.js
// Add a paddler that is not in the roster.
import React from 'react';
import { handlePaddlerClick } from '../utils/StorageHelpers';
import StorageManager from '../utils/StorageManager';
import STORAGE_KEYS from "../utils/StorageKeys";
import useStore from '../store/useStore';

const AddPaddler = () => {

  const missingPaddlers = useStore(state => state.missingPaddlers);
  const allPaddlers = useStore((state) => state.allPaddlers);
  const showAddPaddler = useStore((state) => state.showAddPaddler);
  const newPaddlerName = useStore((state) => state.newPaddlerName);
  const newPaddlerWeight = useStore((state) => state.newPaddlerWeight);

  const setAllPaddlers = useStore((state) => state.setAllPaddlers);
  const toggleShowAddPaddler = useStore((state) => state.toggleShowAddPaddler);
  const setNewPaddlerName = useStore((state) => state.setNewPaddlerName);
  const setNewPaddlerWeight = useStore((state) => state.setNewPaddlerWeight);

  // Handles the addition of a new paddler
  const handleAddNewPaddler = () => {
    if (!newPaddlerName || isNaN(parseInt(newPaddlerWeight))) return;
    const newPaddler = { name: newPaddlerName, weight: parseInt(newPaddlerWeight), side: 'either', role: '' };

    let updatedPaddlers = [...allPaddlers, newPaddler];
    setAllPaddlers(updatedPaddlers);

    const existing = StorageManager.get(STORAGE_KEYS.EXTRA_PADDLERS);
    let currentExtras = [];
    if (existing) {
      currentExtras = JSON.parse(existing);
    }
    StorageManager.set(STORAGE_KEYS.EXTRA_PADDLERS, [...currentExtras, newPaddler]);

    handlePaddlerClick(newPaddler);
    setNewPaddlerName("");
    setNewPaddlerWeight("");
    toggleShowAddPaddler(false);
  };

  return (
    <div className="mb-3">

      {missingPaddlers.length > 0 && (
        <div className="text-rose-600 mb-6">
          <p>⚠ Missing from roster:</p>
          <ul className="list-disc pl-5 ml-6">
            {missingPaddlers.map((p, idx) => (
              <li key={idx}>
                {p.name} (seat: {p.seat})
              </li>
            ))}
          </ul>
        </div>
      )}

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
      <p className="mt-3">Use this to add one-off paddler that is not in your roster.</p>
    </div>
  );
};

export default AddPaddler;
