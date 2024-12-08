
import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";

import Chart from "./components/Chart";


function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100  px-36">
      <Dashboard />
      <div className="mt-4 flex items-center justify-between w-full bg-white rounded-lg shadow-md p-4 space-x-2">

      <Statistics />
      <Chart />
      </div>
    </div>
  );
}
export default App;
