import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import FetchContext from "../../context/FetchContext";

const MetaPixel = () => {
  const [metaId, setMetaId] = useState("");
  const [metaData, setMetaData] = useState([]);
  const { request } = useContext(FetchContext);

  // Fetch products with pagination
  const fetchMetaPixels = async () => {
    try {
      const res = await request("meta-pixels");
      const json = await res.json();
      const { data } = json;

      if (Array.isArray(data)) {
        setMetaData(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      console.log("MetaPixels fetched");
    }
  };

  // Fetch products when component mounts or when page changes
  useEffect(() => {
    fetchMetaPixels();
  }, [metaData]);

  const handleInputChange = (e) => {
    setMetaId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^\d+$/.test(metaId)) {
      toast.error("Please enter a valid Meta ID", {
        autoClose: 1000,
      });
      setMetaId("");
      return;
    }

    const newMeta = {
      id: metaId,
      createdAt: new Date().toLocaleString(),
    };

    setMetaData((prevData) => [...prevData, newMeta]);
    setMetaId("");
  };

  const handleDelete = (id) => {
    setMetaData((prevData) => prevData.filter((meta) => meta.id !== id));
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Meta Pixel</h2>
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            value={metaId}
            onChange={handleInputChange}
            className="w-full lg:w-[300px] py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            placeholder="Enter Meta ID"
            required
          />
          <button
            type="submit"
            className="bg-[#6CB93B] text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">Meta Pixel List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                  MetaId
                </th>
                <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                  CreatedAt
                </th>
                <th className="px-4 py-2 md:px-6 md:py-4 border-b text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {metaData.map((meta) => (
                <tr key={meta.id}>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                    {meta.id}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                    {moment(meta.createdAt).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                    <button
                      onClick={() => handleDelete(meta.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {metaData.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetaPixel;
