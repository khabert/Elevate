const express = require("express");
const connectToDB = require("./db/database");
const productModel = require("./models/productModel");

const app = express();
app.use(express.json());

connectToDB();

let liftState = {
  currentFloor: 1,
  direction: 'idle',
  isOpen: false,
  isEmergency: false,
  weight: 0,
  waitPressed: false,
};

// Middleware to check if the lift is operational
function checkLiftOperational(request, response, next) {
  if (liftState.isEmergency) {
    return response.status(400).json({ error: 'Lift is in emergency mode. Cannot proceed.' });
  }
  next();
}

app.get('/', (request, response) => {
  return response.send('Welcome to the Lift Simulation');
});

app.get('/options', checkLiftOperational, (request, response) => {
  // Display options (up, down) for the user to choose
  return response.status(200).json({ options: ['up', 'down'] });
});

app.post('/select-direction', checkLiftOperational, (request, response) => {
  const { direction } = request.body;

  if (!direction || (direction !== 'up' && direction !== 'down')) {
    return response.status(400).json({ error: 'Invalid direction' });
  }

  // Set lift state for simulation
  liftState = {
    currentFloor: 1,
    direction,
    isOpen: true,
    isEmergency: false,
    weight: 0,
    waitPressed: false,
  };

  // Display floor options based on the selected direction
  const floorOptions = direction === 'up' ? [2, 3, 4, 5] : [5, 4, 3, 2, 1];
  return response.status(200).json({ floorOptions });
});

app.post('/create', (request, response) => {
  const { Name, Email, Contact } = request.body;

  if (!Name || !Email || !Contact) {
    return response.status(400).json({ error: 'Name, Email, and Contact are required' });
  }

  // Save the user profile (you may adapt this to your database logic)
  const userProfile = {
    Name,
    Email,
    Contact,
  };

  return response.status(200).json({ message: 'User profile created successfully', userProfile });
});

app.post('/select-floor', checkLiftOperational, (request, response) => {
  const { selectedFloor } = request.body;

  if (!selectedFloor || isNaN(selectedFloor)) {
    return response.status(400).json({ error: 'Invalid or missing selectedFloor' });
  }

  // Update the liftState with the new selected floor
  liftState.currentFloor = selectedFloor;
  return response.status(200).json({ message: 'Floor selected successfully', liftState });
});

app.post('/enter-weight', checkLiftOperational, (request, response) => {
  const { weight } = request.body;

  if (!weight || isNaN(weight)) {
    return response.status(400).json({ error: 'Invalid or missing weight' });
  }

  if (liftState.weight + parseFloat(weight) > 800) {
    return response.status(400).json({ error: 'Total weight exceeds 800kgs. Lift cannot move.' });
  }

  // Update the lift state with the new weight
  liftState.weight += parseFloat(weight);

  return response.status(200).json({ message: 'Weight entered successfully', liftState });
});

// Additional route for handling lift state
app.route('/lift-state')
  .get(checkLiftOperational, (request, response) => {
    // Handle GET request for lift state
    return response.status(200).json({ liftState });
  })
  .post(checkLiftOperational, (request, response) => {
    // Handle POST request for lift state
    return response.status(200).json({ liftState });
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app running at http://localhost:${port}`);
});