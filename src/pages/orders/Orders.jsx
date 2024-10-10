import React, { useContext, useEffect, useState } from "react";
import Loader from "../../loader/Loader";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import SearchBar from "../../components/searchbar/SearchBar";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { request } = useContext(FetchContext);

  const fetchOrders = async () => {
    try {
      const response = await request("orders");
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setOrders(json.data);
      console.log(json.data);
      setFilteredOrders(json.data);
    } catch (error) {
      console.error();
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const onCompleted = (id) => {
    e.preventDefault();
    request(`orders/completed/${id}`, {
      method: "PATCH",
      body: formData,
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
    e.preventDefault();
    request(`orders/canceled/${id}`, {
      method: "PATCH",
      body: formData,
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

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">
            orders are {orders.length > 0 ? "" : "not"} available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar />
        </div>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Product
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Created At
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Updated At
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">{order.id}</td>
                    <td className="px-6 py-4 border-b">{order.customer_id}</td>
                    <td className="px-6 py-4 border-b">${order.price}</td>
                    <td className="px-6 py-4 border-b">{order.quantity}</td>
                    <td className="px-6 py-4 border-b">{order.status}</td>
                    <td className="px-6 py-4 border-b">
                      {moment(order.created_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {moment(order.updated_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-6 py-4 border-b flex items-center gap-3">
                      <button onClick={() => onCompleted(order.id)}>
                        <i className="fa-regular fa-square-check text-2xl text-green-500"></i>
                      </button>
                      <button onClick={() => onCanceled(order.id)}>
                        <i className="fa-regular fa-rectangle-xmark text-2xl text-red-500"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Orders;
