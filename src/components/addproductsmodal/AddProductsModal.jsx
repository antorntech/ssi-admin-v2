/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/prop-types */
import { useContext, useEffect, useRef, useState } from "react";
import "./AddProductsModal.css";
import { Add } from "iconsax-react";
import FetchContext from "../../context/FetchContext";

const AddProductsModal = ({
  isOpen,
  onClose = () => {},
  gift,
  fetchGifts = () => {},
}) => {
  if (!isOpen) return null;
  const { request } = useContext(FetchContext);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, [modalRef]);

  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  console.log(selectedProducts);

  const fetchProducts = async () => {
    try {
      const response = await request("products?limit=100");
      const json = await response.json();
      setProducts(json.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onSubmit = async (e) => {
    try {
      const response = await request("gifts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      fetchGifts();
      onClose();
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  return (
    <div className="product-modal">
      <div className="product-modal-content clear-start p-5 md:px-10 space-y-2">
        <h2 className="text-2xl font-semibold mb-4">Add Products</h2>
        <button onClick={onClose} className="close-button">
          <Add size="24" className="text-white rotate-45" />
        </button>
        <>
          {products.map((product) => (
            <div key={product.id} className="flex items-center py-1.5">
              <input
                type="checkbox"
                id={product.id}
                name={product.name}
                value={product.id}
                className="mr-3 size-5"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts([...selectedProducts, product.id]);
                  } else {
                    setSelectedProducts(
                      selectedProducts.filter((id) => id !== product.id)
                    );
                  }
                }}
              />
              <label htmlFor={product.id} className="text-md md:text-lg">
                {product.name}
              </label>
            </div>
          ))}
        </>
      </div>
    </div>
  );
};

export default AddProductsModal;
