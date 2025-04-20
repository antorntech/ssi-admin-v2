import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import AddPointsModal from "../../components/addpointsmodal/AddPointsModal";
import { formatDate } from "../../utils/date";
import SearchBar from "../../components/searchbar/SearchBar";
import Loader from "../../loader/Loader";
import { twMerge } from "tailwind-merge";
import DownloadCSVFromAPI from "../../components/DownloadCSVFromAPI";

const API_Allergyjom = import.meta.env.VITE_API_URL_ALLERGYJOM

const CustomerRow = ({ data }) => {
  const [customer, setCustomer] = useState(data);

  const commonCellClasses = "px-4 py-2 md:px-6 border-b capitalize";

  if (!customer) return null;

  return (
    <tr key={customer?.id} className="border-b border-gray-200 hover:bg-gray-100">
      <td className={twMerge(commonCellClasses, "whitespace-nowrap")}>{customer?.name}</td>
      <td className={twMerge(commonCellClasses)}>
        {customer?.phone && <Link to={`tel:${customer.phone}`} className="hover:underline">{customer.phone}</Link>}
      </td>
      <td className={twMerge(commonCellClasses)} width="20%">{customer?.address}</td>
      <td className={twMerge(commonCellClasses)} width="40%">{customer?.problem}</td>
      <td className={twMerge(commonCellClasses)}>{customer?.duration}</td>
      <td className={twMerge(commonCellClasses, "whitespace-nowrap")}>{formatDate(customer?.created_at)}</td>
      <td className={twMerge(commonCellClasses)}>
        <button type="button" className="bg-red-700 text-white px-3 py-1 rounded-lg hover:bg-red-900"
          onClick={async () => {
            try {
              const response = await fetch(`${API_Allergyjom}/api/v1/query/${customer?.id}`, {
                method: "DELETE",
              })
              if (response.ok) {
                setCustomer(null);
              }
            } catch (error) {
              console.error(error);
            }
          }}
        >Delete</button>
      </td>
    </tr>
  );
};

const Pagination = ({ total, currentPage, pageSize }) => {
  const totalPages = Math.ceil(total / pageSize);
  const location = useLocation();

  if (totalPages <= 1) return null;

  // Helper to build new URL with updated page
  const getPageLink = (page) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page);
    return `${location.pathname}?${params.toString()}`;
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-wrap gap-2 items-center justify-center mt-4">
      {currentPage > 1 && (
        <Link
          to={getPageLink(currentPage - 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          to={getPageLink(page)}
          className={`px-3 py-1 rounded ${page == currentPage
            ? "bg-green-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          to={getPageLink(currentPage + 1)}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Next
        </Link>
      )}
    </div>
  );
};

const AllergyjomCustomers = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const q = searchParams.get("q");
  const limit = 10;
  const navigate = useNavigate();

  const [response, setResponse] = useState({ rows: [], count: 0, loading: false });
  const [searchText, setSearchText] = useState(q || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setResponse(prev => ({ ...prev, loading: true }));
      const queryParams = new URLSearchParams({ q: q || "", offset: (page - 1) * limit, limit });
      const res = await fetch(`${API_Allergyjom}/api/v1/query?${queryParams.toString()}`);
      const json = await res.json();
      if (json) {
        json.loading = false;
        setResponse(json);
      }
    } catch (error) {
      setResponse(prev => ({ ...prev, loading: false }));
      console.error(error);
    }
  }, [page, q]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handlePointsClick = (id) => {
    setSelectedCustomer(id);
    setIsModalOpen(true);
  };

  const doSearch = (e) => {
    e.preventDefault();
    navigate(`?q=${searchText}&skip=0&limit=${limit}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const customers = response?.rows || [];

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
        <div className="grow">
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">Total Customers: {response.count}</p>
        </div>
        <DownloadCSVFromAPI />
        <SearchBar searchText={searchText} handleSearch={setSearchText} doSearch={doSearch} />
      </div>

      {response.loading ? <Loader /> : (
        <>
          <div className="mt-5 w-full overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr className="bg-gray-50">
                  {["Name", "Phone", "Address", "Problem", "Duration", "Created At", "Action"].map((header, i) => (
                    <th
                      key={i}
                      className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) =>
                  <CustomerRow key={customer?.id} data={customer} handlePointsClick={handlePointsClick} />
                )}
              </tbody>
            </table>
          </div>
          {response?.count > limit && (
            <Pagination
              total={response.count}
              currentPage={page}
              pageSize={limit}
              onPageChange={(newPage) => {
                navigate(`/customers/${newPage}?q=${searchText}`);
              }}
            />
          )}
        </>
      )}

      <AddPointsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        customerId={selectedCustomer}
        fetchCustomers={fetchCustomers}
      />
    </>
  );
};

export default AllergyjomCustomers;
