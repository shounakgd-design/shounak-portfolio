import { useEffect, useMemo, useState } from "react";

import Header from "../components/shared/Header";
import Navbar from "../components/shared/Navbar";
import BlogCard from "../components/blog/blogcard";
import SearchBar from "../components/projectpage/searchbar";
import SortSelect from "../components/projectpage/sortnselect";
import TagFilter from "../components/projectpage/tagfilter";
import Footer from "../components/shared/Footer";

import { usePortfolioData } from "../services/usePortfolioData";

export default function Blogspage() {
  const { blogs } = usePortfolioData();

  // =====================================================
  // UI STATE
  // =====================================================

  const [menuOpen, setMenuOpen] = useState(false);

  // Search / sort / tag state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTag, setSelectedTag] = useState("All");


  // =====================================================
  // CLOSE MENU WITH ESCAPE
  // =====================================================

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


  // =====================================================
  // NAVIGATION
  // =====================================================

  function navigate() {
    setMenuOpen(false);
  }


  // =====================================================
  // GET ALL UNIQUE BLOG TAGS
  // =====================================================

  const tags = useMemo(() => {

    const allTags = blogs.flatMap((blog) => {

      return Array.isArray(blog.tags)
        ? blog.tags
        : [];

    });

    return [...new Set(allTags)].sort();

  }, [blogs]);


  // =====================================================
  // SEARCH + TAG FILTER + SORT
  // =====================================================

  const filteredBlogs = useMemo(() => {

    let result = [...blogs];


    // ---------------------------------------------------
    // SEARCH
    // ---------------------------------------------------

    const searchValue = search.trim().toLowerCase();

    if (searchValue) {

      result = result.filter((blog) => {

        const title =
          blog.title?.toLowerCase() || "";

        const excerpt =
          blog.excerpt?.toLowerCase() || "";

        const content =
          blog.content?.toLowerCase() || "";

        const blogTags =
          Array.isArray(blog.tags)
            ? blog.tags.join(" ").toLowerCase()
            : "";

        return (
          title.includes(searchValue) ||
          excerpt.includes(searchValue) ||
          content.includes(searchValue) ||
          blogTags.includes(searchValue)
        );

      });

    }


    // ---------------------------------------------------
    // TAG FILTER
    // ---------------------------------------------------

    if (selectedTag !== "All") {

      result = result.filter((blog) => {

        if (!Array.isArray(blog.tags)) {
          return false;
        }

        return blog.tags.includes(selectedTag);

      });

    }


    // ---------------------------------------------------
    // SORT
    // ---------------------------------------------------

    switch (sortBy) {

      case "newest":

        result.sort((a, b) => {
          return getBlogDate(b) - getBlogDate(a);
        });

        break;


      case "oldest":

        result.sort((a, b) => {
          return getBlogDate(a) - getBlogDate(b);
        });

        break;


      case "az":

        result.sort((a, b) => {

          return (a.title || "").localeCompare(
            b.title || ""
          );

        });

        break;


      case "za":

        result.sort((a, b) => {

          return (b.title || "").localeCompare(
            a.title || ""
          );

        });

        break;


      default:

        result.sort((a, b) => {
          return getBlogDate(b) - getBlogDate(a);
        });

        break;

    }


    return result;

  }, [blogs, search, selectedTag, sortBy]);


  // =====================================================
  // BLOG DATE HELPER
  // =====================================================

  function getBlogDate(blog) {

    const date =
      blog.date ||
      blog.createdAt ||
      blog.year ||
      0;

    const timestamp =
      new Date(date).getTime();

    return Number.isNaN(timestamp)
      ? 0
      : timestamp;

  }


  // =====================================================
  // RESET FILTERS
  // =====================================================

  function resetFilters() {

    setSearch("");
    setSelectedTag("All");
    setSortBy("newest");

  }


  // =====================================================
  // JSX
  // =====================================================

  return (

    <div className="wrap">

      {/* HEADER */}

      <Header
        menuOpen={menuOpen}
        onMenuToggle={() =>
          setMenuOpen((value) => !value)
        }
      />


      {/* NAVBAR */}

      <Navbar
        menuOpen={menuOpen}
        onNavigate={navigate}
      />


      {/* BLOG PAGE */}

      <main id="blogs-page">


        {/* PAGE HEADER */}

        <div className="blogs-page-header">

          <div>

            <h1>Blogs</h1>

            <p>
              Thoughts, tutorials and things
              I've learned while building.
            </p>

          </div>

        </div>


        {/* SEARCH + SORT */}

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


        {/* TAG FILTER */}

        <div className="tags">

          <TagFilter
            tags={tags}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
          />

        </div>


        {/* BLOG GRID */}

        <div
          className="blogs-grid"
          id="blogs-grid"
        >

          {filteredBlogs.length > 0 ? (

            filteredBlogs.map((blog, index) => (

              <BlogCard
                key={blog.id || blog.title}
                blog={blog}
                index={index}
              />

            ))

          ) : (

            <div className="no-blogs">

              <h3>
                No blogs found
              </h3>

              <p>
                Try changing your search
                or filters.
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


      {/* FOOTER */}

      <Footer />

    </div>

  );

}

