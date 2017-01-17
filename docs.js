//"use strict";
const swaggerJSDoc = require("swagger-jsdoc")
const path = require("path");
const pkg = require("./package.json");

var options = {
  swaggerDefinition: {
    info: {
      title: 'Platform Challenge', // Title (required)
      version: pkg.version, // Version (required)
    },
    host: 'localhost:8080',
    basePath: '/',
  },
  apis: ['./index.js'], // Path to the API docs
};


// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
console.log(JSON.stringify(swaggerSpec))
