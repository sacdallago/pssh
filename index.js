/*
 *  Server bootstrapping
 *
 *  Created by Christian Dallago on 20160308 .
 */

/*jshint esversion: 6 */

var context;

module.exports = {
    start: function(done) {

        // Parallelize
        const numCPUs = require('os').cpus().length;
        const cluster = require('cluster');
        const consoleStamp = require('console-stamp');

        if (cluster.isMaster) {
            // Setup timestamps for logging
            consoleStamp(console,{
                metadata: function () {
                    return ("[MASTER]");
                },
                colors: {
                    stamp: "yellow",
                    label: "white",
                    metadata: "red"
                }
            } );

            // Fork workers.
            for (var i = 0; i < numCPUs; i++) {
                var worker = cluster.fork();
                console.log("Spwaning worker " + worker.id);
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
                var newWorker = cluster.fork();
                console.log("Spwaning worker " + newWorker.id);
            });
        } else {

            // Import modules
            const express = require('express');
            const bodyParser = require('body-parser');
            const q = require('q');
            const uuid = require('node-uuid');
            const formidable = require('formidable');
            const nodemailer = require('nodemailer');
            const passwordGenerator = require('password-generator');
            const mysql = require('mysql');
            const biojs = require('biojs-io-fasta');
            const psshParser = require('pssh-parser');

            const crypto = require('crypto');
            const path = require('path');
            const util = require('util');
            const fs = require('fs');
            const http = require('http');
            

            const config = require('./configuration');

            // Initialize the context
            context = {};

            // Setup timestamps for logging
            consoleStamp(console,{
                metadata: function () {
                    return ("[Worker " + cluster.worker.id + "]");
                },
                colors: {
                    stamp: "yellow",
                    label: "white",
                    metadata: "green"
                }
            } );

            // Expose modules
            context.promises = q;
            context.config = config;
            context.path = path;
            context.uuid = uuid;
            context.formidable = formidable;
            context.fs = fs;
            context.path = path;
            context.util = util;
            context.crypto = crypto;
            context.passwordGenerator = passwordGenerator;
            context.mysql = mysql;
            context.biojs = biojs;
            context.psshParser = psshParser;

            context.smtpTransporter = {};
            context.app = {};
            context.router = {};
            context.server = {};

            // Initialize MySQL connection
            context.db = context.mysql.createConnection({
                host     : config.mysql.url,
                port     : config.mysql.port,
                user     : config.mysql.username,
                password : config.mysql.password,
                database : config.mysql.database
            });

            // Test MySQL connection
            context.db.connect(function(error, connection) {
                if (error) {
                    console.error('Error connecting to MySQL:');
                    throw error;
                }
                console.log('Connection test to MySQL worked.');
            });

            // Query constructor
            context.queryConstructor = function(table, field, where){
                var sql = "SELECT * FROM ?? WHERE ?? = ?";
                var inserts = [table, field, where];
                return context.mysql.format(sql, inserts);
            };

            // Initialize express
            context.app = express();
            context.app.use(bodyParser.json());
            context.app.use(bodyParser.urlencoded({extended: true}));

            // Initialize nodemailer
            context.smtpTransporter = nodemailer.createTransport(config.email.defaultFrom);

            // SetUp default email sender and subject from configuration
            context.mailOptions = function(){
                return {
                    from: config.email.defaultFrom,
                    subject: config.email.defaultSubject
                };
            };

            // verify connection configuration 
            context.smtpTransporter.verify(function(error, success) {
                if (error) {
                    console.log("This node instance won't be able to send emails! Error: " + error);
                } else {
                    console.log("This node instance is able to send emails.");
                }
            });

            // Initialize router
            context.router = new express.Router();

            // Response for the 'home request'
            context.app.get('/', function(request, response) {
                response.send('<html><body>It works! The API is available under <strong>/api/*</strong></body></html>');
            });

            // Set up the token that needs to be passed in the head with every request
            var token = config.app.accessToken;
            if(!token){
                token = context.uuid.v4();
            }

            console.log('Your requests must contain the following token:');
            console.log(token);

            context.token = token;

            // Set router for the whole api
            context.app.use('/api', context.router);
            context.router.use(function(request, response, next) {

                // Log each request to the console
                console.log(request.method, request.url);

                // Continue doing what we were doing and go to the route
                return next();
            });

            // Function to load all components from the respective folders (models, controllers, services, daos, utils)
            context.component = function(componentName) {
                if (!context[componentName]) {
                    context[componentName] = {};
                }

                return {
                    module: function(moduleName) {
                        if (!context[componentName][moduleName]) {
                            console.log('Loading component ' + componentName);
                            context[componentName][moduleName] = require(path.join(__dirname, componentName, moduleName))(context,
                                                                                                                          componentName, moduleName);
                            console.log('LOADED ' + componentName + '.' + moduleName);
                        }

                        return context[componentName][moduleName];
                    }
                };
            };

            // Initialize routes module in order to cover all services
            // ALso kicks off loading of all modules
            context.component('controllers').module('routes');

            // Done, start server
            console.log('Starting server...');


            // Workers can share any TCP connection
            // In this case it is an HTTP server
            http
                .createServer(context.app)
                .listen(context.config.app.port, function() {
                console.log('Worker listening on port %s', context.config.app.port);
            });
        }
    },
    stop: function(done) {
        if (!context || !context.server) {
            console.log('Server stopped');
            return;
        }
        context.server.close(done);
    }
};