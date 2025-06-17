import mongoose from "mongoose";
import { Client } from "@elastic/elasticsearch";

import Profile from "../models/profile.js";

const MONGO_URI = process.env.MONGO_URI;
await mongoose.connect(MONGO_URI);

const client = new Client({
  node: process.env.ELASTICSEARCH_URL, // Adjust as needed
  auth: {
    username: process.env.ELASTICSEARCH_USER,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const deleteAllIndices = async () => {
  try {
    const indices = await client.cat.indices({ format: "json" });
    const indexNames = indices.body.map((index) => index.index);
    for (const name of indexNames) {
      await client.indices.delete({ index: name });
      console.log(`Deleted index: ${name}`);
    }
  } catch (err) {
    console.error("Error deleting indices:", err.meta?.body?.error || err);
  }
};

const createProfilesIndex = async () => {
  try {
    await client.indices.create({
      index: "profiles",
      body: {
        mappings: {
          properties: {
            username: { type: "keyword" },
            firstName: { type: "text" },
            lastName: { type: "text" },
            suggest: {
              type: "completion",
            },
          },
        },
      },
    });
    console.log("Created 'profiles' index with mapping.");
  } catch (err) {
    console.error("Error creating index:", err.meta?.body?.error || err);
  }
};

const indexProfiles = async () => {
  const profiles = await Profile.find({});
  console.log(`Found ${profiles.length} profiles.`);

  for (const doc of profiles) {
    try {
      await client.index({
        index: "profiles",
        id: doc._id.toString(),
        document: {
          username: doc.username,
          firstName: doc.firstName,
          lastName: doc.lastName,
          suggest: {
            input: [doc.username, doc.firstName, doc.lastName],
          },
        },
      });
      console.log(`Indexed profile: ${doc.username}`);
    } catch (err) {
      console.error(
        `Failed to index profile ${doc._id}:`,
        err.meta?.body?.error || err
      );
    }
  }

  await client.indices.refresh({ index: "profiles" });
  console.log("Refreshed index.");
};

(async () => {
  await deleteAllIndices();
  await createProfilesIndex();
  await indexProfiles();
  console.log("✅ Done reindexing.");
  process.exit();
})();
