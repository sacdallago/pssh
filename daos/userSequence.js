/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    return {
        findBySequence: function(sequence){
            var deferred = context.promises.defer();

            var query = context.queryConstructor('protein_sequence_unified','Sequence',sequence);

            console.log("QUERYING: " + query);

            context.db.query(query, function(error, rows, fields) {
                if (error){
                    deferred.reject(error);
                } else {
                    deferred.resolve(rows);
                }
            });
            return deferred.promise;
        },
        
        findByMD5: function(md5){
            var deferred = context.promises.defer();

            var query = context.queryConstructor('protein_sequence_unified','MD5_Hash',md5);

            console.log("QUERYING: " + query);

            context.db.query(query, function(error, rows, fields) {
                if (error){
                    deferred.reject(error);
                } else {
                    deferred.resolve(rows);
                }
            });
            return deferred.promise;
        },
        
        insertInProteinSequenceUpload: function(email, sequence, md5){
            var deferred = context.promises.defer();

            var query = context.mysql.format("INSERT INTO `protein_sequence_uploaded` (`email`, `sequence`, `md5_hash`) VALUES (?,?,?);", [email, sequence, md5]); 

            console.log("QUERYING: " + query);

            context.db.query(query, function(error, rows, fields) {
                if (error){
                    deferred.reject(error);
                } else {
                    deferred.resolve(rows);
                }
            });
            return deferred.promise;
        },
    };
};