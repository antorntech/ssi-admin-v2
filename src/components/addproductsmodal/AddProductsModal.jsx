/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import "./AddProductsModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";
import Loader from "../../loader/Loader";
import ArrayValidator from "../../components/shared/ArrayValidator";

const AddProductsModal = ({
  isOpen,
  onClose = () => {},
  gift,
  fetchGifts = () => {},
}) => {
  const [giftData, setGiftData] = useState(gift || {});
  const { request } = useContext(FetchContext);
  const modalRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(
    giftData?.products || []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalRef]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request("products?limit=100");
        const json = await response.json();
        setProducts(json.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Stop loading when the fetch is complete
      }
    };
    if (isOpen) {
      fetchProducts(); // Fetch products only when the modal is open
    }
  }, [isOpen, request]);

  const onChange = async (e) => {
    const { id, checked } = e.target;
    if (checked) {
      const products = [...selectedProducts, id].filter(Boolean);
      setSelectedProducts(products);

      try {
        setLoading(true);
        const response = await request(`gifts/${giftData?.id}/products/add`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products }),
        });
        const data = await response.json();
        setGiftData(data);
        fetchGifts();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      const products = selectedProducts.filter(Boolean);
      setSelectedProducts(products);

      try {
        setLoading(true);
        const response = await request(
          `gifts/${giftData?.id}/products/remove`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ products }),
          }
        );
        const data = await response.json();
        setGiftData(data);
        fetchGifts();
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal">
      <div className="product-modal-content clear-start p-5 md:px-10 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Add Products</h2>
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>

        {loading ? (
          <Loader />
        ) : (
          <>
            <ArrayValidator
              list={products}
              fallback={<p>No products available.</p>}
            >
              {products?.map((product, index) => (
                <div
                  key={product.id || index}
                  className="flex items-center py-1.5"
                >
                  <input
                    type="checkbox"
                    id={product.id}
                    name={product.name}
                    value={product.id}
                    className="mr-3 size-5"
                    checked={giftData?.products?.includes(product.id)}
                    onChange={onChange}
                  />
                  <label htmlFor={product.id} className="text-md md:text-lg">
                    {product.name}
                  </label>
                </div>
              ))}
            </ArrayValidator>
          </>
        )}
      </div>
    </div>
  );
};

export default AddProductsModal;
