import SectionHeader from "../shared/SectionHeader";
import { usePortfolioData } from "../../services/usePortfolioData";

function Experience() {
  const { experience } = usePortfolioData();
  return (
    <section id="experience">
      <SectionHeader title="Experience" />

      <div className="card">
        {experience.map((item) => (
          <div className="job" key={`${item.title}-${item.organization}`}>
            <time>{item.period}</time>
            <div>
              <h3>{item.title}</h3>
              <p>{[item.organization, item.description].filter(Boolean).join(". ")}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Experience;
