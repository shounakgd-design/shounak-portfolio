import { useState } from "react";
import { profile } from "../../src/data/profile";
import { ICON } from "../../src/data/icons";
import { submitContactMessage } from "../../services/portfolioApi";

function Contact() {
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    setSending(true);
    setStatus("");

    try {
      const data = new FormData(form);
      await submitContactMessage({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
      });
      form.reset();
      setStatus("Thanks! Your message was sent. I'll get back to you soon.");
    } catch {
      setStatus(
        "Couldn't send your message. Please try again in a moment."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="head" style={{ justifyContent: "center" }}>
        <h2>Contact</h2>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="_honey"
            tabIndex="-1"
            autoComplete="off"
            style={{ display: "none" }}
          />

          <input
            type="hidden"
            name="_template"
            value="table"
          />

          <div className="row">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              aria-label="Your name"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              aria-label="Email address"
              required
            />
          </div>

          <textarea
            name="message"
            placeholder="Your message"
            aria-label="Your message"
            required
          />

          <button
            className="send"
            type="submit"
            disabled={sending}
          >
            {sending ? "Sending…" : "Send message"}
          </button>

          <p id="ok" role="status">
            {status}
          </p>
        </form>
      </div>

      <div className="socials" aria-label="Social links">
        <span className="socials-label">Find me on</span>

        {profile.socials.map((social) => (
          <a
            className="social"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--c": social.color }}
            aria-label={`${social.name} ${social.handle}`}
            key={social.name}
          >
            <i>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {ICON[social.icon]}
              </svg>
            </i>

            {social.handle}
          </a>
        ))}
      </div>
    </section>
  );
}

export default Contact;
