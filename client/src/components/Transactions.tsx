import React from "react";

interface Transaction {
  _id: string;
  id: number;
  category: string;
  dateOfSale: string;
  description: string;
  image: string;
  price: number;
  sold: boolean;
  title: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  currentPage: number;
  totalRecords: number;
  perPage: number;
  onNext: () => void;
  onPrevious: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  currentPage,
  totalRecords,
  perPage,
  onNext,
  onPrevious,
}) => {
  const totalPages = Math.ceil(totalRecords / perPage);

  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500">No transactions available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Price</th>
              <th className="border border-gray-300 p-2">Sold</th>
              <th className="border border-gray-300 p-2">Date of Sale</th>
              <th className="border border-gray-300 p-2">Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td className="border border-gray-300 p-2">{transaction.id}</td>
                <td className="border border-gray-300 p-2">{transaction.title}</td>
                <td className="border border-gray-300 p-2">{transaction.category}</td>
                <td className="border border-gray-300 p-2">{transaction.price}</td>
                <td className="border border-gray-300 p-2">{transaction.sold ? "Yes" : "No"}</td>
                <td className="border border-gray-300 p-2">
                  {new Date(transaction.dateOfSale).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={transaction.image}
                    alt={transaction.title}
                    className="h-12 w-12 object-cover"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={onPrevious}
          className={`px-4 py-2 border ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={onNext}
          className={`px-4 py-2 border ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionTable;
