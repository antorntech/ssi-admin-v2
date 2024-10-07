import React, { useState, useEffect, useContext } from "react";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import moment from "moment";

const Brands = () => {
  const { request } = useContext(FetchContext);

  const [brands, setBrands] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchBrands = async () => {
    try {
      const response = await request("brands");
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setBrands(json.data);
    } catch (error) {
      console.error();
    }
  };
  useEffect(() => {
    fetchBrands();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedBrandId, setSelectedBrandId] = useState(null); // ID of the brand to be deleted

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page for pagination
  const [totalPages, setTotalPages] = useState(0);

  const handleAddBrand = (newBrand) => {
    setBrands([...brands, newBrand]);
  };

  const handleEditBrand = (updatedBrand) => {
    const updatedBrands = brands.map((brand) =>
      brand.id === updatedBrand.id ? updatedBrand : brand
    );
    setBrands(updatedBrands);
    setIsEditing(false);
  };

  const handleDeleteBrand = (id) => {
    const filteredBrands = brands.filter((brand) => brand.id !== id);
    setBrands(filteredBrands);
    localStorage.setItem("brandsData", JSON.stringify(filteredBrands));
  };

  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open); // Toggle modal open/close

  // Confirm deletion of the selected brand
  const confirmDeleteBrand = () => {
    handleDeleteBrand(selectedBrandId);
    handleOpen(); // Close the modal after deletion
  };

  // Calculate the current brands for the current page
  const indexOfLastBrand = currentPage * itemsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirstBrand, indexOfLastBrand);

  // Set total pages whenever brands change
  useEffect(() => {
    setTotalPages(Math.ceil(brands.length / itemsPerPage));
  }, [brands]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Column 1: Table */}
      <div className="brands-table">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Brands</h1>
          <p className="text-sm text-gray-500">
            brands are {brands.length > 0 ? "" : "not"} available here.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full bg-white border">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Banner
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  CreatedAt
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  UpdatedAt
                </th>
                <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentBrands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">
                    {brand.image ? (
                      <img
                        src={brand.image}
                        alt={brand.name || "Brand"}
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
                  <td className="px-6 py-4 border-b">{brand.name}</td>
                  <td className="px-6 py-4 border-b">
                    {moment(brand.created_at).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {moment(brand.updated_at).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEditClick(brand)}
                      className="text-orange-500 hover:text-orange-700 mr-3"
                    >
                      <i className="fa-solid fa-pen-to-square text-xl"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBrandId(brand.id);
                        handleOpen(); // Open delete confirmation modal
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-trash-can text-xl"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={setCurrentPage}
            nextPage={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            prevPage={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          />
        )}
      </div>

      {/* Column 2: Conditional Form */}
      <div className="brand-form">
        {isEditing ? (
          <EditBrand
            selectedBrand={selectedBrand}
            handleEditBrand={handleEditBrand}
          />
        ) : (
          <AddBrand handleAddBrand={handleAddBrand} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={handleOpen}
        itemId={selectedBrandId}
        onDelete={confirmDeleteBrand} // Confirm deletion function
        itemName="Brand" // Change to "Brand" for better context
      />
    </div>
  );
};

export default Brands;