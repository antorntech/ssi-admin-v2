import React from "react";

const Points = () => {
  const points = [
    {
      id: 1,
      customer_id: 101,
      product_id: 501,
      coins_earned: 20,
      coins_used: 5,
      transaction_type: "earned",
      order_id: 1001,
      created_at: "2nd October, 2024",
    },
    {
      id: 2,
      customer_id: 102,
      product_id: 502,
      coins_earned: 10,
      coins_used: 0,
      transaction_type: "earned",
      order_id: 1002,
      created_at: "2nd October, 2024",
    },
    {
      id: 3,
      customer_id: 103,
      product_id: 503,
      coins_earned: 0,
      coins_used: 15,
      transaction_type: "spent",
      order_id: 1003,
      created_at: "2nd October, 2024",
    },
  ];
  return (
    <>
      <div>
        <h1 className="text-xl font-bold">Points</h1>
        <p className="text-sm text-gray-500">Total Points: {points.length}</p>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="min-w-[1200px] lg:min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                ID
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Customer Email
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Customer Phone
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Coins Given
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.id}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.customer_email}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.customer_phone}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.coins_given}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                  {point.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Points;
