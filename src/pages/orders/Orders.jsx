/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import Loader from "../../loader/Loader";
import FetchContext, { useFetch } from "../../context/FetchContext";
import { toast } from "react-toastify";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import ViewOrderModal from "../../components/viewordermodal/ViewOrderModal";
import SearchBar from "../../components/searchbar/SearchBar";
import { formatDate } from "../../utils/date";
import cn from "../../utils/cn";
import { loyaltyColor } from "../../loyalty_customers/LoyaltyCustomers";
import ArrayValidator from "../../components/shared/ArrayValidator";

// function Customer({ id = "" }) {
//   const [customer, setCustomer] = useState(null);
//   const { request } = useFetch();

//   useEffect(() => {
//     async function fetchCustomer() {
//       try {
//         const response = await request(`users/${id}`);
//         const data = await response.json();
//         setCustomer(data);
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchCustomer();
//   }, [id]);
//   if (!customer) return;
//   return <p className="font-semibold">{customer?.name}</p>;
// }

const statusClasses = {
  pending: "bg-cyan-400 text-white",
  processed: "bg-yellow-400 text-black",
  shipped: "bg-blue-400 text-white",
  delivered: "bg-green-400 text-white",
  canceled: "bg-red-400 text-white",
  completed: "bg-green-600 text-white",
  default: "bg-red-400 text-white", // Default fallback for unexpected status
};

const LoyaltyColumn = ({ order = {} }) => {
  const [loyalty, setLoyalty] = useState(null);
  const { request } = useFetch();
  const customer_id = order?.customer_id;

  useEffect(() => {
    if (!customer_id) return;
    request(`loyalty/customers/by/${customer_id}`)
      .then((res) => res.json())
      .then((data) => setLoyalty(data))
      .catch(console.error);
  }, [customer_id, request]);

  if (!loyalty?.level) return;

  return (
    <span
      className={cn("text-black capitalize")}
      style={{
        color: loyaltyColor[loyalty?.level],
      }}
    >
      {loyalty?.level}
    </span>
  );
};

const OrderRow = ({ item, handleView, status = [] }) => {
  const [order, setOrder] = useState(item);
  const { request } = useContext(FetchContext);
  const shippingCost =
    order?.shipping_address?.district?.toLowerCase() === "dhaka" ? 60 : 120;

  const switchStatus = (id, status) => {
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
        request(`orders/${id}`)
          .then((res) => res.json())
          .then((data) => setOrder(data));
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  return (
    <tr key={order?.id} className="hover:bg-gray-100">
      <td className="px-4 py-2 border-b whitespace-nowrap">
        {order?.shipping_address?.name}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        <LoyaltyColumn order={order} />
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        ৳{" "}
        {order?.order_items?.reduce((acc, item) => {
          const price = parseInt(item?.price) || 0;
          const points_used = parseInt(order?.points_used) || 0;

          const items_items = price * item.quantity;
          return acc + items_items + shippingCost - points_used;
        }, 0)}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        {order?.order_items?.reduce((acc, item) => acc + item.quantity, 0)}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        {order?.points_used}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        {formatDate(order?.created_at)}
      </td>
      <td className="px-4 py-2 border-b whitespace-nowrap">
        {formatDate(order?.updated_at)}
      </td>
      <td className="px-4 py-2 border-b flex items-center gap-3">
        <select
          className={cn(
            `capitalize border rounded-md px-2 py-2`,
            statusClasses[order?.status]
          )}
          value={order?.status}
          onChange={(e) => switchStatus(order?.id, e.target.value)}
        >
          {status?.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <div>
          <button
            onClick={() => handleView()}
            className="px-4 py-[6px] text-white bg-orange-500 rounded-md"
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
};

const Orders = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const currentPage = parseInt(page || 1, 10);
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
  });

  // Fetch orders with pagination
  const fetchOrders = useCallback(
    async (page) => {
      setLoading(true);
      try {
        const qp = {};
        if (page) qp.skip = (page - 1) * searchParams.get("limit");

        searchParams.forEach((value, key) => {
          if (value) qp[key] = value;
        });

        const qpString = "?" + new URLSearchParams(qp).toString();

        const res = await request(`orders${qpString}`);
        const json = await res.json();
        const { data, count } = json;

        if (data) {
          setOrders(data);
          setResponse({ data, count });
        }
      } catch (error) {
        setResponse(null);
        setOrders([]);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [request, searchParams]
  );

  const doSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchText.trim()) {
        fetchOrders(currentPage ? currentPage : 1);
        return;
      }
      const res = await request(`orders?q=${searchText}`);
      const order = await res.json();
      if (!order) {
        throw new Error("No order found");
      }
      setOrders(order?.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  // Refetch orders when the page number changes
  useEffect(() => {
    fetchOrders(currentPage);
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
    fetchStatus();
  }, [currentPage, fetchOrders, request]);

  // order-modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };

  const FilterByStatus = () => {
    return (
      <div className="flex items-center gap-3 whitespace-nowrap flex-wrap">
        <div className="flex items-center gap-2">
          Filter By
          <select
            className="rounded-lg border px-3 py-2.5 capitalize"
            value={searchParams.get("status")}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("status", e.target.value);
                return prev;
              });
            }}
          >
            <option value="">All Status</option>
            {status.map((item) => (
              <option key={item} value={item} className="">
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          From
          <input
            type="date"
            className="rounded-lg border px-3 py-2"
            value={searchParams.get("date_from") || ""}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("date_from", e.target.value);
                return prev;
              });
            }}
          />
          To
          <input
            type="date"
            min={searchParams.get("date_from") || ""}
            className="rounded-lg border px-3 py-2"
            value={searchParams.get("date_to") || ""}
            onChange={(e) => {
              setSearchParams((prev) => {
                prev.set("date_to", e.target.value);
                return prev;
              });
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="w-full flex flex-wrap gap-4 items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">
            Total Orders: {response?.count}
          </p>
        </div>
        <FilterByStatus />
        <div className="flex gap-3 items-center">
          <SearchBar
            searchText={searchText}
            handleSearch={setSearchText}
            doSearch={doSearch}
          />
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <ArrayValidator list={orders} fallback={<p>No orders found.</p>}>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr>
                  {[
                    "Customer",
                    "Loyalty",
                    "Price Total",
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
                  <Fragment key={order?.id}>
                    <OrderRow
                      item={order}
                      handleView={() => {
                        handleOrderClick(order);
                      }}
                      status={status}
                    />
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            endPoint="orders"
            currentPage={currentPage}
            totalPages={
              Math.ceil(response?.count / searchParams.get("limit")) || 0
            }
            onPageChange={(newPage) => navigate(`/orders/${newPage}`)}
          />

          <ViewOrderModal
            isOpen={isModalOpen}
            onClose={closeModal}
            order={selectedOrder}
          />
        </ArrayValidator>
      )}
    </>
  );
};

export default Orders;
