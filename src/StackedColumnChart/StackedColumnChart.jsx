import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";

const StackedColumnChart = () => {
  const [chartData, setChartData] = useState("week");

  // Function to fetch chart data based on time range
  const getChartData = (range) => {
    switch (range) {
      case "week":
        return {
          categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          series: [
            { name: "Series 1", data: [10, 20, 15, 30, 20, 10, 15] },
            { name: "Series 2", data: [5, 10, 5, 20, 10, 5, 10] },
            { name: "Series 3", data: [8, 10, 12, 22, 14, 9, 13] },
          ],
        };
      case "month":
        return {
          categories: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
          series: [
            { name: "Series 1", data: [40, 50, 60, 30, 20] },
            { name: "Series 2", data: [15, 25, 35, 20, 10] },
            { name: "Series 3", data: [20, 30, 25, 15, 18] },
          ],
        };
      case "year":
        return {
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
          series: [
            {
              name: "Series 1",
              data: [
                200, 180, 210, 160, 140, 180, 210, 220, 150, 170, 160, 180,
              ],
            },
            {
              name: "Series 2",
              data: [90, 110, 95, 80, 70, 85, 100, 120, 105, 95, 110, 100],
            },
            {
              name: "Series 3",
              data: [75, 65, 80, 85, 60, 70, 85, 95, 90, 80, 85, 90],
            },
          ],
        };
      default:
        return {};
    }
  };

  // Handle chart rendering
  useEffect(() => {
    const chartColors = JSON.parse(
      document
        .getElementById("stacked-column-chart")
        .getAttribute("data-colors")
    ).map(
      (color) =>
        getComputedStyle(document.documentElement).getPropertyValue(color) ||
        color
    );

    const chartOptions = {
      series: getChartData(chartData).series,
      chart: {
        type: "bar",
        height: 317,
        stacked: true,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "15%",
        },
      },
      xaxis: {
        categories: getChartData(chartData).categories,
      },
      colors: chartColors,
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => `${val}`,
        },
      },
      legend: {
        position: "top",
      },
    };

    const chart = new ApexCharts(
      document.querySelector("#stacked-column-chart"),
      chartOptions
    );

    chart.render();
    return () => {
      chart.destroy();
    };
  }, [chartData]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between">
        <h4 className="card-title mb-4">Email Sent</h4>
        <div className="btn-group mb-4" role="group">
          <button
            type="button"
            className={`btn btn-primary ${
              chartData === "week" ? "active" : ""
            }`}
            onClick={() => setChartData("week")}
          >
            Week
          </button>
          <button
            type="button"
            className={`btn btn-primary ${
              chartData === "month" ? "active" : ""
            }`}
            onClick={() => setChartData("month")}
          >
            Month
          </button>
          <button
            type="button"
            className={`btn btn-primary ${
              chartData === "year" ? "active" : ""
            }`}
            onClick={() => setChartData("year")}
          >
            Year
          </button>
        </div>
      </div>

      <div
        id="stacked-column-chart"
        className="apex-charts"
        data-colors='["--bs-primary", "--bs-warning", "--bs-success"]'
        dir="ltr"
      ></div>
    </div>
  );
};

export default StackedColumnChart;
