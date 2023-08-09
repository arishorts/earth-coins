import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchCoins from "./pages/SearchCoins";
import SavedCoins from "./pages/SavedCoins";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: "/graphql",
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    // addTypename: false,
    //we may need to keeptypename in because this is required for caching
  }),
  typePolicies: {
    Query: {
      fields: {
        getCoinList: {
          keyArgs: ["page"],
        },
      },
    },
  },
});

// function App({ Component, pageProps }) {
function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <div className="app-container">
            <div className="content-wrap">
              <Navbar />
              <Routes>
                <Route exact path="/" element={<SearchCoins />} />
                <Route exact path="/search" element={<SearchCoins />} />
                <Route exact path="/saved" element={<SavedCoins />} />
                <Route
                  render={() => <h1 className="display-2">Wrong page!</h1>}
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
