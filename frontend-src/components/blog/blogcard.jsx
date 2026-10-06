
import { formatDate } from "../../src/utils/format";

const TAG_COLORS = [
  "#5b5bf0",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#0ea5e9",
  "#8b5cf6",
];

function BlogCard({ blog, index }) {
  return (
    <a
      className="blog"
      href={`#/blogs/${blog.id}`}
      style={{
        "--c": TAG_COLORS[index % TAG_COLORS.length],
      }}
    >
      {/* Blog number */}
      <b>{index + 1}</b>

      {/* Blog content */}
      <div className="blog-content">
        <h3>{blog.title}</h3>

        <p>{blog.excerpt}</p>
      </div>

      {/* Blog metadata */}
      <small>
        {formatDate(blog.date)} · {blog.mins} min
      </small>
    </a>
  );
}

export default BlogCard;

