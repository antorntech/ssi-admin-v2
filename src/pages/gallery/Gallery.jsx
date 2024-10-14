import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FetchContext from "../../context/FetchContext";

const Gallery = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [defaultGallery, setDefaultGallery] = useState([]);
  const [brandsGallery, setBrandsGallery] = useState([]);
  const [categoryGallery, setCategoryGallery] = useState([]);
  const [productsGallery, setProductsGallery] = useState([]);
  const [giftsGallery, setGiftsGallery] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  const fetchDefaultGallery = async () => {
    try {
      const response = await request("gallery");
      const json = await response.json();
      if (!json) return;
      setDefaultGallery(json);
    } catch (error) {
      console.error;
    }
  };

  const fetchBrandsGallery = async () => {
    try {
      const response = await request("gallery/brands");
      const json = await response.json();
      if (!json) return;
      setBrandsGallery(json);
    } catch (error) {
      console.error;
    }
  };

  const fetchCategoryGallery = async () => {
    try {
      const response = await request("gallery/categories");
      const json = await response.json();
      if (!json) return;
      setCategoryGallery(json);
    } catch (error) {
      console.error;
    }
  };

  const fetchProductsGallery = async () => {
    try {
      const response = await request("gallery/products");
      const json = await response.json();
      if (!json) return;
      setProductsGallery(json);
    } catch (error) {
      console.error;
    }
  };

  const fetchGiftsGallery = async () => {
    try {
      const response = await request("gallery/gifts");
      const json = await response.json();
      if (!json) return;
      setGiftsGallery(json);
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    fetchDefaultGallery();
    fetchBrandsGallery();
    fetchCategoryGallery();
    fetchProductsGallery();
    fetchGiftsGallery();
  }, [page]);

  const totalGallery = [
    {
      title: "Default",
      data: defaultGallery,
    },
    {
      title: "Brands",
      data: brandsGallery,
    },
    {
      title: "Categories",
      data: categoryGallery,
    },
    {
      title: "Products",
      data: productsGallery,
    },
    {
      title: "Gifts",
      data: giftsGallery,
    },
  ];

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Galleries</h1>
          <p className="text-sm text-gray-500">
            Total Galleries:{" "}
            {defaultGallery.length +
              brandsGallery.length +
              categoryGallery.length +
              productsGallery.length +
              giftsGallery.length}
          </p>
        </div>
      </div>

      <div className="mt-5 w-full h-full">
        <div className="grid grid-cols-3 xl:grid-cols-12 gap-5 w-full h-full">
          {totalGallery.map((gallery, index) => (
            <div key={index} className="relative">
              <span className="font-bold ml-2">{gallery?.title}</span>
              <Link to={`/gallerys/${gallery?.title}`}>
                <img
                  src="/img/icons/folder.png"
                  className="w-full h-full object-contained cursor-pointer"
                  alt=""
                />
              </Link>
              <span className="absolute bottom-0 left-3 text-[1.5rem] text-white">
                {gallery?.data?.length}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;