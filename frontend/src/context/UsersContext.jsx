/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";

export const UsersContext = createContext();

function UsersContextProvider({ children }) {
  const [allBlogPostsToMain, setAllBlogPostsToMain] = useState([]);

  useEffect(() => {
    async function getAllBlogPosts() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/blogPosts/getAllBlogPosts`);

        if (response.ok) {
          const blogPosts = await response.json();
          setAllBlogPostsToMain(blogPosts);
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    getAllBlogPosts();
  }, []);

  return (
    <UsersContext.Provider value={{ allBlogPostsToMain, setAllBlogPostsToMain }}>{children}</UsersContext.Provider>
  );
}

export default UsersContextProvider;
