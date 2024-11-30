/* eslint-disable react/prop-types */
import { useCallback, useContext, useEffect, useState } from "react";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { formatDate } from "../../utils/date";
import Pagination from "../../components/pagination/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/searchbar/SearchBar";

const PointsRow = ({ point, handleOpen }) => {
  const { request } = useContext(FetchContext);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    request(`users/${point?.customer_id}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          setCustomer(data);
        });
      }
    });
  }, []);

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 md:px-6 border-b">{customer?.email}</td>
      <td className="px-4 py-2 md:px-6 border-b">{customer?.phone}</td>
      <td className="px-4 py-2 md:px-6 border-b">{point.points}</td>
      <td className="px-4 py-2 md:px-6 border-b whitespace-nowrap">
        {formatDate(point?.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 border-b whitespace-nowrap">
        {formatDate(point?.updated_at)}
      </td>
      <td className="px-4 py-2 md:px-6 border-b">
        <button
          onClick={handleOpen}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

const Points = () => {
  const { request } = useContext(FetchContext);
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
  });
  const limit = searchParams.get("limit") || 10;
  const params = useParams();
  const page = params?.page || 1;
  const previousPage = page - 1
  const skip = previousPage * limit;

  // Fetch points data
  const fetchPoints = useCallback(async () => {
    try {
      const qp = new URLSearchParams({ limit, skip, q: searchParams.get("q") });
      const res = await request(`points?${qp.toString()}`);
      const json = await res.json();
      setResponse(json);
    } catch (error) {
      console.error("Error fetching points data:", error);
    }
  }, [request, skip, limit]);

  const doSearch = async (e) => {
    e.preventDefault();
    fetchPoints(page ? page : 1);
    setSearchParams({ q: searchText });
  };

  useEffect(() => {
    fetchPoints();
  }, [fetchPoints]);

  const handleDelete = async (id) => {
    try {
      const res = await request(`points/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchPoints(); // Refetch points data after deletion
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting point:", error);
    }
  };

  const handleOpen = (id = null) => {
    setSelectedItemId(id);
    setOpen(!open);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4 md:mb-8">
        <h2 className="text-xl font-semibold mb-3">Points List</h2>
        <SearchBar
          searchText={searchText}
          handleSearch={setSearchText}
          doSearch={doSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Points
              </th>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
              <th className="px-4 py-2 md:px-6 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {response?.data?.map((point) => {
              return (
                <PointsRow
                  key={point?.id}
                  point={point}
                  onOpen={() => handleOpen(point?.id)}
                />
              );
            })}
            {response?.count === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          endPoint="points"
          currentPage={page}
          totalPages={Math.ceil(response?.count / limit)}
        />
        <DeleteConfirmModal
          open={open}
          handleOpen={() => handleOpen(null)}
          onCollapse={() => setOpen(false)}
          itemId={selectedItemId}
          onDelete={() => handleDelete(selectedItemId)}
        />
      </div>
    </div>
  );
};

export default Points;
