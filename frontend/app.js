const API_URL = "http://127.0.0.1:5000";

const taskInput = document.getElementById('taskInput');
const timeslotContainer = document.getElementById('timeslotContainer');

function fetchTimeslots() {
  fetch(`${API_URL}/timeslots`)
    .then(res => res.json())
    .then(data => {
      displayTimeslots(data.time_slots, data.assignments);
    });
}

function displayTimeslots(slots, assignments) {
  timeslotContainer.innerHTML = '';
  slots.forEach(slot => {
    const slotDiv = document.createElement('div');
    slotDiv.className = 'timeslot';

    const label = document.createElement('span');
    label.innerText = slot;

    const assignedTask = assignments[slot];
    const statusSpan = document.createElement('span');
    statusSpan.className = assignedTask ? 'assigned' : 'unassigned';
    statusSpan.innerText = assignedTask ? ` - ${assignedTask}` : ' - Available';

    slotDiv.appendChild(label);
    slotDiv.appendChild(statusSpan);

    if (!assignedTask) {
      const btn = document.createElement('button');
      btn.innerText = 'Assign Task';
      btn.onclick = () => assignTask(slot);
      slotDiv.appendChild(btn);
    }

    timeslotContainer.appendChild(slotDiv);
  });
}

function assignTask(slot) {
  const task = taskInput.value.trim();
  if (!task) {
    alert('Enter a task before assigning');
    return;
  }
  fetch(`${API_URL}/assign`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({slot: slot, task: task})
  }).then(res => res.json())
    .then(data => {
      if (data.error) {
        alert(data.error);
      } else {
        taskInput.value = '';
        fetchTimeslots();
      }
    });
}

function clearAll() {
  if (confirm('Clear all assignments?')) {
    fetch(`${API_URL}/clear`, {method: 'POST'})
      .then(res => res.json())
      .then(data => {
        fetchTimeslots();
      });
  }
}

window.onload = fetchTimeslots;
