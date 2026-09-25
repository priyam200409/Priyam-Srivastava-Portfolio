import { useState } from "react";

const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

const INITIAL_FORM = {
  name: "",
  email: "",
  subject_line: "",
  message: "",
};

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (status !== "idle") {
      setStatus("idle");
      setStatusMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "sending") return;

    if (!ACCESS_KEY) {
      setStatus("error");
      setStatusMessage(
        "The contact form is not configured. Add VITE_WEB3FORMS_ACCESS_KEY to .env.local and restart Vite."
      );
      return;
    }

    setStatus("sending");
    setStatusMessage("Sending your message...");

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    formData.set("access_key", ACCESS_KEY);
    formData.set(
      "subject",
      `Portfolio Contact — ${form.subject_line || "New message"}`
    );
    formData.set("from_name", form.name || "Portfolio Visitor");
    formData.set("replyto", form.email);
    formData.set("botcheck", "");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || `Submission failed with status ${response.status}.`
        );
      }

      setStatus("success");
      setStatusMessage(
        "Message sent successfully. I'll get back to you soon."
      );
      setForm(INITIAL_FORM);
    } catch (error) {
      console.error("Web3Forms submission error:", error);

      setStatus("error");
      setStatusMessage(
        "Your message could not be sent. Please try again or use the direct links."
      );
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="contact-form-intro">
        <span className="contact-form-kicker">SEND A MESSAGE</span>
        <h3>Start a conversation.</h3>
        <p>
          Tell me what you are building, the opportunity you have in mind,
          or what you would like to discuss.
        </p>
      </div>

      <div className="form-row">
        <label>
          <span>01 / NAME</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            maxLength={100}
            required
          />
        </label>

        <label>
          <span>02 / EMAIL</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={160}
            required
          />
        </label>
      </div>

      <label>
        <span>03 / SUBJECT</span>
        <input
          type="text"
          name="subject_line"
          value={form.subject_line}
          onChange={handleChange}
          placeholder="Project, opportunity or collaboration"
          maxLength={180}
          required
        />
      </label>

      <label>
        <span>04 / MESSAGE</span>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={7}
          placeholder="Write your message here..."
          maxLength={3000}
          required
        />
      </label>

      <input
        type="checkbox"
        name="botcheck"
        tabIndex="-1"
        autoComplete="off"
        className="botcheck"
        aria-hidden="true"
      />

      <div className="contact-submit-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="primary-button contact-submit"
          aria-busy={status === "sending"}
        >
          <span>
            {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
          </span>
          <span aria-hidden="true">
            {status === "sending" ? "…" : "↗"}
          </span>
        </button>

        <div
          className={`form-status ${status}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusMessage}
        </div>
      </div>

    </form>
  );
}
