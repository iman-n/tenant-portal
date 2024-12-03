import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "http://localhost:3000/graphql",
  // uri: "http://backend:3000/graphql",
  uri: import.meta.env.VITE_GRAPHQL_URI,
  cache: new InMemoryCache(),
  credentials: 'include',
});

// console log the uri
console.log("uri", import.meta.env.VITE_GRAPHQL_URI);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
);

