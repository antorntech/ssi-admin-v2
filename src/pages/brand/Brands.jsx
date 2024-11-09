import { useState, useEffect, useContext } from "react";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import { useParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";

const Brands = () => {
  const params = useParams();
  const page = params?.page || 1;
  const { request } = useContext(FetchContext);

  const [brands, setBrands] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [open, setOpen] = useState(false); // Delete confirmation modal state
  const [selectedBrandId, setSelectedBrandId] = useState(null); // Store brand ID for deletion

  // Fetch brands from the API
  const fetchBrands = async () => {
    try {
      const response = await request(`brands?skip=${(page - 1) * 5}&limit=5`);
      const json = await response.json();
      const { data, count } = json;
      if (data) {
        setResponse((prev) => ({ ...prev, data, count }));
        setBrands(data);
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page]);

  // Handle brand deletion
  const handleDelete = async () => {
    try {
      if (!selectedBrandId) throw new Error("Brand ID is not defined");
      await request(`brands/${selectedBrandId}`, { method: "DELETE" });
      setSelectedBrandId(null);
      setOpen(false); // Close the modal after deletion
      fetchBrands(); // Refresh the list
    } catch (error) {
      console.error("Error deleting brand:", error);
    }
  };

  // Open the delete modal and set the selected brand ID
  const openDeleteModal = (id) => {
    setSelectedBrandId(id);
    setOpen(true);
  };

  // Handle the edit button click
  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setIsEditing(true);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Column 1: Brands Table */}
      <div className="col-span-1 brands-table">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Brands</h1>
          <p className="text-sm text-gray-500">
            Total Brands: {response?.count}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] lg:min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Banner
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Created At
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Updated At
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 md:px-6 border-b">
                    <img
                      src={
                        brand.image
                          ? `${UPLOADS_URL}brands/${brand.image}`
                          : "https://via.placeholder.com/150"
                      }
                      alt={brand.name || "Brand"}
                      className="h-12 w-12 object-cover"
                    />
                  </td>
                  <td className="px-4 py-2 md:px-6 border-b capitalize min-w-[220px]">
                    {brand.name}
                  </td>
                  <td className="px-4 py-2 md:px-6 border-b whitespace-nowrap">
                    {formatDate(brand?.created_at)}
                  </td>
                  <td className="px-4 py-2 md:px-6 border-b whitespace-nowrap">
                    {formatDate(brand?.updated_at)}
                  </td>
                  <td className="px-4 py-2 md:px-6 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(brand)}
                        className="text-orange-500 hover:text-orange-700 mr-3"
                      >
                        <Edit2
                          size="22"
                          className="text-orange-600"
                          variant="Bold"
                        />
                      </button>
                      <button
                        onClick={() => openDeleteModal(brand.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash
                          size="22"
                          className="text-red-600"
                          variant="Bold"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          endPoint="brands"
          currentPage={page}
          totalPages={response.count ? Math.ceil(response.count / 5) : 0}
        />
      </div>

      {/* Column 2: Form for Adding or Editing Brands */}
      <div className="col-span-1 brand-form">
        <div className="w-full bg-white p-4 lg:p-5 rounded-lg custom-shadow">
          {isEditing ? (
            <EditBrand
              selectedBrand={selectedBrand}
              fetchBrands={() => {
                fetchBrands();
                setIsEditing(false);
              }}
            />
          ) : (
            <AddBrand fetchBrands={fetchBrands} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={() => setOpen(false)}
        itemId={selectedBrandId}
        onDelete={handleDelete}
        itemName="brand"
      />
    </div>
  );
};

export default Brands;
