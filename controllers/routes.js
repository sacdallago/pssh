/*
 *  Starting point for the routes
 *
 *  Created by Christian Dallago on 20160308 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Insert the interceptor for authorization
    context.router.use(function(request, response, next) {
        if(request.get('token') === null) {
            console.log('No token received');
            return response.status(401).send({
                message: 'Need to send a token',
                code: 401
            });
        }

        if(request.get('token') == context.token){
            return next();
        } else {
            return response.sendStatus(401);
        }
    });

    // Load all services we need
    // const someService = context.component('services').module('some');
};