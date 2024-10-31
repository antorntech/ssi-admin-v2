import { Button, Input, Typography } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/API";

const SignUp = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
      case "password":
        if (!value) {
          errorMessage = "Password is required.";
        } else if (value.length < 6) {
          errorMessage = "Password must be at least 6 characters.";
        }
        break;
      case "confirmPassword":
        if (!value) {
          errorMessage = "Confirm password is required.";
        } else if (value !== password) {
          errorMessage = "Passwords do not match.";
        }
        break;
      default:
        break;
    }

    return errorMessage;
  };

  const validateForm = () => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);
    const confirmPasswordError = validateField(
      "confirmPassword",
      confirmPassword
    );

    const newErrors = {
      ...(emailError && { email: emailError }),
      ...(passwordError && { password: passwordError }),
      ...(confirmPasswordError && { confirmPassword: confirmPasswordError }),
    };

    return newErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }

    try {
      const url = `${API_URL}admin/register`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.detail, {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        throw new Error(data.message);
      }
      if (response.ok) {
        toast.success("Successfully Signed Up!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        window.location.href = "/auth/login";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-5 bg-[#F8F8FB]">
      <div className="max-w-screen-lg sm:w-[450px] mx-auto bg-white rounded-md custom-shadow">
        <div className="flex items-start justify-between bg-[#bde0a8] rounded-t-md">
          <div className="w-1/2 p-3 lg:p-5">
            <h2 className="text-md md:text-lg text-[#6CB93B] font-semibold">
              Welcome Back !
            </h2>
            <p className="text-sm text-[#6CB93B]">SignUp to continue to SSI.</p>
            <img src="/img/logo.png" alt="" className="w-36 mt-2" />
          </div>
          <div className="w-1/2">
            <img
              src="/img/profile-img.png"
              alt=""
              className="w-full object-contain"
            />
          </div>
        </div>
        <div className="px-3 md:px-5 pt-4">
          <form onSubmit={handleSignUp}>
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
              <div className="relative mt-3">
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-1 font-normal"
                >
                  Password
                </Typography>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    size="md"
                    className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    value={password}
                    name="password"
                    onChange={handleChange}
                  />
                  <i
                    className={`absolute right-2 top-3 text-gray-600 cursor-pointer fa-solid ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    onClick={toggleShowPassword}
                  ></i>
                </div>
                {errors.password && (
                  <Typography className="text-red-800 text-sm mt-1">
                    {errors.password}
                  </Typography>
                )}
              </div>
              <div className="relative mt-3">
                <Typography
                  variant="h6"
                  color="black"
                  className="mb-1 font-normal"
                >
                  Confirm Password
                </Typography>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    size="md"
                    className="!border !border-gray-300 bg-white text-gray-900 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-[#6CB93B] focus:!border-t-border-[#6CB93B] focus:ring-border-[#199bff]/10"
                    labelProps={{
                      className: "before:content-none after:content-none",
                    }}
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={handleChange}
                  />
                  <i
                    className={`absolute right-2 top-3 text-gray-600 cursor-pointer fa-solid ${
                      showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                    }`}
                    onClick={toggleShowConfirmPassword}
                  ></i>
                </div>
                {errors.confirmPassword && (
                  <Typography className="text-red-800 text-sm mt-1">
                    {errors.confirmPassword}
                  </Typography>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="py-3 my-5 text-sm bg-[#6CB93B] hover:bg-green-700 transition-all duration-500"
              fullWidth
            >
              Sign Up
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
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-[#6CB93B] hover:text-green-700 transition-all duration-500"
          >
            Login
          </Link>
        </Typography>
        <p className="text-gray-600 text-center text-sm">
          © SSI. Crafted with by ANTOR & SANTO
        </p>
      </div>
    </div>
  );
};

export default SignUp;
