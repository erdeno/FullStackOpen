const Filter = ({ searchQuery, handleSearch }) => (
  <div>
    find countries:
    <input
      value={searchQuery}
      onChange={handleSearch} />
  </div>
)

export default Filter