// SelectDrummer.js
import React from 'react';
import { storeDrummer } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

const SelectDrummer = () => {

  const drummer = useStore((state) => state.drummer);
  const allDrummers = useStore((state) => state.allDrummers);

  return (
    <div>
      <label>Select drummer</label>
      <select
        value={drummer?.name ?? ''}
        onChange={(e) => {
          const selected = allDrummers.find(p => p.name === e.target.value);
          storeDrummer(selected ?? null);
        }}
      >
        <option value="">- Select -</option>
        {allDrummers.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectDrummer;
