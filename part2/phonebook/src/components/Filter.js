const Filter = ({ searchQuery, handleSearch }) => (
  <div>
    filter shown with:
    <input
      value={searchQuery}
      onChange={handleSearch} />
  </div>
)

export default Filter