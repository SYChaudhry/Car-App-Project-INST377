let mileageChart;
let dashboardChart;

// Chart for garage page
function makeGarageChart(vehicles) {
  const chartCanvas = document.getElementById("mileageChart");

  if (!chartCanvas) {
    return;
  }

  const labels = [];
  const mileages = [];

  for (let i = 0; i < vehicles.length; i++) {
    labels.push(vehicles[i].make + " " + vehicles[i].model);
    mileages.push(vehicles[i].mileage);
  }

  if (mileageChart) {
    mileageChart.destroy();
  }

  mileageChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mileage",
          data: mileages
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}

// Chart for dashboard page
function makeDashboardChart(vehicles) {
  const chartCanvas = document.getElementById("dashboardMileageChart");

  if (!chartCanvas) {
    return;
  }

  const labels = [];
  const mileages = [];

  for (let i = 0; i < vehicles.length; i++) {
    labels.push(vehicles[i].make + " " + vehicles[i].model);
    mileages.push(vehicles[i].mileage);
  }

  if (dashboardChart) {
    dashboardChart.destroy();
  }

  dashboardChart = new Chart(chartCanvas, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Mileage",
          data: mileages
        }
      ]
    },
    options: {
      responsive: true
    }
  });
}