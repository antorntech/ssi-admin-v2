import React, { useState, useEffect, useContext } from "react";
import AddBrand from "./AddBrand";
import EditBrand from "./EditBrand";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import moment from "moment";
import { UPLOADS_URL } from "../../utils/API";
import { useParams } from "react-router-dom";

const Brands = () => {
  const params = useParams();
  const page = params?.page || 1;
  const { request } = useContext(FetchContext);
  const [brands, setBrands] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchBrands = async () => {
    try {
      const response = await request(`brands?skip=${(page - 1) * 5}&limit=5`);
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
  }, [page]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedBrandId, setSelectedBrandId] = useState(null); // ID of the brand to be deleted

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`brands/${id}`, { method: "DELETE" });
      setSelectedBrandId(null);
      fetchBrands();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (brand) => {
    setSelectedBrand(brand);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open); // Toggle modal open/close

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Column 1: Table */}
      <div className="col-span-1 brands-table">
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
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">
                    {brand.image ? (
                      <img
                        src={`${UPLOADS_URL}brands/${brand.image}`}
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
                  <td className="px-6 py-4 border-b capitalize">
                    {brand.name}
                  </td>
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
                        handleOpen();
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
        <Pagination
          endPoint="brands"
          currentPage={page}
          totalPages={response.count ? Math.ceil(response.count / 5) : 0}
        />
      </div>

      {/* Column 2: Conditional Form */}
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
        handleOpen={handleOpen}
        onCollapse={() => setOpen(false)}
        itemId={selectedBrandId}
        onDelete={() => handleDelete(selectedBrandId)}
        itemName="brand"
      />
    </div>
  );
};

export default Brands;
