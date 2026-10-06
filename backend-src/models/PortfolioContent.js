const mongoose = require("mongoose");

const socialSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    handle: { type: String, trim: true },
    url: { type: String, trim: true },
    color: { type: String, trim: true, default: "#5b5bf0" },
    icon: { type: String, trim: true, default: "instagram" },
  },
  { _id: false }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    color: { type: String, trim: true, default: "#5b5bf0" },
    icon: { type: String, trim: true, default: "java" },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    period: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    organization: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const portfolioContentSchema = new mongoose.Schema(
  {
    key: { type: String, default: "portfolio", unique: true },
    name: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    avatar: { type: String, trim: true, default: "" },
    email: { type: String, trim: true, lowercase: true, default: "" },
    about: { type: String, trim: true, default: "" },
    about2: { type: String, trim: true, default: "" },
    socials: { type: [socialSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    experience: { type: [experienceSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PortfolioContent", portfolioContentSchema);