import { useState } from "react";
import SectionHeader from "../shared/SectionHeader";
import ProjectCard from "../ProjectsCard";
import { usePortfolioData } from "../../services/usePortfolioData";

const PER_PAGE = 4;

function ProjectsPreview() {
  const { projects } = usePortfolioData();
  const [page, setPage] = useState(0);

  const pages = Math.ceil(projects.length / PER_PAGE);

  const visibleProjects = projects.slice(
    page * PER_PAGE,
    page * PER_PAGE + PER_PAGE
  );

  return (
    <section id="projects">

      <SectionHeader
        title="Projects"
        action={
          <a className="more" href="/projects">
            View more ›
          </a>
        }
      />

      <div className="projects" id="projects-grid">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.title}
            project={project}
          />
        ))}
      </div>

      <div className="dots" id="dots">
        {Array.from({ length: pages }, (_, index) => (
          <button
            key={index}
            className={index === page ? "on" : ""}
            aria-label={`Projects page ${index + 1}`}
            onClick={() => setPage(index)}
          />
        ))}
      </div>

    </section>
  );
}

export default ProjectsPreview;