import { useContext, useEffect, useState } from "react";
import Loader from "../../loader/Loader";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import SearchBar from "../../components/searchbar/SearchBar";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const Orders = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page || 1, 10); // Ensure page is an integer
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  // Fetch orders with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const limit = 5; // Set the limit to 5 orders per page
      const res = await request(
        `orders?skip=${(page - 1) * limit}&limit=${limit}`
      );
      const json = await res.json();
      const { data, count } = json;

      if (data) {
        const statusOrder = {
          pending: 1,
          completed: 2,
          canceled: 3,
        };

        const sortedOrders = data.sort((a, b) => {
          return (
            statusOrder[a.status.toLowerCase()] -
            statusOrder[b.status.toLowerCase()]
          );
        });

        setOrders(sortedOrders);
        setResponse({ data, count });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch orders when the page number changes
  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const onCompleted = (id) => {
    request(`orders/${id}/completed`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        return res.json();
      })
      .then(() => {
        toast.success("Order Completed Successfully!");
        fetchOrders(currentPage); // Refetch orders after updating status
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  const onCanceled = (id) => {
    request(`orders/${id}/canceled`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        return res.json();
      })
      .then(() => {
        toast.success("Order Canceled Successfully!");
        fetchOrders(currentPage); // Refetch orders after updating status
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">
            Total Orders: {response.count}
          </p>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : orders.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr>
                  {[
                    "Product",
                    "Customer",
                    "Price",
                    "Quantity",
                    "Status",
                    "Created At",
                    "Updated At",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {order.id}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {order.customer_id}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      ${order.price}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {order.quantity}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      <span
                        className={`capitalize status ${order?.status?.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {moment(order.created_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {moment(order.updated_at).format("Do MMM, YYYY")}
                    </td>
                    {order?.status === "pending" && (
                      <td className="px-4 py-2 md:px-6 md:py-4 border-b flex items-center gap-3">
                        <button onClick={() => onCompleted(order.id)}>
                          <i className="fa-regular fa-square-check text-2xl text-green-700"></i>
                        </button>
                        <button onClick={() => onCanceled(order.id)}>
                          <i className="fa-regular fa-rectangle-xmark text-2xl text-red-700"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            endPoint="orders"
            currentPage={currentPage}
            totalPages={Math.ceil(response.count / 10)}
            onPageChange={(newPage) => navigate(`/orders/${newPage}`)}
          />
        </>
      ) : (
        <p>No orders found.</p>
      )}
    </>
  );
};

export default Orders;
