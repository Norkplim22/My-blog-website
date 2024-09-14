import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import StudyAbroad from "./pages/StudyAbroad/StudyAbroad";
import StayMotivated from "./pages/StayMotivated/StayMotivated";
import LifestyleAndHealth from "./pages/LifestyleAndHealth/LifestyleAndHealth";
import About from "./pages/About/About";
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
import Profile from "./components/Profile/Profile";
import BlogPosts from "./components/BlogPosts/BlogPosts";
// import { BounceLoader } from "react-spinners";
import { FadeLoader } from "react-spinners";
import { AnimatePresence } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogPostDetails from "./pages/BlogPostDetails/BlogPostDetails";
import Subscribers from "./components/Subscribers/Subscribers";
import Comments from "./components/Comments/Comments";
import { FaArrowUp } from "react-icons/fa6";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

function App() {
  const { handleHTTPRequestWithToken, setAdmin } = useContext(DataContext);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Conditionally render the go-to-top-button based on the current path
  const isAdminRoute = location.pathname.startsWith("/dashboard");

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
          navigate("/login");
          const { error } = await response.json();

          if (!isInitialLoad) {
            throw new Error(error.message);
          }
        }
      } catch (error) {
        if (!isInitialLoad) {
          toast.error(`Your session has expired! ${error.message}`);
          console.log(`Your session has expired! ${error.message}`);
          setAdmin(null);
        }
      } finally {
        setTimeout(() => {
          setIsInitialLoad(false); // Mark initial load as complete after delay
        }, 2000); //
      }
    }

    if (isAdminRoute) {
      checkAuth();
    } else {
      // Immediately stop showing loading for non-admin routes
      setIsInitialLoad(false);
    }
  }, [isAdminRoute]);

  if (isInitialLoad) {
    return (
      <div className="loading-spinner">
        <FadeLoader color={"#2e8fc0"} loading={isInitialLoad} size={40} />
      </div>
    );
  }

  return (
    <>
      {!isAdminRoute && (
        <a className="go-to-top-button" href="#">
          <FaArrowUp />
        </a>
      )}
      <Toaster
        containerStyle={{
          top: 40,
        }}
        toastOptions={{
          duration: 5000,
          style: {
            boxShadow: "0 0 100px rgba(0, 0, 0, 0.4)",
          },
          success: {
            style: {
              backgroundColor: "rgb(249, 253, 249)",
              color: "rgb(24, 97, 24)",
            },
          },
          error: {
            style: {
              backgroundColor: "rgb(252, 241, 241)",
              color: "rgb(146, 55, 55)",
            },
          },
        }}
      />
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
            <Route path="/about" element={<About />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>

          {/* Admin routes */}
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
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="comments" element={<Comments />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
