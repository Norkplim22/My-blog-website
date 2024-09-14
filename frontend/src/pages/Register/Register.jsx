import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from "react-hot-toast";
import "./Register.css";

function Register() {
  const [registerInputs, setRegisterInputs] = useState({});
  const { setAdmin } = useContext(DataContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setRegisterInputs({ ...registerInputs, [e.target.name]: e.target.value });
  }

  function toggleOldPasswordVisibility() {
    setShowPassword(!showPassword);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newAdmin = {
      firstname: registerInputs.firstname,
      lastname: registerInputs.lastname,
      email: registerInputs.email,
      password: registerInputs.password,
    };

    const settings = {
      body: JSON.stringify(newAdmin),
      headers: {
        "Content-Type": "application/JSON",
      },
      method: "POST",
      credentials: "include",
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/admin/register`, settings);

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        toast.success("You have registered successfully.");
        navigate("/dashboard");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }

    setRegisterInputs({});
  }

  return (
    <AnimatedPage>
      <div className="register-page">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Firstname
            <input type="text" name="firstname" value={registerInputs.firstname || ""} onChange={handleChange} />
          </label>
          <label>
            Lastname
            <input type="text" name="lastname" value={registerInputs.lastname || ""} onChange={handleChange} />
          </label>
          <label>
            Email
            <input type="email" name="email" value={registerInputs.email || ""} onChange={handleChange} />
          </label>
          <label>
            Password
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={registerInputs.password || ""}
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
          Already have an account? <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </div>
    </AnimatedPage>
  );
}

export default Register;
