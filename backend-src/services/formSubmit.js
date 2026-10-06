const PortfolioContent = require("../models/PortfolioContent");

async function sendContactEmail({ name, email, message }) {
  const content = await PortfolioContent.findOne({ key: "portfolio" });
  const recipient = content?.email || process.env.CONTACT_EMAIL;

  if (!recipient) {
    throw new Error("CONTACT_EMAIL is not configured on the server.");
  }

  const form = new FormData();
  form.append("name", name);
  form.append("email", email);
  form.append("message", message);
  form.append("_subject", `New portfolio message from ${name}`);
  form.append("_template", "table");

  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      body: form,
    }
  );
  const result = await response.json().catch(() => ({}));

  if (!response.ok || String(result.success) !== "true") {
    throw new Error(result.message || "The email service rejected the message.");
  }
}

module.exports = sendContactEmail;