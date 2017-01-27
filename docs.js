//"use strict";
const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const pkg = require("./package.json");

var options = {
  swaggerDefinition: {
    info: {
      title: 'Platform Challenge',
      version: pkg.version, // Version (required)
    },
    host: 'localhost:8080',
    basePath: '/',
    securityDefinitions: {
      basicAuth: {
        type: "basic"
      }
    }
  },
  apis: ['./index.js'],
};


// Initialize swagger-jsdoc -> returns validated swagger spec in json format
var swaggerSpec = swaggerJSDoc(options);
console.log(JSON.stringify(swaggerSpec));
