import { useContext, useEffect, useState } from "react";
import AnimatedPage from "../AnimatedPage";
import { DataContext } from "../../context/DataContext";
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import "./Profile.css";
import toast from "react-hot-toast";

function Profile() {
  const {
    admin,
    handleHTTPRequestWithToken,
    setAdmin,
    showOldPassword,
    showNewPassword,
    toggleOldPasswordVisibility,
    toggleNewPasswordVisibility,
  } = useContext(DataContext);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [formData, setFormData] = useState({});

  // console.log(admin);

  useEffect(() => {
    if (isEditing) {
      setFormData({
        firstname: admin.firstname || "",
        lastname: admin.lastname || "",
        email: admin.email || "",
      });
    }
  }, [isEditing, admin]);

  // Toggle edit mode
  function handleEditClick() {
    setIsEditing(!isEditing);
  }

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  // Optional: Handle form submission (e.g., updating the profile)
  async function handleSubmit(e) {
    e.preventDefault();

    const settings = {
      body: JSON.stringify({ formData }),
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
      credentials: "include",
    };

    try {
      const response = await handleHTTPRequestWithToken(
        `${import.meta.env.VITE_API}/admin/profile/${admin._id}`,
        settings
      );

      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
        toast.success("Your profile has been updated");
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    // console.log("Updated data:", formData);
    setIsEditing(false);
    setFormData({});
  }

  return (
    <AnimatedPage>
      <div className="profile-page">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input type="text" name="firstname" value={formData.firstname || ""} onChange={handleChange} />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastname" value={formData.lastname || ""} onChange={handleChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={formData.email || ""} onChange={handleChange} />
            </label>
            <h3>Change password</h3>
            <label>
              Old password
              <div className="password-container">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  id="oldPassword"
                  value={formData.oldPassword || ""}
                  onChange={handleChange}
                  className="password-input"
                />
                <span className="password-toggle-icon" onClick={toggleOldPasswordVisibility}>
                  {showOldPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </label>
            <label>
              New Password
              <div className="password-container">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  id="newPassword"
                  value={formData.newPassword || ""}
                  onChange={handleChange}
                  className="password-input"
                />
                <span className="password-toggle-icon" onClick={toggleNewPasswordVisibility}>
                  {showNewPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
            </label>

            <div className="buttons-container">
              <button type="submit" className="main-button">
                Save Changes
              </button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-info">
            <p>
              First Name: <span>{admin.firstname}</span>
            </p>
            <p>
              Last Name: <span>{admin.lastname}</span>
            </p>
            <p>
              Email: <span>{admin.email}</span>
            </p>

            <button className="edit-button" onClick={handleEditClick}>
              Edit
            </button>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}

export default Profile;
