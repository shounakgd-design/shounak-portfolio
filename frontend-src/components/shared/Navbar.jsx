function Navbar({ menuOpen, onNavigate }) {
  const links = [
    ["About", "#about"],
    ["Skills", "#skills"],
    ["Experience", "#experience"],
    ["Projects", "/projects"],
    ["Blogs", "/blogs"],
    // ["Gallery", "#gallery"],
    ["Contact", "#contact"],
  ];

  return (
    <nav id="menu" className={menuOpen ? "open" : ""} aria-label="Sections">
      {links.map(([label, href]) => (
        <a key={href} href={href} onClick={onNavigate}>
          {label}
        </a>
      ))}
    </nav>
  );
}

export default Navbar;
