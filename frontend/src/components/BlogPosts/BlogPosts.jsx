import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import "./BlogPost.css";
import { useNavigate } from "react-router-dom";
import noData from "../../assets/undraw_Empty_re_opql.png";
import AnimatedPage from "../AnimatedPage";
import { motion } from "framer-motion";

// Define the staggered animation for the cards container
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delay between each card animation
    },
  },
  // exit: { opacity: 0 },
};

// Define the animation for individual cards
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  // exit: { opacity: 0, y: 20 },
  // transition: { duration: 1 },
};

function BlogPosts() {
  const {
    allPosts,
    setCurrentPost,
    handleHTTPRequestWithToken,
    admin,
    setAllPosts,
    setAdmin,
    searchInput,
    setSearchInput,
  } = useContext(DataContext);
  const navigate = useNavigate();

  console.log("searchInput:", searchInput);

  useEffect(() => {
    async function getAllPost() {
      try {
        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/admin/getAllPosts/${admin._id}`,
          { credentials: "include" }
        );

        if (response.ok) {
          const data = await response.json();
          setAllPosts(data.blogPosts);
          setAdmin(data);
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        alert(error.message);
      }
    }

    if (admin._id) {
      getAllPost();
    }
  }, [admin?._id]);

  function handleEdit(id) {
    const postToEdit = allPosts.find((post) => post._id === id);
    setCurrentPost(postToEdit);
    navigate("/dashboard/create-blog-post");
  }

  async function handleDelete(id) {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const settings = {
          method: "DELETE",
          credentials: "include",
        };

        const response = await handleHTTPRequestWithToken(
          `${import.meta.env.VITE_API}/blogPosts/deletePost/${id}`,
          settings
        );

        if (response.ok) {
          const { deletedPostId } = await response.json();

          const settings2 = {
            method: "PATCH",
            body: JSON.stringify({ deletedPostId }),
            headers: {
              "Content-Type": "application/JSON",
            },
            credentials: "include",
          };

          const response2 = await handleHTTPRequestWithToken(
            `${import.meta.env.VITE_API}/admin/deletePost/${admin._id}`,
            settings2
          );

          if (response2.ok) {
            const { message, data } = await response2.json();
            alert(message);
            setAllPosts(data.blogPosts);
          } else {
            const { error } = await response2.json();
            throw new Error(error.message);
          }
        } else {
          const { error } = await response.json();
          throw new Error(error.message);
        }
      } catch (error) {
        alert(error.message);
      }
    }
  }

  // Group posts by categories
  const postsByCategory = allPosts.reduce((acc, post) => {
    if (!acc[post.category]) {
      acc[post.category] = [];
    }
    acc[post.category].push(post);
    return acc;
  }, {});

  return (
    // <AnimatedPage>
    //   <div className="blogPosts-container">
    //     <>
    //       {allPosts.length === 0 ? (
    //         <div className="no-data-container">
    //           <img src={noData} alt="" className="no-data-img" />
    //           <h2>You have no posts</h2>
    //         </div>
    //       ) : (
    //         <>
    //           <input
    //             type="search"
    //             name="search"
    //             value={searchInput}
    //             onChange={(e) => setSearchInput(e.target.value)}
    //             placeholder="Search..."
    //             className="searchInput"
    //           />
    //           {Object.keys(postsByCategory)
    //             .slice()
    //             .reverse()
    //             .map((category) => {
    //               // Filter posts based on search input and publication status
    //               const filteredPosts = postsByCategory[category]
    //                 .slice()
    //                 .reverse()
    //                 .filter((post) => {
    //                   const publicationStatus = post.published ? "published" : "unpublished";
    //                   return (
    //                     post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
    //                     publicationStatus.toLowerCase().startsWith(searchInput.toLowerCase())
    //                   );
    //                 });

    //               // Only render the category container if there are filtered posts
    //               if (filteredPosts.length === 0)
    //                 return (
    //                   <>
    //                     <div className="no-data-container">
    //                       <img src={noData} alt="" className="no-data-img" />
    //                       <h2>There is no posts with the search criteria</h2>
    //                     </div>
    //                   </>
    //                 );

    //               return (
    //                 <div key={category} className="category-container">
    //                   <h2>
    //                     {category} ({filteredPosts.length})
    //                   </h2>
    //                   <div className="cards-container">
    //                     {filteredPosts.map((post) => (
    //                       <div key={post?._id} className="card">
    //                         <div className="image-container">
    //                           <img src={post.coverImage} alt={post.title} />
    //                         </div>
    //                         <div className="details-container">
    //                           <p className="date">
    //                             {new Date(post.updatedAt).toLocaleDateString("en-US", {
    //                               year: "numeric",
    //                               month: "long",
    //                               day: "numeric",
    //                             })}
    //                           </p>
    //                           <h3>{post.title}</h3>
    //                           <p className={post.published ? "published" : "unpublished"}>
    //                             {post.published ? "published" : "unpublished"}
    //                           </p>
    //                         </div>
    //                         <div className="buttons-container">
    //                           <button onClick={() => handleEdit(post._id)}>Edit</button>
    //                           <button className="delete-button" onClick={() => handleDelete(post._id)}>
    //                             Delete
    //                           </button>
    //                         </div>
    //                       </div>
    //                     ))}
    //                   </div>
    //                 </div>
    //               );
    //             })}
    //         </>
    //       )}
    //     </>
    //   </div>
    // </AnimatedPage>
    <AnimatedPage>
      <div className="blogPosts-container">
        {allPosts.length === 0 ? (
          <div className="no-data-container">
            <img src={noData} alt="No data" className="no-data-img" />
            <h2>You have no posts</h2>
          </div>
        ) : (
          <>
            <input
              type="search"
              name="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search..."
              className="searchInput"
            />
            {Object.keys(postsByCategory)
              .slice()
              .reverse()
              .map((category) => {
                // Filter posts based on search input and publication status
                const filteredPosts = postsByCategory[category]
                  .slice()
                  .reverse()
                  .filter((post) => {
                    const publicationStatus = post.published ? "published" : "unpublished";
                    return (
                      post.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                      publicationStatus.toLowerCase().startsWith(searchInput.toLowerCase())
                    );
                  });

                // Render message if no filtered posts
                if (filteredPosts.length === 0) {
                  return (
                    <div key={category} className="no-data-container">
                      <img src={noData} alt="No data" className="no-data-img" />
                      <h2>There are no posts matching the search criteria</h2>
                    </div>
                  );
                }

                return (
                  <div key={category} className="category-container">
                    <h2>
                      {category} ({filteredPosts.length})
                    </h2>
                    {/* Animate the cards container with staggered animation */}
                    <motion.div
                      variants={containerVariants}
                      className="cards-container"
                      initial="initial"
                      animate="animate"
                      // exit="exit"
                    >
                      {filteredPosts.map((post) => (
                        <motion.div
                          key={post._id}
                          variants={cardVariants} // Each card has its own animation
                          className="card"
                        >
                          <div className="image-container">
                            <img src={post.coverImage} alt={post.title} />
                          </div>
                          <div className="details-container">
                            <p className="date">
                              {new Date(post.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                            <h3>{post.title}</h3>
                            <p className={post.published ? "published" : "unpublished"}>
                              {post.published ? "published" : "unpublished"}
                            </p>
                          </div>
                          <div className="buttons-container">
                            <button onClick={() => handleEdit(post._id)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(post._id)}>
                              Delete
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                );
              })}
          </>
        )}
      </div>
    </AnimatedPage>
  );
}

export default BlogPosts;
