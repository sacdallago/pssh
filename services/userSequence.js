/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Controllers
    const userSequenceController = context.component('controllers').module('userSequence');

    // Routes
    context.router
        .get('/sequence/:md5', userSequenceController.getStatus)
        .post('/sequence', userSequenceController.generatePSSH);
};