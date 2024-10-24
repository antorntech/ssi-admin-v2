import { useContext, useEffect, useState } from "react";
import Loader from "../../loader/Loader";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import { toast } from "react-toastify";
import { useParams, useNavigate, Link } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const Orders = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page || 1, 10);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  // Fetch orders with pagination
  const fetchOrders = async (page) => {
    setLoading(true);
    try {
      const limit = 5;
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

  const fetchStatus = async () => {
    try {
      const res = await request(`orders/status`);
      const json = await res.json();
      if (json) {
        setStatus(json);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Refetch orders when the page number changes
  useEffect(() => {
    fetchOrders(currentPage);
    fetchStatus();
  }, [currentPage]);

  const onCompleted = (id, status) => {
    request(`orders/${id}/status`, {
      method: "PATCH",
      header: "Content-Type: application/json",
      body: status,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        return res.json();
      })
      .then(() => {
        toast.success("Order Updated Successfully!");
        fetchOrders(currentPage);
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
                    "Customer",
                    "Price",
                    "Quantity",
                    "Points Used",
                    "Created At",
                    "Updated At",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {order.customer_id}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      ৳{" "}
                      {order.order_items.reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {order.order_items.reduce(
                        (acc, item) => acc + item.quantity,
                        0
                      )}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {order.points_used}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {moment(order.created_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {moment(order.updated_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <select
                        className={`capitalize border rounded-md px-2 py-2 
                        ${
                          order.status === "pending"
                            ? "bg-cyan-400 text-white"
                            : order.status === "processed"
                            ? "bg-yellow-400 text-black"
                            : order.status === "shipped"
                            ? "bg-blue-400 text-white"
                            : order.status === "delivered"
                            ? "bg-green-400 text-white"
                            : order.status === "canceled"
                            ? "bg-red-400 text-white"
                            : order.status === "completed"
                            ? "bg-green-600 text-white"
                            : "bg-red-400 text-white" // Default fallback for unexpected status
                        }`}
                        value={order.status}
                        onChange={(e) => onCompleted(order.id, e.target.value)}
                      >
                        {status?.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <div>
                        <Link to={`/orders/${order.id}`} className="hover:underline">View</Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <Pagination
            endPoint="orders"
            currentPage={currentPage}
            totalPages={Math.ceil(response.count / 5)}
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
