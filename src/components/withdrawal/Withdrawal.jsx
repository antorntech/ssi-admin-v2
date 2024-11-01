import React, { useState } from "react";

const Withdrawal = () => {
  // Sample data for demonstration
  const [withdrawals, setWithdrawals] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      amount: "$500",
      approved: false,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "987-654-3210",
      amount: "$300",
      approved: false,
    },
    // Add more entries as needed
  ]);

  // Function to handle approval action
  const handleApproval = (id) => {
    setWithdrawals((prev) =>
      prev.map((withdrawal) =>
        withdrawal.id === id ? { ...withdrawal, approved: true } : withdrawal
      )
    );
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 items-start md:items-center mb-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold">Withdrawal</h1>
          <p className="text-sm text-gray-500">
            Total Applications: {withdrawals.length}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((withdrawal) => (
              <tr key={withdrawal.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-3 capitalize">{withdrawal.name}</td>
                <td className="px-4 py-3 capitalize">{withdrawal.email}</td>
                <td className="px-4 py-3 capitalize">{withdrawal.phone}</td>
                <td className="px-4 py-3 capitalize">{withdrawal.amount}</td>
                <td className="px-4 py-3 capitalize">
                  <button
                    onClick={() => handleApproval(withdrawal.id)}
                    className={`px-4 py-2 rounded ${
                      withdrawal.approved
                        ? "bg-gray-700 text-white"
                        : "bg-green-500 text-white"
                    }`}
                    disabled={withdrawal.approved}
                  >
                    {withdrawal.approved ? "Approved" : "Approve"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Withdrawal;
