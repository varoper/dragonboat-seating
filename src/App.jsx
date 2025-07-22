import React, { useState, useEffect, useRef } from 'react';
import SeatingChart from './SeatingChart';
import Instructions from './Instructions';

const SEATING_COOKIE_KEY = 'seatingChart';
const EXTRA_PADDLERS_COOKIE_KEY = 'extraPaddlers';
const DRUMMER_COOKIE_KEY = 'drummer';
const STERN_COOKIE_KEY = 'stern';

function App() {
  const [currentTab, setCurrentTab] = useState('chart');

  // Load correct tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'instructions' || tab === 'chart') {
      setCurrentTab(tab);
    }
  }, []);

  return (
    <div className="App">
      <h1>Nichi Dragonboat Seating Chart</h1>
      <div className="px-3">
        <div className="inline-flex rounded-t-md overflow-hidden -mb-0.5">
          <a
            href="?tab=chart"
            className={`px-4 py-2 mr-2 text-md font-medium border border-gray-300 border-b-0 rounded-t-md transition-colors duration-150 ${currentTab === 'chart'
              ? 'bg-white text-purple-600 font-semibold'
              : 'bg-gray-100 text-gray-600 hover:text-purple-600'
              }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('chart');
              const url = new URL(window.location);
              url.searchParams.set('tab', 'chart');
              window.history.pushState({}, '', url);
            }}
          >
            Chart Builder
          </a>
          <a
            href="?tab=instructions"
            className={`px-4 py-2 text-md font-medium border border-gray-300 border-b-0 rounded-t-md transition-colors duration-150 ${currentTab === 'instructions'
              ? 'bg-white text-purple-600 font-semibold'
              : 'bg-gray-100 text-gray-600 hover:text-purple-600'
              }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('instructions');
              const url = new URL(window.location);
              url.searchParams.set('tab', 'instructions');
              window.history.pushState({}, '', url);
            }}
          >
            Instructions
          </a>
        </div>
      </div>

      <div className="border-t-2 border-gray-300 bg-white py-6 px-3">
        <div className="max-w-6xl">
          {currentTab === 'chart' && (
            <SeatingChart />
          )}
          {
            currentTab === 'instructions' && (
              <Instructions />
            )
          }
        </div>
      </div>
    </div>
  );
}

export default App;