import { useNavigate } from "react-router-dom";
import NotFound from "../../assets/undraw_Page_not_found_re_e9o6 (1).png";
import "./PageNotFound.css";
import AnimatedPage from "../AnimatedPage";

function PageNotFound() {
  const navigate = useNavigate();

  return (
    <AnimatedPage>
      <div className="page-not-found-container">
        <img src={NotFound} alt="" />
        <h2>Page not found</h2>
        <p>
          The page you are looking for does not exist. Go back to the{" "}
          <span onClick={() => navigate("/")}>Home Page</span>
        </p>
      </div>
    </AnimatedPage>
  );
}

export default PageNotFound;
