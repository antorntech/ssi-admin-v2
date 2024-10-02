import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { Pagination } from "../../components/pagination/Pagination"; // Assuming you moved pagination as well
import SearchBar from "../../components/searchbar/SearchBar";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

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
  }, [searchText, products]);

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            {products.length > 0
              ? "Products available"
              : "No products available."}
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
                  {/* Other headers */}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredProducts.map((product) => (
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
                    {/* Other product data */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            totalItems={filteredProducts.length}
            itemsPerPage={5}
            currentPage={currentPage}
            paginate={paginate}
            nextPage={nextPage}
            prevPage={prevPage}
          />

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
