<template>
  <div>
    <canvas ref="lineChart"></canvas>
  </div>
  <div style="display: flex; flex-direction: column; align-items: center">
    <p style="text-align: center">Hauteur actuelle : {{ lastPointValue }}m</p>
    <button @click="openMoreInfos">Plus d'informations</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale,
} from "chart.js";
import "chartjs-adapter-date-fns";
import "chartjs-plugin-zoom";
import { fetchHeightData } from "./Api";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  TimeScale
);

const chartInstance = ref<Chart>();
const lineChart = ref<HTMLCanvasElement>();
const lastPointValue = ref(0);

const openMoreInfos = () => {
  const url = "https://www.vigicrues.gouv.fr/station/J708311001";
  window.open(url, "_blank");
};

onMounted(async () => {
  const sortedData = await fetchHeightData();

  lastPointValue.value = sortedData[0].value;

  if (chartInstance.value) {
    chartInstance.value.destroy(); // Destroy the existing chart instance
  }

  const ctx = lineChart.value?.getContext("2d");

  const labels = sortedData.map((point) => point.date); // Dates as labels
  const data = sortedData.map((point) => point.value); // Values as data points

  if (!ctx) {
    return;
  }

  chartInstance.value = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Hauteur d'eau",
          data,
          borderColor: "blue",
          backgroundColor: "blue",
          borderWidth: 0.1,
          pointBorderWidth: 1,
          pointRadius: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: "time",
          time: {
            tooltipFormat: "MMM dd, yyyy", // Format for tooltip
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Hauteur",
          },
          beginAtZero: true,
          max: 2.3,
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true, // Activer le déplacement
            mode: "x", // Permet de déplacer horizontalement (peut être "x", "y", ou "xy")
          },
          zoom: {
            wheel: {
              enabled: true, // Activer le zoom avec la molette
            },
            pinch: {
              enabled: true, // Activer le zoom par pincement sur les écrans tactiles
            },
            mode: "x", // Permet de zoomer horizontalement (peut être "x", "y", ou "xy")
          },
        },
      },
    },
  });
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy(); // Clean up the chart instance
  }
});
</script>
