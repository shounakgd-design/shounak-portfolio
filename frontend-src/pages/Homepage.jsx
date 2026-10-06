import { useEffect, useState } from "react";

import Header from "../components/shared/Header";
import Navbar from "../components/shared/Navbar";
import About from "../components/home/About";
import Skills from "../components/home/Skills";
import Experience from "../components/home/Experience";
import ProjectsPreview from "../components/home/ProjectsPreview";
import BlogPreview from "../components/home/BlogsPreview";
// import Gallery from "../components/home/Gallery";
import Contact from "../components/home/Contact";
import Footer from "../components/shared/Footer";

function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);

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

  function navigate() {
    setMenuOpen(false);
  }

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

      <main id="home">
        <About />
        <Skills />
        <Experience />
        <ProjectsPreview />
        <BlogPreview />
        {/* <Gallery /> */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;
