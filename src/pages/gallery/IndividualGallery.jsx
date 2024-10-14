import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FetchContext from "../../context/FetchContext";
import { UPLOADS_URL } from "../../utils/API";

const IndividualGallery = () => {
  const params = useParams();
  const slug = params.slug.toLowerCase();
  const [gallery, setGallery] = useState([]);
  const { request } = useContext(FetchContext);
  const fetchGallery = async () => {
    try {
      if (!slug) return;
      if (slug === "Default") {
        const response = await request("gallery");
        const json = await response.json();
        if (!json) return;
        setGallery(json);
        return;
      } else {
        const response = await request(`gallery/${slug.toLowerCase()}`);
        const json = await response.json();
        if (!json) return;
        setGallery(json);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);
  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 text-black border-2 border-black px-2 py-2 rounded-md text-sm hover:bg-black hover:text-white transition-all duration-500"
        >
          <i className="fa-solid fa-hand-point-left"></i>
        </button>
        <div>
          <h1 className="text-xl font-bold">
            {slug.charAt(0).toUpperCase() + slug.slice(1)} Gallery (
            {gallery.length})
          </h1>
          <p className="text-sm text-gray-500">
            You can find all the images from here.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
        {gallery.length > 0 ? (
          gallery.map((image, index) => {
            if (!image) return;

            let url = UPLOADS_URL;
            if (slug === "products") {
              url += image;
            } else {
              url += slug + "/" + image;
            }

            return (
              <div
                className="aspect-video border rounded-lg overflow-hidden"
                key={index}
              >
                <img
                  src={url}
                  alt={image}
                  className="w-full h-full object-cover"
                />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No images found</p>
        )}
      </div>
    </>
  );
};

export default IndividualGallery;
