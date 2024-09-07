import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";
import "./Register.css";

function Register() {
  const [registerInputs, setRegisterInputs] = useState({});
  const { setAdmin } = useContext(DataContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setRegisterInputs({ ...registerInputs, [e.target.name]: e.target.value });
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
      const response = await fetch(`http://localhost:3003/admin/register`, settings);

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        navigate("/dashboard");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
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
            <input type="password" name="password" value={registerInputs.password || ""} onChange={handleChange} />
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
