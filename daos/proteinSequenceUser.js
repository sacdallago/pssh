/*
 *  Protein Sequence Uploaded DAO
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    return {
        insertInProteinSequenceUpload: function(email, sequence, md5, description){
            var deferred = context.promises.defer();

            var query = context.mysql.format("INSERT INTO `protein_sequence_uploaded` (`email`, `sequence`, `md5_hash`) VALUES (?,?,?);", [email, sequence, md5]);

            if(description){
                query = context.mysql.format("INSERT INTO `protein_sequence_uploaded` (`email`, `sequence`, `md5_hash`, `description`) VALUES (?,?,?,?);", [email, sequence, md5, description]);
            } 

            console.log("QUERYING: " + query);

            context.db.query(query, function(error, rows, fields) {
                if (error){
                    deferred.reject(error);
                } else {
                    deferred.resolve(rows);
                }
            });
            return deferred.promise;
        }
    };
};