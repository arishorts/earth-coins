const express = require("express");
// const { ApolloServer } = require("apollo-server-express");
const path = require("path");
const { authMiddleware } = require("./utils/auth");
const CoinGeckoAPI = require("./datasources/coingeckoapi");
const { typeDefs, resolvers } = require("./schemas");
const db = require("./config/connection");
const { ApolloServer } = require("@apollo/server");
const http = require("http");
const { expressMiddleware } = require("@apollo/server/express4");
const {
  ApolloServerPluginDrainHttpServer,
} = require("@apollo/server/plugin/drainHttpServer");
const { json } = require("body-parser");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // We'll take Apollo Server's cache
        // and pass it to each of our data sources
        const { cache } = server;
        return {
          dataSources: {
            coinGeckoAPI: new CoinGeckoAPI({ cache }),
          },
          user: authMiddleware(req),
        };
      },
    })
  );

  db.once("open", () => {
    httpServer.listen({ port: PORT }, () => {
      console.log(`Use GraphQL on port http://localhost:${PORT}/graphql`);
    });
  });
};
//localhost:3000/
// Call the async function to start the server
startApolloServer();
