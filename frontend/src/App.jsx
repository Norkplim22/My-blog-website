import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudyAbroad from "./pages/StudyAbroad/StudyAbroad";
import StayMotivated from "./pages/StayMotivated/StayMotivated";
import LifestyleAndHealth from "./pages/LifestyleAndHealth/LifestyleAndHealth";
import AboutUs from "./pages/AboutUs/AboutUs";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./components/DashboardLayout/DashboardLayout";
import CreatePost from "./components/CreatePost/CreatePost";
import Preview from "./components/Preview/Preview";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "./context/DataContext";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import Password from "./components/Password/Password";
import { BounceLoader } from "react-spinners";

function App() {
  const { handleHTTPRequestWithToken, setAdmin } = useContext(DataContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await handleHTTPRequestWithToken(`${import.meta.env.VITE_API}/admin/check-auth`, {
          credentials: "include",
        });

        if (response.ok) {
          const adminData = await response.json();
          setAdmin(adminData);
        } else {
          setAdmin(null);
          navigate("/login");
          const { error } = await response.json();

          if (!isInitialLoad) {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        if (!isInitialLoad) {
          alert(`Your session has expired! ${error.message}`);
          console.log(`Your session has expired! ${error.message}`);
        }
      } finally {
        setTimeout(() => {
          setIsInitialLoad(false); // Mark initial load as complete after delay
        }, 2000); //
      }
    }

    checkAuth();
  }, []);

  if (isInitialLoad) {
    return (
      <div className="loading-spinner">
        <BounceLoader color={"#2e8fc0"} loading={isInitialLoad} size={40} />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-blog-post" element={<CreatePost />} />
          <Route path="preview" element={<Preview />} />
          <Route path="password" element={<Password />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/stay-motivated" element={<StayMotivated />} />
          <Route path="/lifestyle-and-health" element={<LifestyleAndHealth />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
