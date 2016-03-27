/*
 *  Protein Sequence Unified Service
 *
 *  Created by Christian Dallago on 20160327 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Controllers
    const proteinSequenceUnifiedController = context.component('controllers').module('proteinSequenceUnified');

    // Routes
    context.router
        .get('/md5/:md5', proteinSequenceUnifiedController.getMD5)
        .get('/sequence/:sequence', proteinSequenceUnifiedController.getSequence);
};