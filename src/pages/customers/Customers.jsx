import React, { useEffect, useState } from "react";
import SearchBar from "../../components/searchbar/SearchBar";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";

const Customers = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [customers, setCustomers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({ data: [], count: 0 });

  const fetchCustomers = async () => {
    try {
      const response = await request(
        `customers?skip=${(page - 1) * 5}&limit=5`
      );
      const json = await response.json();
      const { data, count } = json;
      if (!data) return;
      setResponse((prev) => ({ ...prev, data, count }));
      setCustomers(json.data);
    } catch (error) {
      console.error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  useEffect(() => {
    const filteredData = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setResponse((prev) => ({ ...prev, data: filteredData }));
  }, [searchText]);

  const handleOpen = () => setOpen(!open);

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`products/${id}`, { method: "DELETE" });
      setSelectedItemId(null);
      fetchCustomers();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500">
            Total Customers: {response?.count}
          </p>
        </div>
      </div>

      <div className="mt-5 w-full overflow-x-auto">
        <table className="min-w-[1200px] lg:min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Address
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {response?.data.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer.name}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer.email}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer.phone}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer.address}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b">
                  <Link
                    to={`/customers/edit/${customer.id}`}
                    className="text-orange-500 hover:text-orange-700"
                  >
                    <i className="fa-solid fa-pen-to-square mr-3 text-xl"></i>
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedItemId(customer.id);
                      handleOpen();
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <i className="fa-solid fa-trash-can text-xl"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        endPoint="customers"
        currentPage={page}
        totalPages={response.count ? Math.ceil(response.count / 5) : 0}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={open}
        handleOpen={handleOpen}
        onCollapse={() => setOpen(false)}
        itemId={selectedItemId}
        onDelete={() => handleDelete(selectedItemId)}
        itemName="Customer"
      />
    </>
  );
};

export default Customers;
