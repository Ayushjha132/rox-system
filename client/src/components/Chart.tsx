import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MonthDropdown from "./MonthDropDown";

export default function StatisticsChart() {
  const [month, setMonth] = useState("march");
  const [chartData, setChartData] = useState([]); // Store bar graph data
  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch statistics data from the backend API
  const fetchChartData = async () => {
    try {
      console.log("Fetching data for month:", month); // Debugging line
      const response = await axios.get(`${baseUrl}/barchart`, {
        params: { month },
      });

      console.log("Received data from backend:", response?.data?.data); // Log response
      if (response?.data) {
        setChartData(response.data.data);
      } else {
        console.log("No valid data found.");
        setChartData([]);
      }
    } catch (error) {
      console.error("Failed to fetch bar chart data:", error);
      setChartData([]); // Clear data on API failure
    }
  };

  // Trigger fetch every time the `month` changes
  useEffect(() => {
    fetchChartData();
  }, [month]);

  return (
    <>
    <div className="w-full shadow-lg p-6 bg-white rounded-lg">
    <div className="flex-col items-center justify-center mt-4 space-y-1">
      <h1 className="flex justify-center item-center text-blue-600 font-semibold text-2xl pt-11 pb-10">Monthly Sales Bar Graph</h1>

      {/* Month Dropdown */}
      <div className="mb-4 flex justify-center">
        <MonthDropdown selectedMonth={month} onChange={setMonth} />
      </div>

      {/* Bar Graph */}
      <div className="mt-6 w-full h-96">
        <ResponsiveContainer width="%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            {/* Debug X Axis with priceRange */}
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      </div>
      </div>
    </>
  );
}
