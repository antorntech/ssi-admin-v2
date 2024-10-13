import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import SearchBar from "../../components/searchbar/SearchBar";
import Pagination from "../../components/pagination/Pagination";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";
import moment from "moment";

const Products = () => {
  const { request } = useContext(FetchContext);
  const params = useParams();
  const page = parseInt(params?.page || 1, 10); // Ensure page is an integer

  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [filteredProducts, setFilteredProducts] = useState([]); // Initialize as an empty array
  const [searchText, setSearchText] = useState("");
  const [response, setResponse] = useState({ data: [], count: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch products with pagination
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await request(`products?skip=${(page - 1) * 5}&limit=5`);
      const json = await res.json();
      const { data, count } = json;

      if (Array.isArray(data)) {
        setResponse({ data, count });
        setProducts(data);
        setFilteredProducts(data); // Set filteredProducts initially to the fetched products
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when component mounts or when page changes
  useEffect(() => {
    fetchProducts();
  }, [page]);

  // Handle search filtering
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchText.trim()) {
          const filtered = await request(`search?q=${searchText}`);
          const data = await filtered.json();
          if (Array.isArray(data)) {
            setFilteredProducts(data);
          }
        } else {
          setFilteredProducts(products); // Reset to original products if searchText is empty
        }
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    };

    fetchData();
  }, [searchText, products]);

  // Handle delete operation
  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");

      const res = await request(`products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts(); // Refetch products after successful deletion
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Toggle delete confirmation modal
  const handleOpen = (id = null) => {
    setSelectedItemId(id);
    setOpen(!open);
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            Total Products: {response.count}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* SearchBar component for searching */}
          <SearchBar searchText={searchText} handleSearch={setSearchText} />
          <Link
            to="/products/add-product"
            className="inline-block ml-[50px] md:ml-0 w-[110px] text-sm font-medium bg-[#6CB93B] text-white md:w-[150px] text-center px-3 py-2 md:px-4 md:py-2 rounded-md"
          >
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : response.count > 0 ? (
        <>
          <div className="mt-5 w-full overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr>
                  {[
                    "Banner",
                    "Name",
                    "Brand",
                    "Color",
                    "Category",
                    "Price",
                    "Quantity",
                    "Date",
                    "Action",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const {
                      id,
                      images,
                      name,
                      brand,
                      color,
                      category,
                      price,
                      quantity,
                      created_at,
                    } = product;
                    const imageUrl = images?.[0]
                      ? `${UPLOADS_URL}${images[0]}`
                      : "";

                    return (
                      <tr key={id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                          {imageUrl && (
                            <img
                              src={imageUrl}
                              alt={name}
                              className="h-12 w-12 object-cover border"
                            />
                          )}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                          {name}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                          {brand.name}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                          {color}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                          {category.name}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                          {price}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                          {quantity}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                          {moment(created_at).format("Do MMM, YYYY")}
                        </td>
                        <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                          <div className="flex">
                            <Link
                              to={`/products/edit/${id}`}
                              className="text-orange-500 hover:text-orange-700"
                            >
                              <i className="fa-solid fa-pen-to-square mr-3 text-xl"></i>
                            </Link>
                            <button
                              onClick={() => handleOpen(id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <i className="fa-solid fa-trash-can text-xl"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      No products found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Component */}
          <Pagination
            endPoint="products"
            currentPage={page}
            totalPages={response.count ? Math.ceil(response.count / 5) : 1}
          />

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            open={open}
            handleOpen={() => handleOpen(null)}
            onCollapse={() => setOpen(false)}
            itemId={selectedItemId}
            onDelete={() => handleDelete(selectedItemId)}
            itemName="Product"
          />
        </>
      ) : (
        <p>No products found.</p>
      )}
    </>
  );
};

export default Products;
