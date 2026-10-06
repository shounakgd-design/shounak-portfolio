const express = require("express");
const Contact = require("../models/Contact");
const requireAdmin = require("../middleware/requireAdmin");
const sendContactEmail = require("../services/formSubmit");

const router = express.Router();

// POST - Submit a contact message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    await sendContactEmail({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    const savedContact = await contact.save();

    res.status(201).json(savedContact);
  } catch (error) {
    res.status(error.message.includes("CONTACT_EMAIL") ? 503 : 502).json({
      message: "Failed to submit contact form",
    });
  }
});

// GET - Get all contact messages
router.get("/", requireAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact messages",
      error: error.message,
    });
  }
});

// GET - Get one contact message
router.get("/:id", requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contact message",
      error: error.message,
    });
  }
});

// DELETE - Delete a contact message
router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact message not found",
      });
    }

    res.status(200).json({
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact message",
      error: error.message,
    });
  }
});

module.exports = router;