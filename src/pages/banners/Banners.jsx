import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";

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

  // Fetch products when component mounts or when page changes
  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");

      const res = await request(`banners/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchBanners(); // Refetch banners after successful deletion
        setOpen(false);
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
          <p className="text-sm text-gray-500">Total Banners:</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/banners/add-banner"
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
                Mobile Banner
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Desktop Banner
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
                  {banner.image ? (
                    <img
                      src={`${UPLOADS_URL}banners/${banner.image}`}
                      alt={banner.name || "Brand"}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                      className="h-12 w-12 object-cover"
                    />
                  )}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  {banner.image ? (
                    <img
                      src={`${UPLOADS_URL}banners/${banner.image}`}
                      alt={banner.name || "Brand"}
                      className="h-12 w-12 object-cover"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Placeholder"
                      className="h-12 w-12 object-cover"
                    />
                  )}
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
                      to={`/banners/edit/${id}`}
                      className="text-orange-500 hover:text-orange-700"
                    >
                      <i className="fa-solid fa-pen-to-square mr-3 text-xl"></i>
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedItemId(banner.id);
                        handleOpen();
                      }}
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
        onDelete={() => handleDelete(selectedItemId)}
      />
    </>
  );
};

export default Banners;
