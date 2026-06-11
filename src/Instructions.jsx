// Instructions.jsx
import React from 'react';

function Instructions() {
  return (
    <div>
      <h2>
        The Roster
      </h2>
      <p>Create your roster in .csv (separated by commas) format and include the following columns:</p>
      <h3>name</h3>
      <p>Required. Each name should be unique. You can use a last initial if you have two paddlers with the same name. </p>
      <h3>weight</h3>
      <p>Required. This is used for the boat balancing math.</p>
      <h3>side</h3>
      <p>Required. This is the side the paddler is able to paddle on. Use one of the following: 'left', 'right', 'either', 'none'</p>
      <h3>role</h3>
      <p>Optional. Leave empty if the person only paddles. You can add 'drummer', 'stern', or 'flagcatcher'. These are used in balancing the front and back of the boat. Including at least one 'flagcatcher' in your roster will inform the balancer app that you are balancing an 18 person flagcatcher boat. Otherwise, the default is a 20 person boat.</p>
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

      <p>You can <a href="example-paddlers.csv" download>download a sample roster</a> and edit it with your own team's info.</p>
      <h2>Balance & Weight Distribution</h2>

      <p>The app currently generates balance numbers based on the following sets. Use these numbers to make your own decisions in balancing the boat.</p>

      <h3>Left v/s Right</h3>
      <ul className="ml-8 list-disc mb-4">
        <li><strong>Left:</strong> The left side of rows 1-10, 1/2 of drummer weight, 1/2 of stern weight, 1/2 of extra front weight, 1/2 of extra back weight, and the steering mechanism weight.
        </li>
        <li><strong>Right:</strong> The right side of rows 1-10, 1/2 of drummer weight, 1/2 of stern weight, 1/2 of extra front weight, and 1/2 of extra back weight. </li>
      </ul>
      <h3>Front 5 v/s Back 5</h3>
      <ul className="ml-8 list-disc mb-4">
        <li><strong>Front:</strong> Drummer weight, extra front weight, and rows 1-5. </li>
        <li> <strong>Back:</strong> Stern weight, extra back weight, and rows 6-10. </li>
      </ul>
      <h3>Pacers v/s Rockets</h3>
      <p>Note that the Engine weight (rows 4-7) is excluded from this calculation.</p>
      <ul className="ml-8 list-disc mb-4">
        <li> <strong>Pacers:</strong> Drummer weight, extra front weight, and rows 1-3. </li>
        <li> <strong>Rockets:</strong> Stern weight, extra back weight, and rows 8-10. </li>
      </ul>

      <p><strong>COMING SOON:</strong> a weight differential to represent the fact that the impact of weight increases the further a paddler is from the center of the boat. I don't fully understand the precise numbers for this yet, and these will inevitably vary across types of boats (flagcatcher v/s Hong Kong) and brands within each type, but am hoping to create a general approximation to use.</p>

      <h2>Balancing Strategies</h2>

      <p>A boat with equal weights on the left and right sides is ideal. If that cannot be achieved, then slightly left-heavy is better than slightly right-heavy, as the stern can more easily balance out a left-heavy boat by standing on the right.</p>
      <p>Place your most technical paddlers at the front and back of the boat, as these sections will have the most impact on balance. </p>
      <p>Place your larger paddlers in the middle (engine) section, and lighter paddlers in the front (pacers) and back (rockets) sections. This aids in balance as well as paddler comfort & ease of paddling, as those sections best suit their body types in terms of available seating space and ability to accomodate their full reach.</p>
      <p>If you have paddlers with mixed experience, place more experienced paddlers around newer paddlers (instead of grouping newer paddlers together) to miminize any paddling mistakes the newer paddlers may make from impacting the rest of the boat. </p>
      <h3>Race strategy</h3>
      <p>Race seating balance should be more precise than it may be for practices. YOu may wish to ask paddlers to weigh themselves before the race, while wearing the clothing & footwear they plan to wear on race day, to ensure more accurate numbers.</p>
      <p>Some teams like having the boat slightly front-heavy for race day. This can be particularly impactful for faster teams. As the boat picks up speed, the bow (front) of the boat can lift, so by having the weight slightly heavier in the front, this alleviates the issue of rear drag. Less experienced or slower teams may prefer to have a more balanced front and back.</p>
      <p>On race day, make sure paddlers only take what they need on the boat for that race. Unless it is an endurance race or the paddler has special needs, water can be left on shore.</p>
    </div >
  );
}

export default Instructions;
