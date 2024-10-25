import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import { useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const SendMessages = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);
  const [message, setMessage] = useState("");
  const limit = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await request(
          `users?skip=${(page - 1) * limit}&limit=${limit}`
        );
        const json = await response.json();
        const { data, count } = json;
        if (!data) return;
        setResponse((prev) => ({ ...prev, data, count }));
        setCustomers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCustomers();
  }, [page, request]);

  const handleSelect = (phone) => {
    setSelectedNumbers(
      (prevSelected) =>
        prevSelected.includes(phone)
          ? prevSelected.filter((id) => id !== phone) // Deselect if already selected
          : [...prevSelected, phone] // Add to selected if not already selected
    );
  };

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

  const doSend = () => {
    Promise.all(
      selectedNumbers.map((phone) => {
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
        setSelectedNumbers([]);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const uniqueCustomers = uniqueByPhone(customers);

  return (
    <div className="flex flex-wrap gap-4">
      <div className="w-full">
        <h1 className="text-xl font-bold">Send Messages</h1>
      </div>
      <section className="">
        <table className="overflow-x-auto bg-white border">
          <thead>
            <tr>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700"
                width="80px"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                  onChange={() => {
                    if (selectedNumbers.length > 0) {
                      setSelectedNumbers([]);
                    } else {
                      setSelectedNumbers(
                        uniqueCustomers.map((item) => item?.phone || item)
                      );
                    }
                  }}
                />
              </th>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700"
                width="280px"
              >
                Phone
              </th>
              <th
                className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700"
                width="280px"
              >
                Name
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {uniqueByPhone(customers).map((point) => (
              <tr key={point?.id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-green-500"
                    checked={selectedNumbers.includes(point?.phone)}
                    onChange={() => handleSelect(point?.phone)}
                  />
                </td>
                <td className="px-4 py-2">{point?.phone}</td>
                <td className="px-4 py-2">{point?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          endPoint="send-messages"
          currentPage={page}
          totalPages={response.count ? Math.ceil(response.count / 5) : 0}
        />
      </section>
      <div className="w-full max-w-sm">
        <textarea
          rows={5}
          color={100}
          className="w-full rounded p-3"
          placeholder="Write message here"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        ></textarea>
        <div className="mt-2">
          <button
            className="bg-[#6CB93B] text-white px-4 py-2 rounded"
            onClick={doSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessages;
