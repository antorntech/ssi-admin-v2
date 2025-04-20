/* eslint-disable react/prop-types */
import { twMerge } from "tailwind-merge";

const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "medium",
  ...props
}) => {
  return (
    <button
      className={twMerge(
        "rounded focus:outline-none focus:ring ring-green-200 transition duration-200 whitespace-nowrap",
        {
          small: "px-2 py-1 text-sm",
          medium: "px-4 py-2 text-md",
          large: "px-6 py-3 text-lg",
        }[size],
        {
          primary: "bg-green-500 text-white hover:bg-green-600",
          secondary: "bg-gray-500 text-white hover:bg-gray-600",
          danger: "bg-red-500 text-white hover:bg-red-600",
          outline:
            "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
        }[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
