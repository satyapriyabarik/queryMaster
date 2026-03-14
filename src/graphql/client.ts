import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { API_URL } from "../utils/constants";

const httpLink = new HttpLink({
  uri: API_URL,
  fetchOptions: {
    mode: "cors"
  },
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});