import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { roomMapping } from './fetchOccupancy'
import ChartDataLabels from 'chartjs-plugin-datalabels';


// Register required components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

function getInitials(inputString) {
    return inputString
        .split(' ') // Split the string into an array of words
        .map(word => word.charAt(0)) // Get the first character of each word
        .join(''); // Combine them into a single string
}

const PieChart = ({occupancyData}) => {
  const filteredKeys = Object.keys(occupancyData).filter((d) => d !== 'totalRoomsSold')
  const data = {
    labels: Object.keys(roomMapping).map((d) => roomMapping[d].name),
    datasets: [
      {
        label: 'Room types',
        data: filteredKeys.map((d) => occupancyData[d]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom aspect ratio

    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Rooms Sold',
      },
      datalabels: {
        color: 'black', // Color of the text
        formatter: (value, context) => {
            const label = context.chart.data.labels[context.dataIndex];
            return `${getInitials(label)}: ${value}`; // Combine legend name and value
          },
        font: {
          size: 14, // Adjust font size
          weight: 'bold',
        },
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
