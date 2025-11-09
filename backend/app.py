from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

time_slots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"]
assignments = {slot: None for slot in time_slots}

@app.route('/timeslots', methods=['GET'])
def get_timeslots():
    return jsonify({"time_slots": time_slots, "assignments": assignments})

@app.route('/assign', methods=['POST'])
def assign_slot():
    data = request.json
    slot = data.get('slot')
    task = data.get('task')
    if slot not in time_slots:
        return jsonify({"error": "Invalid time slot"}), 400
    if assignments[slot] is not None:
        return jsonify({"error": "Time slot already assigned"}), 400
    assignments[slot] = task
    return jsonify({"message": "Assigned successfully", "assignments": assignments})

@app.route('/clear', methods=['POST'])
def clear_assignments():
    for slot in time_slots:
        assignments[slot] = None
    return jsonify({"message": "All assignments cleared", "assignments": assignments})

if __name__ == '__main__':
    app.run(debug=True)
