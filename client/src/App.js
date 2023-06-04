import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";
import { ChakraBaseProvider, extendBaseTheme } from '@chakra-ui/react'
import chakraTheme from '@chakra-ui/theme'
import { ThemeProvider, theme } from '@chakra-ui/core';
import { Heading, Link } from "@chakra-ui/core";


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
  cache: new InMemoryCache(),
});
const { Button } = chakraTheme.components
const theme = extendBaseTheme({
  components: {
    Button,
  },
})

function App( { Component, pageProps }) {
  return (
  
    <ChakraBaseProvider theme={theme}>
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<SearchBooks />} />
            <Route exact path="/saved" element={<SavedBooks />} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Routes>
          <Component {...pageProps} />
        </>
      </Router>
    </ApolloProvider>
    </ChakraBaseProvider>

  );
}

export default App;
