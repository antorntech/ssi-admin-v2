import React, { useState, useEffect, useContext } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import { UPLOADS_URL } from "../../utils/API";

const Categories = () => {
  const { request } = useContext(FetchContext);

  const [categories, setCategories] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchCategories = async () => {
    try {
      const response = await request("categories");
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setCategories(json.data);
    } catch (error) {
      console.error();
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // ID of the category to be deleted

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page for pagination
  const [totalPages, setTotalPages] = useState(0);

  const handleAddCategory = (newCategory) => {
    setCategories([...categories, newCategory]);
  };

  const handleEditCategory = (updatedCategory) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    setIsEditing(false);
  };

  const handleDeleteCategory = (id) => {
    const filteredCategories = categories.filter(
      (category) => category.id !== id
    );
    setCategories(filteredCategories);
    localStorage.setItem("categoriesData", JSON.stringify(filteredCategories));
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open); // Toggle modal open/close

  // Confirm deletion of the selected category
  const confirmDeleteCategory = () => {
    handleDeleteCategory(selectedCategoryId);
    handleOpen(); // Close the modal after deletion
  };

  // Calculate the current categories for the current page
  const indexOfLastCategory = currentPage * itemsPerPage;
  const indexOfFirstCategory = indexOfLastCategory - itemsPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  // Set total pages whenever categories change
  useEffect(() => {
    setTotalPages(Math.ceil(categories.length / itemsPerPage));
  }, [categories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Column 1: Table */}
      <div className="col-span-1 categories-table">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            categories are {categories.length > 0 ? "" : "not"} available here.
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
              {currentCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">
                    {category.image ? (
                      <img
                        src={`${UPLOADS_URL}categories/${category.image}`}
                        alt={category.name || "Category"}
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
                  <td className="px-6 py-4 border-b">{category.name}</td>
                  <td className="px-6 py-4 border-b">
                    {moment(category.created_at).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    {moment(category.updated_at).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="text-orange-500 hover:text-orange-700 mr-3"
                    >
                      <i className="fa-solid fa-pen-to-square text-xl"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategoryId(category.id);
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
      <div className="col-span-1 category-form bg-white p-4 lg:p-5 rounded-lg custom-shadow">
        {isEditing ? (
          <EditCategory
            selectedCategory={selectedCategory}
            handleEditCategory={handleEditCategory}
          />
        ) : (
          <AddCategory fetchCategories={fetchCategories} />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={handleOpen}
        itemId={selectedCategoryId}
        onDelete={confirmDeleteCategory} // Confirm deletion function
        itemName="Category" // Change to "Category" for better context
      />
    </div>
  );
};

export default Categories;
