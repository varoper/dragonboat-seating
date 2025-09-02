// ExtraBoatWeight.js
import React, { useState, useEffect, useRef } from 'react';
import { storeExtraFrontWeight, storeExtraBackWeight, storeSteeringWeight } from '../utils/StorageHelpers';
import useStore from '../store/useStore';

// Inputs for additional front and back weight 
const ExtraBoatWeight = () => {

  const extraFrontWeight = useStore((state) => state.extraFrontWeight);
  const extraBackWeight = useStore((state) => state.extraBackWeight);
  const steeringWeight = useStore((state) => state.steeringWeight);

  return (
    <section>
      <h2>Add extra boat weight</h2>
      <fieldset>
        <div className="flex gap-4">
          <div>
            <label for="extra_front_weight">Front</label>
            <input
              type="number"
              id="extra_front_weight"
              className="w-16"
              value={extraFrontWeight}
              onChange={(e) => storeExtraFrontWeight(e.target.value)}
            />
          </div>
          <div>
            <label for="extra_back_weight">Back</label>
            <input
              type="number"
              id="extra_back_weight"
              className="w-16"
              value={extraBackWeight}
              onChange={(e) => storeExtraBackWeight(e.target.value)}
            />
          </div>
          <div>
            <label for="steering_weight">Steering mechanism</label>
            <input
              type="number"
              id="steering_weight"
              className="w-16"
              value={steeringWeight}
              onChange={(e) => storeSteeringWeight(e.target.value)}
            />
          </div>
        </div>
        <p className="mt-3">When using a drum, add that weight to the "front" field. These fields can also be used to add the weight of a drummer, stern, or flagcatcher who is not in the roster.</p>
      </fieldset>
    </section>
  );
};

export default ExtraBoatWeight;
