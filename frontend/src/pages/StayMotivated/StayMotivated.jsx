import { useContext } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import { UsersContext } from "../../context/UsersContext";
import "./StayMotivated.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../components/AnimateCards";

function StayMotivated() {
  const { allBlogPostsToMain /* setAllBlogPostsToMain */ } = useContext(UsersContext);

  const stayMotivated = allBlogPostsToMain.filter((post) => post.category === "stay-motivated");

  return (
    <AnimatedPage>
      <div className="stay-motivated-page">
        <div className="hero-container">
          <h1>Stay Motivated</h1>
        </div>
        <main>
          <section className="stay-motivated-section">
            <motion.div
              className="stay-motivated-container"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {stayMotivated
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
    </AnimatedPage>
  );
}

export default StayMotivated;
