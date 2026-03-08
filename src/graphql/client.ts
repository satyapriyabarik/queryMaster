import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://13.234.136.192:4000/graphql"
  // "http://localhost:4000"
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
