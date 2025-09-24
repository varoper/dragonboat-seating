// SelectPaddlers.js
// Clickable list of paddlers to add to seating chart
import React from 'react';
import { X } from "lucide-react";
import { handlePaddlerClick } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

const SelectPaddlers = () => {
  const allPaddlers = useStore((state) => state.allPaddlers);
  const seatingChart = useStore((state) => state.seatingChart);
  const stern = useStore((state) => state.stern);
  const drummer = useStore((state) => state.drummer);
  const flagcatcher = useStore((state) => state.flagcatcher);
  const allFlagcatchers = useStore((state) => state.allFlagcatchers);
  const removePaddler = useStore((state) => state.removePaddler);

  return (
    <fieldset>
      <legend>
        Select up to {allFlagcatchers?.length > 0 ? 18 : 20} paddlers
      </legend>

      {/* Render paddler names as selectable containers */}
      <div className="flex flex-wrap gap-2 pt-1 mb-5">
        {allPaddlers.map((p) => {
          const isInChart = seatingChart.some(seat => seat.name === p.name);
          const noEmptySeats = !seatingChart.some(seat => seat.name === 'Empty');
          const isDisabled =
            (!isInChart && (stern?.name === p.name)) ||
            (!isInChart && (drummer?.name === p.name)) ||
            (!isInChart && (flagcatcher?.name === p.name)) ||
            (!isInChart && noEmptySeats);

          return (
            <div
              key={p.name}
              onClick={() => !isDisabled && handlePaddlerClick(p)}
              className={`relative paddler
                   ${isInChart ? 'bg-sky-200' : 'bg-white'}
                  ${isDisabled ? 'opacity-50 cursor-default hover:bg-white hover:border-slate-300' : 'cursor-pointer'}`}
            >
              {p.name}

              {p.isCustom && (
                <button
                  className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-500"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent triggering paddler click
                    removePaddler(p.name);
                  }}
                >
                  <X size={12} />
                </button>
              )}

            </div>
          );
        })}
      </div>
    </fieldset>
  );
};

export default SelectPaddlers;
