import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UsersContext } from "../../context/UsersContext";
import renderBlock from "../../components/EditorjsParser/EditorjsParser";
import "./BlogPostDetails.css";
import AnimatedPage from "../../components/AnimatedPage";
import avatar from "../../assets/avatar.png";
import toast from "react-hot-toast";

function BlogPostDetails() {
  const { allBlogPostsToMain } = useContext(UsersContext);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [formIsOpen, setFormIsOpen] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const storedPost = localStorage.getItem(`post-${id}`);

  const post = storedPost ? JSON.parse(storedPost) : allBlogPostsToMain.find((post) => post._id === id);

  useEffect(() => {
    if (post) {
      localStorage.setItem(`post-${id}`, JSON.stringify(post));
    }
  }, [post, id]);

  let commentsLength = post.comments.length;
  let repliesLength = post.comments.reduce((acc, curr) => acc + curr.replies.length, 0);
  let allCommentsLength = commentsLength + repliesLength;

  // console.log(post);

  function handleGoToCategory(category) {
    navigate(`/${category}`);
  }

  function handleChange(e) {
    setCommentInputs({ ...commentInputs, [e.target.name]: e.target.value });
  }

  function handleReplyInputsChange(e) {
    setReplyInputs({ ...replyInputs, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const commentObj = {
      name: commentInputs.name,
      email: commentInputs.email,
      content: commentInputs.content,
    };

    const settings = {
      body: JSON.stringify(commentObj),
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/blogPosts/comments/addComments/${post._id}`, settings);

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        setCommentInputs({});
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleReplyToComment(e, postId, commentId) {
    e.preventDefault();

    const replyObj = {
      name: replyInputs.name,
      email: replyInputs.email,
      content: replyInputs.content,
    };

    const settings = {
      body: JSON.stringify(replyObj),
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/blogPosts/comments/addReply/${postId}/${commentId}`,
        settings
      );

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
        setFormIsOpen("");
        setReplyInputs({});
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
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
              {new Date(post.createdAt).toLocaleDateString("en-US", {
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
        <div className="comments-section">
          {allCommentsLength !== 0 && (
            <h3>
              {allCommentsLength} comments on &quot;{post.title}&quot;
            </h3>
          )}
          {post.comments.length !== 0 && (
            <div className="comments">
              {post.comments
                .slice()
                .reverse()
                .map((comment) => {
                  return (
                    <div className="comment-card" key={comment._id}>
                      <div className="avatar-and-name-and-date">
                        <img src={avatar} alt="avatar" width={50} />
                        <div className="name-and-date">
                          <h3>{comment.name}</h3>
                          <p className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            })}
                          </p>
                        </div>
                      </div>
                      <p>{comment.content}</p>
                      <button onClick={() => setFormIsOpen(comment._id)}>Reply</button>
                      {formIsOpen === comment._id && (
                        <form onSubmit={(e) => handleReplyToComment(e, post._id, comment._id)}>
                          <div className="top-inputs">
                            <label>
                              Name*
                              <input
                                type="text"
                                name="name"
                                value={replyInputs.name || ""}
                                onChange={handleReplyInputsChange}
                                required
                              />
                            </label>
                            <label>
                              Email*
                              <input
                                type="email"
                                name="email"
                                value={replyInputs.email || ""}
                                onChange={handleReplyInputsChange}
                                required
                              />
                            </label>
                          </div>
                          <label>
                            Comment*
                            <textarea
                              name="content"
                              value={replyInputs.content || ""}
                              onChange={handleReplyInputsChange}
                              required
                            />
                          </label>
                          <div className="buttons-container">
                            <button type="submit" className="main-button">
                              Submit
                            </button>
                            <button type="button" className="cancel-button" onClick={() => setFormIsOpen(false)}>
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                      {comment.replies.length !== 0 && (
                        <div className="replies-container">
                          {comment.replies.map((reply) => {
                            return (
                              <div className="reply-card" key={reply._id}>
                                <div className="avatar-and-name-and-date">
                                  <img src={avatar} alt="avatar" width={50} />
                                  <div className="name-and-date">
                                    <h3>{reply.name}</h3>
                                    <p className="comment-date">
                                      {new Date(reply.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true,
                                      })}
                                    </p>
                                  </div>
                                </div>
                                <p>{reply.content}</p>
                                {/* <button onClick={() => setFormIsOpen(reply._id)}>Reply</button>
                            {formIsOpen === reply._id && (
                              <form onSubmit={(e) => handleReplyToComment(e, post._id, reply._id)}>
                                <div className="top-inputs">
                                  <label>
                                    Name*
                                    <input
                                      type="text"
                                      name="name"
                                      value={replyInputs.name || ""}
                                      onChange={handleReplyInputsChange}
                                      required
                                    />
                                  </label>
                                  <label>
                                    Email*
                                    <input
                                      type="email"
                                      name="email"
                                      value={replyInputs.email || ""}
                                      onChange={handleReplyInputsChange}
                                      required
                                    />
                                  </label>
                                </div>
                                <label>
                                  Comment*
                                  <textarea
                                    name="content"
                                    value={replyInputs.content || ""}
                                    onChange={handleReplyInputsChange}
                                    required
                                  />
                                </label>
                                <div className="buttons-container">
                                  <button type="submit" className="main-button">
                                    Submit
                                  </button>
                                  <button type="button" className="cancel-button" onClick={() => setFormIsOpen("")}>
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )} */}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          <h2>Leave a comment</h2>
          <p className="info">Your email address will not be published. Required fields are marked *</p>
          <form onSubmit={handleSubmit}>
            <div className="top-inputs">
              <label>
                Name*
                <input type="text" name="name" value={commentInputs.name || ""} onChange={handleChange} required />
              </label>
              <label>
                Email*
                <input type="email" name="email" value={commentInputs.email || ""} onChange={handleChange} required />
              </label>
            </div>
            <label>
              Comment*
              <textarea name="content" value={commentInputs.content || ""} onChange={handleChange} required />
            </label>
            <button>Submit</button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default BlogPostDetails;
