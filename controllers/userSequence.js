/*
 *  User Sequence Service
 *
 *  Created by Christian Dallago on 20160310 .
 */

/*jshint esversion: 6 */

module.exports = function(context) {

    // Daos
    const userSequenceDao = context.component('daos').module('userSequence');

    return {
        getMD5Status: function(request, response) {
            return response.status(404).send({
                message: 'Sequence request not found'
            });
        },
        generatePSSH: function(request, response) {
            return response.status(201).send({
                message: 'Sequence is being processed.'
            });
        },
        getSequenceStatus: function(request,response){
            const sequence = request.params.sequence;
            userSequenceDao.findBySequence(sequence).then(function(data){
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
            });
        }
    };
};