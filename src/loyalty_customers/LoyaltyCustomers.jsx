/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../components/pagination/Pagination";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { useFetch } from "../context/FetchContext";
import { Trash } from "iconsax-react";
import { formatDate } from "../utils/date";

// const Orders = ({ customer = {} }) => {
//   const [orders, setOrders] = useState({ data: [], count: 0 });

//   const { request } = useFetch();
//   const { id } = customer;

//   useEffect(() => {
//     if (!id) return;
//     async function fetchOrders() {
//       try {
//         const response = await request(`orders?customer_id=${id}`);
//         const data = await response.json();
//         setOrders(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchOrders();
//   }, [id, request]);

//   return <div>{orders.count}</div>;
// };

export const loyaltyColor = {
  silver: "#A8A9AD",
  gold: "#DAA511",
  platinum: "#E5E3E0",
};

const AvailablePoints = ({ customer_id }) => {
  const [customer, setCustomer] = useState(null);
  const { request } = useFetch();

  useEffect(() => {
    if (!customer_id) return;
    async function fetchCustomer() {
      try {
        const response = await request(`users/${customer_id}`);
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCustomer();
  }, [customer_id, request]);

  return customer?.points || 0;
};

const LoyaltyCustomerRow = ({ customer, levels, handleOpen = () => {} }) => {
  const { request } = useFetch();
  const [loyaltyCustomer, setLoyaltyCustomer] = useState(customer || null);

  // const onDelete = useCallback(async () => {
  //   try {
  //     const response = await request(
  //       `loyalty/customers/${loyaltyCustomer.id}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     const data = await response.json();
  //     if (!data) return;
  //     setLoyaltyCustomer(null);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, [customer.id, request]);

  return (
    <tr
      key={loyaltyCustomer?.id}
      className="border-b border-gray-200 hover:bg-gray-100"
    >
      <td
        className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap"
        title={JSON.stringify(loyaltyCustomer, null, 2)}
      >
        {loyaltyCustomer?.name}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
        {loyaltyCustomer?.email ? (
          <Link
            to={`mailto:${loyaltyCustomer?.email}`}
            className="hover:underline py-2"
          >
            {loyaltyCustomer?.email}
          </Link>
        ) : null}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
        {loyaltyCustomer?.phone ? (
          <Link
            to={`tel:${loyaltyCustomer?.phone}`}
            className="hover:underline py-2"
          >
            {loyaltyCustomer?.phone}
          </Link>
        ) : null}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize w-[160px] whitespace-nowrap">
        <AvailablePoints customer_id={loyaltyCustomer?.customer_id} />
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
        {formatDate(loyaltyCustomer?.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
        {formatDate(loyaltyCustomer?.updated_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
        <select
          style={{
            backgroundColor: loyaltyColor[loyaltyCustomer?.level] || "",
          }}
          className="capitalize border rounded-md px-2 py-2 focus:outline-none"
          value={loyaltyCustomer?.level}
          onChange={async (e) => {
            if (!e.target.value) return;
            try {
              await request(`loyalty/customers/${loyaltyCustomer?.id}`, {
                method: "PATCH",
                body: e.target.value,
              });
              const response = await request(
                `loyalty/customers/${loyaltyCustomer?.id}`
              );
              const data = await response.json();
              setLoyaltyCustomer(data);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          {levels.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
        <button
          onClick={() => handleOpen(customer?.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash size="22" className="text-red-600" variant="Bold" />
        </button>
      </td>
    </tr>
  );
};

const LoyaltyCustomers = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [levels, setLevels] = useState(["silver", "gold", "platinum"]);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useFetch();
  const limit = 10;

  const fetchLoyaltyCustomers = useCallback(async () => {
    try {
      const response = await request(
        `loyalty/customers?skip=${(page - 1) * limit}&limit=${limit}`
      );
      const json = await response.json();
      setResponse(json);
    } catch (error) {
      console.error(error);
    }
  }, [request, page, limit]);

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

  useEffect(() => {
    fetchLoyaltyCustomers();
    const fetchLevels = async () => {
      try {
        const res = await request(`loyalty/level`);
        const json = await res.json();
        if (json) {
          setLevels(json);
        } else {
          console.error("Failed to fetch status");
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchLevels();
  }, [fetchLoyaltyCustomers, page, request]);

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
                Created At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Updated At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Loyalty Level
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {response?.data?.map((customer) => (
              <LoyaltyCustomerRow
                key={customer?.id}
                customer={customer}
                levels={levels}
                handleOpen={handleOpen}
              />
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
