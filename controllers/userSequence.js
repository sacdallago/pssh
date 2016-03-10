/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Daos
    const userSequenceDao = context.component('daos').module('userSequence');

    return {
        getStatus: function(request, response) {
            return response.status(404).send({
                message: 'Sequence request not found'
            });
        },
        generatePSSH: function(request, response) {
            return response.status(201).send({
                message: 'Sequence is being processed.'
            });
        }
    };
};