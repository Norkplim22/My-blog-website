/* eslint-disable react/no-unescaped-entities */
import AnimatedPage from "../../components/AnimatedPage";
// import aboutMeImg from "../../assets/WhatsApp Image 2024-09-14 at 12.40.11 AM (1).jpeg";
import "./About.css";

function About() {
  return (
    <AnimatedPage>
      <div className="about-page">
        <div className="hero-container">
          <h1>About Me</h1>
        </div>
        <main>
          <div className="about-container">
            <div className="image-container">{/* <img src={aboutMeImg} alt="about-me-image" /> */}</div>
            <div className="about-text">
              <p>
                {/* <span>Welcome!!</span> <br /> <br /> */}
                I'm <strong>Dr. Linda Lumor</strong>, a biologist and a techie in learning. I love data analysis and I
                enjoy reading, writing, and cooking. Life they say is a journey and a journey of a thousand miles begins
                with a step. Well, I have been on this journey, and I have realized that life is not devoid of
                challenges. But this challenge allows us to learn and pushes us to improve and become better. <br />{" "}
                <br /> My journey hasn't been linear or easy. At some point in my life, it felt like I would only be a
                high school graduate but today I am a PhD holder. I have been to countries I only dreamt of and It took
                persistence, personal development, consistent mindset renewal, setting the right boundaries, and
                creating healthy and lasting habits to achieve all these. Although I have not fully arrived yet, I am
                confident about my destination. I have come far and I know you can too. That dream you have can be
                achieved if you are dedicated to it and I am here to be a friend. <br /> <br /> I am aware of how
                overwhelming life challenges can be but I also know how rewarding it is to embrace them, take control of
                your life, and thrive. GROW is here to be your online companion, furnishing you with all the
                inspiration, practical strategies, and advice on your journey. GROW will cover topics about Mindset &
                Self-Discovery, Lifestyle and Health, Habits and Beliefs, Emotional Intelligence & Well-being and Study
                Abroad Opportunities. <br /> <br />
                Whether you are beginning or well-versed in your growth journey, you are welcome to join our community.
                Let's create a community where we develop together. Subscribe and follow GROW's social media pages to be
                updated when I post. I can’t wait to see where this journey takes us!
              </p>
            </div>
          </div>
        </main>
      </div>
    </AnimatedPage>
  );
}

export default About;
