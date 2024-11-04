/* eslint-disable react/prop-types */

import "./ViewPointsHistoryModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";
import { useContext, useEffect, useState } from "react";
import { srcBuilder } from "../../utils/src";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";

const ViewPointsHistoyModal = ({ isOpen, onClose, customerID }) => {
  if (!isOpen) return null;

  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>

        <h1 className="underline underline-offset-4 text-3xl font-bold mb-8 text-center text-gray-800">
          Points History
        </h1>

        <p>Customer Id: {customerID}</p>
      </div>
    </div>
  );
};

export default ViewPointsHistoyModal;
