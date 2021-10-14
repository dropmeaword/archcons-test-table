import { SubscriptionClient } from "graphql-subscriptions-client";
import { SUB_TABLE_STREAM } from "./queries";

// get ready
const GRAPHQL_ENDPOINT =
  "wss://archcons-dev.eu-central-1.aws.cloud.dgraph.io/graphql";

const query = SUB_TABLE_STREAM;

// set up the client, which can be reused
const client = new SubscriptionClient(GRAPHQL_ENDPOINT, {
  reconnect: true,
  lazy: true, // only connect when there is a query
  connectionCallback: (error) => {
    error && console.error(error);
  }
});

// make the actual request
client.request({ query });

export { client };
