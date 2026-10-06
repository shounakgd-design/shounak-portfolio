import { useEffect, useState } from "react";
import {
  blogs as fallbackBlogs,
  experience as fallbackExperience,
  profile as fallbackProfile,
  projects as fallbackProjects,
  skills as fallbackSkills,
} from "../src/data/profile";
import {
  fetchBlogs,
  fetchPortfolioContent,
  fetchProjects,
  savePortfolioContent as saveContentRequest,
} from "./portfolioApi";
import { PortfolioDataContext } from "./portfolioDataStore";

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState({
    profile: fallbackProfile,
    skills: fallbackSkills,
    experience: fallbackExperience,
    projects: fallbackProjects,
    blogs: fallbackBlogs,
  });

  useEffect(() => {
    fetchProjects()
      .then((projects) => setData((current) => ({ ...current, projects })))
      .catch(() => {});

    fetchBlogs()
      .then((blogs) => setData((current) => ({ ...current, blogs })))
      .catch(() => {});

    fetchPortfolioContent()
      .then((content) => {
        if (!content) return;
        const { name, role, avatar, email, about, about2, skills, experience, socials } = content;
        setData((current) => ({
          ...current,
          profile: { ...current.profile, name, role, avatar, email, about, about2, socials },
          skills: skills || [],
          experience: experience || [],
        }));
      })
      .catch(() => {});
  }, []);

  async function refreshProjects() {
    const projects = await fetchProjects();
    setData((current) => ({ ...current, projects }));
    return projects;
  }

  async function refreshBlogs() {
    const blogs = await fetchBlogs();
    setData((current) => ({ ...current, blogs }));
    return blogs;
  }

  async function saveContent(content, adminKey) {
    const savedContent = await saveContentRequest(content, adminKey);
    const { name, role, avatar, email, about, about2, skills, experience, socials } = savedContent;
    setData((current) => ({
      ...current,
      profile: { ...current.profile, name, role, avatar, email, about, about2, socials },
      skills: skills || [],
      experience: experience || [],
    }));
    return savedContent;
  }

  return (
    <PortfolioDataContext.Provider
      value={{ ...data, refreshProjects, refreshBlogs, saveContent }}
    >
      {children}
    </PortfolioDataContext.Provider>
  );
}
