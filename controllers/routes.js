/*
 *  Starting point for the routes
 *
 *  Created by Christian Dallago on 20160308 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Insert the interceptor for authorization
    context.router.use(function(request, response, next) {

        //Allow all GET requests as these do not modify data
        if(request.method === 'GET'){
            return next();
        }
        
        // Check token
        if(!request.get('token')) {
            console.log('No token received');
            return response.status(401).send({
                message: 'Need to send a token.'
            });
        }

        if(request.get('token') == context.token){
            return next();
        } else {
            return response.sendStatus(401).send({
                message: 'Wrong token.'
            });
        }
    });

    // Load all services we need
    const proteinSequenceUserService = context.component('services').module('proteinSequenceUser');
    const proteinSequenceUnifiedService = context.component('services').module('proteinSequenceUnified');
};