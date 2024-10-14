import { useContext, useEffect, useState } from "react";
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
  const { request } = useContext(FetchContext);

  const fetchDefaultGallery = async () => {
    try {
      const response = await request("gallery");
      const json = await response.json();
      if (!json) return;
      setDefaultGallery(json);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBrandsGallery = async () => {
    try {
      const response = await request("gallery/brands");
      const json = await response.json();
      if (!json) return;
      setBrandsGallery(json);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategoryGallery = async () => {
    try {
      const response = await request("gallery/categories");
      const json = await response.json();
      if (!json) return;
      setCategoryGallery(json);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProductsGallery = async () => {
    try {
      const response = await request("gallery/products");
      const json = await response.json();
      if (!json) return;
      setProductsGallery(json);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchGiftsGallery = async () => {
    try {
      const response = await request("gallery/gifts");
      const json = await response.json();
      if (!json) return;
      setGiftsGallery(json);
    } catch (error) {
      console.error(error);
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

      <div className="mt-5">
        <div className="flex gap-5">
          {totalGallery.map((gallery, index) => (
            <Link to={`/gallerys/${gallery?.title}`} key={index} className="hover:text-green-600">
              <span className="font-bold ml-2">{gallery?.title}</span>
              <div className="relative block h-32">
                <img
                  src="/img/icons/folder.png"
                  className="w-full h-full object-contained"
                  alt=""
                  loading="lazy"
                />
                <span className="absolute bottom-5 left-5 text-[1.5rem] text-white">
                  {gallery?.data?.length}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Gallery;
