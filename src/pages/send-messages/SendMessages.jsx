import { useState } from "react";
import { toast } from "react-toastify";

const SendMessages = () => {
  const [selectedPoints, setSelectedPoints] = useState([]);

  // Dummy data for points
  const points = [
    {
      id: 1,
      name: "John Doe",
      phone: "123-456-7890",
      email: "john@example.com",
    },
    {
      id: 2,
      name: "Jane Smith",
      phone: "987-654-3210",
      email: "jane@example.com",
    },
    {
      id: 3,
      name: "Alice Johnson",
      phone: "555-123-4567",
      email: "alice@example.com",
    },
  ];

  // Handle row selection
  const handleSelect = (pointId) => {
    setSelectedPoints(
      (prevSelected) =>
        prevSelected.includes(pointId)
          ? prevSelected.filter((id) => id !== pointId) // Deselect if already selected
          : [...prevSelected, pointId] // Add to selected if not already selected
    );
  };

  // Handle "Send" button click
  const handleSend = () => {
    const selectedPhones = points
      .filter((point) => selectedPoints.includes(point.id))
      .map((point) => point.phone);

    console.log("Selected Customer Phones:", selectedPhones);
    toast.success("Messages sent successfully", {
      autoClose: 1000,
    });
    setSelectedPoints([]);
  };

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
                Select
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
            </tr>
          </thead>

          <tbody>
            {points.map((point) => (
              <tr key={point.id}>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedPoints.includes(point.id)}
                    onChange={() => handleSelect(point.id)}
                  />
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.name}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.phone}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5">
        <button
          className="bg-[#6CB93B] text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default SendMessages;
