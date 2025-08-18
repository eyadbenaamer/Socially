import { Client } from "@elastic/elasticsearch";
import { config } from "dotenv";

config();

const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL;
const ELASTICSEARCH_USER = process.env.ELASTICSEARCH_USER;
const ELASTICSEARCH_PASSWORD = process.env.ELASTICSEARCH_PASSWORD;

let clientData;

clientData = {
  node: ELASTICSEARCH_URL,
  auth: {
    username: ELASTICSEARCH_USER,
    password: ELASTICSEARCH_PASSWORD,
  },
};

export const client = new Client(clientData);
