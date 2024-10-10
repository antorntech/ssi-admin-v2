import { useContext, useEffect, useState } from "react";
import Loader from "../../loader/Loader";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import SearchBar from "../../components/searchbar/SearchBar";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";

const Orders = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [orders, setOrders] = useState([]);
  const { request } = useContext(FetchContext);
  const [response, setResponse] = useState({ data: [], filtered: [] });
  const fetchOrders = async () => {
    try {
      const response = await request("orders");
      const json = await response.json();
      const { data, count } = json;
      setResponse((prev) => ({ ...prev, data, count }));
      if (!data) return;

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
      console.log(sortedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onCompleted = (id) => {
    request(`orders/${id}/completed`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        toast.success("Order Completed Successfully!");
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  const onCanceled = (id) => {
    request(`orders/${id}/canceled`, {
      method: "PATCH",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        toast.success("Order Canceled Successfully!");
      })
      .catch((error) => {
        console.error("Error updating order:", error);
      });
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">
            Total Orders: {response?.count}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar />
        </div>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Created At
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Updated At
                  </th>
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
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
                    {order?.status == "pending" ? (
                      <td className="px-4 py-2 md:px-6 md:py-4 border-b flex items-center gap-3">
                        <button onClick={() => onCompleted(order.id)}>
                          <i className="fa-regular fa-square-check text-2xl text-green-700"></i>
                        </button>
                        <button onClick={() => onCanceled(order.id)}>
                          <i className="fa-regular fa-rectangle-xmark text-2xl text-red-700"></i>
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          <Pagination
            endPoint="orders"
            currentPage={page}
            totalPages={response.count ? Math.ceil(response.count / 5) : 0}
          />
        </>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default Orders;
