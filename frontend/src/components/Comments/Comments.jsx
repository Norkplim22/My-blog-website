import { useContext, useLayoutEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import noData from "../../assets/undraw_Empty_re_opql.png";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import "./Comments.css";

function Comments() {
  const { admin, handleHTTPRequestWithToken } = useContext(DataContext);
  const [commentsData, setCommentsData] = useState([]);
  // const [toReply, setToReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminReplyInput, setAdminReplyInput] = useState("");
  const [adminReply, setAdminReply] = useState({});
  const [replyToComment, setReplyToComment] = useState(null); // Track reply per comment

  useLayoutEffect(() => {
    setLoading(true);

    async function getComments() {
      try {
        const response = await handleHTTPRequestWithToken(`${import.meta.env.VITE_API}/blogPosts/getComments`, {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setCommentsData(data);
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    }

    getComments();
  }, [adminReply]);

  console.log("Comments Data:", commentsData);

  async function handleApprove(commentId, postId, isApproved) {
    try {
      const response = await handleHTTPRequestWithToken(
        `${import.meta.env.VITE_API}/blogPosts/comments/approveComment/${postId}/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isApproved: !isApproved }),
          credentials: "include",
        }
      );

      if (response.ok) {
        const { message, data } = await response.json();
        toast.success(message);
        setCommentsData(data);
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  async function handleDelete(commentId, postId, replyId) {
    // Show a toast with the confirmation message
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this comment?
          <div style={{ display: "flex", gap: "2rem", marginTop: "2rem" }}>
            <button
              style={{
                // marginLeft: "10px",
                padding: "1rem 2rem",
                backgroundColor: "var(--button-color)",
                color: "white",
                border: "none",
                cursor: "pointer",
                flex: "1",
                borderRadius: "0.6rem",
                fontWeight: "600",
              }}
              onClick={() => confirmDelete(t)} // Call the function to delete
            >
              Yes
            </button>
            <button
              style={{
                // marginLeft: "10px",
                padding: "1rem 2rem",
                backgroundColor: "rgb(133, 34, 34)",
                color: "white",
                border: "none",
                cursor: "pointer",
                flex: "1",
                borderRadius: "0.6rem",
                fontWeight: "600",
              }}
              onClick={() => toast.dismiss(t.id)} // Dismiss the toast
            >
              No
            </button>
          </div>
        </span>
      ),
      {
        duration: Infinity, // Keep the toast open until the user decides
      }
    );

    async function confirmDelete(t) {
      try {
        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/blogPosts/comments/deleteComment/${postId}/${commentId}`,
          {
            method: "DELETE",
            credentials: "include",
            body: JSON.stringify({ replyId }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const { message, data } = await response.json();
          setCommentsData(data);
          toast.success(message); // Show a success toast
        } else {
          const { error } = await response.json();
          throw new Error(error);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete comment"); // Show an error toast
      } finally {
        toast.dismiss(t.id); // Dismiss the confirmation toast after action
      }
    }
    // if (confirm("Are you sure you want to delete this comment?")) {

    // }
  }

  async function handleAdminReply(postId, commentId) {
    const settings = {
      method: "PATCH",
      body: JSON.stringify({ adminReplyInput: adminReplyInput[commentId] }),
      headers: {
        "Content-Type": "application/JSON",
      },
      credentials: "include",
    };

    try {
      const response = await handleHTTPRequestWithToken(
        `${import.meta.env.VITE_API}/blogPosts/comments/adminReply/${postId}/${commentId}/${admin._id}`,
        settings
      );

      if (response.ok) {
        const { message, data } = await response.json();
        toast.success(message);
        setAdminReply((prevReplies) => ({
          ...prevReplies,
          [commentId]: data, // Store reply for the specific comment
        }));
        setReplyToComment(null); // Close the reply form after submitting
        setAdminReplyInput("");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  console.log("AdminReply:", adminReply);

  if (loading) {
    return (
      <div className="loading-spinner">
        <FadeLoader color={"#2e8fc0"} loading={loading} size={40} />
      </div>
    );
  }

  return (
    <div className="comments-page">
      {commentsData.length === 0 ? (
        <div className="no-data-container">
          <img src={noData} alt="No data" className="no-data-img" />
          <h2>You have no comments yet.</h2>
        </div>
      ) : (
        <div className="comments-container">
          {commentsData.map((post) =>
            post.comments.map((comment) => (
              <div className="card" key={comment._id}>
                <p>
                  From <strong>{comment.name}</strong> on <strong>{post.title}</strong>
                </p>
                <p className="date">
                  {new Date(comment.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p className="content">{comment.content}</p>
                <div className="buttons-container">
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(comment._id, post._id, comment.approved)}
                  >
                    {!comment.approved ? "Approve" : "Disapprove"}
                  </button>
                  {replyToComment !== comment._id && (
                    <button className="reply-button" onClick={() => setReplyToComment(comment._id)}>
                      Reply
                    </button>
                  )}
                  <button className="delete-button" onClick={() => handleDelete(comment._id, post._id)}>
                    Delete
                  </button>
                </div>
                {/* Reply textarea */}
                {replyToComment === comment._id && (
                  <>
                    <textarea
                      onChange={(e) =>
                        setAdminReplyInput({
                          ...adminReplyInput,
                          [comment._id]: e.target.value,
                        })
                      }
                      value={adminReplyInput[comment._id] || ""}
                      name="adminReply"
                    />
                    <div className="buttons-container">
                      <button onClick={() => handleAdminReply(post._id, comment._id)}>Send Reply</button>
                      <button
                        className="cancel-button"
                        onClick={() => {
                          setReplyToComment(null);
                          setAdminReplyInput("");
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {/* Display admin replies and user replies */}
                {comment.replies.map((reply) => (
                  <div className="reply" key={reply._id}>
                    {reply.role === "Admin" ? (
                      <p>
                        <strong>{reply.role === "Admin" && "You"}</strong> replied to <strong>{comment.name}</strong> on{" "}
                        <strong>{post.title}</strong>
                      </p>
                    ) : (
                      <p>
                        From <strong>{reply.name}</strong> replies to <strong>{comment.name}</strong> on{" "}
                        <strong>{post.title}</strong>
                      </p>
                    )}

                    <p className="date">
                      {new Date(reply.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                    </p>
                    <p className="content">{reply.content}</p>

                    {/* Only show approve button for user replies, not admin replies */}
                    {reply.role !== "Admin" && (
                      <div className="buttons-container">
                        <button
                          className="approve-button"
                          onClick={() => handleApprove(reply._id, post._id, reply.approved)}
                        >
                          {!reply.approved ? "Approve" : "Disapprove"}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(comment._id, post._id, reply._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Comments;
