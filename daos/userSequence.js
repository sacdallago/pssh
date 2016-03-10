/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Imports
    // const userSequenceModel = context.component('models').module('userSequence');

    return {
        findBySequence: function(sequence){
            context.db.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
                if (err) throw err;

                console.log('The solution is: ', rows[0].solution);
            });
        }
    };
};