// ExtraBoatWeight.js
import React, { useState, useEffect, useRef } from 'react';
import StorageManager from '../utils/StorageManager';
import useStore from '../store/useStore';
import STORAGE_KEYS from "../consts/StorageKeys";

// Inputs for additional front and back weight 
const ExtraBoatWeight = () => {

  const extraFrontWeight = useStore((state) => state.extraFrontWeight);
  const extraBackWeight = useStore((state) => state.extraBackWeight);
  const steeringWeight = useStore((state) => state.steeringWeight);

  const setExtraFrontWeight = useStore((state) => state.setExtraFrontWeight);
  const setExtraBackWeight = useStore((state) => state.setExtraBackWeight);
  const setSteeringWeight = useStore((state) => state.setSteeringWeight);

  const storeExtraFrontWeight = (extraFrontWeight) => {
    setExtraFrontWeight(extraFrontWeight);
    StorageManager.set(STORAGE_KEYS.EXTRA_FRONT_WEIGHT, extraFrontWeight);
  };

  const storeExtraBackWeight = (extraBackWeight) => {
    setExtraBackWeight(extraBackWeight);
    StorageManager.set(STORAGE_KEYS.EXTRA_BACK_WEIGHT, extraBackWeight);
  };

  const storeSteeringWeight = (steeringWeight) => {
    setSteeringWeight(steeringWeight);
    StorageManager.set(STORAGE_KEYS.STEERING_WEIGHT, steeringWeight);
  };

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
      </fieldset>
    </section>
  )
}

export default ExtraBoatWeight;
