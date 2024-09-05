import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../context/DataContext";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../tools.component";
import "./CreatePost.css";
import { /* useLocation */ useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import AnimatedPage from "../AnimatedPage";

function CreatePost() {
  const { setAdmin, admin, setCurrentPost, currentPost, handleHTTPRequestWithToken, setCreatedPostId, setSearchInput } =
    useContext(DataContext);
  const [createPostInputs, setCreatePostInputs] = useState({});
  const [image, setImage] = useState(null);
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(false);
  const editorInstanceRef = useRef(null);
  const imageRef = useRef();
  const navigate = useNavigate();

  console.log(admin);

  useEffect(() => {
    if (!editorInstanceRef.current) {
      const editor = new EditorJS({
        holder: "textEditor",
        data: currentPost?.content ? JSON.parse(currentPost.content) : {},
        tools: tools,
        placeholder: "Write your content here...",
        autofocus: true, // Enable autofocus if needed
      });

      setTextEditor(editor);
      editorInstanceRef.current = editor;

      // editorRef.current = true;

      return () => {
        if (editorInstanceRef.current && editorInstanceRef.current.destroy) {
          editorInstanceRef.current.destroy(); // Destroy editor instance
          editorInstanceRef.current = null; // Clear reference
        }
      };
    }
  }, [currentPost]);

  useEffect(() => {
    setSearchInput("");
    if (currentPost) {
      setCreatePostInputs({
        title: currentPost.title,
        category: currentPost.category,
      });
      setImage(currentPost.coverImage); // Assuming `coverImage` is a URL
    }
  }, [currentPost]);

  function handleChange(e) {
    setCreatePostInputs({ ...createPostInputs, [e.target.name]: e.target.value });
  }

  function handleCancel() {
    setCurrentPost("");
    navigate("/dashboard");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const { title, category } = createPostInputs;

    if (!title) {
      return alert("Please enter a title");
    }

    if (!category) {
      return alert("Please enter a category");
    }

    let savedContent;

    if (textEditor.isReady) {
      const data = await textEditor.save();
      console.log(data);
      if (data.blocks.length) {
        savedContent = data; // Store the content directly here
      } else {
        return alert("Write something in your blog to publish it");
      }
    }

    const formData = new FormData();
    formData.append("title", createPostInputs.title);
    formData.append("category", createPostInputs.category);
    formData.append("content", JSON.stringify(savedContent));
    if (image) {
      formData.append("image", image);
    }
    if (currentPost?._id) {
      formData.append("postId", currentPost._id); // Pass postId for updates
    }

    const settings = {
      body: formData,
      method: "POST",
      credentials: "include",
    };

    try {
      const response = await handleHTTPRequestWithToken(
        `http://localhost:3003/blogPosts/createPost/${admin._id}`,
        settings
      );

      if (response.ok) {
        const { newPostId, newPost } = await response.json();
        setCurrentPost(newPost);
        setCreatedPostId(newPostId);

        const settings2 = {
          body: JSON.stringify({ newPostId }),
          headers: {
            "Content-Type": "application/JSON",
          },
          method: "PATCH",
          credentials: "include",
        };

        const response2 = await handleHTTPRequestWithToken(
          `http://localhost:3003/admin/addPost/${admin._id}`,
          settings2
        );

        if (response2.ok) {
          const data = await response2.json();
          setAdmin(data);
          // setTestView(data.blogPosts);
          navigate("/dashboard/preview");
        } else {
          const { error } = await response2.json();
          throw new Error(error.message);
        }
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      // Stop loading after the request is complete
      setLoading(false);
    }

    setCreatePostInputs({});
    // setContent("");
    imageRef.current.value = "";
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <FadeLoader color={"#2e8fc0"} loading={loading} size={40} />
      </div>
    );
  }

  console.log(admin);

  console.log(image);

  console.log(currentPost._id);

  return (
    <>
      <AnimatedPage>
        <form onSubmit={handleSubmit} className="create-post-form">
          <label>
            Title
            <input type="text" name="title" value={createPostInputs.title || ""} onChange={handleChange} required />
          </label>
          <label>
            Category
            <select name="category" value={createPostInputs.category || ""} onChange={handleChange} required>
              <option disabled value="">
                Choose Category
              </option>
              <option value="study-abroad">Study Abroad</option>
              <option value="stay-motivated">Stay Motivated</option>
              <option value="lifestyle-and-health">Lifestyle and Health</option>
            </select>
          </label>
          <label className="cover-image-label">
            Cover Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              ref={imageRef}
              required={currentPost._id ? false : true}
            />
            {/* <img src={image && URL.createObjectURL(image)} width={150} alt="" /> */}
            {/* {image && <img src={URL.createObjectURL(image)} width={150} alt="Cover" />} */}
            {image && typeof image === "string" ? (
              <img src={image} width={150} alt="Cover" />
            ) : image ? (
              <img src={URL.createObjectURL(image)} width={150} alt="Cover" />
            ) : null}
          </label>
          {/* <label> */}
          <div className="textarea" id="textEditor"></div>
          {/* </label> */}
          <div className="buttons-container">
            <button className="main-button">{currentPost._id ? "Update Post" : "Create Post"}</button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
        {/* <div>
        {testView.map((blogPost) => {
          const content = JSON.parse(blogPost.content);
          return (
            <div key={blogPost._id}>
              <h2>{blogPost.title}</h2>
              <img src={blogPost.coverImage} alt="" width="200rem" />
              <div>{content.blocks.map((block) => renderBlock(block))}</div>
            </div>
          );
        })}
      </div> */}
      </AnimatedPage>
    </>
  );
}

export default CreatePost;
