/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import AddGift from "./AddGift";
import EditGift from "./EditGift";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import { useParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";

const Product = ({ id }) => {
  const [product, setProduct] = useState(null);
  const { request } = useContext(FetchContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await request(`products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id, request]);

  return <p>{product?.name}</p>;
};

const GiftRow = ({ gift, onEditClick, onDeleteClick }) => {
  const { images, products } = gift;
  const image = images?.[0];

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        {image && (
          <img
            src={`${UPLOADS_URL}gifts/${image}`}
            alt={image}
            className="h-12 w-12 object-cover border"
          />
        )}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{gift.name}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{gift.type}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">{gift.price}</td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        {products?.map((product) => (
          <Product key={product?.id} id={product?.id} />
        ))}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        {formatDate(gift.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        {formatDate(gift.updated_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => onEditClick(gift)}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            <Edit2 />
          </button>
          <button
            onClick={() => onDeleteClick(gift.id)}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            <Trash />
          </button>
        </div>
      </td>
    </tr>
  );
};

const Gifts = () => {
  const params = useParams();
  const page = params?.page || 1;
  const { request } = useContext(FetchContext);
  const [gifts, setGifts] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState(null);

  const fetchGifts = async () => {
    try {
      const response = await request(`gifts?skip=${(page - 1) * 5}&limit=5`);
      const json = await response.json();
      const { data, count } = json;
      if (data) {
        setResponse((prev) => ({ ...prev, data, count }));
        setGifts(data);
      }
    } catch (error) {
      console.error("Error fetching gifts:", error);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [page]);

  const handleEditClick = (gift) => {
    setSelectedGift(gift);
    setIsEditing(true);
  };

  const handleDeleteClick = (id) => {
    setSelectedGiftId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedGiftId) return;
    try {
      await request(`gifts/${selectedGiftId}`, { method: "DELETE" });
      setSelectedGiftId(null);
      setDeleteModalOpen(false);
      fetchGifts();
    } catch (error) {
      console.error("Error deleting gift:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="col-span-2">
        <h1 className="text-xl font-bold">Gifts</h1>
        <p className="text-sm text-gray-500">Total Gifts: {response?.count}</p>
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
                  Type
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Price
                </th>
                <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                  Products
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
              {gifts.map((gift) => (
                <GiftRow
                  key={gift._id}
                  gift={gift}
                  onEditClick={handleEditClick}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
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
          {isEditing ? (
            <EditGift
              selectedGift={selectedGift}
              fetchGifts={() => {
                fetchGifts();
                setIsEditing(false);
                setSelectedGift(null);
              }}
            />
          ) : (
            <AddGift fetchGifts={fetchGifts} />
          )}
        </div>
      </div>

      {deleteModalOpen && (
        <DeleteConfirmModal
          open={deleteModalOpen}
          handleOpen={() => setDeleteModalOpen(false)}
          onDelete={handleDelete}
          itemName="Gift"
        />
      )}
    </div>
  );
};

export default Gifts;
