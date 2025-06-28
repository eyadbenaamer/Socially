import React from "react";
import { Link } from "react-router-dom";
import { User, Image, MessageSquare } from "lucide-react";

const SearchResults = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin circle h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No results found. Try a different search term.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <Link to={`/${result.type}/${result.id}`} className="block">
            <div className="flex items-start space-x-4">
              {result.type === "user" && (
                <div className="flex-shrink-0">
                  {result.avatar ? (
                    <img
                      src={result.avatar}
                      alt={result.name}
                      className="w-12 h-12 circle object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 circle bg-gray-200 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              )}
              {result.type === "post" && (
                <div className="flex-shrink-0">
                  {result.image ? (
                    <img
                      src={result.image}
                      alt="Post thumbnail"
                      className="w-12 h-12 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                      <Image className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {result.title || result.name}
                </h3>
                {result.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {result.description}
                  </p>
                )}
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  {result.type === "post" && (
                    <>
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{result.commentCount || 0} comments</span>
                    </>
                  )}
                  {result.type === "user" && (
                    <span>{result.followers || 0} followers</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
