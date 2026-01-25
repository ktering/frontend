const SearchBar = ({ onSearch }) => {
  return (
    <div className="flex justify-center my-4">
      <input
        type="text"
        placeholder="Search dishes..."
        className="border border-gray-300 px-4 py-2 rounded-full text-sm w-full max-w-md"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
