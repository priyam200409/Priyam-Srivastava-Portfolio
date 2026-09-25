import {
  ArrowDownRight,
  FileText,
  Github,
  Linkedin,
} from "lucide-react";

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <section id="home" className="hero-section">

      <div className="diagonal-background" />

      <div className="hero-shape hero-shape-one" />
      <div className="hero-shape hero-shape-two" />

      <div className="hero-number">
        01
      </div>

      <div className="container hero-container">

        <div className="hero-top-label">
          <span />
          MEET,
        </div>

        <h1 className="hero-title">
          Priyam
          <br />
          <span>Srivastava</span>
        </h1>

        <div className="hero-role">
          <span />
          AI / ML • DATA • SOFTWARE ENGINEERING
        </div>

        <div className="hero-bottom">

          <p className="hero-description">
            Building practical intelligent systems,
            data-driven products and software solutions
            for real-world problems.
          </p>

          <div className="hero-actions">

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
            >
              <FileText size={18} />
              View Resume
            </a>

            <button
              onClick={scrollToProjects}
              className="btn btn-outline"
            >
              Explore Projects
              <ArrowDownRight size={18} />
            </button>

          </div>

        </div>

        <div className="hero-socials">

          <a
            href="https://github.com/priyam200409"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github size={19} />
          </a>

          <a
            href="https://www.linkedin.com/in/priyamsrivastavaai/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin size={19} />
          </a>

        </div>

        <button
          className="hero-scroll"
          onClick={scrollToContact}
        >
          <span>SCROLL TO EXPLORE</span>
          <ArrowDown size={16} />
        </button>

      </div>
    </section>
  );
};

export default Hero;