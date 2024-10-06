import React, { useState, useEffect } from "react";
import AddGift from "./AddGift";
import EditGift from "./EditGift";
import Pagination from "../../components/pagination/Pagination"; // Import the Pagination component
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal"; // Import the DeleteConfirmModal component

const Gifts = () => {
  const [gifts, setGifts] = useState(
    JSON.parse(localStorage.getItem("giftsData")) || []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [open, setOpen] = useState(false); // State for delete confirmation modal
  const [selectedGiftId, setSelectedGiftId] = useState(null); // ID of the gift to be deleted

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page for pagination
  const [totalPages, setTotalPages] = useState(0);

  const handleAddGift = (newGift) => {
    setGifts([...gifts, newGift]);
  };

  const handleEditGift = (updatedGift) => {
    const updatedGifts = gifts.map((gift) =>
      gift.id === updatedGift.id ? updatedGift : gift
    );
    setGifts(updatedGifts);
    setIsEditing(false);
  };

  const handleDeleteGift = (id) => {
    const filteredGifts = gifts.filter((gift) => gift.id !== id);
    setGifts(filteredGifts);
    localStorage.setItem("giftsData", JSON.stringify(filteredGifts));
  };

  const handleEditClick = (gift) => {
    setSelectedGift(gift);
    setIsEditing(true);
  };

  const handleOpen = () => setOpen(!open); // Toggle modal open/close

  // Confirm deletion of the selected gift
  const confirmDeleteGift = () => {
    handleDeleteGift(selectedGiftId);
    handleOpen(); // Close the modal after deletion
  };

  // Calculate the current gifts for the current page
  const indexOfLastGift = currentPage * itemsPerPage;
  const indexOfFirstGift = indexOfLastGift - itemsPerPage;
  const currentGifts = gifts.slice(indexOfFirstGift, indexOfLastGift);

  // Set total pages whenever gifts change
  useEffect(() => {
    setTotalPages(Math.ceil(gifts.length / itemsPerPage));
  }, [gifts]);

  const TH = ({ children }) => (
    <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
      {children}
    </th>
  );

  return (
    <div className="flex flex-wrap gap-6">
      <div className="flex-grow">
        <h1 className="text-xl font-bold">Gifts</h1>
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full bg-white border">
            <thead>
              <tr>
                <TH>Banner</TH>
                <TH>Price</TH>
                <TH>CreatedAt</TH>
                <TH>UpdatedAt</TH>
                <TH>Action</TH>
              </tr>
            </thead>
            <tbody>
              {currentGifts.map((gift) => (
                <tr key={gift.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 border-b">
                    {gift.image ? (
                      <img
                        src={gift.image}
                        alt={gift.name || "Gift"}
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
                  <td className="px-6 py-4 border-b">{gift.price}</td>
                  <td className="px-6 py-4 border-b">{gift.createdAt}</td>
                  <td className="px-6 py-4 border-b">{gift.updatedAt}</td>
                  <td className="px-6 py-4 border-b">
                    <button
                      onClick={() => handleEditClick(gift)}
                      className="text-orange-500 hover:text-orange-700 mr-3"
                    >
                      <i className="fa-solid fa-pen-to-square text-xl"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedGiftId(gift.id);
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
        <DeleteConfirmModal
          open={open}
          handleOpen={handleOpen}
          itemId={selectedGiftId}
          onDelete={confirmDeleteGift} // Confirm deletion function
          itemName="Gift" // Change to "Gift" for better context
        />
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
      <div className="w-full bg-white p-4 lg:p-5 rounded-lg max-w-md">
        {isEditing ? (
          <EditGift
            selectedGift={selectedGift}
            handleEditGift={handleEditGift}
          />
        ) : (
          <AddGift handleAddGift={handleAddGift} />
        )}
      </div>
    </div>
  );
};

export default Gifts;
