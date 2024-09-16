/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

function DataContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [currentPost, setCurrentPost] = useState("");
  const [createdPostId, setCreatedPostId] = useState("");
  const [allPosts, setAllPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const currentPostLocalStorage = localStorage.getItem("currentPost");
    const createdPostIdLocalStorage = localStorage.getItem("createdPostId");

    if (currentPostLocalStorage) {
      const parsed = JSON.parse(currentPostLocalStorage);
      setCurrentPost(parsed);
    }

    if (createdPostIdLocalStorage) {
      const parsedId = JSON.parse(createdPostIdLocalStorage);
      setCreatedPostId(parsedId);
    }
  }, []);

  function toggleOldPasswordVisibility() {
    setShowOldPassword(!showOldPassword);
  }

  function toggleNewPasswordVisibility() {
    setShowNewPassword(!showNewPassword);
  }

  async function handleHTTPRequestWithToken(url, settings) {
    const firstAccessResponse = await fetch(url, settings);

    if (firstAccessResponse.ok) {
      return firstAccessResponse;
    } else {
      let error;
      try {
        const responseClone = firstAccessResponse.clone();
        error = await responseClone.json();
      } catch (err) {
        console.log("Failed to parse JSON response", err);
      }

      if (error.status !== 401) {
        return firstAccessResponse;
      }

      const refreshResponse = await fetch(`${import.meta.env.VITE_API}/refresh-token`, { credentials: "include" });

      if (refreshResponse.ok) {
        const secondAccessResponse = await fetch(url, settings);
        return secondAccessResponse;
      } else {
        return refreshResponse;
      }
    }
  }

  return (
    <DataContext.Provider
      value={{
        admin,
        setAdmin,
        handleHTTPRequestWithToken,
        currentPost,
        setCurrentPost,
        createdPostId,
        setCreatedPostId,
        allPosts,
        setAllPosts,
        searchInput,
        setSearchInput,
        showOldPassword,
        setShowOldPassword,
        showNewPassword,
        setShowNewPassword,
        toggleOldPasswordVisibility,
        toggleNewPasswordVisibility,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
