import React from "react";
import PropTypes from "prop-types";

/**
 * input[name="images"]
 * @param {function} onChange Callback function when input files change
 * @returns {React.ReactElement} A label element wrapping an input element
 * @example
 * const handleFilesChange = (ev) => {
 *   const files = ev.target.files;
 *   // Do something with the files
 * };
 * <InputImages onFilesChange={handleFilesChange} />
 */
const InputImages = ({ onChange, ...rest }) => {
  if (!onChange) console.warn("InputImages: onChange is not defined");
  return (
    <label className="border-2 border-dashed rounded-lg border-gray-400 hover:border-[#6CB93B] p-6 py-2 lg:py-[33px] text-center w-full flex flex-col items-center relative">
      <div className="text-3xl grayscale">📁</div>
      <div className="flex flex-col items-center">
        <div className="text-lg font-semibold mb-1">
          Drag and drop files here
        </div>
        <div className="text-sm mb-4">File must be image/* format</div>
        <div className="border border-gray-500 text-gray-900 hover:bg-gray-100 relative flex items-center justify-center gap-1 text-sm lg:text-base rounded-xl px-4 lg:px-5 py-2 lg:py-2.5 font-medium whitespace-nowrap">
          Browse files
        </div>
      </div>
      <input
        name="images"
        type="file"
        accept="image/*"
        multiple
        className="absolute top-0 left-0 w-full h-full opacity-0 z-[1] bg-black"
        onChange={onChange}
        {...rest}
      />
    </label>
  );
};

InputImages.propTypes = {
  onFilesChange: PropTypes.func
};

export default InputImages;
