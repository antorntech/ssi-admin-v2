import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import { useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const SendMessages = () => {
  const uniqueByPhone = (arr) => {
    const seen = new Set();
    return arr.filter((item) => {
      if (seen.has(item.phone)) {
        return false;
      }
      seen.add(item.phone);
      return true;
    });
  };

  const params = useParams();
  const page = params?.page || 1;
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  const fetchCustomers = async () => {
    try {
      const response = await request(`users?skip=${(page - 1) * 5}&limit=5`);
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);
  console.log(selectedPoints);
  // Handle row selection
  const handleSelect = (phone) => {
    setSelectedPoints(
      (prevSelected) =>
        prevSelected.includes(phone)
          ? prevSelected.filter((id) => id !== phone) // Deselect if already selected
          : [...prevSelected, phone] // Add to selected if not already selected
    );
  };
  // Handle "Send" button click
  const doSend = () => {
    Promise.all(
      selectedPoints.map((phone) => {
        return fetch("https://www.24bulksmsbd.com/api/smsSendApi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer_id: parseInt(import.meta.env.VITE_SMS_CUSTOMER_ID),
            api_key: import.meta.env.VITE_SMS_API_KEY,
            message: `Hello, ${phone}, Welcome to the SSI Shopping Ecommerce.`,
            mobile_no: phone,
          }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json(); // Convert the response to JSON
        });
      })
    )
      .then((results) => {
        console.log("All data fetched:", results);
        toast.success("Messages sent successfully", {
          autoClose: 1000,
        });
        setSelectedPoints([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <>
      <div>
        <h1 className="text-xl font-bold">Send Messages</h1>
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
            </tr>
          </thead>

          <tbody>
            {uniqueByPhone(customers).map((point) => (
              <tr key={point.id}>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedPoints.includes(point.phone)}
                    onChange={() => handleSelect(point.phone)}
                  />
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.name}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        endPoint="customers"
        currentPage={page}
        totalPages={response.count ? Math.ceil(response.count / 5) : 0}
      />
      <textarea rows={4} color={50}>
        Write message here
      </textarea>
      <div className="mt-5">
        <button
          className="bg-[#6CB93B] text-white px-4 py-2 rounded"
          onClick={doSend}
        >
          Send
        </button>
      </div>
    </>
  );
};

export default SendMessages;
