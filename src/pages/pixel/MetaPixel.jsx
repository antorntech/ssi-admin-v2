import moment from "moment";
import { useContext, useEffect, useState } from "react";
import FetchContext from "../../context/FetchContext";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import { Trash } from "iconsax-react";

const MetaPixel = () => {
  const [metaId, setMetaId] = useState("");
  const [metaData, setMetaData] = useState([]);
  const { request } = useContext(FetchContext);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  // Fetch metaPixels
  const fetchMetaPixels = async () => {
    try {
      const res = await request("pixel-id");
      const json = await res.json();
      const { data } = json;

      if (Array.isArray(data)) {
        setMetaData(data);
      }
    } catch (error) {
      console.error("Error fetching metaPixels:", error);
    } finally {
      console.log("MetaPixels fetched");
    }
  };

  // Fetch products when component mounts or when page changes
  useEffect(() => {
    fetchMetaPixels();
  }, []);

  const onChange = (e) => {
    const { value } = e.target;
    setMetaId(value.replace(/\D+$/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      pixel_id: metaId,
    };

    try {
      const response = await request("pixel-id", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setMetaId("");
      fetchMetaPixels();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");

      const res = await request(`pixel-id/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMetaPixels(); // Refetch metaPixels after successful deletion
        setOpen(false);
      }
    } catch (error) {
      console.error("Error deleting metaPixel:", error);
    }
  };

  // Toggle delete confirmation modal
  const handleOpen = (id = null) => {
    setSelectedItemId(id);
    setOpen(!open);
  };

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Meta Pixel</h2>
        <form onSubmit={handleSubmit} className="flex space-x-4">
          <input
            type="text"
            name="pixel_id"
            value={metaId}
            onChange={onChange}
            className="w-full lg:w-[300px] py-[8px] pl-[12px] border border-gray-300 bg-white text-gray-900 rounded-md focus:outline-none  focus:ring-border-none focus:border-[#6CB93B] focus:border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
            placeholder="Meta Pixel ID"
            required
            minLength={15}
            maxLength={15}
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
                    {meta?.pixel_id}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b whitespace-nowrap">
                    {moment(meta.createdAt).format("Do MMM, YYYY")}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                    <button onClick={() => handleOpen(meta.id)} className="">
                      <Trash
                        size="22"
                        className="text-red-600"
                        variant="Bold"
                      />
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
          <DeleteConfirmModal
            open={open}
            handleOpen={() => handleOpen(null)}
            onCollapse={() => setOpen(false)}
            itemId={selectedItemId}
            onDelete={() => handleDelete(selectedItemId)}
          />
        </div>
      </div>
    </div>
  );
};

export default MetaPixel;
