// SelectFlagcatcher.js
import React from 'react';
import { storeFlagcatcher } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

const SelectFlagcatcher = () => {

  const flagcatcher = useStore((state) => state.flagcatcher);
  const allFlagcatchers = useStore((state) => state.allFlagcatchers);

  return (
    <div>
      <label>Select flagcatcher</label>
      <select
        value={flagcatcher?.name ?? ''}
        onChange={(e) => {
          const selected = allFlagcatchers.find(p => p.name === e.target.value);
          storeFlagcatcher(selected ?? null);
        }}
      >
        <option value="">- Select -</option>
        {allFlagcatchers.map(p => (
          <option key={p.name} value={p.name}>{p.name}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectFlagcatcher;
