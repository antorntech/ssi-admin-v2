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
  React.useEffect(() => {
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
  }, []);
  return (
    <div>
      <p>{product?.name}</p>
    </div>
  );
};

const GiftRow = ({ gift }) => {
  const products = gift?.products;
  const { images } = gift;
  const image = images[0];
  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 md:px-6 md:py-4 border-b">
        {image ? (
          <>
            <img
              src={`${UPLOADS_URL + "gifts/" + image}`}
              alt={image}
              className="h-12 w-12 object-cover border"
            />
          </>
        ) : null}
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
            onClick={() => {
              handleEditClick(gift);
            }}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
          >
            <Edit2 />
          </button>
          <button
            onClick={() => {
              handleDeleteClick(gift);
            }}
            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            <Trash />
          </button>
        </div>
      </td>
    </tr>
  );

  function handleEditClick(gift) {
    setSelectedGift(gift);
    setIsEditing(true);
  }

  function handleDeleteClick(gift) {
    setSelectedGift(gift);
    setOpen(true);
  }
};

const Gifts = () => {
  const params = useParams();
  const page = params?.page || 1;
  const { request } = useContext(FetchContext);
  const [gifts, setGifts] = useState([]);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchGifts = async () => {
    try {
      const response = await request(`gifts?skip=${(page - 1) * 5}&limit=5`);
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setGifts(json.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGifts();
  }, [page]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedGiftId, setSelectedGiftId] = useState(null); // ID of the gift to be deleted

  const handleEditClick = (gift) => {
    setSelectedGift(gift);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open); // Toggle modal open/close

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`gifts/${id}`, { method: "DELETE" });
      setSelectedGiftId(null);
      fetchGifts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Column 1: Table */}
      <div className="col-span-2 gifts-table">
        <div className="mb-4">
          <h1 className="text-xl font-bold">Gifts</h1>
          <p className="text-sm text-gray-500">
            Total Gifts: {response?.count}
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
              {gifts?.map((gift) => {
                return (
                  <GiftRow
                    key={gift._id}
                    gift={gift}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDelete}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          endPoint="gifts"
          currentPage={page}
          totalPages={response.count ? Math.ceil(response.count / 5) : 0}
        />
      </div>
      <div className="col-span-2">
        <div className=" w-full bg-white p-4 lg:p-5 rounded-lg custom-shadow">
          {isEditing ? (
            <EditGift
              selectedGift={selectedGift}
              fetchGifts={() => {
                fetchGifts();
                setSelectedGift(null);
                setIsEditing(false);
              }}
            />
          ) : (
            <AddGift fetchGifts={fetchGifts} />
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {selectedGiftId ? (
        <DeleteConfirmModal
          handleOpen={handleOpen}
          onCollapse={() => {
            setSelectedGiftId(null);
          }}
          open={!!selectedGiftId}
          onDelete={() => {
            handleDelete(selectedGiftId);
          }}
          itemName="Gift"
        />
      ) : null}
    </div>
  );
};

export default Gifts;
