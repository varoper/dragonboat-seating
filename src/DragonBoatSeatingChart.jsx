// DragonBoatSeatingChart.js
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

const DragonBoatSeatingChart = ({ selectedPaddlers, extraFrontWeight = 0, extraBackWeight = 0 }) => {
  const [seats, setSeats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [maxWidth, setMaxWidth] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );
  const seatRefs = useRef([]);

  useEffect(() => {
    const filledSeats = Array.from({ length: 20 }, (_, i) => selectedPaddlers[i] || null);
    setSeats(filledSeats);
  }, [selectedPaddlers]);

  useEffect(() => {
    const widths = seatRefs.current.map((ref) => ref?.offsetWidth || 0);
    const widest = Math.max(...widths);
    setMaxWidth(widest);
  }, [seats]);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event) => {
    setOverId(event.over?.id ?? null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id, 10);
    const newIndex = parseInt(over.id, 10);

    setSeats((prev) => {
      const updated = [...prev];
      const temp = updated[oldIndex];
      updated[oldIndex] = updated[newIndex];
      updated[newIndex] = temp;
      return updated;
    });
  };

  const renderImbalance = (label_a, label_b, a, b, tolerance) => {
    const diff = Math.abs(a - b);
    const balanced = diff <= tolerance;
    const compare = a === b ? "=" : a > b ? ">" : "<";
    return (
      <p>
        {label_a}: <strong>{a} lbs <span style={{ color: balanced ? 'green' : 'red' }}>{compare}</span></strong> {label_b}: <strong>{b} lbs</strong> <span style={{ color: balanced ? 'green' : 'red' }}> {balanced ? '(Balanced)' : `(Off by ${diff} lbs)`}</span>
      </p>
    );
  };

  const calculateWeightStats = () => {
    let frontWeight = 0,
      backWeight = 0,
      leftWeight = 0,
      rightWeight = 0;

    seats.forEach((paddler, i) => {
      if (!paddler || !paddler.weight) return;
      if (i < 10) frontWeight += paddler.weight;
      else backWeight += paddler.weight;
      if (i % 2 === 0) leftWeight += paddler.weight;
      else rightWeight += paddler.weight;
    });

    frontWeight += parseInt(extraFrontWeight, 10);
    backWeight += parseInt(extraBackWeight, 10);

    return { frontWeight, backWeight, leftWeight, rightWeight };
  };

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
        className={`draggable px-3 py-2 rounded-xl flex flex-col justify-center items-center shadow border-2 hover:border-blue-400 transition-colors duration-150
          ${isOver ? 'border-dashed border-blue-400' : 'border-transparent'}
          ${paddler && isPaddlerOnWrongSide ? 'bg-red-300' : paddler ? 'bg-blue-100' : 'bg-white'}
          ${paddler && paddler.weight ? 'bg-blue-100' : 'bg-white'}
          ${isActive ? 'ring-4 ring-blue-400 scale-105 transition-transform duration-200' : ''}`}
      >
        {paddler ? (
          <span>
            <strong>{paddler.name}</strong>: {paddler.weight} lbs
          </span>
        ) : (
          <span className="text-gray-400">Empty</span>
        )}
      </div>
    );
  };

  const { frontWeight, backWeight, leftWeight, rightWeight } = calculateWeightStats();

  return (
    <>
      <div className="weights">
        {renderImbalance('Front', 'Back', frontWeight, backWeight, 10)}
        {renderImbalance('Left', 'Right', leftWeight, rightWeight, 10)}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={seats.map((_, i) => i.toString())} strategy={rectSortingStrategy}>
          <div className="boat-seating grid grid-rows-10 gap-3 py-4">
            {Array.from({ length: 10 }).map((_, rowIndex) => {
              const leftIndex = rowIndex * 2;
              const rightIndex = leftIndex + 1;

              return (
                <div key={rowIndex} className="border-b-6 flex items-center gap-3">
                  <div className="w-3 text-gray-600 font-semibold">
                    {rowIndex + 1}
                  </div>
                  <SortableSeat
                    id={leftIndex}
                    paddler={seats[leftIndex]}
                    isActive={activeId === leftIndex.toString()}
                    isOver={overId === leftIndex.toString() && activeId !== overId}
                  />
                  <SortableSeat
                    id={rightIndex}
                    paddler={seats[rightIndex]}
                    isActive={activeId === rightIndex.toString()}
                    isOver={overId === rightIndex.toString() && activeId !== overId}
                  />
                </div>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
};

export default DragonBoatSeatingChart;
