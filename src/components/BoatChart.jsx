// BoatChart.js
import React, { useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import useStore from '../store/useStore';

const BoatChart = ({ updateSeatingChart }) => {
  const [maxWidth, setMaxWidth] = useState(0);    // Used to standardize width of all seat containers
  const [showWeights, setShowWeights] = useState(true);

  const seatingChart = useStore((state) => state.seatingChart);
  const drummer = useStore((state) => state.drummer);
  const stern = useStore((state) => state.stern);
  const topView = useStore((state) => state.topView);
  const activeId = useStore((state) => state.activeId);
  const overId = useStore((state) => state.overId);
  const extraFrontWeight = useStore((state) => state.extraFrontWeight);
  const extraBackWeight = useStore((state) => state.extraBackWeight);
  const steeringWeight = useStore((state) => state.steeringWeight);

  // Actions
  const toggleTopView = useStore((state) => state.toggleTopView);
  const setActiveId = useStore((state) => state.setActiveId);
  const setOverId = useStore((state) => state.setOverId);

  // DnD sensor configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  // Refs to track DOM widths of each seat
  const seatRefs = useRef([]);

  // Track the widest seat container for layout consistency
  useEffect(() => {
    const widths = seatRefs.current.map((ref) => ref?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setMaxWidth(widest);
  });

  // Called when dragging starts
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Called when drag hovers over another item
  const handleDragOver = (event) => {
    setOverId(event.over?.id ?? null);
  };

  // Called when drag ends — updates local seat arrangement
  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id, 10);
    const newIndex = parseInt(over.id, 10);

    // Create updated seat array with swapped paddlers
    const updatedChart = [...seatingChart];
    const temp = updatedChart[oldIndex];
    updatedChart[oldIndex] = updatedChart[newIndex];
    updatedChart[newIndex] = temp;
    updateSeatingChart(updatedChart);
  };

  // Display weight imbalance between seat sides.
  const renderImbalance = (label_a, label_b, a, b, tolerance) => {
    const diff = Math.abs(a - b);
    const balanced = diff <= tolerance;
    const compare = a === b ? "=" : a > b ? ">" : "<";

    const aContent = (
      <>
        {label_a}:{' '}
        {a > b ? (
          <span className="font-bold">{a}</span>
        ) : (
          `${a}`
        )}
      </>
    );

    const bContent = (
      <>
        {label_b}:{' '}
        {b > a ? (
          <span className="font-bold">{b}</span>
        ) : (
          `${b}`
        )}
      </>
    );

    return (
      <div className="mb-1">
        {aContent} {compare} {bContent}{' '}
        <span className={`${balanced ? 'text-emerald-600' : 'text-rose-600'}`}>
          (Off by {diff})
        </span>
      </div>
    );
  };

  // Calculate front/back, left/right, and pacer/rocket weights.
  const calculateWeightStats = () => {
    let frontWeight = 0,
      backWeight = 0,
      leftWeight = 0,
      rightWeight = 0,
      pacerWeight = 0,
      rocketWeight = 0;

    seatingChart.forEach((paddler, i) => {
      if (!paddler || !paddler.weight) return;

      // Front: indices 0–9
      if (i < 10) frontWeight += paddler.weight;
      else backWeight += paddler.weight;

      // Left seat = even index; right seat = odd index
      if (i % 2 === 0) leftWeight += paddler.weight;
      else rightWeight += paddler.weight;

      // Pacer: rows 1–3 (indices 0–5)
      if (i >= 0 && i <= 5) pacerWeight += paddler.weight;

      // Rocket: rows 7–10 (indices 12–19)
      if (i >= 14 && i <= 19) rocketWeight += paddler.weight;
    });

    const extraSideWeight = (parseInt(extraFrontWeight, 10) + parseInt(extraBackWeight, 10) + (drummer ? drummer.weight : 0) + (stern ? stern.weight : 0)) / 2;

    frontWeight += parseInt(extraFrontWeight, 10) + (drummer ? drummer.weight : 0);
    backWeight += parseInt(extraBackWeight, 10) + (stern ? stern.weight : 0) + parseInt(steeringWeight, 10);
    leftWeight += extraSideWeight + parseInt(steeringWeight, 10);
    rightWeight += extraSideWeight;
    pacerWeight += parseInt(extraFrontWeight, 10) + (drummer ? drummer.weight : 0);
    rocketWeight += parseInt(extraBackWeight, 10) + (stern ? stern.weight : 0) + parseInt(steeringWeight, 10);

    return { frontWeight, backWeight, leftWeight, rightWeight, pacerWeight, rocketWeight };
  };

  // Renders a single sortable seat cell
  const SortableSeat = ({ id, paddler, isActive, isOver }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
    } = useSortable({ id: id.toString() });

    const localRef = (node) => {
      seatRefs.current[id] = node;
      setNodeRef(node);
    };

    const isLeftSeat = id % 2 === 0;
    const isPaddlerOnWrongSide =
      paddler && paddler.side && (
        (isLeftSeat && paddler.side === 'right') ||
        (!isLeftSeat && paddler.side === 'left')
      );

    const style = isActive
      ? {
        transform: CSS.Transform.toString(transform),
        transition: 'transform 0.2s ease',
        zIndex: 50,
      }
      : {
        transform: undefined,
        transition: 'none',
        zIndex: 'auto',
      };

    return (
      <div
        ref={localRef}
        style={{ ...style, minWidth: maxWidth }}
        {...attributes}
        {...listeners}
        className={`draggable touch-none flex flex-col justify-center items-center paddler
          ${isOver ? 'border-dashed border-sky-400' : 'border-slate-300'}
          ${paddler && isPaddlerOnWrongSide ? 'bg-rose-300' : 'bg-sky-200'}
          ${paddler && paddler.name === 'Empty' ? 'bg-white' : ''}
          ${isActive ? 'ring-4 ring-sky-400 scale-105 transition-transform duration-200' : ''}`}
      >
        {paddler && paddler.name !== 'Empty' ? (
          <span>
            <span className="font-medium">{paddler.name}</span>{showWeights && `: ${paddler.weight}`}
          </span>
        ) : (
          <span className="opacity-50">Empty</span>
        )}
      </div>
    );
  };

  const { frontWeight, backWeight, leftWeight, rightWeight, pacerWeight, rocketWeight } = calculateWeightStats();

  // Display for drummer.
  const renderDrummer = () => {
    if (!drummer) return null;
    return (
      <div className="grid" >
        <div className="flex items-center gap-8">
          <div className="w-12 boat-label">
            Drummer
          </div>
          <div
            className={`paddler px-2 py-1 my-1 rounded-xl flex flex-col justify-center items-center  text-center bg-sky-200 hover:border-slate-300`}>
            <span>
              <span className="font-medium">{drummer.name}</span>{showWeights && `: ${drummer.weight}`}
            </span>
          </div>
        </div>
      </div >
    )
  };

  // Display for stern.
  const renderStern = () => {
    if (!stern) return null;
    return (
      <div className="grid">
        <div className="flex items-center gap-8">
          <div className="w-12 boat-label">
            Stern
          </div>
          <div
            className={`paddler my-1 rounded-xl flex flex-col justify-center items-center text-center bg-sky-200 hover:border-slate-300`}>
            <span>
              <span className="font-medium">{stern.name}</span>{showWeights && `: ${stern.weight}`}
            </span>
          </div>
        </div>
      </div>
    )
  };

  // Display for rows of seats.
  const renderSeats = () => {
    // Array of row indices [0..9]
    const rowIndices = Array.from({ length: 10 }, (_, i) => i);

    // Reverse if topView is false
    const orderedRows = topView ? rowIndices : [...rowIndices].reverse();

    return orderedRows.map((rowIndex) => {
      const leftIndex = rowIndex * 2;
      const rightIndex = leftIndex + 1;

      // Just use rowIndex + 1 now
      const label = rowIndex + 1;

      return (
        <div key={rowIndex} className="border-b-6 flex items-center gap-2">
          <div className="w-3 boat-label">{label}</div>

          {topView ? (
            // Normal orientation: left → right
            <>
              <SortableSeat
                id={leftIndex}
                paddler={seatingChart[leftIndex]}
                isActive={activeId === leftIndex.toString()}
                isOver={overId === leftIndex.toString() && activeId !== overId}
              />
              <SortableSeat
                id={rightIndex}
                paddler={seatingChart[rightIndex]}
                isActive={activeId === rightIndex.toString()}
                isOver={overId === rightIndex.toString() && activeId !== overId}
              />
            </>
          ) : (
            // Mirrored orientation: right → left
            <>
              <SortableSeat
                id={rightIndex}
                paddler={seatingChart[rightIndex]}
                isActive={activeId === rightIndex.toString()}
                isOver={overId === rightIndex.toString() && activeId !== overId}
              />
              <SortableSeat
                id={leftIndex}
                paddler={seatingChart[leftIndex]}
                isActive={activeId === leftIndex.toString()}
                isOver={overId === leftIndex.toString() && activeId !== overId}
              />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div className="p-2 my-2 inline-block border border-slate-200 bg-gradient-to-b from-white to-purple-50">
        {renderImbalance('Left', 'Right', leftWeight, rightWeight, 15)}
        {renderImbalance('Front 5', 'Back 5', frontWeight, backWeight, 15)}
        {renderImbalance('Pacers', 'Rockets', pacerWeight, rocketWeight, 15)}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={seatingChart.map((_, i) => i.toString())} strategy={rectSortingStrategy}>
          <br />
          <div className="inline-block">
            {topView ? renderDrummer() : renderStern()}
            <div className="grid grid-rows-10 gap-2 py-1">
              {renderSeats()}
            </div>
            {topView ? renderStern() : renderDrummer()}
          </div>

        </SortableContext>
      </DndContext >
      <p>
        <button
          className="mr-3 mt-3"
          onClick={() => setShowWeights((prev) => !prev)}
        >
          {showWeights ? 'Hide Weights' : 'Show Weights'}
        </button>
        <button className="mr-3 mt-3" onClick={toggleTopView}>
          {topView ? "Top first ↑" : "Bottom first ↓"}
        </button>
      </p>
    </>
  );
};

export default BoatChart;
