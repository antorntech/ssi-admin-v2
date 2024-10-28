/* eslint-disable react/prop-types */

import "./ViewOrderModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";
import { useContext, useEffect, useState } from "react";
import { srcBuilder } from "../../utils/src";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";

const ProductPreview = ({ id }) => {
  const [product, setProduct] = useState(null);
  const { request } = useContext(FetchContext);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await request(`products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProduct();
  }, [id, request]);

  if (!product) return;

  return (
    <div className="flex gap-2 items-center">
      <div className="product-image">
        <img
          src={srcBuilder(product?.images[0])}
          alt={product?.name}
          className="size-16"
        />
      </div>
      <div className="">
        <Link to={`/products/${product?.id}`} className="font-semibold">
          {product?.name}
        </Link>
      </div>
    </div>
  );
};

const ViewOrderModal = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const { status, shipping_address, order_items } = order;

  const shippingCost =
    shipping_address.district.toLowerCase() === "dhaka" ? 60 : 120;

  const totalItemPrice = order_items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const totalPrice =
    totalItemPrice + shippingCost - (parseInt(order?.points_used) || 0);

  return (
    <div className="order-modal">
      <div className="order-modal-content">
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
                <span className="font-medium">Order ID:</span> {order?.id}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Customer ID:</span>{" "}
                {order?.customer_id}
              </p>
              <p className="text-gray-600 pt-2">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`capitalize text-sm border rounded-md px-2 py-1 ${
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
                      : "bg-red-400 text-white"
                  }`}
                >
                  {status}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Created At:</span>{" "}
                {formatDate(order?.created_at)}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Updated At:</span>{" "}
                {formatDate(order?.updated_at)}
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
              <span className="font-medium">Name:</span>{" "}
              {shipping_address?.name}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Phone:</span>{" "}
              {shipping_address?.phone}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Address Line 1:</span>{" "}
              {shipping_address?.address_line1 || "N/A"}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">District:</span>{" "}
              {shipping_address?.district}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Upazila:</span>{" "}
              {shipping_address?.upazila}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Delivery Instructions:</span>{" "}
              {shipping_address?.delivery_instructions || "N/A"}
            </p>
          </div>
        </section>

        {/* Order Items with Product Details */}
        <section className="mb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Order Items
          </h2>
          <table className="w-full border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Product
                </th>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Weight
                </th>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Quantity
                </th>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Price (৳)
                </th>
              </tr>
            </thead>
            <tbody>
              {order_items.map((item) => {
                return (
                  <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 border-b">
                      <ProductPreview id={item.id} key={item.id} />
                    </td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      {item.weight ? item.weight + item.unit : ""}
                    </td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      ৳ {item.price}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* Total Cost Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">
            Total Cost
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-12">
              <div className="w-[200px] font-medium">Subtotal:</div>
              <div className="w-[200px]">৳ {totalItemPrice}</div>
            </div>
            <div className="flex items-center gap-12">
              <div className="w-[200px] font-medium">Shipping Cost:</div>
              <div className="w-[200px]">৳ {shippingCost}</div>
            </div>
            <div className="flex items-center gap-12">
              <div className="w-[200px] font-medium">Points Used:</div>
              <div className="w-[200px]">{order?.points_used}</div>
            </div>
            <div className="flex items-center gap-12 font-semibold">
              <div className="w-[200px]">Total Price:</div>
              <div className="w-[200px]">৳ {totalPrice}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ViewOrderModal;
