import { Link } from "react-router-dom";
import { FaTiktok } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa6";
import { GrInstagram } from "react-icons/gr";
import logo from "../../assets/image 16.png";
import "./Footer.css";
import { useState } from "react";
import toast from "react-hot-toast";

function Footer() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const settings = {
      body: JSON.stringify({ email }),
      method: "POST",
      headers: {
        "Content-Type": "application/JSON",
      },
    };

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/admin/subscribers/addSubscribers`, settings);

      if (response.ok) {
        const { message } = await response.json();
        toast.success(message);
      } else {
        const { error } = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      toast.error(error.message);
    }

    setEmail("");
  }

  return (
    <footer>
      <div className="top-footer">
        <div className="grow-journey-info">
          <img src={logo} alt="" width={50} />
          <p>
            Growth is a constant process and requires regular efforts. Grow is a blog that focuses on personal growth
            and development.
          </p>
          <div className="social-media-icons">
            <a href="https://www.tiktok.com/@journeyofpersonalgrowth?_t=8pZsiAFPqpE&_r=1" target="_blank">
              <FaTiktok size={"2.4rem"} />
            </a>
            <a href="https://www.facebook.com/iMOTIVATE21" target="_blank">
              <FaFacebookF size={"2.4rem"} />
            </a>
            <a href="https://www.instagram.com/imotivate_jog?igsh=MTZ1b3RubHhpNnJ2MA==" target="_blank">
              <GrInstagram size={"2.4rem"} />
            </a>
          </div>
        </div>
        <div className="links-container">
          <h3>Quick Links</h3>
          <div className="links">
            <Link to={"/"}>Home</Link>
            <Link to={"/study-abroad"}>Study Abroad</Link>
            <Link to={"/stay-motivated"}>Stay Motivated</Link>
            <Link to={"/lifestyle-and-health"}>Lifestyle & Health</Link>
            <Link to={"/about"}>About</Link>
          </div>
        </div>
        <div className="newsletter-container">
          <h3>Newsletter</h3>
          <p>Subscribe to the mailing list to get the new updates!</p>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Your email address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button>Subscribe</button>
          </form>
        </div>
      </div>
      <div className="bottom-footer">
        <p>Copyright &copy; {new Date().getFullYear()} Grow</p>
        <p>
          Designed & Developed by{" "}
          <a href="https://worlanyokwablakporfeame.com" target="_blank">
            Worlanyo
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
