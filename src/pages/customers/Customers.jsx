/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext, { useFetch } from "../../context/FetchContext";
import AddPointsModal from "../../components/addpointsmodal/AddPointsModal";
import { formatDate } from "../../utils/date";
import { Edit } from "iconsax-react";
import { loyaltyColor } from "../../loyalty_customers/LoyaltyCustomers";
import Button from "../../components/shared/Button";
import SearchBar from "../../components/searchbar/SearchBar";

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
        if (!data) setOrders(data);
      } catch (error) {
        console.log(`Orders not found with the given customer id=${id}`, error);
      }
    }
    fetchOrders();
  }, [id]);

  return <div>{orders.count}</div>;
};

const Customers = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({
    data: [],
    count: 0,
    loading: false,
  });
  const { request } = useContext(FetchContext);
  const [searchText, setSearchText] = useState("");
  const limit = 10;

  const fetchCustomers = async () => {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));
      const searchParams = new URLSearchParams({ skip: (page - 1) * limit });
      const response = await request(`users?${searchParams.toString()}`);
      const json = await response.json();
      const { data } = json;
      if (!data) return;
      setResponse({ ...json, loading: false });
    } catch (error) {
      setResponse((prev) => ({ ...prev, loading: false }));
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleOpen = () => setOpen(!open);

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      setSelectedItemId(null);
      fetchCustomers();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  // add-points-modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handlePointsClick = (order) => {
    setSelectedCustomer(order);
    setIsModalOpen(true);
  };

  const makeLoyaltyCustomer = async (customer_id) => {
    try {
      await request(`loyalty/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id }),
      });
      fetchCustomers();
    } catch (error) {
      throw new Error(error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  if (response?.loading == true) return "Loading...";

  const doSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchText.trim()) {
        fetchCustomers();
        return;
      }
      const res = await request(`users?q=${searchText}`);
      const order = await res.json();
      if (order?.data) {
        setResponse(order?.data);
      }
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">
            Total Customers: {response.count}
          </p>
        </div>
        <div>
          <SearchBar
            searchText={searchText}
            handleSearch={setSearchText}
            doSearch={doSearch}
          />
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
                Address
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Created At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Updated At
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Loyalty
              </th>
            </tr>
          </thead>
          <tbody>
            {response?.data?.map((customer) => (
              <tr
                key={customer?.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
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
                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePointsClick(customer.id)}
                        className="size-7 flex items-center justify-center bg-[#6CB93B] rounded"
                      >
                        <Edit className="size-4" color="#fff" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  <Orders customer={customer} />
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.address}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
                  {formatDate(customer?.created_at)}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize whitespace-nowrap">
                  {formatDate(customer?.updated_at)}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.loyalty?.level ? (
                    <span
                      style={{
                        color: loyaltyColor[customer?.loyalty?.level],
                      }}
                    >
                      {customer?.loyalty?.level}
                    </span>
                  ) : (
                    <Button onClick={() => makeLoyaltyCustomer(customer.id)}>
                      Make Loyalty
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Points Modal */}
      <AddPointsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        customerId={selectedCustomer}
        fetchCustomers={fetchCustomers}
      />

      {/* Pagination Component */}
      <Pagination
        endPoint="customers"
        currentPage={page}
        totalPages={response?.count ? Math.ceil(response?.count / limit) : 0}
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

export default Customers;
