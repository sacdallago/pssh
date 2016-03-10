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
            var deferred = context.promises.defer();

            var query = context.queryConstructor('protein_sequence_unified','sequence',sequence);

            console.log("QUERYING: " + query);

            context.db.query(query, function(err, rows, fields) {
                if (err){
                    deferred.reject(error);
                } else {
                    deferred.resolve(rows);
                }
            });
            return deferred.promise;
        }
    };
};