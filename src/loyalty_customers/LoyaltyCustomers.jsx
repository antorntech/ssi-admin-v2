/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../components/pagination/Pagination";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import FetchContext, { useFetch } from "../context/FetchContext";
import { Trash } from "iconsax-react";

const Orders = ({ customer = {} }) => {
  const [orders, setOrders] = useState({ data: [], count: 0 });

  const { request } = useFetch();
  const { id } = customer;

  useEffect(() => {
    if (!id) return;
    async function fetchOrders() {
      try {
        const response = await request(`orders?customer_id=${id}`);
        const data = await response.json();
        if (!data) return;
        console.log(data);
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrders();
  }, [id, request]);

  return <div>{orders.count}</div>;
};

export const loyaltyColor = {
  silver: "silver",
  gold: "gold",
  platinum: "platinum",
};

const LoyaltyCustomers = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [loyaltyCustomers, setLoyaltyCustomers] = useState([]);
  const [level, setLevel] = useState(["silver", "gold", "platinum"]);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);
  const limit = 10;

  const fetchLoyaltyCustomers = async () => {
    try {
      const response = await request(
        `loyalty/customers?skip=${(page - 1) * limit}&limit=${limit}`
      );
      const json = await response.json();
      console.log(json);
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setLoyaltyCustomers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (id = null) => {
    setSelectedItemId(id);
    setOpen(!open);
  };

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`loyalty/customers/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete product");
      setSelectedItemId(null);
      fetchLoyaltyCustomers();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLevel = async () => {
    try {
      const res = await request(`loyalty/level`);
      const json = await res.json();
      if (json) {
        setLevel(json);
      } else {
        console.error("Failed to fetch status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLoyaltyCustomers();
    fetchLevel();
  }, [page]);

  const switchLevel = (id, level) => {
    request(`loyalty/customers/${id}/level`, {
      method: "PATCH",
      header: "Content-Type: application/json",
      body: level,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.levelText}`);
        return res.json();
      })
      .then(() => {
        toast.success("Order Updated Successfully!");
        fetchOrders(currentPage);
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  // const closeModal = () => {
  //   setIsModalOpen(false);
  //   setSelectedCustomer(null);
  // };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Loyalty Customers</h1>
          <p className="text-sm text-gray-500">
            Total Loyalty Customers: {response?.count}
          </p>
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <table className="min-w-[1200px] lg:min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Name
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Email
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Phone
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Earned Points
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Orders
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Created At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Updated At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Level
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loyaltyCustomers?.map((customer) => (
              <tr
                key={customer?.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.name}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {customer?.email ? (
                    <Link
                      to={`mailto:${customer?.email}`}
                      className="hover:underline py-2"
                    >
                      {customer?.email}
                    </Link>
                  ) : null}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {customer?.phone ? (
                    <Link
                      to={`tel:${customer?.phone}`}
                      className="hover:underline py-2"
                    >
                      {customer?.phone}
                    </Link>
                  ) : null}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize w-[160px]">
                  <div className="flex items-center justify-between">
                    <div>{customer?.points || 0}</div>
                    {/* <div className="flex gap-1">
                      <button
                        onClick={() => handlePointsClick(customer.id)}
                        className="size-7 flex items-center justify-center bg-[#6CB93B] rounded"
                      >
                        <Edit className="size-4" color="#fff" />
                      </button>
                    </div> */}
                  </div>
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  <Orders customer={customer} />
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
                  {customer?.created_at
                    ? new Date(customer?.created_at).toLocaleString()
                    : ""}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.updated_at
                    ? new Date(customer?.updated_at).toLocaleString()
                    : ""}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  <select
                    className={`capitalize border rounded-md px-2 py-2 
                        ${
                          customer.level === "silver"
                            ? "bg-[#A8A9AD] text-black"
                            : customer.level === "gold"
                            ? "bg-[#DAA511] text-black"
                            : customer.level === "platinum"
                            ? "bg-[#E5E3E0] text-black"
                            : "bg-[#A8A9AD] text-black" // Default fallback for unexpected level
                        }`}
                    value={customer.level}
                    onChange={(e) => switchLevel(customer.id, e.target.value)}
                  >
                    {level?.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  <button
                    onClick={() => handleOpen(customer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash size="22" className="text-red-600" variant="Bold" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        endPoint="loyalty-customers"
        currentPage={page}
        totalPages={response.count ? Math.ceil(response.count / limit) : 0}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={handleOpen}
        onCollapse={() => setOpen(false)}
        itemId={selectedItemId}
        onDelete={() => handleDelete(selectedItemId)}
        itemName="Customer"
      />
    </>
  );
};

export default LoyaltyCustomers;
