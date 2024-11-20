/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import "./AddPriorityModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";

const AddPriorityModal = ({
  isOpen,
  onClose = () => {},
  productId,
  fetchProducts = () => {},
}) => {
  if (!isOpen) return null;
  const [priority, setPriority] = useState(0);
  const { request } = useContext(FetchContext);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalRef]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (priority == 0) {
      console.error("Priority cannot be 0");
      return;
    }
    if (!productId) {
      console.error("Customer ID is required");
      return;
    }

    const body = {
      id: productId,
      priority: parseFloat(priority),
    };

    try {
      const response = await request("/products/priority", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      fetchProducts();
      setPriority("");
      onClose();
    } catch (error) {
      console.error("Error adding priority:", error);
    }
  };

  return (
    <div className="priority-modal">
      <div className="priority-modal-content clear-start p-4">
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-black">
            Add or Subtract Priority
          </h1>
          <p className="text-gray-500">
            You can add or subtract priority to product!
          </p>
        </div>
        <div className="py-3"></div>
        <form onSubmit={onSubmit}>
          <input
            type="number"
            placeholder="Enter priority"
            className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            onChange={(e) => setPriority(parseInt(e.target.value))}
            value={priority}
            ref={modalRef}
          />
          <button className="px-2 py-1 bg-[#6CB93B] rounded text-white mt-3">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPriorityModal;
