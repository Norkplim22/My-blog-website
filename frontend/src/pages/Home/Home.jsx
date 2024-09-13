import { useContext } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import "./Home.css";
import { UsersContext } from "../../context/UsersContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../components/AnimateCards";

function Home() {
  const { allBlogPostsToMain } = useContext(UsersContext);
  const navigate = useNavigate();

  console.log(allBlogPostsToMain);

  const featuredPosts = allBlogPostsToMain.filter((post) => post.featured);

  function handleGoToCategory(category) {
    navigate(`/${category}`);
  }

  return (
    <AnimatedPage>
      <div className="home">
        <div className="hero-container">
          <h1>Welcome to the GROW Journey</h1>
          <p>Your guide to mastering life, staying inspired, and studying abroad.</p>
        </div>
        <main>
          <section className="posts-section">
            <h2>FEATURED POSTS</h2>
            <motion.div className="posts-container" variants={containerVariants} initial="initial" animate="animate">
              {featuredPosts.map((post) => {
                return (
                  <Link key={post._id} to={`/${post.category}/${post._id}`}>
                    <motion.div className="card" variants={cardVariants}>
                      <div className="image-container">
                        <img src={post.coverImage} alt="cover-image" />
                      </div>
                      <div className="details">
                        <p className={`category ${post.category}`} onClick={() => handleGoToCategory(post.category)}>
                          {post.category.split("-").join(" ")}
                        </p>
                        <h3 className="title">
                          <span>{post.title}</span>
                        </h3>
                        <p className="date">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </motion.div>
          </section>
          <section className="posts-section">
            <h2>LATEST POSTS</h2>
            <div className="posts-container">
              {allBlogPostsToMain.slice(0, 3).map((post) => {
                return (
                  <Link key={post._id} to={`/${post.category}/${post._id}`}>
                    <div className="card">
                      <div className="image-container">
                        <img src={post.coverImage} alt="cover-image" />
                      </div>
                      <div className="details">
                        <p className={`category ${post.category}`} onClick={() => handleGoToCategory(post.category)}>
                          {post.category.split("-").join(" ")}
                        </p>
                        <h3 className="title">
                          <span>{post.title}</span>
                        </h3>
                        <p className="date">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </AnimatedPage>
  );
}

export default Home;
