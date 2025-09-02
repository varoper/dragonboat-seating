// SelectPaddlers.js
import React from 'react';
import { storeSeatingChart } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

const SelectPaddlers = () => {

  const allPaddlers = useStore((state) => state.allPaddlers);
  const seatingChart = useStore((state) => state.seatingChart);
  const stern = useStore((state) => state.stern);
  const drummer = useStore((state) => state.drummer);

  // Handles when user clicks on a paddler's name
  const handlePaddlerClick = (p) => {
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

  return (
    <fieldset>
      <legend>Select up to 20 paddlers</legend>

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
    </fieldset>
  );
};

export default SelectPaddlers;
