/*
 *  PSSH User DAO
 *
 *  Created by Christian Dallago on 20160327 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    return {
        /* Takes an array of entries like:
        *  [
        *    [
        *       protein_sequence_hash,
        *       PDB_chain_hash,
        *       Repeat_domains,
        *       E_value,
        *       Identity_Score,
        *       Match_length,
        *       Alignment
        *    ], ...
        *  ]
        */
        insertInPSSHUser: function(psshEntries){
            var deferred = context.promises.defer();

            // INSERT IGNORE = don't break on duplicates, just ignore them
            var query = context.mysql.format("INSERT IGNORE INTO `PSSH2_user` (`protein_sequence_hash`, `PDB_chain_hash`, `Repeat_domains`, `E_value`, `Identity_Score`, `Match_length`, `Alignment`) VALUES ?;", [psshEntries]);

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