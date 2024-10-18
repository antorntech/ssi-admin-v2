import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import { useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const SendMessages = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [customers, setCustomers] = useState([]);
  console.log(customers);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  const fetchCustomers = async () => {
    try {
      const response = await request(`users?skip=${(page - 1) * 5}&limit=5`);
      const json = await response.json();
      console.log(json);
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setCustomers(data);
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

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
    const selectedPhones = customers
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
        <p className="text-sm text-gray-500">
          Total Points: {customers.length}
        </p>
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
            {customers.map((point) => (
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

      {/* Pagination Component */}
      <Pagination
        endPoint="customers"
        currentPage={page}
        totalPages={response.count ? Math.ceil(response.count / 5) : 0}
      />

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
