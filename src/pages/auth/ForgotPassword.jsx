import React from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "email" ? setEmail(value) : setEmail(value);

    // Clear error when the user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validateField = (fieldName, value) => {
    let errorMessage = "";

    switch (fieldName) {
      case "email":
        if (!value) {
          errorMessage = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMessage = "Email address is invalid.";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const validateForm = () => {
    const emailError = validateField("email", email);

    const newErrors = {
      ...(emailError && { email: emailError }),
    };

    return newErrors;
  };

  const handleReset = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      // Send email request
      console.log("Email:", email);

      toast.success("Successfully Reset Password!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      setErrors(formErrors);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-5 bg-[#F8F8FB]">
      <div className="w-96 max-w-screen-lg sm:w-[450px] mx-auto bg-white rounded-md custom-shadow">
        <div className="flex items-start justify-between bg-[#bde0a8] rounded-t-md">
          <div className="w-1/2 p-3 lg:p-5">
            <h2 className="text-md md:text-lg text-[#6CB93B] font-semibold">
              Reset Password
            </h2>
            <p className="text-sm text-[#6CB93B]">Reset Password with SSI.</p>
          </div>
          <div className="w-1/2">
            <img
              src="/img/profile-img.png"
              alt=""
              className="w-full object-contain"
            />
          </div>
        </div>
        <div className="px-3 md:px-5 py-6">
          <div className="mb-4 bg-[#bde0a8] border-[1px] border-[#6bb93b75] text-center p-3 rounded-md">
            <p className="text-sm">
              Enter your Email and instructions will be sent to you!
            </p>
          </div>
          <form onSubmit={handleReset}>
            <div>
              <div className="relative">
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-1 font-normal"
                >
                  Email
                </Typography>
                <Input
                  type="text"
                  size="md"
                  className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                  labelProps={{
                    className: "before:content-none after:content-none",
                  }}
                  value={email}
                  name="email"
                  onChange={handleChange}
                />
                {errors.email && (
                  <Typography className="text-red-800 text-sm mt-1">
                    {errors.email}
                  </Typography>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="float-right mb-6 py-3 mt-5 text-sm bg-[#6CB93B] hover:bg-green-700 transition-all duration-500"
            >
              Reset
            </Button>
          </form>
        </div>
      </div>
      <div className="mt-6">
        <Typography
          variant="h6"
          color="black"
          className="mb-1 font-normal text-center"
        >
          Remember It ?{" "}
          <Link
            to="/login"
            className="text-[#6CB93B] hover:text-green-700 transition-all duration-500"
          >
            Login here
          </Link>
        </Typography>
        <p className="text-gray-600 text-center text-sm">
          © SSI. Crafted with by ANTOR & SANTO
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
