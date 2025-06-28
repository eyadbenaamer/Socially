import React, { useRef, useEffect } from "react";

import { ReactComponent as SearchIcon } from "assets/icons/search.svg";
import { ReactComponent as CrossIcon } from "assets/icons/cross.svg";

const SearchInput = ({ query, setQuery, suggestions, loading }) => {
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setQuery]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <CrossIcon className="w-5" />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="animate-spin circle h-5 w-5 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
