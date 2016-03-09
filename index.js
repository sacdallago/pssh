/*
 *  Server bootstrapping
 *
 *  Created by Christian Dallago on 20160308 .
 */

var context;

module.exports = {
    start: function(done) {
        console.log('---------- START BOOTSTRAPPING ----------');

        // Import modules
        console.log('Importing dependencies...');
        const express = require('express');
        const bodyParser = require('body-parser');
        const q = require('q');
        const uuid = require('node-uuid');
        const formidable = require('formidable');
        const nodemailer = require('nodemailer');
        const crypto = require('crypto');
        const passwordGenerator = require('password-generator');
        const consoleStamp = require('console-stamp');
        const mysql = require('mysql');

        const path = require('path');
        const util = require('util');
        const fs = require('fs');

        const config = require('./configuration');
        console.log('Dependencies has been imported successfully');

        // Initialize the context
        context = {};

        // Setup timestamps for logging
        consoleStamp(console);

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

        context.smtpTransporter = {};
        context.app = {};
        context.router = {};
        context.server = {};

        // Initialize MySQL connection
        const db = context.mysql.createConnection({
            host     : config.mysql.url,
            port     : config.mysql.port,
            user     : config.mysql.username,
            password : config.mysql.password,
            database : config.mysql.database
        });

        // Test MySQL connection
        db.connect(function(error, connection) {
            if (err) {
                console.error('Error connecting to MySQL: ' + error.stack);
                return;
            }
            console.log('Connection test to MySQL worked.');
            console.log('Connected as id ' + connection.threadId);
            connection.release()
        });

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
            }
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

        // Set router for the whole api
        context.app.use('/api', context.router);
        context.router.use(function(request, response, next) {

            // Log each request to the console
            console.log(request.method, request.url);

            // Check that the head request contains the token in config or generate a new token.
            var token = config.accessToken
            if(!token){
                token = context.uuid.v4();
            }

            console.log('Your requests must contain the token'+ token);
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
            }
        };

        // Initialize routes module in order to cover all services
        // ALso kicks off loading of all modules
        context.component('controllers').module('routes');

        // Done, start server
        console.log('Starting server...')
        context.server = context.app.listen(context.config.app.port, function() {
            console.log('SERVER LISTENING ON PORT %s', context.config.app.port);
            console.log('---------- DONE BOOTSTRAPPING ----------');
            done(context);
        });
    },

    stop: function(done) {
        if (!context || !context.server) {
            console.log('Server stopped');
            return;
        }
        context.server.close(done);
    }
};