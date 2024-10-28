/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { formatDate } from "../../utils/date";

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
    <tr>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{customer?.email}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{customer?.phone}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{point.points}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
        {formatDate(point?.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
        {formatDate(point?.updated_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
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
  const [pointsData, setPointsData] = useState([]);
  const { request } = useContext(FetchContext);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Fetch points data
  const fetchPoints = async () => {
    try {
      const res = await request("points");
      const json = await res.json();
      const { data } = json;

      if (Array.isArray(data)) {
        setPointsData(data);
      }
    } catch (error) {
      console.error("Error fetching points data:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

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
      <h2 className="text-xl font-semibold mb-3">Points List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Points
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pointsData.map((point) => {
              return (
                <PointsRow
                  key={point?.id}
                  point={point}
                  onOpen={() => handleOpen(point?.id)}
                />
              );
            })}
            {pointsData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
