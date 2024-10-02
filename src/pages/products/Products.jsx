import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import SearchBar from "../../components/searchbar/SearchBar";
import Pagination from "../../components/pagination/Pagination";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page for pagination

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const storedProducts = localStorage.getItem("productsData");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
  }, []);

  // Update filtered products when searchText changes
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when products are filtered
  }, [searchText, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = () => {
    const storedProducts =
      JSON.parse(localStorage.getItem("productsData")) || [];
    setProducts(storedProducts);
    setFilteredProducts(storedProducts); // Update filtered products on deletion
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            products are{" "}
            {products.length > 0 && filteredProducts.length > 0 ? "" : "not"}{" "}
            available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Reusable SearchBar Component */}
          <SearchBar searchText={searchText} handleSearch={setSearchText} />
          <Link
            to="/products/add-product"
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
              {/* Table Head */}
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
                    Brand
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Color
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">
                      {product.images && product.images.length < 0 ? (
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
                    <td className="px-6 py-4 border-b">{product.name}</td>
                    <td className="px-6 py-4 border-b">
                      {product.description?.slice(0, 20)}...
                    </td>
                    <td className="px-6 py-4 border-b">{product.brand}</td>
                    <td className="px-6 py-4 border-b">{product.color}</td>
                    <td className="px-6 py-4 border-b">{product.category}</td>
                    <td className="px-6 py-4 border-b">{product.price}</td>
                    <td className="px-6 py-4 border-b">{product.quantity}</td>
                    <td className="px-6 py-4 border-b">{product.date}</td>
                    <td className="px-6 py-4 border-b">
                      <Link
                        to={`/products/edit-product/${product.id}`}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <i className="fa-solid fa-pen-to-square mr-3 text-xl"></i>
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedItemId(product.id);
                          handleOpen();
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

          {/* Reusable Pagination Component */}
          {totalPages > 1 && ( // Check if there are more than 1 page
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages} // Pass totalPages to the Pagination component
              paginate={paginate}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          )}

          <DeleteConfirmModal
            open={open}
            handleOpen={handleOpen}
            itemId={selectedItemId}
            onDelete={handleDelete}
            itemName="productsData"
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Products;
