from glasses import FrontendData

from flask import Flask, jsonify, request
from flask_cors import CORS
import time

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])

@app.route('/members')
def members():
    return jsonify({"members": ["yas", "yaas", "yaaas"]})

# States
NOT_STARTED = 0
WORK_RUNNING = 1
WORK_PAUSED = 2
REST_RUNNING = 3
REST_PAUSED = 4

state = NOT_STARTED
WORK_BLOCK = 11   # 10 minutes in seconds
REST_BLOCK = 21  # 20 minutes in seconds

end_time = None
remaining_time_when_paused = None
frontend = None
glassesValues = None



@app.route('/control', methods=['POST'])
def control():
    global state, end_time, remaining_time_when_paused
    global frontend

    action = request.json.get("action")
    current_time = time.time()
    
    if action == "start":
        state = WORK_RUNNING
        end_time = current_time + WORK_BLOCK
        frontend = FrontendData()
        
    elif action == "pause":
        if state in [WORK_RUNNING, REST_RUNNING]:
            remaining_time_when_paused = end_time - current_time
            end_time = current_time  # Immediately update to reflect paused state
            state = WORK_PAUSED if state == WORK_RUNNING else REST_PAUSED
    elif action == "resume":
        if state in [WORK_PAUSED, REST_PAUSED]:
            state = WORK_RUNNING if state == WORK_PAUSED else REST_RUNNING
            end_time = current_time + remaining_time_when_paused

    return jsonify({"status": "ok"})

@app.route('/time_left')
def time_left():
    global state, end_time, frontend, glassesValues
    current_time = time.time()

    print(frontend)
    if(frontend != None):
        print(frontend.getValues())
        glassesValues = frontend.getValues()


    if state == NOT_STARTED:
        return jsonify({"time_left": 0, "state": state})
    
    # Handle the paused states
    if state in [WORK_PAUSED, REST_PAUSED]:
        return jsonify({"time_left": remaining_time_when_paused, "state": state})
    
    time_left = end_time - current_time

    if time_left < 0:
        if state in [WORK_RUNNING, REST_RUNNING]:  # Only reset if running
            time_left = 0
            state = REST_RUNNING if state == WORK_RUNNING else WORK_RUNNING
            end_time = current_time + (REST_BLOCK if state == REST_RUNNING else WORK_BLOCK)

    return jsonify({"time_left": time_left, "state": state, "eyeValues": glassesValues})

@app.route('/reset', methods=['POST'])
def reset():
    global state, end_time, remaining_time_when_paused
    state = NOT_STARTED
    end_time = None
    remaining_time_when_paused = None
    return jsonify({"status": "reset"})


if __name__ == "__main__":
    app.run(debug=True)
