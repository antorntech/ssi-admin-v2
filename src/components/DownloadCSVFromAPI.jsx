import { useEffect, useRef, useState } from "react";
import Button from "./shared/Button";
import { unparse } from "papaparse";

const API_Allergyjom = import.meta.env.VITE_API_URL_ALLERGYJOM

const DownloadForm = ({ closeForm }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ offset: 0, limit: 100 });

    const fetchCustomers = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const queryParams = new URLSearchParams(form);
            const res = await fetch(`${API_Allergyjom}/api/v1/query?${queryParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json = await res.json();

            if (json.rows) {
                const csv = '\uFEFF' + unparse(json.rows);

                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const CSV_URL = URL.createObjectURL(blob);
                const tempLink = document.createElement("a");
                tempLink.href = CSV_URL;
                tempLink.setAttribute("download", `alergyjom_customers_${form.offset}-${form.limit}.csv`);
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                URL.revokeObjectURL(CSV_URL);

                closeForm();
            }

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={fetchCustomers} className="p-4 border rounded-md shadow-sm bg-white w-64 absolute top-full right-0 z-10 mt-2">
            <h5 className="block mb-2 font-medium">Download Range (e.g. 0-100):</h5>
            <div className="flex gap-3">
                <div>
                    <label className="text-sm" htmlFor="offset">Offset</label>
                    <input
                        type="text"
                        value={form.offset}
                        name="offset"
                        onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                        placeholder="e.g. 0"
                        className="border px-3 py-2 w-full rounded mb-3 text-sm"
                    />
                </div>
                <div>
                    <label className="text-sm" htmlFor="offset">Limit</label>
                    <input
                        type="text"
                        value={form.limit}
                        name="limit"
                        onChange={(e) => { setForm({ ...form, [e.target.name]: e.target.value }) }}
                        min={form.offset + 1}
                        placeholder="e.g. 100"
                        className="border px-3 py-2 w-full rounded mb-3 text-sm"
                    />
                </div>
            </div>
            <Button type="submit">{loading ? "Downloading..." : "Download CSV"}</Button>
        </form>
    );
};

const DownloadCSVFromAPI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleForm = () => { setIsOpen(!isOpen); };
    const closeForm = () => { setIsOpen(false); };
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                closeForm();
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={ref}>
            <Button onClick={toggleForm}>Download</Button>
            {isOpen ? <DownloadForm closeForm={closeForm} /> : null}
        </div>
    );
};

export default DownloadCSVFromAPI;
