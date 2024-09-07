import { Route, Routes, useLocation } from "react-router-dom";
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
import BlogPosts from "./components/BlogPosts/BlogPosts";
// import { BounceLoader } from "react-spinners";
import { FadeLoader } from "react-spinners";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogPostDetails from "./pages/BlogPostDetails/BlogPostDetails";

function App() {
  const { handleHTTPRequestWithToken, setAdmin } = useContext(DataContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
          // navigate("/login");
          const { error } = await response.json();

          if (!isInitialLoad) {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        if (!isInitialLoad) {
          alert(`Your session has expired! ${error.message}`);
          console.log(`Your session has expired! ${error.message}`);
          setAdmin(null);
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
        <FadeLoader color={"#2e8fc0"} loading={isInitialLoad} size={40} />
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Users route */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/study-abroad" element={<StudyAbroad />} />
            <Route path="/study-abroad/:id" element={<BlogPostDetails />} />
            <Route path="/stay-motivated" element={<StayMotivated />} />
            <Route path="/stay-motivated/:id" element={<BlogPostDetails />} />
            <Route path="/lifestyle-and-health" element={<LifestyleAndHealth />} />
            <Route path="/lifestyle-and-health/:id" element={<BlogPostDetails />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Admin routes */}
          {/* <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="create-blog-post" element={<CreatePost />} />
            <Route path="blog-posts" element={<BlogPosts />} />
            <Route path="preview" element={<Preview />} />
            <Route path="password" element={<Password />} />
          </Route> */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="create-blog-post" element={<CreatePost />} />
            <Route path="blog-posts" element={<BlogPosts />} />
            <Route path="preview" element={<Preview />} />
            <Route path="password" element={<Password />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
