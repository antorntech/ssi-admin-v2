import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { Button, Input } from "@material-tailwind/react";
import Pagination from "../../components/pagination/Pagination";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedProducts = localStorage.getItem("productsData");
    if (storedProducts) {
      const productsData = JSON.parse(storedProducts);
      setProducts(productsData);
      setFilteredProducts(productsData); // Initialize filtered products with all products
    }
  }, []);

  const handleOpen = () => setOpen(!open);

  const handleDelete = () => {
    const storedProducts =
      JSON.parse(localStorage.getItem("productsData")) || [];
    setProducts(storedProducts);
    setFilteredProducts(storedProducts); // Update filtered products on deletion
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchText(searchTerm);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.author.toLowerCase().includes(searchTerm)
    );

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to the first page after a search
  };

  const openDeleteConfirmModal = (itemId) => {
    setSelectedItemId(itemId);
    handleOpen();
  };

  // Pagination logic for filtered products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            products are {products.length > 0 ? "" : "not"} available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative md:flex w-full max-w-[24rem]">
            <Input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={handleSearch} // Bind the search input to the handler
              className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Button
              size="sm"
              disabled={!searchText}
              className={`!absolute right-1 top-1 rounded transition-all duration-300 ${
                searchText ? "bg-[#050828]" : "bg-[#c9c8c8]"
              }`}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </Button>
          </div>
          <Link
            to={"/products/add-product"}
            className="inline-block text-center w-full bg-[#6CB93B] text-white px-4 py-2 rounded-md mt-2 md:mt-0"
          >
            Add Product
          </Link>
        </div>
      </div>
      {filteredProducts.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Banner
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Color
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Author
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].path}
                          alt={product.name}
                          className="h-12 w-12 object-cover"
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/150"
                          alt={product.name}
                          className="h-12 w-12 object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <h1 className="text-sm font-bold">{product.name}</h1>
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.description.slice(0, 50)}...
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.color}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.price}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.author}
                    </td>
                    <td className="px-6 py-4 border-b text-sm text-gray-500">
                      {product.date}
                    </td>
                    <td className="px-6 py-4 border-b text-sm">
                      <div className="flex gap-2">
                        <Link to={`/products/edit-product/${product.id}`}>
                          <button className="text-orange-800 border-2 border-orange-800 px-2 py-1 rounded-md text-sm hover:bg-orange-800 hover:text-white transition-all duration-500">
                            <i className="fa-solid fa-pencil"></i>
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteConfirmModal(product.id)}
                          className="text-red-800 border-2 border-red-800 px-2 py-1 rounded-md text-sm hover:bg-red-800 hover:text-white transition-all duration-500"
                        >
                          <i className="fa-regular fa-trash-can"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <DeleteConfirmModal
            open={open}
            handleOpen={handleOpen}
            itemId={selectedItemId}
            onDelete={handleDelete}
            itemName={"productsData"}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Products;
