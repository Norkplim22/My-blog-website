import { useContext, useLayoutEffect, useState } from "react";
import { DataContext } from "../../context/DataContext";
import noData from "../../assets/undraw_Empty_re_opql.png";
import { FadeLoader } from "react-spinners";
import "./Subscribers.css";
import toast from "react-hot-toast";

function Subscribers() {
  const { admin, handleHTTPRequestWithToken } = useContext(DataContext);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(subscribers);

  useLayoutEffect(() => {
    setLoading(true);
    async function getSubscribers() {
      try {
        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/admin/getSubscribers/${admin._id}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setSubscribers(data);
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

    getSubscribers();
  }, []);

  async function handleDelete(id) {
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
        // if (confirm("Are you sure you want to delete this subscriber?")) {
        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/admin/deleteSubscriber/${admin._id}/${id}`,
          { method: "DELETE", credentials: "include" }
        );

        if (response.ok) {
          const { message, data } = await response.json();
          setSubscribers(data);
          toast.success(message);
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
        // }
      } catch (error) {
        toast.error(error.message);
      } finally {
        toast.dismiss(t.id); // Dismiss the confirmation toast after action
      }
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        <FadeLoader color={"#2e8fc0"} loading={loading} size={40} />
      </div>
    );
  }

  return (
    <div className="subscribers-page">
      {subscribers.length === 0 ? (
        <div className="no-data-container">
          <img src={noData} alt="No data" className="no-data-img" />
          <h2>You have no subscribers yet.</h2>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Date Subscribed</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber, index) => {
              return (
                <tr key={subscriber._id}>
                  <td>{index + 1}</td>
                  <td>{subscriber.email}</td>
                  <td>
                    {new Date(subscriber.subscribedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(subscriber._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Subscribers;
