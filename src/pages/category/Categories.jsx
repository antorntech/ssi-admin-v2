/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import { useParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";

const Categories = () => {
  const params = useParams();
  const page = params?.page || 1;
  const { request } = useContext(FetchContext);
  const [categories, setCategories] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchCategories = async () => {
    try {
      const response = await request(
        `categories?skip=${(page - 1) * 5}&limit=5`
      );
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setCategories(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`categories/${id}`, { method: "DELETE" });
      setSelectedCategoryId(null);
      fetchCategories();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Column 1: Table */}
      <div className="col-span-1 categories-table">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">
            Total Category: {response?.count}
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
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-100">
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
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
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize min-w-[220px]">
                    {category.name}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                    {formatDate(category?.created_at)}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                    {formatDate(category?.updated_at)}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditClick(category)}
                        className="text-orange-500 hover:text-orange-700 mr-3"
                      >
                        <Edit2
                          size="22"
                          className="text-orange-600"
                          variant="Bold"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCategoryId(category.id);
                          handleOpen(); // Open delete confirmation modal
                        }}
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
          endPoint="categories"
          currentPage={page}
          totalPages={response.count ? Math.ceil(response.count / 5) : 0}
        />
      </div>

      {/* Column 2: Conditional Form */}
      <div className="col-span-1 category-form">
        <div className="w-full bg-white p-4 lg:p-5 rounded-lg custom-shadow">
          {isEditing ? (
            <EditCategory
              selectedCategory={selectedCategory}
              fetchCategories={() => {
                fetchCategories();
                setIsEditing(false);
              }}
            />
          ) : (
            <AddCategory fetchCategories={fetchCategories} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={handleOpen}
        onCollapse={() => setOpen(false)}
        itemId={selectedCategoryId}
        onDelete={() => handleDelete(selectedCategoryId)}
        itemName="Category"
      />
    </div>
  );
};

export default Categories;
