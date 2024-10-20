import React, { useState, useEffect, useContext } from "react";
import AddGift from "./AddGift";
import EditGift from "./EditGift";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Edit2, Trash } from "iconsax-react";

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
      console.error();
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
      <div className="col-span-1 gifts-table">
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
                  Price
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
                const { images } = gift;
                const image = images[0];
                return (
                  <tr key={gift.id} className="hover:bg-gray-100">
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
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      {gift.price}
                    </td>

                    <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                      {moment(gift.created_at).format("Do MMM, YYYY")}
                    </td>

                    <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                      {moment(gift.updated_at).format("Do MMM, YYYY")}
                    </td>
                    <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(gift)}
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
                            setSelectedGiftId(gift.id);
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
      <div className="col-span-1">
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
