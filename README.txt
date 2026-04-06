Vehicle Insurance Cross-Sell ML Application
===========================================


Prerequisites
-------------

1. Python(with pip)
2. Node.js(with npm)

Step-by-Step Guide
------------------

### 1. Start the Backend API

1. Open a new Command Prompt or Terminal.
2. Navigate to this root folder:
   cd path\to\Specialisation
3. (Optional but recommended) Install Python dependencies if you haven't already:
   pip install -r backend\requirements.txt
   pip install uvicorn
4. Start the server using Uvicorn:
   python -m uvicorn backend.main:app

Keep this terminal window running! The backend will successfully load the 4 models and print "Startup complete."

### 2. Start the Frontend UI

1. Open a SECOND (new) Command Prompt or Terminal window.
2. Navigate to the frontend folder:
   cd path\to\Specialisation\frontend
3. (Optional) Run npm install if this is your first time setting up the project on a new PC:
   npm install
4. Start the React development server:
   npm run dev

### 3. Usage
- Once both servers are running, the second terminal should show a local URL, typically: http://localhost:5173/
- Copy and paste that URL into your web browser.
- You can navigate the UI to switch between the Home Overview, Model Analyses graphs, and the interactive Predictor tool!
