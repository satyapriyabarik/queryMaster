import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const retryLink = new RetryLink({
  delay: {
    initial: 500,
    max: 5000,
    jitter: true,
  },
  attempts: {
    max: Infinity,
    retryIf: () => true,
  },
});

export const client = new ApolloClient({
  link: ApolloLink.from([retryLink, httpLink]),
  cache: new InMemoryCache(),
});

window.addEventListener("online", () => {
  client.refetchQueries({ include: "active" });
});
