/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import "./AddProductsModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";
import Loader from "../../loader/Loader";
import ArrayValidator from "../../components/shared/ArrayValidator";
import Button from "../../components/shared/Button";

const ModalLoader = () => {
  return <div class="modal-loader"></div>;
};

const AddProductsModal = ({
  isOpen,
  onClose = () => {},
  gift = {},
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
      const tuple = new Set(selectedProducts).add(id);
      setSelectedProducts([...tuple]);
    } else {
      const products = selectedProducts.filter((item) => item !== id);
      setSelectedProducts(products);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="product-modal">
      <div className="product-modal-content clear-start py-4 space-y-2 flex flex-col">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setLoading(true);
              const response = await request(`gifts/${giftData?.id}/products`, {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ products: selectedProducts }),
              });
              const data = await response.json();
              if (data?.id) {
                setGiftData(data);
                fetchGifts();
                onClose();
              }
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-4 flex-grow flex flex-col px-4 overflow-hidden"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-4" title={giftData?.id}>
              Add Products
            </h2>
            <button onClick={onClose} className="close-button" type="button">
              <Add size="24" className="text-white rotate-45" />
            </button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <ModalLoader />
              </div>
            ) : (
              <ArrayValidator
                list={products}
                fallback={<p>No products available.</p>}
              >
                {products?.map((product, index) => (
                  <div
                    key={product?.id || index}
                    className="flex items-center py-1.5"
                  >
                    <input
                      type="checkbox"
                      id={product?.id}
                      name={product?.id}
                      value={product?.id}
                      className="mr-3 size-4"
                      checked={selectedProducts?.includes(product?.id)}
                      onChange={onChange}
                    />
                    <label htmlFor={product?.id} className="text-md">
                      {product?.name}
                    </label>
                  </div>
                ))}
              </ArrayValidator>
            )}
          </div>
          <div>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductsModal;
