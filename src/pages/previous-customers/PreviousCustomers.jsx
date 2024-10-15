import React, { useContext, useEffect, useState } from "react";
import SearchBar from "../../components/searchbar/SearchBar";
import { Link, useParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import FetchContext from "../../context/FetchContext";

const PreviousCustomers = () => {
  const params = useParams();
  const page = params?.page || 1;
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [response, setResponse] = useState({ data: [], count: 0 });
  const { request } = useContext(FetchContext);

  // const fetchCustomers = async () => {
  //   try {
  //     const response = await request(`users?skip=${(page - 1) * 5}&limit=5`);
  //     const json = await response.json();
  //     console.log(json);
  //     const { data, count } = json;
  //     if (!data) return;
  //     setResponse((prev) => ({ ...prev, data, count }));
  //     setCustomers(data);
  //   } catch (error) {
  //     console.error;
  //   }
  // };

  // useEffect(() => {
  //   fetchCustomers();
  // }, [page]);

  console.log(response);

  const handleOpen = () => setOpen(!open);

  const handleDelete = async (id) => {
    try {
      if (!id) throw new Error("Id is not defined");
      const response = await request(`products/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      setSelectedItemId(null);
      // fetchCustomers();
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
                Earned Points
              </th>
              <th className="px-4 md:px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                Address
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr
                key={customer?.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.name}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.email ? (
                    <Link
                      to={`mailto:${customer?.email}`}
                      className="hover:underline"
                    >
                      {customer?.email}
                    </Link>
                  ) : null}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.phone ? (
                    <Link
                      to={`tel:${customer?.phone}`}
                      className="hover:underline"
                    >
                      {customer?.phone}
                    </Link>
                  ) : null}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.points || 0}
                </td>
                <td className="px-4 py-2 md:px-6 md:py-4 border-b capitalize">
                  {customer?.address}
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

export default PreviousCustomers;
