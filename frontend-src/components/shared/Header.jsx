import Avatar from "../home/Avatar";
import { usePortfolioData } from "../../services/usePortfolioData";

function Header({ menuOpen, onMenuToggle }) {
  const { profile } = usePortfolioData();
  return (
    <header>
      <div className="id">
        <Avatar src={profile.avatar} alt={`Portrait of ${profile.name}`} />

        <div>
          <h1 id="name">{profile.name}</h1>
          <p id="role">{profile.role}</p>
        </div>
      </div>

      <button
        className="burger"
        id="burger"
        type="button"
        aria-label="Open menu"
        aria-expanded={menuOpen}
        aria-controls="menu"
        onClick={onMenuToggle}
      >
        <span />
      </button>
    </header>
  );
}

export default Header;
