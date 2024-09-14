import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import "./Preview.css";
import { useNavigate } from "react-router-dom";
import renderBlock from "../EditorjsParser/EditorjsParser";
import toast from "react-hot-toast";
// import AnimatedPage from "../AnimatedPage";

function Preview() {
  const { currentPost, createdPostId, handleHTTPRequestWithToken, /* publish, */ setCurrentPost } =
    useContext(DataContext);
  const [publish, setPublish] = useState(false);
  const navigate = useNavigate();

  // console.log(currentPost);
  // console.log(createdPostId);
  console.log(publish);

  useEffect(() => {
    const isPublishedLocalStorage = localStorage.getItem("isPublished");

    if (isPublishedLocalStorage) {
      const parsedIsPublished = JSON.parse(isPublishedLocalStorage);
      setPublish(parsedIsPublished);
    }
  }, []);

  async function publishPost() {
    try {
      const settings = {
        body: JSON.stringify({ published: !publish }),
        headers: {
          "Content-Type": "application/JSON",
        },
        method: "PATCH",
        credentials: "include",
      };

      const response = await handleHTTPRequestWithToken(
        `${import.meta.env.VITE_API}/blogPosts/publishPost/${createdPostId}`,
        settings
      );

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        setCurrentPost("");
        navigate("/dashboard");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  function saveAsDraft() {
    toast.success("Your post is saved as draft and not published");
    setCurrentPost("");
    navigate("/dashboard");
  }

  function handleEdit() {
    navigate("/dashboard/create-blog-post");
  }

  return (
    // <AnimatedPage>
    <div className="preview-page">
      <div className="buttons-container">
        <button onClick={publishPost}>Publish</button>
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button
          className="save-draft-button"
          style={{
            display: currentPost._id && !currentPost.published ? "block" : currentPost._id ? "none" : "block",
          }}
          onClick={saveAsDraft}
        >
          Save draft
        </button>
        <button
          className="save-draft-button"
          style={{ display: currentPost._id && currentPost.published ? "block" : "none" }}
          onClick={publishPost}
        >
          Unpublish
        </button>
      </div>
      <div className="preview-container">
        <h1>{currentPost.title}</h1>
        <img src={currentPost.coverImage} alt="" width="200" style={{ width: "100%" }} />
        {currentPost.content && (
          <>
            {/* Immediately Invoked Function expression (IIFE) */}
            {(() => {
              try {
                const parsedContent = JSON.parse(currentPost.content);
                return parsedContent.blocks?.map((block) => renderBlock(block));
              } catch (error) {
                console.error("Error parsing content:", error);
                return <p>Error loading content</p>;
              }
            })()}
          </>
        )}
      </div>
    </div>
    // </AnimatedPage>
  );
}

export default Preview;
