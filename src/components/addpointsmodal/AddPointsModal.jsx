import React, { useContext, useState } from "react";
import "./AddPointsModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";

const AddPointsModal = ({ isOpen, onClose, customerId, fetchCustomers }) => {
  if (!isOpen) return null;
  const [points, setPoints] = useState(0);
  const { request } = useContext(FetchContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const body = {
      customer_id: customerId,
      points: parseInt(points),
    };
    console.log(body);

    try {
      const response = await request("points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      fetchCustomers();
      setPoints("");
      onClose();
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  return (
    <div className="points-modal">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>
        <div className="mb-4">
          <h1 className="text-xl font-bold text-black">Add Points</h1>
          <p className="text-gray-500">
            You can add points to customer account!
          </p>
        </div>
        <form action="#" onSubmit={onSubmit}>
          <input
            type="number"
            placeholder="Enter points"
            className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            onChange={(e) => setPoints(e.target.value)}
            value={points}
          />
          <button className="px-2 py-1 bg-[#6CB93B] rounded text-white mt-3">
            Add Points
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPointsModal;
