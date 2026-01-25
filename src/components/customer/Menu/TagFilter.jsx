const TagFilter = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      {tags.map((tag) => (
        <button
          key={tag}
          className={`px-3 py-1 rounded-full text-sm border transition ${
            selectedTag === tag
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-800 border-gray-300 hover:border-primary"
          }`}
          onClick={() => onSelectTag(tag)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;
