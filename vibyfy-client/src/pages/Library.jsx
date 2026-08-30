import library from "../data/library";
import LibraryCard from "../components/cards/LibraryCard";

const Library = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        Your Library
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {library.map((item) => (
          <LibraryCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

export default Library;