import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../../components/AnimatedPage";

function Dashboard() {
  const { admin, setAdmin, handleHTTPRequestWithToken, allPosts, setAllPosts, setSearchInput } =
    useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllPost() {
      setSearchInput("");
      try {
        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/admin/getAllPosts/${admin._id}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setAllPosts(data.blogPosts);
          setAdmin(data);
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        alert(error.message);
      }
    }

    if (admin._id) {
      getAllPost();
    }
  }, [admin?._id]);

  const publishedPosts = admin.blogPosts.filter((blogPost) => blogPost.published);
  const unpublishedPosts = admin.blogPosts.filter((blogPost) => blogPost.published === false);

  return (
    <AnimatedPage>
      <div className="dashboard-container">
        <div className="cards-container">
          <div
            className="card allPosts"
            onClick={() => {
              setSearchInput("");
              navigate("/dashboard/blog-posts");
            }}
          >
            <h2>Total number of posts</h2>
            <p>{allPosts.length}</p>
          </div>
          <div
            className="card published"
            onClick={() => {
              setSearchInput("published");
              navigate("/dashboard/blog-posts");
            }}
          >
            <h2>Published posts</h2>
            <p>{publishedPosts.length}</p>
          </div>
          <div
            className="card unpublished"
            onClick={() => {
              setSearchInput("unpublished");
              navigate("/dashboard/blog-posts");
            }}
          >
            <h2>Unpublished posts</h2>
            <p>{unpublishedPosts.length}</p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
