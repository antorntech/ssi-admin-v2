import React from "react";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter
} from "@material-tailwind/react";
import { toast } from "react-toastify";

export function DeleteConfirmModal({
  open,
  handleOpen,
  itemId,
  onDelete,
  itemName
}) {
  console.log(itemId);
  const handleDelete = () => {
    // Perform deletion from local storage
    let storedItems = JSON.parse(localStorage.getItem(`${itemName}`)) || [];
    storedItems = storedItems.filter((item) => item.id !== itemId);
    localStorage.setItem(`${itemName}`, JSON.stringify(storedItems));

    // Notify user
    toast.success("Successfully Deleted!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });

    // Close modal and trigger a callback to refresh the blog list
    handleOpen();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Dialog open={open} handler={handleOpen}>
      <div className="flex items-center gap-1 p-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-8 text-red-800"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-xl font-bold text-black">
          Do you want to delete this?
        </h1>
      </div>
      <DialogBody>
        After clicking the confirm button, the data will be deleted permanently.
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="black"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="red" onClick={handleDelete}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
