// components/SearchBar.js
import React from "react";
import { Input, Button } from "@material-tailwind/react";
import { SearchNormal } from "iconsax-react";

const SearchBar = ({ searchText, handleSearch }) => {
  return (
    <div className="relative w-[150px] md:w-[20rem]">
      <Input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:ring-border-[#199bff]/10"
        labelProps={{
          className: "before:content-none after:content-none",
        }}
      />
      <Button
        size="sm"
        disabled={!searchText}
        className={`!absolute right-[-3rem] md:right-1 top-1 rounded transition-all duration-300 ${
          searchText ? "bg-[#050828]" : "bg-[#c9c8c8]"
        }`}
      >
        <SearchNormal size="15" color="#fff" />
      </Button>
    </div>
  );
};

export default SearchBar;
