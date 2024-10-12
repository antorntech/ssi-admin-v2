const endPoints = {
  products: "products",
  orders: "orders",
  points: "points",
  categories: "categories",
  brand: "brand",
  gifts: "gifts",
  admin: "admin",
};

let API_URL = import.meta.env.VITE_API_URL;
const UPLOADS_URL = API_URL + "uploads/";
if (!API_URL) throw new Error("API_URL is not defined");

API_URL += "api/v1/";

export { API_URL, endPoints, UPLOADS_URL };
