import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";

const Points = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [points, setPoints] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes("@")) {
      toast.error("Please enter a valid email", { autoClose: 1000 });
      return;
    }

    if (isNaN(phone) || phone.trim() === "") {
      toast.error("Please enter a valid phone number", { autoClose: 1000 });
      return;
    }

    if (isNaN(points) || points.trim() === "") {
      toast.error("Please enter valid points", { autoClose: 1000 });
      return;
    }

    const body = {
      email,
      phone,
      points,
    };

    try {
      const response = await request("points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setEmail("");
      setPhone("");
      setPoints("");
      fetchPoints();
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

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
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Points</h2>
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full lg:w-[300px] py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full lg:w-[300px] py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Phone"
            required
          />
          <input
            type="text"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            className="w-full lg:w-[300px] py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Points"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>

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
    </div>
  );
};

export default Points;
