import { art } from "../src/utils/art";
import { formatDate } from "../src/utils/format";

const TAG_COLORS = [
  "#5b5bf0",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
];

function ProjectCard({ project, full = false }) {
  return (
    <a className="proj" href={project.link}>
      <div className="thumb">
        <img
          src={project.image || art(project.n * 97 + 11, true)}
          alt={`${project.title} preview`}
          loading="lazy"
        />

        {full && <span className="cat">{project.cat}</span>}

        <b>View project</b>
      </div>

      <div className="t">
        <h3>
          {project.title}
          {project.featured && (
            <span className="star" title="Featured">
              ★
            </span>
          )}
        </h3>

        <p>{project.desc}</p>

        <div className="tags">
          {project.tags.map((tag, index) => (
            <em
              key={tag}
              style={{
                "--c": TAG_COLORS[(project.n + index) % 6],
              }}
            >
              {tag}
            </em>
          ))}
        </div>

        {full && (
          <small className="date">
            {formatDate(project.date)}
          </small>
        )}
      </div>
    </a>
  );
}

export default ProjectCard;
