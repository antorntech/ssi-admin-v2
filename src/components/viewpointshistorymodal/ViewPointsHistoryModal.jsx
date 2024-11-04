/* eslint-disable react/prop-types */

import "./ViewPointsHistoryModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";
import { useContext, useEffect, useState } from "react";
import { srcBuilder } from "../../utils/src";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/date";
import moment from "moment";

const ViewPointsHistoyModal = ({ isOpen, onClose, customerID }) => {
  if (!isOpen) return null;

  const [pointsData, setPointsData] = useState([]);
  const { request } = useContext(FetchContext);

  const fetchPoints = async () => {
    try {
      const res = await request(`points?customer_id=${customerID}`);
      const json = await res.json();
      const { data } = json;

      if (Array.isArray(data)) {
        setPointsData(data);
      }
    } catch (error) {
      console.error("Error fetching points data:", error);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>

        <h1 className="underline underline-offset-4 text-3xl font-bold mb-8 text-center text-gray-800">
          Points History
        </h1>

        <div>
          <table className="w-full border border-gray-300 rounded-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Points From
                </th>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  Total Points
                </th>
                <th className="px-4 py-2 border-b font-bold text-left text-gray-700">
                  CreatedAt
                </th>
              </tr>
            </thead>
            <tbody>
              {pointsData?.map((item) => {
                return (
                  <tr key={item.id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 border-b">{item.points_from}</td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      {item.points}
                    </td>
                    <td className="px-4 py-3 border-b text-gray-600">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewPointsHistoyModal;
