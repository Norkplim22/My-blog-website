import { useContext } from "react";
import { DataContext } from "../../context/DataContext";
import "./Preview.css";
import { useNavigate } from "react-router-dom";

function Preview() {
  const { currentPost, createdPostId, handleHTTPRequestWithToken, publish, setCurrentPost } = useContext(DataContext);
  const navigate = useNavigate();

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
        `http://localhost:3003/blogPosts/publishPost/${createdPostId}`,
        settings
      );

      if (response.ok) {
        const { message } = await response.json();
        alert(message);
        setCurrentPost("");
        navigate("/dashboard");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  function saveAsDraft() {
    alert("Your post is saved as draft and not published");
    setCurrentPost("");
    navigate("/dashboard");
  }

  function handleEdit() {
    navigate("/dashboard/create-blog-post");
  }

  function renderBlock(block) {
    switch (block.type) {
      case "header":
        return <h2 key={block.id}>{block.data.text}</h2>;

      case "paragraph":
        return (
          <p className="paragraph" key={block.id}>
            {block.data.text}
          </p>
        );

      case "list":
        // Handle both unordered and ordered lists
        return block.data.style === "unordered" ? (
          <ul className="list" key={block.id}>
            {block.data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <ol className="list" key={block.id}>
            {block.data.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        );

      case "code":
        return (
          <pre key={block.id}>
            <code>{block.data.code}</code>
          </pre>
        );

      case "embed":
        return (
          <div key={block.id}>
            <iframe
              width={block.data.width || "100%"}
              height={block.data.height || "400px"}
              src={block.data.embed}
              allowFullScreen
            ></iframe>
            <p>{block.data.caption}</p>
          </div>
        );

      case "image":
        return (
          <div key={block.id}>
            <img src={block.data.file.url} alt={block.data.caption || "Image"} width={300} />
            {block.data.caption && <p>{block.data.caption}</p>}
          </div>
        );

      case "inlineCode":
        return (
          <pre key={block.id}>
            <code>{block.data.text}</code>
          </pre>
        );

      case "link":
        return (
          <a key={block.id} href={block.data.link} target="_blank" rel="noopener noreferrer">
            {block.data.link}
          </a>
        );

      case "marker":
        return <mark key={block.id}>{block.data.text}</mark>;

      case "quote":
        return (
          <blockquote key={block.id}>
            <p>{block.data.text}</p>
            <cite>{block.data.caption}</cite>
          </blockquote>
        );

      default:
        return null;
    }
  }

  return (
    <div className="preview-page">
      <div className="buttons-container">
        <button onClick={publishPost}>{publish ? "unpublish" : "publish"}</button>
        <button className="edit-button" onClick={handleEdit}>
          Edit
        </button>
        <button className="save-draft-button" onClick={saveAsDraft}>
          Save draft
        </button>
      </div>
      <div className="preview-container">
        <h2>{currentPost.title}</h2>
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
  );
}

export default Preview;
