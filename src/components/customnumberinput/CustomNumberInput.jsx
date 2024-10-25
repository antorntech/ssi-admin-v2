import { Add, Minus } from "iconsax-react";
import React, { useState } from "react";

const CustomNumberInput = ({
  number,
  newInput = true,
  onChange = () => {},
  addInput = () => {},
  removeInput = () => {},
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          minLength={11}
          maxLength={11}
          pattern="^(013|014|015|016|017|018|019)[0-9]{8}$"
          name="custom_number"
          placeholder="Enter mobile number"
          onChange={onChange}
          value={number}
          className="capitalize w-full py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
        />
        <button
          type="button"
          onClick={() => {
            newInput ? addInput() : removeInput();
          }}
          className="bg-[#6CB93B] px-2 py-[9px] rounded"
        >
          {newInput ? (
            <Add size="20" color="#fff" />
          ) : (
            <Minus size="20" color="#fff" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CustomNumberInput;
