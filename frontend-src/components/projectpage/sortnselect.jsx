function SortSelect({ sortBy, setSortBy }) {
return ( <div className="filter-group">
{/* 
  <label htmlFor="sort-projects">
    Sort
  </label> */}

  <select
    id="sort-projects"
    value={sortBy}
    onChange={(event) => setSortBy(event.target.value)}
  >

    <option value="featured">
      Featured
    </option>

    <option value="newest">
      Newest
    </option>

    <option value="oldest">
      Oldest
    </option>

    <option value="az">
      A → Z
    </option>

    <option value="za">
      Z → A
    </option>

  </select>

</div>

);
}

export default SortSelect;
