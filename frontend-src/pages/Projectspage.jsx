import { useEffect, useMemo, useState } from "react";

import Header from "../components/shared/Header";
import Navbar from "../components/shared/Navbar";
import ProjectCard from "../components/ProjectsCard";
import SearchBar from "../components/projectpage/searchbar";
import SortSelect from "../components/projectpage/sortnselect";
import TagFilter from "../components/projectpage/tagfilter";
import Footer from "../components/shared/Footer";

import { usePortfolioData } from "../services/usePortfolioData";

export default function Projectspage() {
  const { projects } = usePortfolioData();
  // -----------------------------
  // UI state
  // -----------------------------

  const [menuOpen, setMenuOpen] = useState(false);

  // Search, sort and tag state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedTag, setSelectedTag] = useState("All");

  // -----------------------------
  // Close menu with Escape
  // -----------------------------

  useEffect(() => {
    function closeMenu(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("keydown", closeMenu);

    return () => {
      document.removeEventListener("keydown", closeMenu);
    };
  }, []);

  // -----------------------------
  // Navigation
  // -----------------------------

  function navigate() {
    setMenuOpen(false);
  }

  // -----------------------------
  // Get all unique tags
  // -----------------------------

  const tags = useMemo(() => {
    const allTags = projects.flatMap((project) => {
      return Array.isArray(project.tags) ? project.tags : [];
    });

    return [...new Set(allTags)].sort();
  }, [projects]);

  // -----------------------------
  // Filter + Search + Sort
  // -----------------------------

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // -------------------------
    // SEARCH
    // -------------------------

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((project) => {
        const title = project.title?.toLowerCase() || "";
        const description = project.description?.toLowerCase() || "";

        const projectTags = Array.isArray(project.tags)
          ? project.tags.join(" ").toLowerCase()
          : "";

        const technologies = Array.isArray(project.technologies)
          ? project.technologies.join(" ").toLowerCase()
          : "";

        return (
          title.includes(searchValue) ||
          description.includes(searchValue) ||
          projectTags.includes(searchValue) ||
          technologies.includes(searchValue)
        );
      });
    }

    // -------------------------
    // TAG FILTER
    // -------------------------

    if (selectedTag !== "All") {
      result = result.filter((project) => {
        if (!Array.isArray(project.tags)) {
          return false;
        }

        return project.tags.includes(selectedTag);
      });
    }

    // -------------------------
    // SORT
    // -------------------------

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => {
          return getProjectDate(b) - getProjectDate(a);
        });
        break;

      case "oldest":
        result.sort((a, b) => {
          return getProjectDate(a) - getProjectDate(b);
        });
        break;

      case "az":
        result.sort((a, b) => {
          return (a.title || "").localeCompare(b.title || "");
        });
        break;

      case "za":
        result.sort((a, b) => {
          return (b.title || "").localeCompare(a.title || "");
        });
        break;

      case "featured":
      default:
        result.sort((a, b) => {
          // Featured projects first
          const featuredA = a.featured ? 1 : 0;
          const featuredB = b.featured ? 1 : 0;

          if (featuredA !== featuredB) {
            return featuredB - featuredA;
          }

          // Then alphabetical
          return (a.title || "").localeCompare(b.title || "");
        });

        break;
    }

    return result;
  }, [projects, search, selectedTag, sortBy]);

  // -----------------------------
  // Helper for project dates
  // -----------------------------

  function getProjectDate(project) {
    const date =
      project.date ||
      project.createdAt ||
      project.year ||
      0;

    const timestamp = new Date(date).getTime();

    return Number.isNaN(timestamp) ? 0 : timestamp;
  }

  // -----------------------------
  // Reset filters
  // -----------------------------

  function resetFilters() {
    setSearch("");
    setSelectedTag("All");
    setSortBy("featured");
  }

  // -----------------------------
  // JSX
  // -----------------------------

  return (
    <div className="wrap">

      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
      />

      <Navbar
        menuOpen={menuOpen}
        onNavigate={navigate}
      />

      <main id="project">

        {/* Search + Sort */}
        <div className="searchfilter">

          <SearchBar
            search={search}
            onSearch={setSearch}
          />

          <SortSelect
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

        </div>

        {/* Tags */}
        <div className="tags">

          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />

        </div>

        {/* Projects */}
        <div
          className="projects"
          id="projects-grid"
        >

          {filteredProjects.length > 0 ? (

            filteredProjects.map((project) => (
              <div
                className="project-grid-item"
                key={project.id || project.title}
              >
                <ProjectCard project={project} />
              </div>
            ))

          ) : (

            <div className="no-projects">
              <h3>No projects found</h3>

              <p>
                Try changing your search or filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
              >
                Clear filters
              </button>
            </div>

          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}
