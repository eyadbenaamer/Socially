import Profile from "../models/profile.js";
import { client } from "../services/elasticsearch.js";
import { handleError } from "../utils/errorHandler.js";

const INDEX_NAME = "profiles";

// Build search query for partial and fuzzy matching
const buildSearchQuery = (searchTerm) => {
  const term = searchTerm.trim().toLowerCase();
  const terms = term.split(/\s+/); // Split by one or more spaces

  return {
    bool: {
      should: [
        // Full name search using multi_match
        {
          multi_match: {
            query: term,
            fields: ["firstName^3", "lastName^3", "username^2"],
            type: "best_fields",
            operator: "or",
            boost: 4,
          },
        },
        // Individual term search
        ...terms.map((t) => ({
          multi_match: {
            query: t,
            fields: ["firstName^2", "lastName^2", "username^1.5"],
            type: "best_fields",
            operator: "or",
            boost: 2,
          },
        })),
        // Wildcard matches for partial text
        {
          bool: {
            should: [
              { wildcard: { username: { value: `*${term}*`, boost: 1.5 } } },
              { wildcard: { firstName: { value: `*${term}*`, boost: 1 } } },
              { wildcard: { lastName: { value: `*${term}*`, boost: 1 } } },
            ],
          },
        },
        // Fuzzy matches for typo tolerance
        {
          bool: {
            should: [
              {
                fuzzy: {
                  username: { value: term, fuzziness: "AUTO", boost: 0.8 },
                },
              },
              {
                fuzzy: {
                  firstName: { value: term, fuzziness: "AUTO", boost: 0.7 },
                },
              },
              {
                fuzzy: {
                  lastName: { value: term, fuzziness: "AUTO", boost: 0.7 },
                },
              },
            ],
          },
        },
      ],
      minimum_should_match: 1,
    },
  };
};

// Build prefix query for autocomplete
const buildPrefixQuery = (searchTerm) => {
  const term = searchTerm.trim().toLowerCase();
  return {
    bool: {
      should: [
        {
          prefix: {
            username: {
              value: term,
              boost: 2.0,
            },
          },
        },
        {
          prefix: {
            firstName: {
              value: term,
              boost: 1.0,
            },
          },
        },
        {
          prefix: {
            lastName: {
              value: term,
              boost: 1.0,
            },
          },
        },
      ],
      minimum_should_match: 1,
    },
  };
};

// Process search results and fetch full profile data
const processSearchResults = async (searchResults) => {
  const ids = searchResults.hits.hits.map((hit) => hit._id);
  const profiles = await Profile.find({ _id: { $in: ids } }).lean();

  // Create a map for quick lookup
  const profilesMap = new Map(
    profiles.map((profile) => [profile._id.toString(), profile])
  );

  // Return profiles in the same order as search results
  return ids
    .map((id) => {
      const profile = profilesMap.get(id);
      if (!profile) return null;

      return {
        ...profile,
        followers: Array.isArray(profile.followers)
          ? profile.followers.length
          : 0,
        following: Array.isArray(profile.following)
          ? profile.following.length
          : 0,
      };
    })
    .filter(Boolean);
};

// Main search endpoint
export const search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query?.trim()) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchResults = await client.search({
      index: INDEX_NAME,
      query: buildSearchQuery(query),
    });

    const profiles = await processSearchResults(searchResults);
    return res.json(profiles);
  } catch (err) {
    return handleError(err, res);
  }
};

// Autocomplete endpoint
export const autocomplete = async (req, res) => {
  try {
    const { text } = req.query;

    if (!text?.trim()) {
      return res.json([]);
    }

    const searchResults = await client.search({
      index: INDEX_NAME,
      query: buildPrefixQuery(text),
      size: 20,
      sort: [{ _score: { order: "desc" } }],
    });

    // Extract unique suggestions from results while preserving order
    const seen = new Set();
    const suggestions = searchResults.hits.hits
      .map((hit) => {
        const source = hit._source;
        const results = [];

        // Add username if it matches
        if (source.username.toLowerCase().startsWith(text.toLowerCase())) {
          results.push(source.username.toLowerCase());
        }

        // Add first name if it matches
        if (source.firstName.toLowerCase().startsWith(text.toLowerCase())) {
          results.push(source.firstName.toLowerCase());
        }

        // Add last name if it matches
        if (source.lastName.toLowerCase().startsWith(text.toLowerCase())) {
          results.push(source.lastName.toLowerCase());
        }

        // Add full name if it matches
        const fullName = `${source.firstName} ${source.lastName}`.toLowerCase();
        if (fullName.startsWith(text.toLowerCase())) {
          results.push(fullName);
        }

        return results;
      })
      .flat()
      .filter((suggestion) => {
        if (seen.has(suggestion)) return false;
        seen.add(suggestion);
        return true;
      })
      .slice(0, 10); // Limit to 10 results after deduplication

    return res.json(suggestions);
  } catch (err) {
    return handleError(err, res);
  }
};
