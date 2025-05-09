/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import FetchContext, { useFetch } from "../../context/FetchContext";
import AddPointsModal from "../../components/addpointsmodal/AddPointsModal";
import { formatDate } from "../../utils/date";
import { Check, Copy, Edit } from "iconsax-react";
import { loyaltyColor } from "../../loyalty_customers/LoyaltyCustomers";
import Button from "../../components/shared/Button";
import SearchBar from "../../components/searchbar/SearchBar";
import Loader from "../../loader/Loader";

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
        setOrders(data);
      } catch (error) {
        // ignore
      }
    }
    fetchOrders();
  }, [id, request]);

  return <div>{orders.count}</div>;
};

const MakeLoyalty = ({ customer = {} }) => {
  const { request } = useFetch();
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(false);

  const makeLoyaltyCustomer = async (customer_id) => {
    setLoading(true);
    try {
      await request(`loyalty/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customer_id }),
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoyalty = useCallback(async () => {
    if (!customer?.id) return;
    setLoading(true);
    try {
      const response = await request(`loyalty/customers/by/${customer?.id}`);
      const data = await response.json();
      setLoyalty(data);
    } catch (error) {
      console.log(`Ignore error if not loyalty customer`);
    } finally {
      setLoading(false);
    }
  }, [customer?.id, request]);

  useEffect(() => {
    fetchLoyalty();
  }, [customer.id, fetchLoyalty, request]);

  return loyalty?.level ? (
    <span
      style={{
        color: loyaltyColor[loyalty?.level],
      }}
    >
      {loyalty?.level}
    </span>
  ) : (
    <Button
      onClick={async () => {
        await makeLoyaltyCustomer(customer.id);
        await fetchLoyalty();
      }}
      disabled={loading}
    >
      Make Loyalty
    </Button>
  );
};

const CustomerRow = ({ data, handlePointsClick = (id) => {} }) => {
  const { request } = useFetch();
  const [customer, setCustomer] = useState(data || {});

  const CopyButton = ({ id }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    return (
      <button
        onClick={handleCopy}
        className="size-7 flex items-center justify-center rounded"
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    );
  };

  return (
    <tr
      key={customer?.id}
      className="border-b border-gray-200 hover:bg-gray-100"
    >
      <td className="px-4 py-2 md:px-6 border-b capitalize whitespace-nowrap">
        <CopyButton id={customer?.id} />
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize whitespace-nowrap">
        {customer?.name}
      </td>
      <td className="px-4 py-2 md:px-6 border-b">
        {customer?.email ? (
          <Link
            to={`mailto:${customer?.email}`}
            className="hover:underline py-2"
          >
            {customer?.email}
          </Link>
        ) : null}
      </td>
      <td className="px-4 py-2 md:px-6 border-b">
        {customer?.phone ? (
          <Link to={`tel:${customer?.phone}`} className="hover:underline py-2">
            {customer?.phone}
          </Link>
        ) : null}
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize w-[160px]">
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
      <td className="px-4 py-2 md:px-6 border-b capitalize">
        <Orders customer={customer} />
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize">
        {customer?.address}
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize whitespace-nowrap">
        {formatDate(customer?.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize whitespace-nowrap">
        {formatDate(customer?.updated_at)}
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize">
        <MakeLoyalty customer={customer} />
      </td>
    </tr>
  );
};

const Customers = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const page = params?.page || 1;
  const [response, setResponse] = useState({
    data: [],
    count: 0,
    loading: false,
  });
  const { request } = useContext(FetchContext);
  const q = searchParams.get("q");
  const [searchText, setSearchText] = useState(q || "");
  const limit = 10;
  const navigate = useNavigate();

  const fetchCustomers = useCallback(async () => {
    try {
      setResponse((prev) => ({ ...prev, loading: true }));
      const sp = new URLSearchParams({
        q: q || "",
        skip: (page - 1) * limit,
        limit,
      });
      const response = await request(`users?${sp.toString()}`);
      const json = await response.json();
      const { data } = json;
      if (!data) return;
      setResponse({ ...json, loading: false });
    } catch (error) {
      setResponse((prev) => ({ ...prev, loading: false }));
      console.error(error);
    }
  }, [request, page, q]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, page, q, request]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handlePointsClick = (order) => {
    setSelectedCustomer(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  function doSearch(e) {
    e.preventDefault();
    navigate(`?q=${searchText}&skip=0&limit=${limit}`);
  }

  const loading = response?.loading;

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

      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-5 w-full overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                    ID
                  </th>
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
                  <Fragment key={customer?.id}>
                    <CustomerRow
                      data={customer}
                      handlePointsClick={handlePointsClick} // lifting customer id up for points modal
                    />
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            endPoint="customers"
            currentPage={page}
            totalPages={
              response?.count ? Math.ceil(response?.count / limit) : 0
            }
          />
        </>
      )}

      {/* Add Points Modal */}
      <AddPointsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        customerId={selectedCustomer}
        fetchCustomers={fetchCustomers}
      />
    </>
  );
};

export default Customers;
