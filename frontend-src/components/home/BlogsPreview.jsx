
import BlogCard from "../blog/blogcard";
import { usePortfolioData } from "../../services/usePortfolioData";
function BlogPreview() {
  const { blogs } = usePortfolioData();
  return (
    <section id="blogs">

      {/* Section heading */}
      <div className="head">

        <h2>Blogs</h2>

        <a
          className="more"
          href="#/blogs"
        >
          View more ›
        </a>

      </div>

      {/* Blog cards */}
      <div id="blogs-list">

        {blogs.map((blog, index) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            index={index}
          />
        ))}

      </div>

    </section>
  );
}

export default BlogPreview;

