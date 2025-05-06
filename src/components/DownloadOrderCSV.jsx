import { useEffect, useRef, useState } from "react";
import Button from "./shared/Button";
import { unparse } from "papaparse";

const API_Allergyjom = import.meta.env.VITE_API_URL_ALLERGYJOM

const DownloadForm = ({ closeForm }) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ offset: 0, limit: 100 });
    const [columns, setColumns] = useState({
        id: false,
        name: true,
        phone: true,
        address: false,
        problem: true,
        duration: true,
        created_at: false
    });

    const fetchCustomers = async (e) => {
        e.preventDefault();

        setLoading(true);
        try {
            const queryParams = new URLSearchParams(form);
            const res = await fetch(`${API_Allergyjom}/api/v1/order?${queryParams.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch data");

            const json = await res.json();
            if (!json.rows) throw new Error("Failed to fetch data");

            const filtered = (json.rows || []).map(item => {
                const row = {}
                // Total 8 Columns
                if (columns.id === true) { row.id = item.id }
                if (columns.name === true) { row.name = item.name }
                if (columns.phone === true) { row.phone = item.phone }
                if (columns.address === true) { row.address = item.address }
                if (columns.problem === true) { row.problem = item.problem }
                if (columns.duration === true) { row.duration = item.duration }
                if (columns.status === true) { row.status = item.status }
                if (columns.created_at === true) { row.created_at = item.created_at }
                if (columns.updated_at === true) { row.updated_at = item.updated_at }
                return row
            })

            // CSV
            const csv = '\uFEFF' + unparse(filtered);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const CSV_URL = URL.createObjectURL(blob);
            const tempLink = document.createElement("a");
            tempLink.href = CSV_URL;
            tempLink.setAttribute("download", `alergyjom_customers_${form.offset}-${form.limit}.csv`);
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(CSV_URL);
            // END CSV

            closeForm();

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={fetchCustomers} className="p-4 border rounded-md shadow-sm bg-white w-64 absolute top-full right-0 z-10 mt-2">
            <h5 className="block mb-2 font-medium">Download Range (e.g. 0-100):</h5>
            <div className="flex gap-2">
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
            <div className="w-full flex gap-x-4 gap-y-1 flex-wrap text-sm">
                {["id", 'name', 'phone', "address", "problem", "duration", "created_at"].map((field) => (
                    <label key={field}>
                        <input type="checkbox" name={field} checked={columns[field]} onChange={(e) => {
                            setColumns(prev => ({ ...prev, [e.target.name]: e.target.checked }))
                        }} />
                        <span className="ml-1 capitalize">{field}</span>
                    </label>
                ))}
            </div>
            <div className="mt-2">
                <Button type="submit">{loading ? "Downloading..." : "Download CSV"}</Button>
            </div>
        </form>
    );
};

const DownloadOrderCSV = () => {
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

export default DownloadOrderCSV;
