import React, { useEffect, useState } from "react";
import { DeleteConfirmModal } from "../../components/DeleteConfirmModal";
import Pagination from "../../components/pagination/Pagination";
import SearchBar from "../../components/searchbar/SearchBar"; // Make sure you have this component
import Loader from "../../loader/Loader";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchText, setSearchText] = useState(""); // State for search text
  const [filteredOrders, setFilteredOrders] = useState([]); // State for filtered orders
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Items per page for pagination

  useEffect(() => {
    // Fake data for orders
    const fakeOrders = [
      {
        id: 1,
        productName: "Product 1",
        customer: "Customer 1",
        price: 100,
        quantity: 2,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
      {
        id: 2,
        productName: "Product 2",
        customer: "Customer 2",
        price: 150,
        quantity: 1,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
      // Add more fake orders as needed
      {
        id: 3,
        productName: "Product 3",
        customer: "Customer 3",
        price: 200,
        quantity: 3,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
      {
        id: 4,
        productName: "Product 4",
        customer: "Customer 4",
        price: 250,
        quantity: 4,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
      {
        id: 5,
        productName: "Product 5",
        customer: "Customer 5",
        price: 300,
        quantity: 5,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
      {
        id: 6,
        productName: "Product 6",
        customer: "Customer 6",
        price: 350,
        quantity: 6,
        status: "pending",
        createdAt: "2nd October, 2024",
        updatedAt: "2nd October, 2024",
      },
    ];

    setOrders(fakeOrders);
    setFilteredOrders(fakeOrders); // Initialize filteredOrders with all orders
  }, []);

  // Update filtered orders when searchText changes
  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when orders are filtered
  }, [searchText, orders]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleDelete = () => {
    setOrders(orders.filter((order) => order.id !== selectedOrderId));
    setOpen(false); // Close the modal after deletion
  };

  const handleOpen = (id) => {
    setSelectedOrderId(id);
    setOpen(true);
  };

  const handleConfirm = (id) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id
          ? {
              ...order,
              status: order.status === "pending" ? "completed" : "pending",
            }
          : order
      )
    );
  };

  return (
    <div>
      <div className="w-full flex flex-col md:flex-row items-start md:items-center md:justify-between">
        <div>
          <h1 className="text-xl font-bold">Orders</h1>
          <p className="text-sm text-gray-500">
            orders are{" "}
            {orders.length > 0 && filteredOrders.length > 0 ? "" : "not"}{" "}
            available here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SearchBar searchText={searchText} handleSearch={setSearchText} />
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead>
                <tr>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Product Name
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Customer
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Quantity
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Created At
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Updated At
                  </th>
                  <th className="px-6 py-3 border-b text-left text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 border-b">{order.id}</td>
                    <td className="px-6 py-4 border-b">{order.productName}</td>
                    <td className="px-6 py-4 border-b">{order.customer}</td>
                    <td className="px-6 py-4 border-b">${order.price}</td>
                    <td className="px-6 py-4 border-b">{order.quantity}</td>
                    <td className="px-6 py-4 border-b">
                      {order.status === "pending" ? (
                        <span className="px-2 py-1 text-white rounded-md bg-cyan-300">
                          Pending
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-white rounded-md bg-green-300">
                          Completed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b">{order.createdAt}</td>
                    <td className="px-6 py-4 border-b">{order.updatedAt}</td>
                    <td className="px-6 py-4 border-b flex items-center gap-3">
                      <button
                        onClick={() => handleConfirm(order.id)}
                        className={
                          order.status === "pending"
                            ? "text-cyan-500 font-bold rounded"
                            : "text-green-500 font-bold rounded"
                        }
                      >
                        {order.status === "pending" ? (
                          <i className="fa-regular fa-square-check text-2xl"></i>
                        ) : (
                          <i className="fa-regular fa-rectangle-xmark text-2xl"></i>
                        )}
                      </button>
                      <button
                        onClick={() => handleOpen(order.id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          )}

          {/* Delete Confirmation Modal */}
          <DeleteConfirmModal
            open={open}
            handleOpen={() => setOpen(false)}
            itemId={selectedOrderId}
            onDelete={handleDelete}
            itemName="order"
          />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Orders;
