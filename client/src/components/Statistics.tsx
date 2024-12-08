import { useState, useEffect } from "react";
import MonthDropdown from "./MonthDropDown";
import axios from "axios";

export default function Statistics() {
  const [month, setMonth] = useState("march");
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  const baseUrl = import.meta.env.VITE_API_URL;

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${baseUrl}/statistics`, {
        params: { month },
      });

      const statisticsData = response?.data || {};
      setStatistics({
        totalSaleAmount: statisticsData.totalSaleAmount || 0,
        totalSoldItems: statisticsData.totalSoldItems || 0,
        totalNotSoldItems: statisticsData.totalNotSoldItems || 0,
      });
    } catch (err) {
      console.error("Error fetching statistics:", err);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  return (
    
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg border border-gray-600">
        <h1 className="flex justify-center item-center text-blue-600 font-semibold text-2xl pt-11 pb-10">Transctions Statistics</h1>
        <MonthDropdown selectedMonth={month} onChange={setMonth} />
        <div className="flex flex-col  justify-start mt-4 space-y-4">
          <p className="text-lg font-semibold">Total Sale Amount: ${statistics.totalSaleAmount}</p>
          <p className="text-lg font-semibold">Total Sold Items: {statistics.totalSoldItems}</p>
          <p className="text-lg font-semibold">Total Not Sold Items: {statistics.totalNotSoldItems}</p>
        </div>
      </div>
  );
}
