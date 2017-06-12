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
        },

        insertInProteinSequenceUploadAndPSSH: function(email, sequence, md5, description, associatedPSSH){
            var deferred = context.promises.defer();

            var query = context.mysql.format("INSERT INTO `protein_sequence_uploaded` (`email`, `sequence`, `md5_hash`) VALUES (?,?,?);", [email, sequence, md5]);

            if(description){
                query = context.mysql.format("INSERT INTO `protein_sequence_uploaded` (`email`, `sequence`, `md5_hash`, `description` ,`Primary_Accession`) VALUES (?,?,?,?,?);", [email, sequence, md5, description, description]);
            }

            if(associatedPSSH.length > 0) {
                pssh = context.mysql.format("INSERT IGNORE INTO `PSSH2_user` (`protein_sequence_hash`, `PDB_chain_hash`, `Repeat_domains`, `E_value`, `Identity_Score`, `Match_length`, `Alignment`) VALUES ?;", [associatedPSSH]);

                context.db.beginTransaction(function(err) {
                    if (err){
                        deferred.reject(error);
                    }

                    console.log("QUERYING: " + query);
                    context.db.query(query, function(err, rows) {
                        if (err) {
                            deferred.reject(err);
                            context.db.commit(function(comError) {
                                if (comError) {
                                    // The rollback will rollback every sequence uploaded together with the one containing the PSSH that failed!
                                    return context.db.rollback(function() {
                                        deferred.reject(comError);
                                    });
                                }
                                // Everything worked :)
                                deferred.reject(err);
                            });
                        } else {
                            console.log("QUERYING: " + pssh);
                            context.db.query(pssh, function(err, result) {
                                if (err) {
                                    return context.db.rollback(function() {
                                        deferred.reject(err);
                                    });
                                }
                                context.db.commit(function(err) {
                                    if (err) {
                                        // The rollback will rollback every sequence uploaded together with the one containing the PSSH that failed!
                                        return context.db.rollback(function() {
                                            deferred.reject(err);
                                        });
                                    }
                                    // Everything worked :)
                                    deferred.resolve(rows);
                                });
                            });

                        }
                    });
                });

            } else {
                console.log("QUERYING: " + query);

                context.db.query(query, function(error, rows, fields) {
                    if (error){
                        deferred.reject(error);
                    } else {
                        deferred.resolve(rows);
                    }
                });
            }
            return deferred.promise;
        }
    };
};