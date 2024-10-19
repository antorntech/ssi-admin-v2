import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { srcBuilder } from "../../utils/src";
import moment from "moment";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const { request } = useContext(FetchContext);
  const [open, setOpen] = useState(false);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await request("banners");
      const json = await res.json();
      const { data } = json;

      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      console.log("Banners fetched");
    }
  };

  // Fetch banners on component mount
  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle delete operation
  const handleDelete = async () => {
    try {
      if (!selectedItemId) {
        console.error("Selected banner ID is not defined");
        return;
      }

      const res = await request(`banners/${selectedItemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBanners(); // Refetch banners after successful deletion
        setOpen(false); // Close modal
        setSelectedItemId(null); // Clear selected item ID
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
    }
  };

  // Toggle delete confirmation modal
  const handleOpen = (id = null) => {
    setSelectedItemId(id);
    setOpen(!open);
  };

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Banners</h1>
          <p className="text-sm text-gray-500">
            Total Banners: {banners.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/banners/add"
            className="inline-block ml-[50px] md:ml-0 w-[110px] text-sm font-medium bg-[#6CB93B] text-white md:w-[150px] text-center px-3 py-2 md:px-4 md:py-2 rounded-md"
          >
            Add Banner
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto mt-5">
        <table className="w-full min-w-[600px] lg:min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Banner
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Size
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                CreatedAt
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                UpdatedAt
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <img
                    src={
                      banner.image
                        ? srcBuilder(`banners/${banner.image}`)
                        : "https://via.placeholder.com/150"
                    }
                    alt={banner.name || "Banner"}
                    className="h-12 w-12 object-cover"
                  />
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {banner.size}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                  {moment(banner.created_at).format("Do MMM, YYYY")}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                  {moment(banner.updated_at).format("Do MMM, YYYY")}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/banners/edit/${banner.id}`}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <i className="fa-solid fa-pen-to-square mr-3 text-xl"></i>
                    </Link>
                    <button
                      onClick={() => handleOpen(banner.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash-can text-xl"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={() => handleOpen(null)}
        onCollapse={() => setOpen(false)}
        itemId={selectedItemId}
        onDelete={handleDelete}
      />
    </>
  );
};

export default Banners;
