/* eslint-disable react/prop-types */
import { useState, useEffect, useContext, Fragment, useCallback } from "react";
import AddGift from "./AddGift";
import EditGift from "./EditGift";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import { useParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";
import AddProductsModal from "../../components/addproductsmodal/AddProductsModal";
import ArrayValidator from "../../components/shared/ArrayValidator";

const GiftRow = ({ gift, onEditClick, onDeleteClick, onViewClick }) => {
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
            <button
              onClick={() => onEditClick(gift)}
              className="text-blue-500 size-8 flex justify-center items-center"
            >
              <Edit2 className="size-6" />
            </button>
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
  const [modalState, setModalState] = useState({
    edit: false,
    addProducts: false,
  });

  const fetchGifts = useCallback(async () => {
    try {
      const response = await request(`gifts?skip=${(page - 1) * 5}&limit=5`);
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
    setModalState({ ...modalState, edit: true });
  };

  const handleDeleteClick = async (id) => {
    try {
      await request(`gifts/${id}`, { method: "DELETE" });
      fetchGifts(); // refresh the gifts list
      setSelectedGift(null);
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  const handleViewClick = (gift) => {
    setSelectedGift(gift);
    setModalState({ ...modalState, addProducts: true });
  };

  const closeModal = () => {
    setSelectedGift(null);
    setModalState({ edit: false, addProducts: false });
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="col-span-2">
        <h1 className="text-xl font-bold">Gifts</h1>
        <p className="text-sm text-gray-500">Total Gifts: {response.count}</p>

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
                {gifts?.map((gift) => {
                  if (!gift) return;
                  return (
                    <GiftRow
                      key={gift?.id}
                      gift={gift}
                      onEditClick={handleEditClick}
                      onDeleteClick={() => {
                        setModalState({ ...modalState, delete: true });
                      }}
                      onViewClick={handleViewClick}
                    />
                  );
                })}
              </ArrayValidator>
            </tbody>
          </table>
        </div>

        <Pagination
          endPoint="gifts"
          currentPage={page}
          totalPages={Math.ceil(response.count / 5)}
        />
      </div>

      <div className="col-span-2">
        <div className="w-full max-w-2xl bg-white p-4 lg:p-5 rounded-lg custom-shadow">
          {modalState.edit ? (
            <EditGift
              selectedGift={selectedGift}
              fetchGifts={() => {
                fetchGifts();
                setModalState({ ...modalState, edit: false });
                setSelectedGift(null);
              }}
            />
          ) : (
            <AddGift fetchGifts={fetchGifts} />
          )}
        </div>
      </div>

      {/* Add Products Modal */}
      {modalState.addProducts && selectedGift && (
        <AddProductsModal
          isOpen={modalState.addProducts}
          onClose={closeModal}
          gift={selectedGift}
          fetchGifts={fetchGifts}
        />
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        open={modalState.delete}
        handleOpen={() => setModalState({ ...modalState, delete: false })}
        onDelete={() => handleDeleteClick(selectedGift)}
        onCollapse={closeModal}
        itemName="Gift"
      />
    </div>
  );
};

export default Gifts;
