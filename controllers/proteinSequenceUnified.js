/*
 *  Protein Sequence Unified Service
 *
 *  Created by Christian Dallago on 20160327 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Daos
    const proteinSequenceUnifiedDao = context.component('daos').module('proteinSequenceUnified');

    return {
        getMD5: function(request, response) {
            const md5 = request.params.md5;
            proteinSequenceUnifiedDao.findByMD5(md5).then(function(data){
                if(data.length < 1){
                    return response.status(404).send({
                        data: [],
                        count: 0
                    });
                } else {
                    return response.status(200).send({
                        data: data,
                        count: data.length
                    });
                }
            }, function(error){
                console.error("Error while getting sequence via MD5:");
                console.error(error.code);
                return response.status(500).send(error);
            });
        },
        getSequence: function(request,response){
            const sequence = request.params.sequence;
            proteinSequenceUnifiedDao.findBySequence(sequence).then(function(data){
                if(data.length < 1){
                    return response.status(404).send({
                        data: [],
                        count: 0
                    });
                } else {
                    return response.status(200).send({
                        data: data,
                        count: data.length
                    });
                }
            }, function(error){
                console.error("Error while getting sequence:");
                console.error(error.code);
                return response.status(500).send(error);
            });
        }
    };
};