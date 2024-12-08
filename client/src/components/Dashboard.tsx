import { useState, useEffect } from "react";
import MonthDropdown from "./MonthDropDown";
import TransactionTable from "./Transactions";
import axios from "axios";

interface ITransaction {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: string;
}

function Dashboard() {
  const [month, setMonth] = useState("march"); // Default month
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const perPage = 10;

  const baseUrl = import.meta.env.VITE_API_URL;

  // Fetch transaction data safely
  const fetchTransactions = async (query = "") => {
    try {
      const response = await axios.get(`${baseUrl}/transactions`, {
        params: { month, search: query, page: currentPage, perPage: 10 },
      });

      // Map only the transactions array safely
      const mappedTransactions = response?.data?.transactions?.map(
        (txn: ITransaction) => ({
          id: txn.id,
          date: txn.dateOfSale,
          category: txn.category,
          title: txn.title,
          description: txn.description,
          image: txn.image,
          price: txn.price,
          sold: txn.sold,
        })
      );

      if (mappedTransactions) {
        setTransactions(mappedTransactions);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setTransactions([]); // Clear the data if an error occurs
      setTotalRecords(0);
    }
  };

  useEffect(() => {
    fetchTransactions(searchTerm);
  }, [month, searchTerm, currentPage]);

  return (
    <div className="p-6 w-screen px-36">
      <h1 className="flex justify-center item-center text-blue-600 font-semibold text-4xl pt-11 pb-10">Transactions Dashboard</h1>
      {/* search  */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search transaction"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg w-1/3"
          />
          {/* month dropdown */}
          <MonthDropdown selectedMonth={month} onChange={setMonth} />
        </div>
        {/* transaction table */}
        <TransactionTable
          transactions={transactions}
          onNext={() => setCurrentPage((prev) => prev + 1)}
          onPrevious={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          currentPage={currentPage}
          totalRecords={totalRecords}
          perPage={perPage}
        />
      </div>
  );
}
export default Dashboard;
