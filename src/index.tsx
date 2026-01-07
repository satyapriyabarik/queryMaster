import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./graphql/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { QueryExecutionProvider } from "./context/QueryExecutionContext";
const root = ReactDOM.createRoot(
  document.getElementById('root')!
);
const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
<QueryExecutionProvider>
          <App />
</QueryExecutionProvider>
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>
);

