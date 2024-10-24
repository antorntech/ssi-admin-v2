import React from "react";
import "./ViewOrderModal.css";
import { Add } from "iconsax-react";
import moment from "moment";

const ViewOrderModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const {
    id,
    customer_id,
    created_at,
    updated_at,
    status,
    points_used,
    shipping_address,
    order_items,
  } = order;

  return (
    <div className="order-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>

        <h1 className="underline underline-offset-4 text-3xl font-bold mb-8 text-center text-gray-800">
          Order Details
        </h1>

        {/* Order Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Order Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Order ID:</span> {id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Customer Email:</span>{" "}
                {customer_id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`capitalize border rounded-md px-2 py-2 
                        ${
                          status === "pending"
                            ? "bg-cyan-400 text-white"
                            : status === "processed"
                            ? "bg-yellow-400 text-black"
                            : status === "shipped"
                            ? "bg-blue-400 text-white"
                            : status === "delivered"
                            ? "bg-green-400 text-white"
                            : status === "canceled"
                            ? "bg-red-400 text-white"
                            : status === "completed"
                            ? "bg-green-600 text-white"
                            : "bg-red-400 text-white" // Default fallback for unexpected status
                        }`}
                >
                  {status}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Points Used:</span> {points_used}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Created At:</span>{" "}
                {moment(created_at).format("Do MMM, YYYY")}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Updated At:</span>{" "}
                {moment(updated_at).format("Do MMM, YYYY")}
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Address */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Shipping Address
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Name:</span> {shipping_address.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Address Line 1:</span>{" "}
              {shipping_address.address_line1 || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">District:</span>{" "}
              {shipping_address.district}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Upazila:</span>{" "}
              {shipping_address.upazila}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Delivery Instructions:</span>{" "}
              {shipping_address.delivery_instructions || "N/A"}
            </p>
          </div>
        </section>

        {/* Order Items */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Order Items
          </h2>
          <table className="w-full border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                  Item ID
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                  Price
                </th>
                <th className="px-4 py-2 border-b text-left text-gray-700 font-medium">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {order_items.map((item) => (
                <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                  <td className="px-4 py-3 border-b text-gray-600">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    ${item.price}
                  </td>
                  <td className="px-4 py-3 border-b text-gray-600">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default ViewOrderModal;
