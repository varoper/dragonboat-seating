// About.jsx
import React from 'react';

function About() {
  return (
    <div>
      <h2>
        About This App
      </h2>
      <p>This is an app to help you balance your boat. There are no fancy calculations or mathematics involved to place your paddlers in their optimal seats. There are, however, basics calculations and mathematics involved to give you information about weight that empowers you to make your own decisions about where your paddlers should sit, with a drag & drop interface and ability to add paddlers on the fly.</p>
      <h2>Bug Reports & Feature Requests</h2>
      <p>If you encounter any bugs or have feature requests, please submit them through the <a target="_blank" href="https://github.com/varoper/dragonboat-seating/issues">issue tracker</a> on the <a target="_blank" href="https://github.com/varoper/dragonboat-seating/">Dragon Boat Seating GitHub repository</a>.</p>
      <h2>Future Plans</h2>
      <h3>Alternate ways to add a roster</h3>
      <p>Currently, rosters must be added server-side, with me throwing up a new instance of this site. Work is in progress to enable client-side roster upload (then stored in cache) with a more global instance of this app availabole for use. I would also like to explore adding account capabilities, so people could create their own instances of the app and upload rosters to the server themselves (or have a dedicated interface to roster management, maybe even integration with 3rd party team management apps), but ultimately depends on interest in the project.</p>

    </div>
  );
}

export default About;
