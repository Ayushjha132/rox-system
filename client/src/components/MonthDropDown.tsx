import React from "react";

const MonthDropdown: React.FC<{ selectedMonth: string; onChange: (value: string) => void }> = ({ selectedMonth, onChange }) => {
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december",
  ];

  return (
    <select
      value={selectedMonth}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border border-gray-300 rounded-lg"
    >
      {months.map((month) => (
        <option key={month} value={month}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthDropdown;
