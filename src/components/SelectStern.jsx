// SelectStern.js
import React from 'react';
import { storeStern } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

const SelectStern = () => {

  const stern = useStore((state) => state.stern);
  const allSterns = useStore((state) => state.allSterns);

  return (
    <div>
      <label>Select stern</label>
      <select
        value={stern?.name ?? ''}
        onChange={(e) => {
          const selected = allSterns.find(p => p.name === e.target.value);
          storeStern(selected ?? null);
        }}
      >
        <option value="">- Select -</option>
        {allSterns.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectStern;
