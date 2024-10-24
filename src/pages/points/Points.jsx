import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";

const Points = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [points, setPoints] = useState(0);
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
                CreatedAt
              </th>
              <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pointsData.map((point) => (
              <tr key={point.id}>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.email}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.phone}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {point.points}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                  {moment(point.createdAt).format("Do MMM, YYYY")}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <button
                    onClick={() => handleOpen(point.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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
