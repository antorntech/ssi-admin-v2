/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext";
import { useParams } from "react-router-dom";
import cn from "../../utils/cn";
import Pagination from "../../components/pagination/Pagination";
import { formatDate } from "../../utils/date";

const WithdrawalRow = ({ data, status = [] }) => {
  const [customer, setCustomer] = useState(null);
  const [withdrawal, setWithdrawal] = useState(data);
  const { request } = useFetch();

  useEffect(() => {
    if (!data?.customer_id) return;
    async function fetchCustomer() {
      try {
        const response = await request(`users/${data?.customer_id}`);
        const resData = await response.json();
        setCustomer(resData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchCustomer();
  }, [data?.customer_id, request]);

  const switchStatus = (id, status) => {
    request(`withdrawal/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);
        return res.json();
      })
      .then(() => {
        request(`withdrawal/${id}`)
          .then((res) => res.json())
          .then((data) => {
            setWithdrawal(data);
          });
      })
      .catch((error) => console.error("Error updating order:", error));
  };

  const statusClasses = {
    pending: "bg-cyan-400 text-white",
    processing: "bg-yellow-400 text-black",
    paid: "bg-green-600 text-white",
    canceled: "bg-red-400 text-white",
  };

  return (
    <tr className="border-b hover:bg-gray-100">
      <td className="px-4 py-2 capitalize whitespace-nowrap">
        {customer?.name}
      </td>
      <td className="px-4 py-2 capitalize whitespace-nowrap">
        {customer?.email}
      </td>
      <td className="px-4 py-2 capitalize">{customer?.phone}</td>
      <td className="px-4 py-2 capitalize">{withdrawal?.amount}</td>
      <td className="px-4 py-2 capitalize whitespace-nowrap">
        {formatDate(withdrawal?.created_at)}
      </td>
      <td className="px-4 py-2 capitalize whitespace-nowrap">
        {formatDate(withdrawal?.updated_at)}
      </td>
      <td className="px-4 py-2 capitalize">
        <select
          className={cn(
            "capitalize border rounded-md px-2 py-2",
            statusClasses[withdrawal?.status]
          )}
          value={withdrawal?.status}
          onChange={(e) => switchStatus(withdrawal?.id, e.target.value)}
        >
          {status?.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};

const Withdrawal = () => {
  const [response, setResponse] = useState(null);
  const { request } = useFetch();
  const params = useParams();
  const page = params?.page || 1;
  const limit = 10;
  const [status, setStatus] = useState(null);

  const fetchWithdrawals = useCallback(
    async function (page) {
      try {
        const response = await request(
          `withdrawal?skip=${(page - 1) * limit}&limit=${limit}`
        );
        const data = await response.json();
        setResponse(data);
      } catch (error) {
        console.error(error);
      }
    },
    [request, limit]
  );

  useEffect(() => {
    fetchWithdrawals(page);

    async function fetchStatus() {
      try {
        const response = await request(`withdrawal/status`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchStatus();
  }, [fetchWithdrawals, page, request]);

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 items-start md:items-center mb-4">
        <div className="flex-grow">
          <h1 className="text-xl font-bold">Withdrawal</h1>
          <p className="text-sm text-gray-500">
            Total Applications: {response?.count}
          </p>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Created At
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
              <th className="px-4 py-2 border-b text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {response?.data?.map((item) => {
              return (
                <WithdrawalRow key={item?.id} data={item} status={status} />
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        endPoint="withdrawal"
        currentPage={page}
        totalPages={response?.count ? Math.ceil(response?.count / limit) : 0}
      />
    </div>
  );
};

export default Withdrawal;
