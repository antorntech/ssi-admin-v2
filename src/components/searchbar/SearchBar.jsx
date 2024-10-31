/* eslint-disable react/prop-types */
import { SearchNormal } from "iconsax-react";

const SearchBar = ({ searchText, handleSearch, doSearch }) => {
  return (
    <form
      className="flex-grow relative min-w-[16rem] border border-green-400 flex rounded-lg bg-white overflow-hidden"
      onSubmit={doSearch}
    >
      <input
        type="search"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => handleSearch(e.target.value.trim())}
        className="flex-grow focus:outline-none px-3 rounded-lg"
      />
      <button className="size-10 grid place-items-center bg-main-5 hover:bg-main-7 text-white rounded-r-md cursor-pointer">
        <SearchNormal className="size-4" />
      </button>
    </form>
  );
};

export default SearchBar;
