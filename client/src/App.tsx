
import Dashboard from "./components/Dashboard";
import Statistics from "./components/Statistics";

import Chart from "./components/Chart";


function App() {

  const baseUrl = import.meta.env.VITE_API_URL;
  const handleSeedingData = async () => {
    try {
      const response = await fetch(`${baseUrl}/seedData`);
      if (response.ok) {
        console.log("Data seeded successfully!");
      } else {
        console.error("Failed to seed data.");
      }
    } catch (error) {
      console.error("Error seeding data:", error);
    }
  };
  return (
    <>
    {/* to seed data*/}
    <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 mb-1 ml-1" onClick={handleSeedingData}>
      Seed data</button>
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100  px-36">
      
      <Dashboard />
      
      <div className="mt-4 flex items-center justify-between w-full bg-white rounded-lg shadow-md p-4 space-x-2">

      <Statistics />
      <Chart />
      </div>
    </div>
    </>
  );
}
export default App;
