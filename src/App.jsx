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
      <div className="px-3 md:px-6 lg:px-12 pt-3 border-b-2 border-slate-300 bg-gradient-to-b from-sky-50 to-sky-200">
        <h1>DragonBoat<span className="text-purple-600">Balancer</span></h1>
        <div className="inline-flex rounded-t-md overflow-hidden -mb-0.5">
          <a
            href="?tab=chart"
            className={`px-2 sm:px-4 py-2 mr-2 text-md font-medium border border-slate-300 border-b-0 rounded-t-md transition-colors duration-150 ${currentTab === 'chart'
              ? 'bg-white text-purple-600'
              : 'bg-sky-50 border-b-2 text-slate-600 hover:text-purple-600'
              }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('chart');
              const url = new URL(window.location);
              url.searchParams.set('tab', 'chart');
              window.history.pushState({}, '', url);
            }}
          >
            Balancer
          </a>
          <a
            href="?tab=instructions"
            className={`px-2 sm:px-4 py-2 mr-2 text-md font-medium border border-slate-300 border-b-0 rounded-t-md transition-colors duration-150 ${currentTab === 'instructions'
              ? 'bg-white text-purple-600'
              : 'bg-sky-50 border-b-2 text-slate-600 hover:text-purple-600'
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
          <a
            href="?tab=instructions"
            className={`px-2 sm:px-4 py-2 mr-2 text-md font-medium border border-slate-300 border-b-0 rounded-t-md transition-colors duration-150 ${currentTab === 'faq'
              ? 'bg-white text-purple-600'
              : 'bg-sky-50 border-b-2 text-slate-600 hover:text-purple-600'
              }`}
            onClick={(e) => {
              e.preventDefault();
              setCurrentTab('faq');
              const url = new URL(window.location);
              url.searchParams.set('tab', 'faq');
              window.history.pushState({}, '', url);
            }}
          >
            FAQs
          </a>
        </div>
      </div>

      <div className="bg-white py-6 px-3 md:px-6 lg:px-12 border-b-2 border-slate-300">
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
      <div className="py-6 px-3 md:px-6 lg:px-12">
        <p className="text-sm align-right">Created by VA Roper to make coaching just a little bit easier.</p>
      </div>
    </div>
  );
}

export default App;