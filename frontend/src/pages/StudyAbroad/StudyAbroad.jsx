import { useContext } from "react";
import AnimatedPage from "../../components/AnimatedPage";
import { UsersContext } from "../../context/UsersContext";
import "./StudyAbroad.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { containerVariants, cardVariants } from "../../components/AnimateCards";

function StudyAbroad() {
  const { allBlogPostsToMain } = useContext(UsersContext);

  const studyAbroad = allBlogPostsToMain.filter((post) => post.category === "study-abroad");

  return (
    <AnimatedPage>
      <div className="study-abroad-page">
        <div className="hero-container">
          <h1>Study Abroad</h1>
        </div>
        <main>
          <section className="study-abroad-section">
            <motion.div
              className="study-abroad-container"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {studyAbroad
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

export default StudyAbroad;
