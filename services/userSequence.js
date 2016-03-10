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
        .get('/md5/:md5', userSequenceController.getMD5Status)
        .get('/sequence/:sequence', userSequenceController.getSequenceStatus)
        .post('/sequence', userSequenceController.generatePSSH);
};