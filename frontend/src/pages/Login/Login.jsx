import { useContext, useState } from "react";
import { DataContext } from "../../context/DataContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const [loginInputs, setLoginInputs] = useState({});
  const { setAdmin } = useContext(DataContext);
  const navigate = useNavigate();

  function handleChange(e) {
    setLoginInputs({ ...loginInputs, [e.target.name]: e.target.value });
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
      const response = await fetch(`http://localhost:3003/admin/login`, settings);

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

    setLoginInputs({});
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={loginInputs.email || ""} onChange={handleChange} />
        </label>
        <label>
          Password
          <input type="password" name="password" value={loginInputs.password || ""} onChange={handleChange} />
        </label>
        <button>Submit</button>
      </form>
    </div>
  );
}

export default Login;
