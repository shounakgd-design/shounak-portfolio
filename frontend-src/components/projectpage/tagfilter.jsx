function TagFilter({
  tags,
  selectedTag,
  setSelectedTag,
}) {
  return (
    <div className="filter-group tags-filter">

      {/* <label>
        Tags
      </label> */}

      <div className="tag-buttons">

        <button
          type="button"
          className={selectedTag === "All" ? "active" : ""}
          onClick={() => setSelectedTag("All")}
        >
          All
        </button>

        {tags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={selectedTag === tag ? "active" : ""}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}

      </div>

    </div>
  );
}

export default TagFilter;