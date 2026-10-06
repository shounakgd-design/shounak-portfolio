import SectionHeader from "../shared/SectionHeader";
import { usePortfolioData } from "../../services/usePortfolioData";

function About() {
  const { profile } = usePortfolioData();
  return (
    <section id="about">
      <SectionHeader title="About" />

      <div className="card">
        <p className="lead" id="about-text">
          {profile.about}
          <span>{profile.about2}</span>
        </p>
      </div>
    </section>
  );
}

export default About;
