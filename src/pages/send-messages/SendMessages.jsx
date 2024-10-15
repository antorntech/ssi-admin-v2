const SendMessages = () => {
  const points = [];
  return (
    <>
      <div>
        <h1 className="text-xl font-bold">Send Messages</h1>
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
                Customer ID
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Product ID
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Coins Earned
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Coins Used
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Transaction Type
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Order ID
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
                  {point.customer_id}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.product_id}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.coins_earned}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.coins_used}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.transaction_type}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.order_id}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
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

export default SendMessages;
