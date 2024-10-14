import { Button, Input, Typography } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL } from "../../utils/API";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Optimized validation function
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
      default:
        break;
    }

    return errorMessage;
  };

  const validateForm = () => {
    const emailError = validateField("email", email);
    const passwordError = validateField("password", password);

    const newErrors = {
      ...(emailError && { email: emailError }),
      ...(passwordError && { password: passwordError }),
    };

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length !== 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const url = `${API_URL}admin/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error("Invalid Credentials!", {
          autoClose: 1000,
        });
        throw new Error(data.message);
      }
      if (response.ok) {
        if (data.access_token) {
          localStorage.setItem("access_token", data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
      }
      window.location.href = "/";
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    name === "email" ? setEmail(value) : setPassword(value);
    // Clear error when the user starts typing
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
            <p className="text-sm text-[#6CB93B]">Login to continue to SSI.</p>
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
          <form onSubmit={handleLogin}>
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
            </div>
            <Button
              type="submit"
              className="py-3 mt-5 text-sm bg-[#6CB93B] hover:bg-green-700 transition-all duration-500"
              fullWidth
            >
              Log In
            </Button>
          </form>
        </div>
        <div className="flex flex-col gap-3 items-center justify-center my-6">
          <Link to="/auth/forgot-password" className="text-sm text-gray-600">
            <i className="fa-solid fa-lock mr-2" />
            <span>Forgot your password ?</span>
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <Typography
          variant="h6"
          color="black"
          className="mb-1 font-normal text-center"
        >
          Don&apos;t have an account?{" "}
          <Link
            to="/auth/signup"
            className="text-[#6CB93B] hover:text-green-700 transition-all duration-500"
          >
            Sign Up
          </Link>
        </Typography>
        <p className="text-gray-600 text-center text-sm">
          © SSI. Crafted with by ANTOR & SANTO
        </p>
      </div>
    </div>
  );
};

export default Login;
