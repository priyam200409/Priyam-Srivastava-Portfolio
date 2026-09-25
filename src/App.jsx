import { useEffect, useRef, useState } from "react";
import ThreeBackground from "./components/ui/ThreeBackground";
import ContactForm from "./components/contact/ContactForm";

const projects = [
  {
    number: "01",
    category: "DATA ANALYTICS",
    title: "JobPulse",
    status: "LIVE",
    description:
      "India Data Analyst Job Market Intelligence platform analyzing public job postings to understand skill demand, hiring patterns, experience requirements and salary availability.",
    tags: ["Python", "Pandas", "SQL", "Streamlit"],
    github: "https://github.com/priyam200409/jobpulse",
    live: "https://jobpulse91.streamlit.app/",
    visual: "JOBPULSE",
    sub: "MARKET INTELLIGENCE",
  },
  {
    number: "02",
    category: "BUSINESS INTELLIGENCE",
    title: "E-Commerce Business Intelligence",
    status: "IN DEVELOPMENT",
    description:
      "End-to-end analytics project using the Olist Brazilian e-commerce dataset to analyze sales, customers, products, sellers, delivery operations and customer experience.",
    tags: ["Python", "SQL", "Power BI", "Pandas"],
    github: "https://github.com/priyam200409/Ecommerce-business-intelligence",
    live: null,
    visual: "E-COMMERCE",
    sub: "BUSINESS INTELLIGENCE",
  },
  {
    number: "03",
    category: "GENERATIVE AI / RAG",
    title: "DOCQUERY-RAG",
    status: "PUBLIC PROJECT",
    description:
      "Conversational RAG application for querying PDF documents using Streamlit, LangChain, ChromaDB, Hugging Face embeddings and Google Gemini for grounded responses.",
    tags: ["RAG", "LangChain", "ChromaDB", "Gemini", "Streamlit"],
    github: "https://github.com/priyam200409/DOCUQUERY-RAG",
    live: "https://docuquery-rag-assistant.streamlit.app/",
    visual: "DOCQUERY",
    sub: "DOCUMENT INTELLIGENCE",
  },
  {
    number: "04",
    category: "RAG / AI ASSISTANT",
    title: "Bastian at the Bottom",
    status: "LIVE",
    description:
      "Hybrid Retrieval-Augmented Generation AI assistant combining ChromaDB vector search and BM25 keyword retrieval for context-aware response generation.",
    details: [
      "Dual-LLM pipeline using Groq's Llama 3.1 8B and Llama 3.3 70B models.",
      "Cross-encoder reranking for context-aware response generation.",
      "Interactive Streamlit dashboard with real-time pipeline monitoring and modular document ingestion.",
    ],
    tags: ["Python", "RAG", "ChromaDB", "BM25", "Llama 3"],
    github: null,
    live: "https://bastian-at-the-bottom.streamlit.app/",
    visual: "BASTIAN",
    sub: "RAG ASSISTANT",
  },
];

const techStack = {
  Languages: ["Python", "Java", "JavaScript", "HTML5", "CSS3", "SQL"],
  "Data & Analytics": [
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Power BI",
    "Excel",
  ],
  "AI & Machine Learning": [
    "TensorFlow",
    "Keras",
    "Scikit-learn",
    "OpenCV",
    "Hugging Face",
    "Transformers",
  ],
  "Generative AI": [
    "LLMs",
    "Generative AI",
    "RAG",
    "Vector Search",
    "Agentic AI",
    "MCP",
    "Prompt Engineering",
  ],
  "Development & Frameworks": [
    "React",
    "Node.js",
    "Express.js",
    "Streamlit",
  ],
  Databases: ["MySQL", "SQLite", "MongoDB"],
  "Cloud & Platforms": ["Microsoft Azure", "Google Colab", "Jupyter"],
};

const navigation = [
  ["01", "home", "Home"],
  ["02", "work", "Work"],
  ["03", "skills", "Skills"],
  ["04", "about", "About"],
  ["05", "contact", "Contact"],
];

const domains = [
  ["01", "AI / ML", "Machine learning, deep learning, NLP and intelligent systems."],
  ["02", "GENERATIVE AI", "RAG systems, LLM applications, vector search and AI assistants."],
  ["03", "DATA", "Analytics, SQL, visualization and data-driven decision systems."],
  ["04", "SOFTWARE", "Modern web applications, APIs and practical software experiences."],
];

const careerTargets = [
  "AI / ML ENGINEER",
  "MACHINE LEARNING ENGINEER",
  "DATA SCIENTIST",
  "DATA ANALYST",
  "GENERATIVE AI",
  "AGENTIC AI",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("portfolio-theme") === "dark"
      ? "dark"
      : "light";
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeProject, setActiveProject] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setActiveProject(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMenuOpen(false);
  };

  return (
    <div className="site">
      <ThreeBackground />

      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="cursor-glow" aria-hidden="true" />

      <div className="background-system" aria-hidden="true">
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />
        <div className="grid-background" />
        <div className="noise" />
      </div>

      <header className="navbar">
        <button
          className="brand"
          onClick={() => scrollTo("home")}
          aria-label="Go to homepage"
        >
          <span className="brand-mark">PS</span>
          <span className="brand-text">PRIYAM SRIVASTAVA</span>
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navigation.map(([number, id, label]) => (
            <button key={id} onClick={() => scrollTo(id)}>
              <span>{number}</span>
              {label}
            </button>
          ))}
        </nav>

        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          <span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>
          <small>{theme === "light" ? "DARK" : "LIGHT"}</small>
        </button>

        <button className="nav-contact" onClick={() => scrollTo("contact")}>
          LET'S TALK
        </button>

        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        <section id="home" className="hero" ref={heroRef}>
          <div className="hero-inner">
            <div className="hero-top reveal">
              <div className="section-label">
                <span>01</span>
                INTRODUCTION
              </div>
              <div className="hero-location">
                <span className="pulse-dot" />
                INDIA / 2026
              </div>
            </div>

            <div className="hero-layout">
              <div className="hero-content">
                <p className="eyebrow reveal">AI / DATA / SOFTWARE</p>

                <h1 className="hero-title reveal">
                  BUILDING
                  <br />
                  <span className="gradient-text">INTELLIGENT</span>
                  <br />
                  <span className="outline-text">SYSTEMS.</span>
                </h1>

                <p className="hero-summary reveal">
                  I'm <strong>Priyam Srivastava</strong>, a Computer Science
                  student building practical systems across artificial
                  intelligence, machine learning, data analytics, generative AI
                  and software engineering.
                </p>

                <p className="hero-description reveal">
                  I enjoy turning data and emerging AI technologies into useful
                  products — from job-market intelligence and business
                  analytics to retrieval-augmented applications.
                </p>

                <div className="hero-actions reveal">
                  <button className="primary-button" onClick={() => scrollTo("work")}>
                    EXPLORE MY WORK <span aria-hidden="true">→</span>
                  </button>
                  <a
                    href="/resume.pdf"
                    className="secondary-button"
                    target="_blank"
                    rel="noreferrer"
                  >
                    VIEW RESUME <span aria-hidden="true">↗</span>
                  </a>
                </div>

                <div className="hero-socials reveal">
                  <a href="https://github.com/priyam200409" target="_blank" rel="noreferrer" className="social-highlight">
                    <span>GH</span> GITHUB
                  </a>
                  <a href="https://www.linkedin.com/in/priyamsrivastavaai/" target="_blank" rel="noreferrer" className="social-highlight">
                    <span>in</span> LINKEDIN
                  </a>
                  <a href="https://www.instagram.com/priyam3414/" target="_blank" rel="noreferrer" className="social-highlight">
                    <span>IG</span> INSTAGRAM
                  </a>
                </div>
              </div>

              <div className="hero-visual reveal">
                <div className="avatar-halo" aria-hidden="true" />
                <div className="avatar-orbit avatar-orbit-one" aria-hidden="true" />
                <div className="avatar-orbit avatar-orbit-two" aria-hidden="true" />

                <div className="avatar-stage">
                  <div className="avatar-frame">
                    <img
                      src="/avatar.png"
                      alt="Priyam Srivastava avatar"
                      className="avatar-image"
                    />
                  </div>
                  <div className="avatar-caption">PRIYAM / AI · DATA · SOFTWARE</div>
                </div>

                <div className="developer-id-card">
                  <div className="id-topline">
                    <span>DEVELOPER ID</span>
                    <span>PS / 2026</span>
                  </div>

                  <div className="id-main">
                    <div className="id-mini-photo">
                      <img src="/avatar.png" alt="" />
                    </div>

                    <div className="id-copy">
                      <strong>PRIYAM SRIVASTAVA</strong>
                      <span>COMPUTER SCIENCE · AI/ML</span>
                      <span>BUILDING INTELLIGENT SYSTEMS</span>
                    </div>
                  </div>

                  <div className="id-bottom">
                    <span>OPEN TO OPPORTUNITIES</span>
                    <span className="id-status"><i /> ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hero-footer reveal">
              <span className="mono">SCROLL TO EXPLORE</span>
              <div className="hero-line" />
              <span className="hero-scroll" aria-hidden="true">↓</span>
            </div>
          </div>
        </section>

        <section className="section domains-section">
          <div className="section-header reveal">
            <div className="section-number">02</div>
            <div>
              <span className="section-kicker">WHAT I DO</span>
              <h2>
                Turning data
                <br />
                into <em>intelligent direction.</em>
              </h2>
            </div>
          </div>

          <div className="domain-grid">
            {domains.map(([number, title, text], index) => (
              <article
                className="domain-card reveal"
                key={number}
                style={{ "--delay": `${index * 80}ms` }}
              >
                <div className="card-top"><span>{number}</span></div>
                <div className="domain-index-mark">{["AI", "GEN", "DATA", "DEV"][index]}</div>
                <h3>{title}</h3>
                <p>{text}</p>
                <div className="card-line" />
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="section work-section">
          <div className="section-header reveal">
            <div className="section-number">03</div>
            <div>
              <span className="section-kicker">SELECTED WORK</span>
              <h2>
                Projects built
                <br />
                with <em>purpose.</em>
              </h2>
              <p className="section-intro">
                A focused selection of analytics, business intelligence, RAG
                and AI assistant projects.
              </p>
            </div>
          </div>

          <div className="projects-list">
            {projects.map((project, index) => (
              <article
                key={project.number}
                className={`project-card reveal ${activeProject === index ? "active" : ""}`}
                onMouseEnter={() => setActiveProject(index)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="project-number">{project.number}</div>

                <div className="project-visual">
                  <div className="project-grid" />
                  <div className="project-glow" />
                  <div className="project-display">
                    <span>{project.visual}</span>
                    <strong>{project.sub}</strong>
                  </div>
                  
                </div>

                <div className="project-info">
                  <div className="project-meta-row">
                    <div className="project-category">{project.category}</div>
                    <span className="project-status">{project.status}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  {project.details && (
                    <ul className="project-details">
                      {project.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  )}

                  <div className="project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>

                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
                    )}
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noreferrer">LIVE PROJECT ↗</a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="section-header reveal">
            <div className="section-number">04</div>
            <div>
              <span className="section-kicker">TECHNICAL STACK</span>
              <h2>
                Technology I
                <br />
                <em>work with.</em>
              </h2>
            </div>
          </div>

          <div className="stack-container">
            {Object.entries(techStack).map(([category, technologies], index) => (
              <div className="stack-group reveal" key={category}>
                <div className="stack-heading">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{category}</h3>
                </div>

                <div className="stack-items">
                  {technologies.map((technology) => (
                    <span key={technology} className="stack-pill">
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="section-header reveal">
            <div className="section-number">05</div>
            <div>
              <span className="section-kicker">ABOUT / DIRECTION</span>
              <h2>
                Building toward
                <br />
                <em>intelligent systems.</em>
              </h2>
            </div>
          </div>

          <div className="about-grid">
            <div className="about-statement reveal">
              <span className="mono">PROFESSIONAL SUMMARY</span>
              <p className="large-copy">
                I'm Priyam Srivastava, a Computer Science student building
                practical systems across artificial intelligence, machine
                learning, data analytics, generative AI and software
                engineering.
              </p>
              <p>
                I enjoy turning data and emerging AI technologies into useful
                products — from job-market intelligence and business analytics
                to retrieval-augmented applications.
              </p>
              <p>
                My current direction is to grow into technically strong roles
                spanning AI/ML Engineering, Data Science, Data Analytics,
                Generative AI and Agentic AI.
              </p>
            </div>

            <div className="about-details reveal">
              <div className="detail-row"><span>EDUCATION</span><strong>B.Tech · Computer Science</strong></div>
              <div className="detail-row"><span>FOCUS</span><strong>AI / ML · Data · Generative AI</strong></div>
              <div className="detail-row"><span>APPROACH</span><strong>Build · Validate · Improve</strong></div>
              <div className="detail-row"><span>LOCATION</span><strong>India</strong></div>
            </div>
          </div>
        </section>

        <section className="career-section">
          <div className="career-inner reveal">
            <span className="section-kicker">CAREER DIRECTION</span>
            <h2>
              Growing toward
              <br />
              <em>AI-driven roles.</em>
            </h2>
            <p>
              Developing practical depth across machine learning, analytics,
              generative AI and software engineering while building projects
              that demonstrate real technical work.
            </p>
            <div className="career-targets">
              {careerTargets.map((target) => <span key={target}>{target}</span>)}
            </div>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <div className="contact-header reveal">
            <span className="section-kicker">06 / CONTACT</span>
            <h2>
              Let's build
              <br />
              <em>something useful.</em>
            </h2>
            <p>
              Have a project, opportunity or collaboration in mind? Send a
              message and I'll get back to you.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-side reveal">
              <div className="contact-label">DIRECT LINKS</div>
              <a className="big-social" href="https://github.com/priyam200409" target="_blank" rel="noreferrer">
                GITHUB <b>↗</b>
              </a>
              <a className="big-social" href="https://www.linkedin.com/in/priyamsrivastavaai/" target="_blank" rel="noreferrer">
                LINKEDIN <b>↗</b>
              </a>
              <a className="big-social" href="https://www.instagram.com/priyam3414/" target="_blank" rel="noreferrer">
                INSTAGRAM <b>↗</b>
              </a>
              <a className="resume-highlight" href="/resume.pdf" target="_blank" rel="noreferrer">
                VIEW RESUME <b>↗</b>
              </a>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark">PS</span>
            <div>
              <strong>PRIYAM SRIVASTAVA</strong>
              <span>AI / DATA / SOFTWARE</span>
            </div>
          </div>

          <div className="footer-links">
            <a href="https://github.com/priyam200409" target="_blank" rel="noreferrer">GITHUB</a>
            <a href="https://www.linkedin.com/in/priyamsrivastavaai/" target="_blank" rel="noreferrer">LINKEDIN</a>
            <a href="https://www.instagram.com/priyam3414/" target="_blank" rel="noreferrer">INSTAGRAM</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© PRIYAM SRIVASTAVA</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
