/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../loader/Loader";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import SearchBar from "../../components/searchbar/SearchBar";
import Pagination from "../../components/pagination/Pagination";
import FetchContext, { useFetch } from "../../context/FetchContext";
import { Edit, Edit2, Trash } from "iconsax-react";
import { formatDate } from "../../utils/date";
import { srcBuilder } from "../../utils/src";
import cn from "../../utils/cn";
import PlayPause from "../../shared/PlayPause";
import AddPriorityModal from "../../components/addprioritymodal/AddPriorityModal";

const ProductRow = ({
  product = null,
  openModal = () => {},
  handlePriority = (id) => {},
}) => {
  const { request } = useFetch();
  const [data, setData] = useState(product);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(null);
  const [brand, setBrand] = useState(null);

  async function fetchProduct(id = null) {
    if (!id) return;

    setLoading(true);
    try {
      const response = await request(`products/${id}`);
      const data = await response.json();
      if (!data) return;
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (data?.category) {
      let categoryId = data?.category?.id;
      if (typeof data?.category === "string") categoryId = data?.category;
      request(`categories/${categoryId}`).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setCategory(data);
          });
        }
      });
    }

    if (data?.brand) {
      let brandId = data?.brand?.id;
      if (typeof data?.brand === "string") brandId = data?.brand;
      request(`brands/${brandId}`).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setBrand(data);
          });
        }
      });
    }
  }, [data?.brand, data?.brand_id, data?.category, data?.category_id, request]);

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        <div className="flex gap-2 items-center">
          <PlayPause
            play={data?.active}
            onPlay={async (e) => {
              try {
                await request(`products/${data?.id}/activate`, {
                  method: "PATCH",
                });
                await fetchProduct(data?.id); // We are not changing order with updated_at that is why does not require re render
              } catch (error) {
                console.error(error);
              }
            }}
            onPause={async (e) => {
              try {
                await request(`products/${data?.id}/deactivate`, {
                  method: "PATCH",
                });
                await fetchProduct(data?.id); // We are not changing order with updated_at that is why does not require re render
              } catch (error) {
                console.error(error);
              }
            }}
          />
          <Link
            to={`/products/edit/${data?.id}`}
            className="text-orange-500 hover:text-orange-700"
          >
            <Edit2 size="22" className="text-orange-600" variant="Bold" />
          </Link>
          <button
            onClick={() => openModal(data?.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash size="22" className="text-red-600" variant="Bold" />
          </button>
        </div>
      </td>
      <td className="px-4 py-2 md:px-6 border-b capitalize">
        <div className="flex items-center justify-between gap-5">
          <div>{data?.priority || 0}</div>
          <div className="flex gap-1">
            <button
              onClick={() => handlePriority(data.id)}
              className="size-7 flex items-center justify-center text-[#6CB93B] rounded"
            >
              <Edit className="size-4" />
            </button>
          </div>
        </div>
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {data?.images?.[0] && (
          <img
            src={srcBuilder(data?.images?.[0])}
            alt={data?.name}
            className="h-12 w-12 object-cover border"
          />
        )}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b capitalize whitespace-nowrap">
        {data?.name}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b capitalize whitespace-nowrap">
        {brand?.name}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b capitalize">
        {data?.color}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b capitalize whitespace-nowrap">
        {category?.name}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {parseFloat(data?.price)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {parseFloat(data?.regular_price)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b whitespace-nowrap">
        {parseInt(data?.weight)} {data?.unit}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {parseInt(data?.points)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {parseInt(data?.points_max)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {parseInt(data?.quantity)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b">
        {data?.active === false ? "Inactive" : "Active"}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b whitespace-nowrap">
        {formatDate(product?.created_at)}
      </td>
      <td className="px-4 py-2 md:px-6 md:py-2 border-b whitespace-nowrap">
        {formatDate(product?.updated_at)}
      </td>
    </tr>
  );
};

const Products = () => {
  const limit = 10;
  const { request } = useContext(FetchContext);
  const params = useParams();
  const page = parseInt(params?.page) || 1; // Ensure page is an integer
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]); // Initialize as an empty array
  const [searchText, setSearchText] = useState("");
  const [response, setResponse] = useState({ data: [], count: 0 });
  const [loading, setLoading] = useState(false);

  // Fetch products with pagination
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const qp = {
        include_category: false,
        include_brand: false,
      };
      if (page) qp.skip = (page - 1) * limit;
      if (limit) qp.limit = limit;

      const res = await request(
        `products?${new URLSearchParams(qp).toString()}`
      );
      const json = await res.json();
      const { data, count } = json;

      if (Array.isArray(data)) {
        setResponse({ data, count });
        setFilteredProducts(data); // Set filteredProducts initially to the fetched products
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, request]);

  // Fetch products when component mounts or when page changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, page]);

  const doSearch = async (e) => {
    e.preventDefault();
    try {
      if (!searchText.trim()) return;
      const res = await request(`search?q=${searchText}`);
      const product = await res.json();
      if (!product) {
        throw new Error("No product found");
      }
      setFilteredProducts(product.data);
    } catch (error) {
      console.error("Error fetching filtered data:", error);
    }
  };

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handlePriority = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <div className="w-full flex flex-wrap gap-2 items-start md:items-center">
        <div className="flex-grow">
          <h1 className="text-xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            Total Products: {response.count}
          </p>
        </div>
        <div className="w-full max-w-lg flex items-center gap-3">
          <SearchBar
            searchText={searchText}
            handleSearch={setSearchText}
            doSearch={doSearch}
          />
          <Link
            to="/products/add-product"
            className="text-sm font-medium bg-main-5 text-white text-center px-4 py-2.5 rounded-md"
          >
            Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : response.count > 0 ? (
        <>
          <div className="mt-4 w-full overflow-x-auto">
            <table className="min-w-[1200px] lg:min-w-full bg-white border">
              <thead>
                <tr>
                  {[
                    "Action",
                    "Priority",
                    "Banner",
                    "Name",
                    "Brand",
                    "Color",
                    "Category",
                    "Price",
                    "Regular Price",
                    "Weight",
                    "Earn Points",
                    "Used Points Max",
                    "Quantity",
                    "Status",
                    "Ceated At",
                    "Updated At",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700 whitespace-nowrap"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductRow
                      key={product.id}
                      product={product}
                      openModal={handleOpen}
                      handlePriority={handlePriority}
                    />
                  ))
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

          <Pagination
            endPoint="products"
            currentPage={page}
            totalPages={response.count ? Math.ceil(response.count / limit) : 1}
          />

          <DeleteConfirmModal
            open={open}
            handleOpen={() => handleOpen(null)}
            onCollapse={() => setOpen(false)}
            itemId={selectedItemId}
            onDelete={() => handleDelete(selectedItemId)}
          />

          {/* Add Priority Modal */}
          <AddPriorityModal
            isOpen={isModalOpen}
            onClose={closeModal}
            productId={selectedProduct}
            fetchProducts={fetchProducts}
          />
        </>
      ) : (
        <p>No products found.</p>
      )}
    </>
  );
};

export default Products;
