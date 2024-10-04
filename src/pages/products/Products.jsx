import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import SearchBar from "../../components/searchbar/SearchBar";
import Pagination from "../../components/pagination/Pagination";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { request } = useContext(FetchContext);
  const [response, setResponse] = useState({ data: [], filtered: [] });

  const fetchProducts = async () => {
    try {
      const response = await request("products");
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setProducts(json);
    } catch (error) {
      console.error();
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Items per page for pagination

  const handleOpen = () => setOpen(!open);

  useEffect(() => {
    const filtered = products?.data?.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when products are filtered
  }, [searchText, products]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(products.count / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`products/${id}`, { method: "DELETE" });
      setSelectedItemId(null);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500"></p>
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
      {response?.count ? (
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
              <tbody>
                {currentItems?.map((product) => {
                  const { images } = product;
                  const image = images[0];
                  return (
                    <tr key={product.id} className="hover:bg-gray-100">
                      <td className="px-6 py-4 border-b">
                        {image ? (
                          <>
                            <img
                              src={`${UPLOADS_URL + image}`}
                              alt={image}
                              className="h-12 w-12 object-cover border"
                            />
                          </>
                        ) : null}
                      </td>
                      <td className="px-6 py-4 border-b">{product.name}</td>
                      <td className="px-6 py-4 border-b">{product.brand}</td>
                      <td className="px-6 py-4 border-b">{product.color}</td>
                      <td className="px-6 py-4 border-b">{product.category}</td>
                      <td className="px-6 py-4 border-b">{product.price}</td>
                      <td className="px-6 py-4 border-b">{product.quantity}</td>
                      <td className="px-6 py-4 border-b">{product.date}</td>
                      <td className="px-6 py-4 border-b">
                        <Link
                          to={`/products/edit/${product.id}`}
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
                  );
                })}
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
          {selectedItemId ? (
            <DeleteConfirmModal
              handleOpen={handleOpen}
              onCollapse={() => {
                setSelectedItemId(null);
              }}
              open={!!selectedItemId}
              onDelete={() => {
                handleDelete(selectedItemId);
              }}
              itemName="productsData"
            />
          ) : null}
        </>
      ) : (
        <>{/* <Loader /> */}</>
      )}
    </>
  );
};

export default Products;
