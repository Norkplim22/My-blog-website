import { useContext } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import { UsersContext } from "../../context/UsersContext";
import "./LifestyleAndHealth.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../components/AnimateCards";

function LifestyleAndHealth() {
  const { allBlogPostsToMain } = useContext(UsersContext);

  const lifestyleAndHealth = allBlogPostsToMain.filter((post) => post.category === "lifestyle-and-health");

  return (
    <AnimatedPage>
      <div className="lifestyle-and-health-page">
        <div className="hero-container">
          <h1>Lifestyle & Health</h1>
        </div>
        <main>
          <section className="lifestyle-and-health-section">
            <motion.div
              className="lifestyle-and-health-container"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {lifestyleAndHealth
                .slice()
                .reverse()
                .map((post) => {
                  return (
                    <Link key={post._id} to={`/${post.category}/${post._id}`}>
                      <motion.div className="card" variants={cardVariants}>
                        <div className="image-container">
                          <img src={post.coverImage} alt="cover-image" />
                        </div>
                        <div className="details">
                          <p className={`category ${post.category}`}>{post.category.split("-").join(" ")}</p>
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
        </main>
      </div>
      ;
    </AnimatedPage>
  );
}

export default LifestyleAndHealth;
