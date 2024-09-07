import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UsersContext } from "../../context/UsersContext";
import renderBlock from "../../components/EditorjsParser/EditorjsParser";
import "./BlogPostDetails.css";
import AnimatedPage from "../../components/AnimatedPage";

function BlogPostDetails() {
  const { allBlogPostsToMain } = useContext(UsersContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const post = allBlogPostsToMain.find((post) => post._id === id);

  function handleGoToCategory(category) {
    navigate(`/${category}`);
  }

  return (
    <AnimatedPage>
      <div className="blog-details-page">
        <div className="hero-container">
          <img src={post.coverImage} alt="" />
        </div>
        <div className="blog-post-container">
          <div className={`blog-title-container ${post.category}`}>
            <h1>{post.title}</h1>
            <p className="date">
              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p className={`category ${post.category}`} onClick={() => handleGoToCategory(post.category)}>
              {post.category.split("-").join(" ")}
            </p>
          </div>
          <div className="blog-content">
            {(() => {
              try {
                const parsedContent = JSON.parse(post.content);
                return parsedContent.blocks?.map((block) => renderBlock(block));
              } catch (error) {
                console.error("Error parsing content:", error);
                return <p>Error loading content</p>;
              }
            })()}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default BlogPostDetails;
