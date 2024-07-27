import { Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-blog-post" element={<CreatePost />} />
        </Route>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/stay-motivated" element={<StayMotivated />} />
          <Route path="/lifestyle-and-health" element={<LifestyleAndHealth />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
