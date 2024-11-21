
// Import necessary modules
import express, { Express, Request, Response } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as apolloMiddleware } from "@apollo/server/express4";
import { readFile } from "node:fs/promises";
import jwt from "jsonwebtoken";

// Import routes and database configuration
import { routerUsers } from "./routes/users.router";
import { db } from "./config/db";

// Import resolvers
import { resolvers } from "./graphql/resolver";

// Initialize the Express application
const app: Express = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the user routes
app.use("/api/users", routerUsers);

// Load GraphQL schema definition
const typeDefs = await readFile("./src/graphql/schema.graphql", "utf8");

// Context function for Apollo Server
async function getContext({ req }: { req: Request }) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const operationName = req.body.operationName;

  if (operationName === "Login") {
    return {};
  }

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decodedToken: any = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );
    return { user: decodedToken };
  } catch (error) {
    throw new Error("Unauthorized or Token expired");
  }
}

// Initialize Apollo Server
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();

// Use Apollo middleware for GraphQL requests
app.use("/graphql", apolloMiddleware(apolloServer, { context: getContext }));

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hola mundo");
});

// Connect to the database and start the server
db.then(() =>
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
  })
).catch((err) => {
  console.error("Database connection failed", err);
  process.exit(1);
});
