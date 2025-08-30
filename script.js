let chart;
let lastHabitsState = JSON.stringify(localStorage.getItem('habits'));

function getDayLabels() {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

function renderChart() {
  const habits = JSON.parse(localStorage.getItem('habits')) || {};
  const selectedHabit = document.getElementById('habitFilter').value;
  const labels = getDayLabels();

  const datasets = Object.entries(habits)
    .filter(([name]) => selectedHabit === 'all' || name === selectedHabit)
    .map(([name, data]) => ({
      label: name,
      data: Array.isArray(data) ? data.map(val => val ? 1 : 0) : [],
      borderColor: '#000',
      backgroundColor: '#fff',
      tension: 0.3
    }));

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById('habitChart'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1,
          ticks: { stepSize: 1, color: '#000' }
        },
        x: {
          ticks: { color: '#000' }
        }
      },
      plugins: {
        legend: {
          labels: { color: '#000' }
        }
      }
    }
  });
}

function populateHabitFilter() {
  const habits = JSON.parse(localStorage.getItem('habits')) || {};
  const filter = document.getElementById('habitFilter');
  const currentValue = filter.value;
  filter.innerHTML = '<option value="all">All Habits</option>';
  Object.keys(habits).forEach(habit => {
    const option = document.createElement('option');
    option.value = habit;
    option.textContent = habit;
    filter.appendChild(option);
  });
  filter.value = currentValue || 'all';
}

function autoRefresh() {
  setInterval(() => {
    const currentState = JSON.stringify(localStorage.getItem('habits'));
    if (currentState !== lastHabitsState) {
      lastHabitsState = currentState;
      populateHabitFilter();
      renderChart();
    }
  }, 1000);
}

// Initial render
populateHabitFilter();
renderChart();
autoRefresh();


