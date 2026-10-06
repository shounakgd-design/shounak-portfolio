import { createContext } from "react";
import { blogs, experience, profile, projects, skills } from "../src/data/profile";

export const PortfolioDataContext = createContext({
	profile,
	skills,
	experience,
	projects,
	blogs,
});