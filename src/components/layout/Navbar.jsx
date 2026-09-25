import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <header className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-inner">

        <button
          className="navbar-logo"
          onClick={() => scrollToSection("home")}
        >
          PS<span>.</span>
        </button>

        <nav className="navbar-links">
          <button onClick={() => scrollToSection("home")}>
            Home
          </button>

          <button onClick={() => scrollToSection("skills")}>
            Skills
          </button>

          <button onClick={() => scrollToSection("projects")}>
            Projects
          </button>

          <button onClick={() => scrollToSection("contact")}>
            Contact
          </button>
        </nav>

        <button
          className="navbar-contact"
          onClick={() => scrollToSection("contact")}
        >
          Let's Talk
          <ArrowDown size={16} />
        </button>

      </div>
    </header>
  );
};

export default Navbar;