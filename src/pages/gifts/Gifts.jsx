/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, Fragment, useCallback } from "react";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";
import AddProductsModal from "../../components/addproductsmodal/AddProductsModal";
import ArrayValidator from "../../components/shared/ArrayValidator";

const GiftRow = ({ gift, onDeleteClick, onViewClick }) => {
  const image = gift?.images?.[0];

  return (
    <Fragment key={gift?.id}>
      <tr className="hover:bg-gray-100">
        <td className="px-4 py-2 whitespace-nowrap">
          {image && (
            <img
              src={`${UPLOADS_URL}gifts/${image}`}
              alt={gift.name}
              className="h-12 w-12 object-cover border"
            />
          )}
        </td>
        <td className="px-4 py-2">{gift?.name}</td>
        <td className="px-4 py-2">{gift?.type}</td>
        <td className="px-4 py-2">{gift?.price}</td>
        <td className="px-4 py-2">
          <button
            onClick={() => onViewClick(gift)}
            className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600"
          >
            View
          </button>
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {formatDate(gift?.created_at)}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          {formatDate(gift?.updated_at)}
        </td>
        <td className="px-4 py-2 whitespace-nowrap">
          <div className="flex gap-1">
            <Link
              to={`/gifts/edit/${gift?.id}`}
              className="text-blue-500 size-8 flex justify-center items-center"
            >
              <Edit2 className="size-6" />
            </Link>
            <button
              onClick={() => onDeleteClick(gift?.id)}
              className="text-red-500 size-8 flex justify-center items-center"
            >
              <Trash className="size-6" />
            </button>
          </div>
        </td>
      </tr>
    </Fragment>
  );
};

const Gifts = () => {
  const { page = 1 } = useParams();
  const { request } = useContext(FetchContext);
  const [gifts, setGifts] = useState([]);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const [selectedGift, setSelectedGift] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams({
    limit: 10,
  });
  const limit = parseInt(searchParams.get("limit"));

  const fetchGifts = useCallback(async () => {
    try {
      const response = await request(
        `gifts?skip=${(page - 1) * limit}&limit=${limit}`
      );
      const json = await response.json();
      if (json.data) {
        setResponse({ data: json.data, count: json.count });
        setGifts(json.data);
      }
    } catch (error) {
      console.error("Error fetching gifts:", error);
    }
  }, [request, page]);

  useEffect(() => {
    fetchGifts();
  }, [fetchGifts, page]);

  const handleEditClick = (gift) => {
    setSelectedGift(gift);
  };

  const handleDeleteClick = async (id) => {
    try {
      await request(`gifts/${id}`, { method: "DELETE" });
      fetchGifts(); // refresh the gifts list
      setDeleteModalOpen(false); // close the delete modal after successful deletion
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  const handleViewClick = (gift) => {
    setSelectedGift(gift);
    setAddModalOpen(true);
  };

  const closeModals = () => {
    setSelectedGift(null);
    setAddModalOpen(false);
    setDeleteModalOpen(false);
  };

  return (
    <div className="">
      <div className="">
        <div className="flex items-center justify-between gap-8">
          <div>
            <h1 className="text-xl font-bold">Gifts</h1>
            <p className="text-sm text-gray-500">
              Total Gifts: {response.count}
            </p>
          </div>
          <Link
            to="/gifts/add"
            className="text-sm font-medium bg-main-5 text-white text-center px-4 py-2.5 rounded-md"
          >
            Add
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] lg:min-w-full bg-white border">
            <thead>
              <tr>
                {[
                  "Banner",
                  "Name",
                  "Type",
                  "Price",
                  "Products",
                  "CreatedAt",
                  "UpdatedAt",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <ArrayValidator
                list={gifts}
                fallback={
                  <tr className="text-center">
                    <td className="text-center" colSpan={8}>
                      No records
                    </td>
                  </tr>
                }
              >
                {gifts?.map((gift) => (
                  <GiftRow
                    key={gift?.id}
                    gift={gift}
                    onEditClick={handleEditClick}
                    onDeleteClick={() => {
                      setSelectedGift(gift); // set the selected gift before opening delete modal
                      setDeleteModalOpen(true);
                    }}
                    onViewClick={handleViewClick}
                  />
                ))}
              </ArrayValidator>
            </tbody>
          </table>
        </div>

        <Pagination
          endPoint="gifts"
          currentPage={page}
          totalPages={Math.ceil(response.count / limit)}
        />
      </div>

      {isAddModalOpen && selectedGift && (
        <AddProductsModal
          isOpen={isAddModalOpen}
          onClose={closeModals}
          gift={selectedGift}
          fetchGifts={fetchGifts}
        />
      )}

      <DeleteConfirmModal
        open={isDeleteModalOpen}
        handleOpen={() => setDeleteModalOpen(false)}
        onDelete={() => handleDeleteClick(selectedGift?.id)}
        onCollapse={closeModals}
        itemName="Gift"
      />
    </div>
  );
};

export default Gifts;
