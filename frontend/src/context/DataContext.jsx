/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const DataContext = createContext();

function DataContextProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [currentPost, setCurrentPost] = useState("");
  const [createdPostId, setCreatedPostId] = useState("");
  const [publish, setPublish] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");

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
        publish,
        setPublish,
        allPosts,
        setAllPosts,
        searchInput,
        setSearchInput,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContextProvider;
