/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Controllers
    const proteinSequenceUserController = context.component('controllers').module('proteinSequenceUser');

    // Routes
    context.router
        .post('/sequence', proteinSequenceUserController.psshFromSequence)
        .post('/fasta', proteinSequenceUserController.psshFromFasta);
};