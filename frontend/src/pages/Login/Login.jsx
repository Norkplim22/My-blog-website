/* eslint-disable react/no-unescaped-entities */
import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import "./Login.css";

function Login() {
  const [loginInputs, setLoginInputs] = useState({});
  const { setAdmin } = useContext(DataContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setLoginInputs({ ...loginInputs, [e.target.name]: e.target.value });
  }

  function toggleOldPasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const admin = {
      email: loginInputs.email,
      password: loginInputs.password,
    };

    const settings = {
      body: JSON.stringify(admin),
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
      credentials: "include",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/admin/login`, settings);

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        toast.success("You have logged in successfully.");
        navigate("/dashboard");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }

    setLoginInputs({});
  }

  return (
    <AnimatedPage>
      <div className="login-page">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" name="email" value={loginInputs.email || ""} onChange={handleChange} />
          </label>
          <label>
            Password
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginInputs.password || ""}
                onChange={handleChange}
                className="password-input"
              />
              <span className="password-toggle-icon" onClick={toggleOldPasswordVisibility}>
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </span>
            </div>
          </label>
          <button>Submit</button>
        </form>
        <p>
          Don't have an account? <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </AnimatedPage>
  );
}

export default Login;
