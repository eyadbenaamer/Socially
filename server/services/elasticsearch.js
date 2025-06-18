import { Client } from "@elastic/elasticsearch";
import { config } from "dotenv";

config();

const ENV = process.env.NODE_ENV;
const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_USER = process.env.ELASTICSEARCH_USER;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;
const ELASTICSEARCH_API_KEY = process.env.ELASTICSEARCH_API_KEY;

let clientData;

if (ENV === "production") {
  clientData = {
    node: ELASTICSEARCH_URL,
    auth: {
      apiKey: ELASTICSEARCH_API_KEY,
    },
    serverMode: "serverless",
  };
} else {
  clientData = {
    node: ELASTICSEARCH_URL,
    auth: {
      username: ELASTICSEARCH_USER,
      password: ELASTICSEARCH_PASSWORD,
    },
  };
}

export const client = new Client(clientData);
