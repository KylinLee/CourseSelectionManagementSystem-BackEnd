#!/usr/bin/env node

/**
 * Module dependencies.
 */

const app = require("../app");
const debug = require("debug")("demo:server");
/* eslint-disable-next-line no-unused-vars */
const http = require("http");
const jwt = require("jsonwebtoken");

const { ApolloServer } = require("apollo-server-koa");

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
// app.set('port', port);

/**
 * Create HTTP server.
 */

// Construct a schema, using GraphQL schema language
const typeDefs = require("../model/schema/index");

// Provide resolver functions for your schema fields
const resolvers = require("../controller/graphql/index");

// Provide Datasource
const db = require("../model/mysql/index");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ db }),
    context: (app) => {
        const token = app.ctx.header.authorization || "";
        if (token) {
            jwt.verify(token);
            return {
                uid: "18052407",
                role: "student"
            };
        }
        return {
            uid: "18052405",
            role: "student"
        };
    },
    tracing: true
});

server.applyMiddleware({ app });
/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port, () => {
    console.log("listenling:localhost:3000");
});
app.on("error", onError);
app.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

    // handle specific listen errors with friendly messages
    /* eslint-disable */
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = app.address();
    const bind =
        typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("Listening on " + bind);
}
