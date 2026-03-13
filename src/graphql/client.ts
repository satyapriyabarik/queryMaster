import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://ec2-13-204-54-11.ap-south-1.compute.amazonaws.com:4000/graphql"
  // "http://localhost:4000"
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});
