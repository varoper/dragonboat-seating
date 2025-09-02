// Instructions.jsx
import React from 'react';

function Instructions() {
  return (
    <div>
      <h2>
        The Roster
      </h2>
      <p>Your roster be in .csv format and include the following columns:</p>
      <h3>name</h3>
      <p>Required. Each name should be unique. You can use a last initial if you have two paddlers with the same name. </p>
      <h3>weight</h3>
      <p>Required. This is used for the boat balancing math.</p>
      <h3>side</h3>
      <p>Required. This is the side the paddler is able to paddle on. Use one of the following: 'left', 'right', 'either', 'none'</p>
      <h3>role</h3>
      <p>Optional. Leave empty if the person only paddles. You can add 'drummer' or 'stern'. These are used in balancing the front and back of the boat.</p>
      <p>Here is a sample roster:</p>
      <pre>
        name,weight,side,role<br />
        Bubba,145,either,<br />
        Sally,260,left,<br />
        Jimbo,190,none,stern<br />
        Rafael,245,either,<br />
        Enrique,170,either,<br />
        Marcie,120,either,drummer<br />
        Fannie,160,either,<br />
      </pre>

      <p>You can <a href="#">download a sample roster (TODO ADD THIS)</a> and edit it with your own team's info.</p>
      <h2>
        Balance & seating strategies
      </h2>
      <p>A boat with equal weights on the left and right sides is ideal. If that cannot be achieved, then slightly left-heavy is better than slightly right-heavy, as the stern can more easily balance out a left-heavy boat by standing on the right.</p>
      <p>Some teams like having the boat a bit front-heavy for race day.</p>
      <p>Place your most technical paddlers at the front and back of the boat, as these sections will have the most impact on balance.</p>
      <p>If you have paddlers with mixed experience, place more experienced paddlers around newer paddlers (instead of grouping newer paddlers together) to miminize any paddling mistakes the newer paddlers may make from impacting the rest of the boat. </p>
      <p>On race day, make sure paddlers only take what they need on the boat for that race. Unless it is an endurance race or the paddler has special needs, water can be left on shore.</p>
    </div>
  );
}

export default Instructions;
