import React, { useState } from "react";
import Chart from "react-apexcharts";

const AppextBarChart = () => {
  const [timeframe, setTimeframe] = useState("Week");

  // Data for each timeframe (week, month, year)
  const chartData = {
    Week: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [30, 40, 35, 50, 49, 60, 70],
    },
    Month: {
      categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
      data: [120, 150, 180, 220],
    },
    Year: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      data: [400, 430, 448, 470, 540, 580, 690, 700, 780, 810, 870, 900],
    },
  };

  // ApexCharts configuration
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "35%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: chartData[timeframe].categories,
    },
    yaxis: {
      title: {
        text: "Emails Sent",
      },
    },
    fill: {
      opacity: 1,
    },
    colors: ["#6CB93B"], // Set the color of the bars here
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} emails`;
        },
      },
    },
  };

  return (
    <div className="p-5 bg-white rounded-lg">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-md md:text-lg font-semibold">Email Sent</h2>
        <div className="flex items-center">
          <button
            onClick={() => setTimeframe("Week")}
            className={`px-2 py-1 md:px-4 md:py-2 text-white text-sm ${
              timeframe === "Week" ? "bg-[#6CB93B]" : "bg-[#bde0a8]"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("Month")}
            className={`px-2 py-1 md:px-4 md:py-2 text-white text-sm mx-1 ${
              timeframe === "Month" ? "bg-[#6CB93B]" : "bg-[#bde0a8]"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("Year")}
            className={`px-2 py-1 md:px-4 md:py-2 text-white text-sm ${
              timeframe === "Year" ? "bg-[#6CB93B]" : "bg-[#bde0a8]"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      <Chart
        options={chartOptions}
        series={[
          {
            name: "Emails Sent",
            data: chartData[timeframe].data,
          },
        ]}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default AppextBarChart;
