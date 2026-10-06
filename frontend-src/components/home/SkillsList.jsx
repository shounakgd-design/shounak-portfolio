import { ICON } from "../../src/data/icons";
import { usePortfolioData } from "../../services/usePortfolioData";

function SkillList() {
  const { skills } = usePortfolioData();
  return (
    <div className="skills">
      {skills.map((skill) => (
        <div
          className="skill"
          key={skill.name}
          style={{ "--c": skill.color }}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d={ICON[skill.icon] || ICON.java} />
          </svg>

          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  );
}

export default SkillList;