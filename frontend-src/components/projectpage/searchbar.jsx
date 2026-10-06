function SearchBar({ search, onSearch }) {
  function handleChange(event) {
    onSearch(event.target.value);
  }

  function clearSearch() {
    onSearch("");
  }

  return (
    <div className="search-bar">

      <div className="search-input-wrapper">

        <span className="search-icon">
          🔍
        </span>

        <input
          type="text"
          value={search}
          onChange={handleChange}
          placeholder="Search projects..."
          aria-label="Search projects"
        />

        {search && (
          <button
            type="button"
            className="search-clear"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            ×
          </button>
        )}

      </div>

    </div>
  );
}

export default SearchBar;
